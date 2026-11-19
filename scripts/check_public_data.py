"""Check that public chart data do not include excluded model inputs or raw archives."""
import json
import csv
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
FORBIDDEN={'reactance_pu','reconductored_reactance_pu','new_line_cost_musd','reconductoring_cost_musd','built_reconductoring_cost_musd','vmin_hm3','vmax_hm3','qmax_hm3','phi','af','hydroaf','lateralinflow_hm3','cascadeupstreamrelease_hm3','balancestartingstorage_hm3','waterbalanceresidual_hm3','turbined_hm3','spilled_hm3','costruns','annualruns','emissionruns','ensruns','hydroselected','cascadehydro','hydroassets','modeled_import_capacity_mw','existing_transfer_mw','reconductored_transfer_mw','demand_mw_2024','annualpeakdemand_mw'}
def check(value,path):
 if isinstance(value,dict):
  for k,v in value.items():
   assert k.lower() not in FORBIDDEN, f'Excluded field {path}.{k}'
   check(v,path+'.'+k)
 elif isinstance(value,list):
  for i,v in enumerate(value):check(v,path+f'[{i}]')
for f in (ROOT/'assets/js').glob('*.js'):
 if f.name=='dashboard.js':continue
 data=json.loads(f.read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))
 check(data,f.name)
 if f.name=='demand.js':assert len(data)==26 and all('Month' not in r for r in data)
 if f.name=='dashboard_data.js':
  assert all('Demand_GWh' not in r for r in data['sixNode']['monthly'])
  for r in data['sixNode'].get('plantResults',[]):assert set(r)<= {'Case','Year','Month','Generator','Generation_GWh','Storage_Hm3','Release_Hm3','UpstreamRelease_Hm3'}
  for a in data['sixNode'].get('hydroDisplayAssets',{}).values():
   assert set(a)<= {'label','type','plants','edges','metadata'}
   for m in a['metadata']:assert set(m)<= {'Generator','PlantName','Status','Class'}
for f in (ROOT/'data').rglob('*'):
 if f.suffix in {'.json','.geojson'}:check(json.loads(f.read_text(encoding='utf-8-sig')),str(f.relative_to(ROOT)))
 elif f.suffix=='.csv':
  with f.open(encoding='utf-8-sig',newline='') as stream:check(list(csv.DictReader(stream)),str(f.relative_to(ROOT)))
for rel in ['assets/js/reservoir_plants.js','data/tables/monthly_demand.csv','data/metadata/reservoir_parameters_24bus.json','notebooks']:
 assert not (ROOT/rel).exists(),f'Excluded artifact: {rel}'
for f in ROOT.rglob('*'):
 if '.git' in f.parts:continue
 assert f.suffix.lower() not in {'.gms','.gdx','.xlsx','.g00','.bundle','.ipynb'},f'Private artifact: {f}'
print('Public data checks passed.')
