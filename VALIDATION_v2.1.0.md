# PARAMO Ecuador Results Explorer v2.1.0 — validation

**Status:** PASS

- Checks passed: **40 / 40**
- Physical transmission features: **133**
- 6-bus scenarios: **4**
- Maximum public/source summary error: **7.390e-13**
- Maximum monthly/annual demand error: **1.455e-11 GWh**
- Maximum hydro regime balance error: **4.999e-09 GWh**

## Checks

- PASS — four 6-bus cases — ['BAU_Extreme', 'BAU_Normal', 'REN100_Extreme', 'REN100_Normal']
- PASS — 6-bus summary equals source Results.xlsx — max abs error=7.390e-13
- PASS — all 6-bus ModelStat=8
- PASS — all 6-bus SolveStat=1
- PASS — all 6-bus MIP gap below 1% — {'BAU_Normal': 0.6747714806322054, 'BAU_Extreme': 0.5583409292878796, 'REN100_Normal': 0.8816571579935091, 'REN100_Extreme': 0.5846235209045207}
- PASS — zero base-year endogenous build
- PASS — water balance residual within tolerance
- PASS — annual energy reconstruction within tolerance
- PASS — annual rows per case — {'BAU_Normal': 26, 'BAU_Extreme': 26, 'REN100_Normal': 26, 'REN100_Extreme': 26}
- PASS — monthly rows per case — {'BAU_Normal': 312, 'BAU_Extreme': 312, 'REN100_Normal': 312, 'REN100_Extreme': 312}
- PASS — transmission rows per case — {'BAU_Normal': 182, 'BAU_Extreme': 182, 'REN100_Normal': 182, 'REN100_Extreme': 182}
- PASS — reservoir rows per case — {'BAU_Normal': 1248, 'BAU_Extreme': 1248, 'REN100_Normal': 1248, 'REN100_Extreme': 1248}
- PASS — hydroSelected rows per case — {'BAU_Normal': 2184, 'BAU_Extreme': 2184, 'REN100_Normal': 2184, 'REN100_Extreme': 2184}
- PASS — hydroRegimeMonthly complete — 3744
- PASS — monthly demand sums to annual demand — max abs error=1.455e-11 GWh
- PASS — hydro regime months complete
- PASS — Pacific + Amazon = system hydro — max error=4.999e-09 GWh
- PASS — system hydro = native technology aggregate — max error=2.608e-09 GWh
- PASS — hydrology calendar complete
- PASS — transmission has seven 26-year corridors per case
- PASS — transmission utilization within [0,1]
- PASS — transmission decisions identified — {'BAU_Extreme': [{'year': 2046, 'corridor': 'ZNO → ZNX', 'action': 'Add 1 standard circuit', 'state': 'New standard circuit(s)'}], 'BAU_Normal': [{'year': 2045, 'corridor': 'ZNO → ZNX', 'action': 'Reinforce existing corridor', 'state': 'Existing corridor reinforced'}], 'REN100_Extreme': [{'year': 2041, 'corridor': 'ZNO → ZNX', 'action': 'Add 1 standard circuit', 'state': 'New standard circuit(s)'}, {'year': 2047, 'corridor': 'ZSO → ZSX', 'action': 'Add 2 standard circuits', 'state': 'New standard circuit(s)'}, {'year': 2048, 'corridor': 'ZSO → ZSX', 'action': 'Add 1 standard circuit', 'state': 'New standard circuit(s)'}, {'year': 2049, 'corridor': 'ZSO → ZSX', 'action': 'Add 1 standard circuit', 'state': 'New standard circuit(s)'}, {'year': 2050, 'corridor': 'ZSO → ZSX', 'action': 'Add 1 standard circuit', 'state': 'New standard circuit(s)'}], 'REN100_Normal': [{'year': 2044, 'corridor': 'ZNO → ZNX', 'action': 'Reinforce existing corridor', 'state': 'Existing corridor reinforced'}, {'year': 2049, 'corridor': 'ZNO → ZNX', 'action': 'Add 1 reinforced circuit', 'state': 'Reinforced existing + new circuit(s)'}]}
- PASS — physical grid feature count — 133
- PASS — physical grid voltage composition — {138: 66, 230: 53, 69: 8, 500: 6}
- PASS — physical grid coordinates in Ecuador extent — bbox=(-80.848,-4.063)–(-76.672,1.180)
- PASS — no private model/result artifacts
- PASS — no generator-level 6-bus block
- PASS — no dataset ZIP/CSV buttons
- PASS — no duplicate HTML IDs
- PASS — all JavaScript element references exist
- PASS — all chart plots have visible unit definitions
- PASS — PeakCreditedCapacity uses native MW
- PASS — physical-grid voltage selector implemented
- PASS — all index local links exist
- PASS — dashboard JavaScript syntax
- PASS — runtime has no JavaScript errors
- PASS — runtime units visible on every rendered plot
- PASS — runtime physical grid traces visible
- PASS — runtime 6-bus corridors visible — {'table_headers': ['Corridor', 'Base [MW]', 'Available 2050 [MW]', 'Added [MW]', 'Cumulative decision', 'First investment year', 'Action in selected year', 'Peak flow [MW]', 'Utilization [%]', 'Annual CAPEX [MUSD]\n'], 'table_rows': 7, 'timeline_traces': 1, 'timeline_events': 1, 'map_trace_count': 14, 'planning_corridors': 7, 'physical_voltage_traces': 4}
- PASS — runtime hydro cascade and seasonality visible — {'system_monthly_values': 12, 'seasonality_traces': 1, 'regime_traces': 3, 'cascade_groups_system': 3, 'cascade_table_rows_system': 7, 'unit_badges': 5, 'paute_nodes': 4, 'paute_arrows': 3, 'paute_table_rows': 4}
