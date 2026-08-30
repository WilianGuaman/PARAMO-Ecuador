<p align="center">
  <img src="assets/brand/paramo-logo-horizontal.svg" alt="PARAMO" width="560">
</p>

<p align="center">
  <strong>PARAMO Ecuador Results Explorer</strong><br>
  Long-term generation, transmission and hydropower planning under hydrological uncertainty · 2025–2050
</p>

<p align="center">
  <a href="https://wilianguaman.github.io/PARAMO-Ecuador/"><img src="assets/brand/open-dashboard.svg" alt="Open dashboard" width="320"></a>
  &nbsp;&nbsp;
  <a href="https://github.com/WilianGuaman/PARAMO-Ecuador/issues/new?template=data-access-request.yml"><img src="assets/brand/request-data.svg" alt="Request research data" width="320"></a>
</p>

<p align="center">
  <a href="https://github.com/WilianGuaman/PARAMO-Ecuador/issues/new?template=data-access-request.yml"><strong>Request research data</strong></a>
  &nbsp;·&nbsp;
  <a href="docs/CITATION.md"><strong>Cite PARAMO</strong></a>
  &nbsp;·&nbsp;
  <a href="docs/METHODOLOGY.md"><strong>Methodology</strong></a>
</p>

---

## Overview

**PARAMO** — *Planning And Resource Allocation under Multi-scenario Optimization* — is a long-term power-system planning framework for hydro-dependent systems. This repository contains the public Ecuador Results Explorer, not the optimization engine or the private research database.

The explorer combines two complementary study cases:

| Study case | Policy pathways | Hydrology | Public uncertainty representation |
|---|---|---|---|
| **Ecuador 24-Bus** | REF, BRIDGE, NZT | Baseline, Adverse | Aggregate Monte Carlo statistics plus representative trajectories |
| **Ecuador 6-Bus** | BAU, REN100 | Normal, Extreme | Four validated single-realization planning cases (`W=1`) |

The 6-bus public layer was rebuilt from the final PARAMO run completed on **30 August 2026**. All four configurations completed with `ModelStat = 8`, `SolveStat = 1`, MIP gap below 1%, zero base-year endogenous build, and numerical balance residuals within tolerance. See [`docs/VALIDATION.md`](docs/VALIDATION.md).

| 6-bus case | Total cost [MUSD] | Cumulative CO₂ [MtCO₂] | Cumulative ENS [GWh] | Final renewable share |
|---|---:|---:|---:|---:|
| BAU · Normal | 32,615.81 | 23.44 | 0.00 | 97.81% |
| BAU · Extreme | 36,823.54 | 146.95 | 61.59 | 85.19% |
| REN100 · Normal | 32,741.32 | 21.12 | 0.00 | 100.00% |
| REN100 · Extreme | 50,872.92 | 41.81 | 10,012.06 | 100.00% |

The renewable target and system adequacy are reported separately. In particular, the final REN100 · Extreme solution reaches a 100% renewable final-year generation share while exhibiting substantial cumulative ENS under extreme hydrology.


## Explorer

The interface is organized around planning questions rather than raw result files:

- **Overview** — system cost, cumulative CO₂, ENS, expansion and final renewable share.
- **Generation Expansion** — capacity, additions and annual generation by technology or fuel/resource.
- **Transmission & Reconductoring** — 6-bus corridor capacity, expansion/reinforcement state, peak flow, utilization and investment.
- **Hydrology & Reservoirs** — hydro availability, reservoir operation and selected hydraulic cascades.
- **System Operation** — monthly energy balance, reserve, curtailment, imports and ENS.
- **Emissions & Decarbonization** — annual and cumulative carbon outcomes.
- **Reliability & ENS** — reliability trajectories and cost trade-offs.
- **Costs & Uncertainty** — cost composition and available uncertainty summaries.
- **Scenario Comparison** — common indicators for two selected configurations.

The map distinguishes reduced planning corridors from the georeferenced reference network. Reference plants can be displayed independently. For the 6-bus case, corridor width represents available capacity and corridor color identifies the cumulative expansion state.

### Georeferenced transmission view

The browser draws the **user-supplied `Lineas.geojson` directly as a local longitude/latitude engineering plot**. It does not depend on an external web-map service. The default view shows the ≥138 kV backbone; the selector can display all 587 supplied features or individual voltage levels. Planning corridors remain visually separate from the physical grid.

<p align="center">
  <img src="assets/readme/georeferenced-grid-6bus-v2.4.0.png" alt="PARAMO georeferenced physical grid and 6-bus planning corridors" width="430">
</p>

### Transmission decisions

The 6-bus transmission module identifies cumulative corridor configuration, the action executed in the selected year, first investment year, available capacity, added capacity, peak flow, utilization and annual CAPEX.

<p align="center">
  <img src="assets/readme/transmission-decisions-6bus-v2.4.0.png" alt="PARAMO 6-bus transmission investment and corridor decisions" width="980">
</p>

## Hydropower cascades

The reduced Ecuador case includes explicit hydraulic relationships used in the explorer:

- **Paute:** Mazar → Paute Molino → Sopladora → Cardenillo
- **Agoyán:** Agoyán → San Francisco
- **Pucará:** independent reservoir

The public hydrology view combines reservoir storage/output data with a separate cascade-hydraulics layer for zero-storage run-of-river plants. This avoids treating every hydro plant as a reservoir while preserving the water-transfer information needed to interpret the cascades.

The v2.4.0 hydrology view uses the final reservoir and cascade outputs while retaining explicit monthly axes and units, wet/dry seasonal calendars, a dual-axis generation/release chart, a hydraulic Sankey diagram and a detailed plant-by-plant cascade table.

<p align="center">
  <img src="assets/readme/hydrology-cascade-6bus-v2.4.0.png" alt="PARAMO monthly hydro seasonality, reservoir operation and Paute cascade" width="980">
</p>

## Public-data policy

This repository intentionally does **not** distribute the full model-result database. GitHub Pages is a static application: any value delivered to the browser is technically accessible. The browser bundle therefore contains only the aggregates and selected diagnostics required by the public visualizations.

Not distributed through this repository:

- PARAMO GAMS source/model implementation;
- InputData workbooks;
- GDX, LST and solver-log files;
- the complete Results workbook;
- full generator-level annual/build outputs;
- Monte Carlo realization-level result tables.

Additional research data may be requested using the repository data-access form. Requests are reviewed before any non-public material is shared.

**Data access:** [`docs/DATA_ACCESS.md`](docs/DATA_ACCESS.md) · [Open request form](https://github.com/WilianGuaman/PARAMO-Ecuador/issues/new?template=data-access-request.yml)

## Public repository structure

```text
PARAMO-Ecuador/
├─ index.html                     # GitHub Pages explorer
├─ assets/
│  ├─ js/dashboard.js             # visualization logic
│  ├─ js/dashboard_data.js        # minimal chart-ready public bundle
│  ├─ css/dashboard.css
│  ├─ brand/
│  └─ vendor/plotly-3.3.1.min.js
├─ data/
│  ├─ geography/                  # public reference geography
│  └─ metadata/                   # schemas, validation and release manifest
├─ docs/
│  ├─ METHODOLOGY.md
│  ├─ DATA_PROVENANCE.md
│  ├─ DATA_ACCESS.md
│  ├─ VALIDATION.md
│  ├─ LIMITATIONS.md
│  └─ CITATION.md
├─ CITATION.cff
└─ LICENSES.md
```

## Reproducibility and provenance

The dashboard is a publication layer for precomputed PARAMO results. The source result workbooks are audited offline before a public bundle is generated. The public release retains case/scenario metadata, validation summaries and file hashes without exposing the complete research database.

- [`docs/DATA_PROVENANCE.md`](docs/DATA_PROVENANCE.md)
- [`data/metadata/public_bundle_schema.json`](data/metadata/public_bundle_schema.json)
- [`data/metadata/validation/ecuador_6bus_v2_validation.json`](data/metadata/validation/ecuador_6bus_v2_validation.json)
- [`data/metadata/public_release_manifest.csv`](data/metadata/public_release_manifest.csv)

## Citation

**Explorer / software release**

> Guamán Cuenca, W. (2026). *PARAMO Ecuador Results Explorer: Planning And Resource Allocation under Multi-scenario Optimization* (Version 2.4.0) [Software and public research results]. GitHub. https://github.com/WilianGuaman/PARAMO-Ecuador

**Foundational methodology**

> Guamán, W., Benalcazar, P., Cordova-Garcia, J., & Torres, M. (2025). *An integrated framework for the optimal expansion of hydro-dependent power systems under water-resource uncertainty*. **Energy Conversion and Management: X, 28**, 101297. https://doi.org/10.1016/j.ecmx.2025.101297

Machine-readable citation: [`CITATION.cff`](CITATION.cff) · [`BibTeX`](docs/citation/CITATION.bib) · [`RIS`](docs/citation/CITATION.ris)

## Licensing

| Component | Terms |
|---|---|
| Dashboard source code | Apache License 2.0 |
| PARAMO-derived public visualization data and original documentation | CC BY 4.0 where indicated |
| Plotly.js | MIT License |
| Third-party reference geography | Original source terms apply |
| PARAMO optimization engine and non-public research assets | Not distributed |

See [`LICENSES.md`](LICENSES.md) for component-level terms and attribution.

Copyright © 2026 **Wilian Guamán Cuenca**.

## v2.4.0 final-result refresh

The current release replaces the preceding 6-bus values with the final four-scenario results completed on 30 August 2026. It retains the georeferenced transmission network, explicit axis units, corridor investment timing and seasonal/reservoir/cascade hydrology introduced in the visual upgrade. See [`docs/RELEASE_NOTES_v2.4.0.md`](docs/RELEASE_NOTES_v2.4.0.md).
