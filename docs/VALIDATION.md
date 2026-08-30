# Validation — Ecuador 6-Bus final public results

Version 2.4.0 uses the final four-scenario PARAMO run completed on **30 August 2026**. The run completed normally, retained a usable incumbent for every case, and produced consolidated GDX and Excel outputs.

## Solver status

| Case | ModelStat | SolveStat | MIP gap [%] | Solve time [s] |
|---|---:|---:|---:|---:|
| BAU_Normal | 8 | 1 | 0.686 | 346.0 |
| BAU_Extreme | 8 | 1 | 0.979 | 240.9 |
| REN100_Normal | 8 | 1 | 0.746 | 596.3 |
| REN100_Extreme | 8 | 1 | 0.646 | 449.1 |

All four solutions satisfy the configured 1% MIP-gap criterion.

## Final scenario summary

| Case | Total cost [MUSD] | Cumulative CO₂ [MtCO₂] | Cumulative ENS [GWh] | Final renewable share [%] |
|---|---:|---:|---:|---:|
| BAU_Normal | 32,615.81 | 23.44 | 0.00 | 97.81 |
| BAU_Extreme | 36,823.54 | 146.95 | 61.59 | 85.19 |
| REN100_Normal | 32,741.32 | 21.12 | 0.00 | 100.00 |
| REN100_Extreme | 50,872.92 | 41.81 | 10,012.06 | 100.00 |

The final 100%-renewable extreme-hydrology case reaches the renewable target but exhibits substantial ENS, imports, curtailment and reliability cost. The explorer reports these outcomes directly rather than treating target compliance as equivalent to adequacy.

## Structural checks

The source result summary reports the same model structure in all four cases:

- 330 generators;
- 147 existing generators;
- 183 candidate generators;
- 6 planning nodes;
- 7 planning corridors;
- 209 hydro generators;
- 4 reservoirs;
- 205 run-of-river hydro generators;
- 54 VRE generators;
- 65 thermal-class generators;
- 2 imports;
- 4 hydraulic links;
- one active realization (`W=1`).

## Numerical audit

For every case:

- base-year endogenous new build = 0 MW;
- maximum peak-snapshot PNS = 0 MW;
- annual demand reconstruction residual is approximately `2.91e-11 GWh`;
- maximum water-balance residual is below `1.71e-13 hm³`;
- maximum corridor utilization does not exceed the modeled limit beyond floating-point tolerance.

## Public-data transformation audit

The public bundle is rebuilt from the final Results workbook and validated before publication.

- 26 annual rows per case;
- 312 monthly rows per case;
- 182 corridor-year rows per case;
- 1,248 reservoir-month rows per case;
- 2,184 selected-hydro rows per case;
- monthly demand reconstructs annual demand within `1.46e-11 GWh`;
- Pacific + Amazon monthly hydro reconstructs system hydropower within `9.10e-13 GWh`;
- monthly system hydropower reconstructs the native annual hydro aggregate within `2.12e-10 GWh`;
- public fuel/resource generation reconstructs native technology output within `1.97e-10 GWh`;
- fuel/resource capacity reconstructs native technology capacity within `9.10e-13 MW`;
- fuel/resource new capacity reconstructs exactly;
- fuel/resource emissions reconstruct annual model emissions within `5.46e-12 ktCO₂`.

Only aggregated fuel/resource series are included in the browser bundle.

## Browser validation

The packaged application was executed in headless Chromium using the exact release HTML, CSS, Plotly library, data bundle and dashboard JavaScript.

- 59 plot contexts were exercised across the 24-bus and 6-bus cases;
- 0 JavaScript runtime errors;
- 0 missing visible Cartesian axis titles;
- 0 numeric y-axes without explicit units;
- the 6-bus map rendered 332 transmission paths and 6 model-node points;
- the Paute view rendered 6 positive Sankey links and 4 cascade rows.

Runtime results are recorded in `data/metadata/validation/runtime_v2.4.0.json`.
