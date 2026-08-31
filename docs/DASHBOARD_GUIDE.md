# Dashboard guide

## Study cases

### Ecuador 24-Bus

- Policy pathway: REF, BRIDGE, NZT.
- Hydrology: Baseline W100, Adverse W5.
- Statistic: Mean, P10, P50, P90, Representative.
- Representative rule: robust_multimetric.
- Year: 2025–2050.

Mean/P10/P50/P90 apply to the published aggregate uncertainty metrics. Annual and monthly trajectories are representative-realization outputs.

### Ecuador 6-Bus

- Policy pathway: BAU, REN100.
- Hydrology: Normal, Extreme.
- Public result: W=1 for each configuration.
- Year: 2025–2050.
- Month: January–December.

## Transmission & reconductoring

### 24-Bus

The transmission page reports aggregate investment by type:

- new lines;
- reinforcement of existing lines;
- new reinforced circuits;
- total transmission investment.

The statistic selector controls Mean/P10/P50/P90/Representative values. The 24-node branch-capability chart is a static case-definition view. It is not a map of selected investment decisions.

### 6-Bus

Select all corridors or one corridor. The page reports base/available capacity, cumulative configuration, action in the selected year, first investment year, flow, utilization and CAPEX.

## Hydrology & reservoirs

### 24-Bus

The page combines:

- ensemble aggregate storage P10–P50–P90;
- representative storage/turbining/spill by month;
- representative hydro generation and share;
- Baseline/Adverse calendar-month profiles over 2025–2050.

The supplied 24-bus outputs do not support reservoir-specific storage or plant-to-plant hydraulic transfer diagrams.

### 6-Bus

The hydro asset selector includes system total, Paute, Agoyán–San Francisco, Pucará and selected individual plants. Cascade mode combines reservoir records with zero-storage cascade-hydraulics results.

## Map controls

- **Existing 230/500 kV grid** — the filtered physical line layer.
- **PARAMO reduced network** — 24-node branches or 6-node corridors according to the selected case.
- **Reduced-model nodes** — nodes/buses of the active model abstraction.
- **Reference plants** — contextual public generation facilities.
- **International systems** — Colombia and Peru anchors where applicable.

The physical grid and reduced network can be enabled independently.

## Figure export

Chart toolbars export PNG and SVG. Direct CSV/result-dataset downloads are disabled.

## Shareable views

The study case, scenario, hydrology, statistic, year, month and active section are encoded in the URL. **Copy view link** reproduces the selected view.
