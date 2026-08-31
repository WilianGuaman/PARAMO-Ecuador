# Validation

## Ecuador 6-Bus source run

Version 2.5.0 retains the final four-scenario 6-bus run completed on 30 August 2026. All cases retained a usable incumbent:

| Case | ModelStat | SolveStat | MIP gap [%] |
|---|---:|---:|---:|
| BAU_Normal | 8 | 1 | 0.6862 |
| BAU_Extreme | 8 | 1 | 0.9792 |
| REN100_Normal | 8 | 1 | 0.7459 |
| REN100_Extreme | 8 | 1 | 0.6455 |

Structural counts are common to all four cases: 330 generators, 147 existing, 183 candidates, 6 nodes, 7 corridors, 209 hydro generators, 4 reservoirs, 205 ROR generators and 4 hydraulic links.

The source audit reports zero base-year endogenous build, zero peak-snapshot PNS, annual-demand residuals near floating-point precision, water-balance residuals below tolerance and no corridor-utilization violation beyond floating-point tolerance.

## Ecuador 24-Bus source archives

The national public layer was rebuilt from the supplied Helios BigMem and Local PC archives.

| Public hydrology | Ensemble | Pathways | Horizon |
|---|---:|---|---|
| Baseline | W100 | REF, BRIDGE, NZT | 2025–2050 |
| Adverse | W5 | REF, BRIDGE, NZT | 2025–2050 |

The robust-multimetric representative selections are:

| Hydrology | BRIDGE | NZT | REF |
|---|---:|---:|---:|
| Baseline | w96 | w59 | w32 |
| Adverse | w2 | w5 | w5 |

The public transformation includes 156 annual representative rows, 1,560 annual capacity rows, 18,720 monthly generation rows, 1,872 monthly operation rows, 1,872 aggregate reservoir rows, 72 hydro-climatology rows and 24 transmission-investment statistic rows.

## Geography

The public physical-grid layer contains exactly 59 features:

- 500 kV: 6;
- 230 kV: 53.

The Ecuador boundary is present, and both reduced networks can be toggled independently:

- 24-node: 24 nodes and 30 branches;
- 6-node: 6 internal planning nodes and 7 corridors, with external Colombia/Peru anchors.

## Runtime browser validation

The packaged HTML, CSS, Plotly library, public data bundle, geographic bundle and dashboard JavaScript were executed together in headless Chromium.

Validated behaviours:

- no JavaScript page errors or console errors;
- release version shown as 2.5.0;
- no obsolete voltage-filter control;
- Ecuador boundary trace rendered for 24N and 6N;
- existing 500 and 230 kV layers rendered;
- 24-node reduced network rendered and independently toggled;
- 6-node reduced network rendered and independently toggled;
- map axes show longitude/latitude units;
- 24-bus transmission chart contains the three available investment components;
- 24-bus transmission axes show MUSD;
- branch-level investment decisions remain disabled for 24N;
- 24-bus hydrology renders Baseline/Adverse climatology with GWh/month units;
- Paute cascade renders four plants and positive Sankey links;
- reference 6-bus corridor/cascade functions remain operational.

Runtime details are stored in `data/metadata/validation/runtime_v2.5.0.json`.

## Public-data controls

The release package is checked to exclude `.gms`, `.gdx`, `.xlsx`, `.xlsb`, `.lst` and `.log` research artifacts. Direct result CSV/ZIP downloads are not exposed in the browser. The complete source archives remain outside the public repository.


## Release gate

The v2.5.0 public package passed **91/91** static, metadata, privacy, bundle-integrity and key-view browser checks. The machine-readable records are:

- `data/metadata/validation/release_checks_v2.5.0.json`;
- `data/metadata/validation/runtime_v2.5.0.json`.
