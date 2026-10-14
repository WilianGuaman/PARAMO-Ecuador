"""Isolated importer regression tests; fixtures are never model results."""
import copy, importlib.util, io, json, tempfile, unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('importer',Path(__file__).with_name('import_reservoir_tables.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
plants={p['id']:p for p in json.loads((m.ROOT/'data/metadata/reservoir_parameters_24bus.json').read_text())}
plant='E_HYD_Mazar_170MW'
BASE={'Campaign':' baseline ','Scenario':' bridge ','Year':'2050','Month':'1','Reservoir':plant,'mean_Hm3':'300'}
REP={**BASE,'w':'90','Storage_Hm3':'300','Turbined_Hm3':'8','Spilled_Hm3':'2','LateralInflow_Hm3':'10','CascadeUpstreamRelease_Hm3':'0','BalanceStartingStorage_Hm3':'300','WaterBalanceResidual_Hm3':'0'}
class ImportTests(unittest.TestCase):
 def mean(self,changes=None):return m.normalise([{**BASE,**(changes or {})}])
 def rep(self,changes=None):return m.normalise([{**REP,**(changes or {})}],True)
 def test_case_normalisation(self):self.assertEqual(self.mean()[0]['Campaign'],'baseline');self.assertEqual(self.mean()[0]['Scenario'],'BRIDGE')
 def test_realization_normalisation(self):self.assertEqual(self.rep()[0]['w'],'w90')
 def test_valid_mean(self):self.assertTrue(m.validate_rows(self.mean(),plants,complete=False)['passed'])
 def test_valid_balance(self):self.assertTrue(m.validate_rows(self.rep(),plants,True,False)['passed'])
 def test_no_private_columns(self):self.assertNotIn('PrivatePath',self.mean({'PrivatePath':'secret'})[0])
 def test_missing_field(self):
  q=BASE.copy();del q['Reservoir']
  with self.assertRaises(m.SourceValidationError):m.normalise([q])
 def test_nonfinite(self):
  with self.assertRaises(m.SourceValidationError):self.mean({'mean_Hm3':'nan'})
 def test_invalid_period(self):
  with self.assertRaises(m.SourceValidationError):m.validate_rows(self.mean({'Month':13}),plants,complete=False)
 def test_fractional_year(self):
  with self.assertRaises(m.SourceValidationError):self.mean({'Year':2050.5})
 def test_duplicate(self):
  rows=self.mean()
  with self.assertRaises(m.SourceValidationError):m.validate_rows(rows+rows,plants,complete=False)
 def test_unknown_plant(self):
  with self.assertRaises(m.SourceValidationError):m.validate_rows(self.mean({'Reservoir':'Other'}),plants,complete=False)
 def test_unknown_case(self):
  with self.assertRaises(m.SourceValidationError):m.validate_rows(self.mean({'Scenario':'BAU'}),plants,complete=False)
 def test_upper_limit(self):
  with self.assertRaises(m.SourceValidationError):m.validate_rows(self.mean({'mean_Hm3':999}),plants,complete=False)
 def test_negative_storage(self):
  with self.assertRaises(m.SourceValidationError):m.validate_rows(self.mean({'mean_Hm3':-1}),plants,complete=False)
 def test_unbalanced(self):
  with self.assertRaises(m.SourceValidationError):m.validate_rows(self.rep({'Turbined_Hm3':9}),plants,True,False)
 def test_reported_residual(self):
  with self.assertRaises(m.SourceValidationError):m.validate_rows(self.rep({'WaterBalanceResidual_Hm3':1}),plants,True,False)
 def test_negative_release(self):
  with self.assertRaises(m.SourceValidationError):m.validate_rows(self.rep({'Spilled_Hm3':-1}),plants,True,False)
 def test_incomplete_horizon(self):
  with self.assertRaises(m.SourceValidationError):m.validate_rows(self.mean(),plants)
 def test_source_not_found(self):
  with tempfile.TemporaryDirectory() as td:
   with self.assertRaises(m.SourceValidationError):m.collect(Path(td))
 def test_hash_mismatch_current_layer_untouched(self):
  target=m.ROOT/'assets/js/reservoir_plants.js';before=target.read_bytes()
  with tempfile.TemporaryDirectory() as td:
   for name in m.NAMES:(Path(td)/(name+'.csv')).write_text('not the registered source')
   with self.assertRaises(m.SourceValidationError):m.collect(Path(td))
  self.assertEqual(before,target.read_bytes())
 def test_atomic_publish_isolated(self):
  with tempfile.TemporaryDirectory() as td:
   root=Path(td);(root/'assets/js').mkdir(parents=True)
   with patch.object(m,'ROOT',root):
    p=m.publish({'available':False,'test_fixture':True});self.assertIn('test_fixture',p.read_text());self.assertEqual(len(list(p.parent.iterdir())),1)
 def test_invalid_json_does_not_replace(self):
  with tempfile.TemporaryDirectory() as td:
   root=Path(td);(root/'assets/js').mkdir(parents=True);target=root/'assets/js/reservoir_plants.js';target.write_text('original')
   with patch.object(m,'ROOT',root):
    with self.assertRaises(ValueError):m.publish({'bad':float('nan')})
   self.assertEqual(target.read_text(),'original')
if __name__=='__main__':unittest.main(verbosity=2)
