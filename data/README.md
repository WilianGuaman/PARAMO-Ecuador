# Public Data Layer

This directory contains the curated data used by the PARAMO Ecuador Results Explorer.

- `cases/ecuador_24bus/` — REF, BRIDGE and NZT results under Baseline and Adverse hydrology.
- `cases/ecuador_6bus/` — BAU and REN100 results under Normal and Extreme hydrology.
- `geography/` — PARAMO network crosswalks and reference generation assets used for geographic context.
- `metadata/` — case manifests, metric definitions, scenario catalog, data dictionary and release manifest.

The public data layer excludes the PARAMO optimization engine, private InputData workbooks, GDX/LST files and solver logs. See `docs/DATA_PROVENANCE.md` for source and transformation details.
