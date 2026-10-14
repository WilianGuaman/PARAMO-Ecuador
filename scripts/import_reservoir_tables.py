"""Import the two plant CSVs into the public chart layer.

No solver/API is called. Source files are read-only. SHA-256 and row counts must
match the public source register before the browser data can be replaced.
"""
from __future__ import annotations
import argparse, csv, hashlib, json, math, os, re, tempfile
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
NAMES = ('reservoir_storage_statistics_by_plant', 'reservoir_representative_by_plant')
KEYS = ('Campaign', 'Scenario', 'Year', 'Month', 'Reservoir')
MEAN_FIELDS = ('mean_Hm3',)
RECORD_FIELDS = ('Storage_Hm3', 'Turbined_Hm3', 'Spilled_Hm3', 'LateralInflow_Hm3',
                 'CascadeUpstreamRelease_Hm3', 'BalanceStartingStorage_Hm3', 'WaterBalanceResidual_Hm3')
class SourceValidationError(ValueError):
    """Missing, inconsistent or unbound source data. Nothing is published."""

def normalise(rows: list[dict[str, Any]], representative: bool = False) -> list[dict[str, Any]]:
    required = set(KEYS + (RECORD_FIELDS if representative else MEAN_FIELDS))
    if representative: required.add('w')
    out = []
    for i, raw in enumerate(rows, 2):
        if not required.issubset(raw):
            raise SourceValidationError(f'Row {i}: missing fields {sorted(required - set(raw))}')
        r = {key: raw[key] for key in required}
        r['Campaign'] = str(r['Campaign']).strip().lower()
        r['Scenario'] = str(r['Scenario']).strip().upper()
        r['Reservoir'] = str(r['Reservoir']).strip()
        for col in ('Year', 'Month'):
            value = float(r[col])
            if not math.isfinite(value) or value != int(value):
                raise SourceValidationError(f'Row {i}: non-integer {col}')
            r[col] = int(value)
        for col in (RECORD_FIELDS if representative else MEAN_FIELDS):
            try: r[col] = float(r[col])
            except (ValueError, TypeError) as e: raise SourceValidationError(f'Row {i}: invalid {col}') from e
            if not math.isfinite(r[col]): raise SourceValidationError(f'Row {i}: non-finite {col}')
        if representative:
            w = re.fullmatch(r'w?(\d+)(?:\.0)?', str(r['w']).strip(), re.I)
            if not w: raise SourceValidationError(f'Row {i}: invalid realization')
            r['w'] = 'w' + str(int(w[1]))
        out.append(r)
    return out

def validate_rows(rows: list[dict[str, Any]], plants: dict[str, dict], representative: bool = False,
                  complete: bool = True) -> dict:
    seen, groups = set(), {}
    for r in rows:
        key = tuple(r[k] for k in KEYS) + ((r['w'],) if representative else ())
        if key in seen: raise SourceValidationError(f'Duplicate key: {key}')
        seen.add(key)
        if r['Campaign'] not in ('baseline', 'adverse') or r['Scenario'] not in ('REF', 'BRIDGE', 'NZT'):
            raise SourceValidationError(f'Unknown case: {key}')
        if not (2025 <= r['Year'] <= 2050 and 1 <= r['Month'] <= 12):
            raise SourceValidationError(f'Invalid period: {key}')
        if r['Reservoir'] not in plants: raise SourceValidationError(f'Unknown 24-bus reservoir: {r["Reservoir"]}')
        value = r['Storage_Hm3'] if representative else r['mean_Hm3']
        if not -1e-6 <= value <= plants[r['Reservoir']]['vmax_hm3'] + .001:
            raise SourceValidationError(f'Outside nominal upper volume bound: {key}')
        group = (r['Campaign'], r['Scenario'], r['Reservoir']) + ((r['w'],) if representative else ())
        groups.setdefault(group, set()).add((r['Year'], r['Month']))
        if representative:
            for f in RECORD_FIELDS[:-1]:
                if r[f] < -1e-6: raise SourceValidationError(f'Negative {f}: {key}')
            balance = (r['BalanceStartingStorage_Hm3'] + r['LateralInflow_Hm3'] +
                       r['CascadeUpstreamRelease_Hm3'] - r['Turbined_Hm3'] - r['Spilled_Hm3'] - r['Storage_Hm3'])
            if abs(balance) > 1e-5 or abs(r['WaterBalanceResidual_Hm3']) > 1e-5:
                raise SourceValidationError(f'Water balance > 1e-5 hm3: {key}, residual={balance}')
    if complete:
        wanted = {(y, m) for y in range(2025, 2051) for m in range(1, 13)}
        if len(rows) != 9360 or len(groups) != 30:
            raise SourceValidationError('Expected 9360 records: 6 cases × 5 plants × 26 years × 12 months')
        if any(periods != wanted for periods in groups.values()):
            raise SourceValidationError('Incomplete monthly plant trajectory')
        for h in ('baseline','adverse'):
            for s in ('REF','BRIDGE','NZT'):
                part = [r for r in rows if r['Campaign'] == h and r['Scenario'] == s]
                if set(r['Reservoir'] for r in part) != set(plants):
                    raise SourceValidationError(f'Missing plant: {h}/{s}')
                if representative and len(set(r['w'] for r in part)) != 1:
                    raise SourceValidationError(f'Expected one recorded realization for {h}/{s}')
    return {'passed': True, 'rows': len(rows), 'groups': len(groups), 'complete_horizon': complete,
            'water_balance_checked': representative}

def locate(source: Path, name: str) -> Path:
    candidates = [source / f'{name}.csv', source / '10_canonical' / f'{name}.csv',
                  source / 'tables' / f'{name}.csv', source / '05_FUENTES' / 'tablas' / f'{name}.csv']
    p = next((p for p in candidates if p.is_file()), None)
    if p is None: raise SourceValidationError(f'{name}.csv not found under {source}')
    return p

def collect(source: Path) -> dict:
    expected = json.loads((ROOT/'data/metadata/expected_reservoir_sources.json').read_text())
    plants = {p['id']: p for p in json.loads((ROOT/'data/metadata/reservoir_parameters_24bus.json').read_text())}
    tables, provenance, checks = {}, [], []
    for name in NAMES:
        p = locate(source, name)
        if p.stat().st_size > 134217728: raise SourceValidationError(f'{p.name} exceeds 128 MiB')
        sha = hashlib.sha256(p.read_bytes()).hexdigest()
        if not sha.startswith(expected[name]['sha256_prefix']):
            raise SourceValidationError(f'{p.name}: SHA-256 does not match the source recorded in public')
        with p.open(encoding='utf-8-sig', newline='') as f: raw = list(csv.DictReader(f))
        if len(raw) != expected[name]['rows']: raise SourceValidationError(f'{p.name}: row count differs from register')
        rep = name == NAMES[1]
        tables[name] = normalise(raw, rep)
        checks.append(validate_rows(tables[name], plants, rep))
        # A public provenance record contains file names, never local user paths.
        provenance.append({'file':p.name, 'sha256':sha, 'rows':len(raw)})
    return {'available':True,'means':tables[NAMES[0]],'records':tables[NAMES[1]],
            'provenance':provenance,'validation':checks,'model':'EC24','solver_invoked':False,
            'note':'Original research CSVs bound to recorded hashes; representative IDs are kept independent of aggregate-generation IDs.'}

def publish(data: dict) -> Path:
    target=ROOT/'assets/js/reservoir_plants.js'
    text='window.PARAMO_RESERVOIR_PLANTS='+json.dumps(data,ensure_ascii=False,separators=(',',':'),allow_nan=False)+';\n'
    fd,temp=tempfile.mkstemp(prefix='reservoir_',suffix='.tmp',dir=target.parent)
    try:
        with os.fdopen(fd,'w',encoding='utf-8',newline='\n') as f: f.write(text)
        os.replace(temp,target)
    finally:
        if os.path.exists(temp): os.unlink(temp)
    return target

def main() -> int:
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',type=Path,required=True,help='Directory containing the two original CSVs, or its 10_canonical parent')
    parser.add_argument('--check-only',action='store_true',help='Validate without modifying the browser layer')
    args=parser.parse_args()
    try:
        data=collect(args.source)
        print('Validated:',len(data['means']),'monthly mean rows and',len(data['records']),'plant-balance rows.')
        if not args.check_only: print('Browser layer updated:',publish(data))
        print('Original sources unchanged. No GAMS execution. Reload the dashboard.')
        return 0
    except (OSError, ValueError, TypeError, KeyError) as exc:
        print('Import stopped:',exc)
        print('The current dashboard data have not been replaced.')
        return 2
if __name__=='__main__': raise SystemExit(main())
