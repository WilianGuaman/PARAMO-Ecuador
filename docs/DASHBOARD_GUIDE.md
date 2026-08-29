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
- cumulative state (Base, Reinforced, New circuit, Reinforced + new circuits);
- investment action in the selected year;
- peak flow [MW];
- utilization [%];
- annual corridor CAPEX [MUSD].

On the map, line width is proportional to available capacity and line color indicates the cumulative expansion state. The **Physical grid** control displays the author-supplied georeferenced line layer. The adjacent voltage selector filters the contextual network to all 69–500 kV lines, ≥138 kV, or an individual voltage level. It is visually distinct from the 6-bus reduced planning corridors. A separate decision timeline identifies the year and type of each corridor investment event.

## Hydrology & reservoirs

The 6-bus Hydro asset selector includes:

- Hydro system total;
- Paute cascade;
- Agoyán–San Francisco;
- Pucará;
- individual selected plants.

The seasonality heatmap shows monthly availability factors for the Pacific and Amazon hydrological regimes, while the regime profile shows their contribution to system hydropower. Cascade mode combines reservoir records with the zero-storage cascade-hydraulics output. The selected-month cascade diagram and hydraulic-balance table show generation, AF, storage, inflow, upstream transfer, turbinated water, spill/bypass and total release with explicit units.

## Map controls

- **Planning lines** — active model/planning network for the selected case.
- **Physical grid** — author-supplied georeferenced physical transmission-line layer; use **Grid voltage** to select 69–500 kV, ≥138 kV, 500 kV, 230 kV, 138 kV or 69 kV.
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
