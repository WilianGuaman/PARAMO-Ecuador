# Public data layer

The Results Explorer follows a minimum-public-data architecture.

The chart-ready result series used by the static site are embedded in:

`assets/js/dashboard_data.js`

The bundle contains only the system aggregates and selected diagnostics required to render the public figures. It is not the complete PARAMO result database and is not intended as a substitute for the controlled research dataset.

This `data/` directory contains only supporting public resources:

- `geography/` — reference generation assets, planning-network geography, zone metadata and international anchors;
- `metadata/` — case registry, metric definitions, scenario catalog, public-bundle schema, validation summaries and release checksums.

Generator-level result tables, realization-level Monte Carlo outputs, GDX/LST/log files, InputData workbooks and the complete Results workbook are not distributed.

See [`../docs/DATA_ACCESS.md`](../docs/DATA_ACCESS.md) and [`../docs/DATA_PROVENANCE.md`](../docs/DATA_PROVENANCE.md).
