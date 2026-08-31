# Data provenance

## Public result layer

The explorer combines:

1. **PARAMO planning results**, transformed offline from supplied result archives into a minimum chart-ready browser bundle;
2. **reference-system geography**, including public planning crosswalks and a filtered existing-grid layer;
3. a simple mainland Ecuador boundary used only for geographic orientation.

The browser bundle is a publication layer. It is not a copy of a complete Results workbook, GDX database, InputData workbook or solver output.

## Ecuador 6-Bus

The 6-bus layer uses the final four-case PARAMO run completed on 30 August 2026:

- BAU / Normal;
- BAU / Extreme;
- REN100 / Normal;
- REN100 / Extreme.

The source run covers 2025–2050 and uses one active realization (`W=1`) per configuration. All four cases completed with `ModelStat = 8`, `SolveStat = 1` and MIP gap below 1%.

The public transformation uses:

- scenario summary;
- annual and monthly system indicators;
- generation/capacity/additions by technology;
- corridor-level transmission results;
- reservoir operation;
- compact hydro-plant monthly results;
- cascade-hydraulics results.

Full generator-level annual/build records are not distributed.

## Ecuador 24-Bus

Version 2.5.0 rebuilds the national public layer from the two archives supplied for review:

| Public label | Source archive | Ensemble size |
|---|---|---:|
| Baseline | Helios BigMem | 100 realizations per pathway |
| Adverse | Local PC | 5 realizations per pathway |

The archives contain REF, BRIDGE and NZT outputs for 2025–2050. The Baseline/Adverse interpretation follows the supplied study context; the archive metadata themselves do not contain explicit `Baseline`/`Adverse` labels. This mapping is therefore recorded as a publication assumption.

### Representative trajectories

A common `robust_multimetric` method is used:

| Public label | BRIDGE | NZT | REF |
|---|---:|---:|---:|
| Baseline | w96 | w59 | w32 |
| Adverse | w2 | w5 | w5 |

The representative trajectories supply annual generation, annual capacity, monthly generation, reserve/PNS/CO₂, and aggregate reservoir operation. Aggregate Mean/P10/P50/P90 statistics use the complete ensemble.

### Transmission information

Realization-level cost tables supply:

- `NewLineBuiltCost`;
- `ExistingLineRepoweredCost`;
- `RepoweredLineBuiltCost`;
- `TransmissionCost`.

The supplied public-result archives do not include line identifiers or line-year decision/flow variables. The dashboard does not assign aggregate costs to individual branches.

### Hydrology information

The national archives supply aggregate storage, turbining, spill and release. Reservoir rows do not contain a reservoir ID. The public 24-bus hydrology view is therefore system-level. It does not attribute storage or hydraulic release to individual plants and does not construct cascade transfers.

## Fuel/resource reconstruction

The native 6-bus fossil-thermal output is reconstructed offline into public fuel/resource categories and aggregated before publication. Generator-level fuel mapping is not included in the public release.

## Hydraulic topology

The 6-bus cascade display follows the model relationships:

- Mazar → Paute Molino: total upstream release;
- Paute Molino → Sopladora: turbine discharge;
- Sopladora → Cardenillo: turbine discharge;
- Agoyán → San Francisco: turbine discharge;
- Pucará: independent reservoir.

## Existing transmission grid

The physical layer is derived from the user-supplied `Lineas.geojson`, originally provided in EPSG:32717 and transformed to EPSG:4326 for browser display. Version 2.5.0 retains only existing 500 and 230 kV features:

- 500 kV: 6;
- 230 kV: 53;
- total: 59.

The source files did not include a complete citation/license statement. The repository owner should retain the authoritative source and original redistribution terms.

## Ecuador boundary

The mainland Ecuador outline is a low-resolution Natural Earth-derived public-domain boundary used as cartographic context. It does not define the study-system electrical boundary.
