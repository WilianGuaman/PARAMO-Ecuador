<p align="center">
  <img src="assets/brand/paramo-logo-horizontal.svg" alt="PARAMO — Planning And Resource Allocation under Multi-scenario Optimization" width="880">
</p>

<p align="center"><strong>Interactive long-term power-system planning results for Ecuador</strong></p>

<p align="center">
  <a href="https://wilianguaman.github.io/PARAMO-Ecuador/"><img src="assets/brand/open-dashboard.svg" alt="Open interactive dashboard" width="430"></a>
  &nbsp;&nbsp;
  <a href="downloads/PARAMO_Ecuador_Public_Results_v1.0.0.zip"><img src="assets/brand/download-data.svg" alt="Download public data" width="320"></a>
</p>

<p align="center">
  <a href="https://wilianguaman.github.io/PARAMO-Ecuador/"><img src="assets/readme/paramo-ecuador-hero.png" alt="PARAMO Ecuador Results Explorer" width="100%"></a>
</p>

# PARAMO Ecuador Results Explorer

**PARAMO — Planning And Resource Allocation under Multi-scenario Optimization** is a long-term power-system planning framework for hydro-dependent systems. This repository provides an interactive public results layer for two Ecuador applications of PARAMO, with emphasis on expansion decisions, hydro-climatic uncertainty, decarbonization, reliability and system cost.

The explorer is designed for direct technical use: figures are interactive, scenario states are shareable by URL, chart data can be downloaded, and the complete curated public dataset is distributed with provenance and citation metadata. The optimization engine and non-public model assets are not distributed in this repository.

<p align="center"><a href="https://wilianguaman.github.io/PARAMO-Ecuador/"><strong>▶ OPEN THE PARAMO ECUADOR RESULTS EXPLORER</strong></a></p>

## Study cases

| Study case | Planning pathways | Hydrology | Uncertainty | Public result scope |
|---|---|---|---|---|
| **Ecuador 24-Bus National Planning Case** | REF · BRIDGE · NZT | Baseline · Adverse | W100 · W5 | Generation expansion, operation, reservoirs, CO₂, ENS, costs and Monte Carlo statistics |
| **Ecuador 6-Bus Reduced Planning Case** | BAU · REN100 | Normal · Extreme | Single realization | Generation/transmission expansion, corridor utilization, reservoirs, CO₂, ENS and costs |

## Ecuador power-system geography

The spatial layer links the reduced PARAMO planning representation with georeferenced records from the Ecuador Power DataHub. The figure below combines the 24-bus planning network with reference transmission infrastructure, generation assets and canonical planning zones.

<p align="center"><img src="assets/readme/ecuador-network-zones.png" alt="Ecuador power-system geography with PARAMO network, zones and generation assets" width="96%"></p>

The reference geography provides spatial context. Physical assets and reduced optimization objects are kept distinct through explicit crosswalk and provenance fields.

## Planning outcomes

Cost, decarbonization and reliability are treated as complementary dimensions of planning performance. The 24-bus case compares REF, BRIDGE and NZT under Baseline and Adverse hydrological conditions.

<p align="center"><img src="assets/readme/planning-results-overview.png" alt="PARAMO results comparing total system cost, carbon emissions and energy not served" width="96%"></p>

Representative public results include:

- **BRIDGE — Baseline:** mean total system cost of **28.18 billion USD** and cumulative emissions of **43.36 MtCO₂**.
- **NZT — Baseline:** cumulative emissions of **22.02 MtCO₂**, the lowest among the three national pathways under Baseline hydrology.
- **Adverse hydrology:** higher costs and emissions across all national pathways, exposing the planning consequences of hydro-climatic stress.
- **Reliability:** energy not served (ENS) is reported explicitly by pathway, hydrology, year and uncertainty statistic.

## Interactive analysis

The dashboard provides:

- **Overview** — cost, CO₂, ENS, installed capacity and scenario trade-offs.
- **Generation Expansion** — technology-specific capacity additions and long-term generation trajectories.
- **Transmission & Reconductoring** — georeferenced network context and corridor-level results where included in the public case data.
- **Hydrology & Reservoirs** — hydro availability, storage, turbining, spillage and uncertainty envelopes.
- **System Operation** — annual and monthly generation, imports, reserves and reliability indicators.
- **Emissions & Decarbonization** — cumulative and annual CO₂, uncertainty and cost–emissions performance.
- **Reliability & ENS** — cumulative/annual ENS, distributions and reliability–cost relationships.
- **Costs & Uncertainty** — economic components and Monte Carlo distributions.
- **Scenario Comparison** — side-by-side comparison of compatible configurations.
- **Data & Downloads** — chart-level exports, current-selection packages and the complete public dataset.

## Download and reproduce

Results can be downloaded at three levels:

1. **Chart data** — CSV for the active visualization and PNG/SVG figure export.
2. **Current selection** — a browser-generated ZIP for the active case, scenario and hydrology.
3. **Complete public dataset** — curated data for both Ecuador cases, geography, metric definitions and provenance metadata.

**Complete dataset:** [`PARAMO_Ecuador_Public_Results_v1.0.0.zip`](downloads/PARAMO_Ecuador_Public_Results_v1.0.0.zip)

The public distribution excludes GAMS source files, private InputData workbooks, GDX/LST files, solver logs and non-public research assets.

## Methodology and provenance

The **Ecuador 24-Bus National Planning Case** evaluates REF, BRIDGE and NZT over 2025–2050. Baseline hydrology contains **100 Monte Carlo realizations** and Adverse hydrology contains **5 realizations**. Ensemble depth is displayed explicitly throughout the explorer. The **Ecuador 6-Bus Reduced Planning Case** uses the same planning framework in a compact representation with corridor-level transmission outputs.

National ENS statistics in the public layer are calculated from realization-level PNS result tables. Methodology, data provenance and interpretation boundaries are documented in:

- [`docs/METHODOLOGY.md`](docs/METHODOLOGY.md)
- [`docs/DATA_PROVENANCE.md`](docs/DATA_PROVENANCE.md)
- [`docs/LIMITATIONS.md`](docs/LIMITATIONS.md)
- [`data/metadata/data_dictionary.csv`](data/metadata/data_dictionary.csv)

## Citation

If you use the explorer, figures or public results, cite the repository and, where the integrated planning methodology is relevant, the associated scholarly publication.

**PARAMO Ecuador Results Explorer**

> Guamán Cuenca, W. (2026). *PARAMO Ecuador Results Explorer: Planning And Resource Allocation under Multi-scenario Optimization* (Version 1.0.0) [Software and public research results]. GitHub. https://github.com/WilianGuaman/PARAMO-Ecuador

**Foundational publication**

> Guamán, W., Benalcazar, P., Cordova-Garcia, J., & Torres, M. (2025). *An integrated framework for the optimal expansion of hydro-dependent power systems under water-resource uncertainty*. **Energy Conversion and Management: X, 28**, 101297. https://doi.org/10.1016/j.ecmx.2025.101297

Machine-readable citation files are provided as [`CITATION.cff`](CITATION.cff), [`CITATION.bib`](CITATION.bib) and [`CITATION.ris`](CITATION.ris).

## Licensing and attribution

| Component | Terms |
|---|---|
| Dashboard source code | **Apache License 2.0** |
| PARAMO-derived public results, original figures and documentation | **CC BY 4.0** |
| Third-party reference data | Original source terms apply |
| PARAMO optimization model and non-public model assets | **Not distributed** |

Copyright © 2026 **Wilian Guamán Cuenca**. See [`LICENSES.md`](LICENSES.md) and [`NOTICE.md`](NOTICE.md) for component-level terms and attribution scope.

## Author

**Wilian Guamán Cuenca**  
Developer and curator of the PARAMO Ecuador Results Explorer.

---

<p align="center">
  <a href="https://wilianguaman.github.io/PARAMO-Ecuador/"><strong>Open Dashboard</strong></a> ·
  <a href="docs/CITATION.md"><strong>Cite PARAMO</strong></a> ·
  <a href="downloads/PARAMO_Ecuador_Public_Results_v1.0.0.zip"><strong>Download Data</strong></a>
</p>
