from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
for ext in ('*.gms','*.gdx','*.lst'):
    hits=list(ROOT.rglob(ext))
    if hits: errors.append(f'Forbidden public artifact {ext}: {len(hits)} file(s)')
for p in ROOT.rglob('*'):
    if p.is_file() and p.stat().st_size>100*1024*1024:
        errors.append(f'File exceeds GitHub 100 MB limit: {p.relative_to(ROOT)}')
required=['index.html','README.md','CITATION.cff','LICENSE','LICENSE-DATA.md','LICENSES.md','NOTICE.md','assets/brand/paramo-mark.svg','assets/brand/paramo-logo-horizontal.svg','assets/brand/social-preview.png','data/cases/ecuador_24bus/manifest.json','data/cases/ecuador_6bus/manifest.json','data/metadata/metrics.json','downloads/PARAMO_Ecuador_Public_Results_v1.0.0.zip']
for rel in required:
    if not (ROOT/rel).exists(): errors.append(f'Missing required file: {rel}')
for m in [ROOT/'data/cases/ecuador_24bus/manifest.json',ROOT/'data/cases/ecuador_6bus/manifest.json',ROOT/'data/metadata/case_registry.json',ROOT/'data/metadata/metrics.json']:
    try: json.loads(m.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f'Invalid JSON {m.relative_to(ROOT)}: {e}')
if 'version: "1.0.0"' not in (ROOT/'CITATION.cff').read_text(encoding='utf-8'):
    errors.append('CITATION.cff version mismatch')
print('PARAMO ECUADOR PUBLIC RELEASE VALIDATION')
if errors:
    for e in errors: print('FAIL:',e)
    sys.exit(1)
print('PASS: public scope, required assets, metadata and file-size limits validated.')
