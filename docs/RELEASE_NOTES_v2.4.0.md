# PARAMO Ecuador Results Explorer v2.4.0

## Final 6-bus result refresh

- Replaces the preceding 6-bus public bundle with the final four-scenario PARAMO run completed on 30 August 2026.
- Preserves the audited Ecuador 24-bus public layer unchanged.
- Updates scenario summaries, annual and monthly operation, technology and fuel/resource aggregates, corridor decisions, reservoir operation and cascade hydraulics.
- Retains `W=1` and reports solver status, MIP gap and solve time for every 6-bus case.
- Reports the reliability implications of the final REN100_Extreme solution, including ENS, imports, curtailment and PNS penalty, without suppressing or normalizing those results.

## Transmission

- Rebuilds every corridor-year record from the final `Data_Transmission` output.
- Updates first investment year, cumulative configuration, annual action, available capacity, added capacity, flow, utilization and CAPEX.
- Preserves the exact user-supplied `Lineas.geojson` physical-grid layer and all voltage filters.
- Keeps physical grid features separate from reduced planning corridors.

## Hydrology and cascades

- Rebuilds reservoir, selected hydro-plant, cascade-hydraulic and Pacific/Amazon monthly series from the final Results workbook.
- Reconciles Pacific + Amazon generation with system hydropower.
- Reconciles monthly hydropower with the native annual hydro technology aggregate.
- Retains the Paute and Agoyán–San Francisco cascade diagrams and Pucará reservoir view.

## Fuel/resource reconstruction

- Rebuilds public fuel/resource generation, capacity, additions and emissions from the final generator-level annual output.
- Confirms reconciliation with the native PARAMO technology aggregates within numerical precision.
- Does not distribute the private generator-to-fuel mapping or generator-level annual/build data.

## Interface and units

- Retains explicit engineering units in all Cartesian x/y-axis titles.
- Retains local longitude/latitude rendering for the physical network.
- Keeps PNG/SVG figure export while direct CSV/result-dataset downloads remain disabled.
