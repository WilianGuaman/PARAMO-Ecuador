# Validation — Ecuador 6-Bus public release

Version 2.1.0 uses the four-scenario PARAMO run completed on 28 August 2026. The run completed normally and produced consolidated GDX and Excel outputs.

## Solver status

| Case | ModelStat | SolveStat | MIP gap [%] | Solve time [s] |
|---|---:|---:|---:|---:|
| BAU_Normal | 8 | 1 | 0.675 | 282.0 |
| BAU_Extreme | 8 | 1 | 0.558 | 1,063.5 |
| REN100_Normal | 8 | 1 | 0.882 | 755.0 |
| REN100_Extreme | 8 | 1 | 0.585 | 775.0 |

All four solutions satisfy the configured 1% MIP-gap criterion.

## Structural checks

The source result summary reports the same system structure for all four cases:

- 330 generators;
- 147 existing generators;
- 183 candidate generators;
- 6 planning nodes;
- 7 planning corridors;
- 209 hydro generators;
- 4 reservoir plants;
- 205 run-of-river hydro generators;
- 54 VRE generators;
- 65 thermal-class generators;
- 2 imports;
- 4 hydraulic links;
- one active realization (`W=1`).

## Numerical audit

For all four cases:

- base-year endogenous new build = 0 MW;
- maximum peak PNS = 0 MW;
- annual demand reconstruction residual is approximately `2.91e-11 GWh`;
- reported water-balance residual is within numerical tolerance;
- maximum corridor utilization does not exceed the modeled limit beyond floating-point tolerance.

## Public fuel/resource reconstruction

The generator-level source roster was used offline to reconstruct annual generation by public fuel/resource category. The sum of the reconstructed categories matches the model's native annual technology aggregation for every case and year within `1e-5 GWh`.

Only the aggregated fuel/resource series are included in the browser bundle.

## Public explorer validation

The v2.1.0 build also passes 40 release-layer checks. These include:

- exact agreement between the four public 6-bus scenario summaries and the source `Results.xlsx`;
- 26 annual and 312 monthly records per case;
- 7 corridor trajectories over 26 years per case;
- monthly demand reconstruction of annual demand within `1.46e-11 GWh`;
- Pacific plus Amazon hydro generation reproducing the complete system hydro series within `5e-9 GWh`;
- complete 12-month wet/dry calendars for both hydrological regimes;
- 133 georeferenced physical transmission features with valid Ecuador coordinates;
- runtime rendering of the physical grid, 6-bus planning corridors, decision timeline, reservoir views, hydrological seasonality and hydraulic cascades;
- a visible engineering-unit label for every rendered analytical chart;
- no GAMS, GDX, Excel, LST or solver-log artifacts in the public package;
- no direct dataset ZIP or CSV-result download in the public interface.

The machine-readable report is available at [`data/metadata/validation/public_explorer_v2.1.0_validation.json`](../data/metadata/validation/public_explorer_v2.1.0_validation.json). A human-readable release checklist is available at [`VALIDATION_v2.1.0.md`](../VALIDATION_v2.1.0.md).
