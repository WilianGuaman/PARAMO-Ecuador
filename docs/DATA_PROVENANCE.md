# Data provenance

## Public result layer

The explorer combines two classes of information:

1. **PARAMO planning results**, transformed offline from validated result archives into a minimum chart-ready browser bundle.
2. **Reference-system geography**, retained from the public Ecuador planning/geospatial crosswalk used by the previous explorer release.

The browser bundle is a publication layer. It is not a copy of the complete `Results.xlsx`, GDX database, InputData workbook or solver output.

## Ecuador 6-Bus — current result source

Version 2.4.0 uses the final four-case 6-bus PARAMO run completed on 30 August 2026:

- BAU / Normal;
- BAU / Extreme;
- REN100 / Normal;
- REN100 / Extreme.

The source run covers 2025–2050 and uses one active realization (`W=1`) for each configuration. The final public bundle was regenerated from the consolidated Results workbook associated with the 30 August 2026 run; earlier 6-bus public values were replaced rather than merged. All four cases completed with `ModelStat = 8`, `SolveStat = 1` and MIP gap below 1%. The source model reported 330 generators, 6 reduced planning nodes, 7 planning corridors, 209 hydro plants, 4 reservoirs and 4 hydraulic links. Detailed validation is recorded in [`VALIDATION.md`](VALIDATION.md) and `data/metadata/validation/ecuador_6bus_v2_validation.json`.

The public transformation uses the current result schema:

- scenario summary;
- annual system indicators;
- generation/capacity/additions by technology;
- monthly system indicators;
- corridor-level transmission results;
- reservoir operation;
- compact hydro-plant monthly results;
- cascade-hydraulics results.

Full generator-level annual/build records are used only during offline transformation and are not distributed in the public repository.

## 6-Bus fuel/resource reconstruction

The native 6-bus technology output combines diesel-, residual/fuel-oil- and gas-fired units under a fossil-thermal class. The public fuel/resource view is reconstructed offline from the validated generator roster and then aggregated before publication.

The mapping distinguishes:

- Hydro;
- Solar PV;
- Wind;
- Geothermal;
- Bioenergy;
- Diesel;
- Fuel oil / residual;
- Natural gas;
- Imports.

The reconstructed annual generation totals reproduce the native model technology totals for all four cases and all planning years within `1e-5 GWh`. Generator-level fuel mapping is not included in the public release.

## Hydraulic topology

The 6-bus cascade display follows the model input relationships:

- Mazar → Paute Molino: total upstream release;
- Paute Molino → Sopladora: turbine discharge;
- Sopladora → Cardenillo: turbine discharge;
- Agoyán → San Francisco: turbine discharge;
- Pucará: independent reservoir.

Reservoir storage and release data come from the reservoir result block. Zero-storage cascade-ROR water transfers come from the separate cascade-hydraulics result block.

## Zone crosswalk

The reduced model uses historical source-zone labels that differ from the canonical public display convention for the four internal Ecuador zones. The transformation retains the validated crosswalk offline and publishes canonical display codes in the explorer while preserving model-source fields where needed for traceability in the embedded corridor records.

## Reference geography

Reference plants and the georeferenced planning-network overlay provide physical context. They are visually separated from optimization objects because reduced planning nodes/corridors are abstractions and are not one-to-one physical assets.

Colombia and Peru are shown as external planning systems using the reference anchors retained by the public geography layer.

## Ecuador 24-Bus

The national case is retained from the validated public planning-result archive used by the preceding explorer release. The public browser contains aggregate uncertainty statistics and representative trajectories. The W100/W5 realization-level source tables used to create those summaries are not distributed in version 2.4.0.

National ENS aggregates retain the corrected source-based calculation used in the preceding audited release.


## Georeferenced transmission network (v2.4.0)

The public geography is generated from the exact user-supplied `Lineas.geojson` file. The source contains 587 electricity-line features originally encoded in WGS 84 / UTM zone 17S (EPSG:32717). All 587 features are transformed to EPSG:4326 and retained in the public layer. The default dashboard view filters the layer to the 146 lines at 138 kV or above; users may display all supplied features or individual voltage levels.

The browser renders the lines in a local longitude/latitude engineering plot rather than relying on an external basemap service. Display attributes include voltage, thermal limit, length, circuit count, topology and company where supplied. PARAMO planning branches and reduced corridors remain separate overlays because they are model abstractions, not one-to-one physical assets.

The supplied files did not contain a complete citation or license statement. The repository owner should preserve or add the authoritative source and original terms before external redistribution.
