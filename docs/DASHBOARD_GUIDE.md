# Dashboard guide

## Study cases

Use **Study case** to switch between the Ecuador 24-Bus National Planning Case and the Ecuador 6-Bus Reduced Planning Case. Scenario, hydrology and uncertainty controls adapt automatically.

### Ecuador 24-Bus

- Policy pathway: REF, BRIDGE, NZT.
- Hydrology: Baseline, Adverse.
- Statistic: Mean, P10, P50, P90, Representative realization.
- Baseline ensemble: W100.
- Adverse ensemble: W5.

Mean/P10/P50/P90 are available for the public aggregate uncertainty metrics. Annual and monthly trajectories are representative-realization outputs and are labelled accordingly.

### Ecuador 6-Bus

- Policy pathway: BAU, REN100.
- Hydrology: Normal, Extreme.
- Public release: W=1 for each of the four configurations.
- Year: 2025–2050.
- Month: January–December for monthly views.

The Generation section provides both a **fuel/resource** view and the original **technology aggregation**.

## Transmission & reconductoring

For the 6-bus case, select **All corridors** or an individual corridor. The table reports:

- base capacity [MW];
- available capacity in the selected year [MW];
- cumulative added capacity [MW];
- cumulative state (Base, Reinforced, Expanded, Expanded + reinforced);
- investment action in the selected year;
- peak flow [MW];
- utilization [%];
- annual corridor CAPEX [MUSD].

On the map, line width is proportional to available capacity and line color indicates the cumulative expansion state. The optional **Physical transmission grid** is the user-supplied georeferenced contextual layer and is visually distinct from the 6-bus reduced planning corridors.

## Hydrology & reservoirs

The 6-bus Hydro asset selector includes:

- Hydro system total;
- Paute cascade;
- Agoyán–San Francisco;
- Pucará;
- individual selected plants.

Cascade mode combines reservoir records with the zero-storage cascade-hydraulics output. The selected-month cascade diagram shows generation, AF, reservoir storage where applicable, and water transferred between linked plants.

## Map controls

- **Planning lines** — active model/planning network for the selected case.
- **Physical transmission grid** — user-supplied georeferenced electricity-line layer rendered in longitude/latitude coordinates.
- **Model nodes** — PARAMO planning nodes/zones.
- **Reference plants** — public reference generation assets.
- **International** — Colombia and Peru external-system anchors where represented.

Reference assets provide geographic context; they are not a one-to-one declaration that every physical asset is represented individually in the reduced optimization model.

## Figure export

Chart toolbars export **PNG** and **SVG** figures. Direct CSV/result-dataset downloads are intentionally disabled in the public interface.

## Data access

Additional research data can be requested from the **Data Access** tab or through the GitHub Issue Form. GitHub Issues are public, so requests must not include confidential, sensitive or personal information.

## Shareable views

The current study case, scenario, hydrology, statistic, year, month and active section are encoded in the URL. **Copy view link** reproduces the selected view.


## v2.4.0 map and hydrology controls

- **Planning / model lines** shows PARAMO planning objects.
- **Physical transmission grid** shows the complete supplied 6.3–500 kV line layer; the default filter displays the ≥138 kV backbone.
- Every chart displays a visible unit badge in addition to axis labels.
- The 6-bus transmission table separates cumulative corridor configuration from the action in the selected year.
- The hydrology section adds system-wide seasonal profiles, Pacific/Amazon availability and detailed Paute and Agoyán cascade operation.


## Physical-grid and hydro-flow controls in v2.4.0

Use **Georeferenced line voltage** to switch between the core ≥138 kV network, the ≥69 kV layer, all 587 supplied features, individual voltage levels, or transmission-only records. The hydrology page includes explicit monthly GWh/hm³ axes and a Sankey diagram for selected hydraulic cascades.
