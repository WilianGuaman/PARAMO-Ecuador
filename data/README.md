# Public data layer

The Results Explorer follows a minimum-public-data architecture.

The chart-ready result series used by the static site are embedded in:

`assets/js/dashboard_data.js`

The bundle contains only the system aggregates and selected diagnostics required to render the public figures. It is not the complete PARAMO result database and is not intended as a substitute for the controlled research dataset.

This `data/` directory contains only supporting public resources:

- `geography/` — the mainland Ecuador outline, the existing 230 and 500 kV grid retained from the supplied georeferenced line layer, reference generation facilities, reduced PARAMO network geography, zone metadata and international anchors;
- `metadata/` — case registry, metric definitions, scenario catalog, public-bundle schema, validation summaries and release checksums.

For the Ecuador 24-Bus case, the public result layer contains ensemble summary statistics, robust-multimetric representative trajectories, aggregate transmission-investment statistics and aggregate reservoir/hydropower operation. It does not contain realization-level tables, line-specific investment decisions or reservoir-specific hydraulic transfers.

For the Ecuador 6-Bus case, the public layer contains validated system aggregates, corridor-year decisions and selected reservoir/cascade diagnostics required by the explorer. Full generator-level output is not distributed.

Generator-level build tables, realization-level Monte Carlo outputs, GDX/LST/log files, InputData workbooks and complete Results workbooks are not distributed.

See [`../docs/DATA_ACCESS.md`](../docs/DATA_ACCESS.md) and [`../docs/DATA_PROVENANCE.md`](../docs/DATA_PROVENANCE.md).
