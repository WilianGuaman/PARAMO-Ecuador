# Methodology summary

## PARAMO

PARAMO — **Planning And Resource Allocation under Multi-scenario Optimization** — evaluates long-term generation, transmission and hydropower expansion in hydro-dependent systems. The public explorer reports precomputed outcomes; the optimization implementation is not distributed in this repository.

The integrated methodology includes generation expansion, transmission expansion/reconductoring, DC network representation, hydropower availability, reservoir/cascade operation, reserve and adequacy conditions, policy constraints, and economic/emissions accounting.

The associated methodological publication is:

> Guamán, W., Benalcazar, P., Cordova-Garcia, J., & Torres, M. (2025). *An integrated framework for the optimal expansion of hydro-dependent power systems under water-resource uncertainty*. Energy Conversion and Management: X, 28, 101297. https://doi.org/10.1016/j.ecmx.2025.101297

## Ecuador 24-Bus national case

The national case spans 2025–2050 and compares REF, BRIDGE and NZT pathways under two supplied result archives:

- **Baseline:** Helios BigMem ensemble, W100;
- **Adverse:** local-PC ensemble, W5.

The public dashboard retains aggregate Mean/P10/P50/P90 statistics. Annual, monthly, plant-generation and reservoir-operation trajectories are drawn from one representative realization per pathway and hydrological condition.

### Representative-realization rule

Version 2.5.0 uses `robust_multimetric` consistently across both archives. The selection considers total cost, operating cost, PNS cost, transmission cost, investment cost, ENS and CO₂ rather than choosing a realization only by total cost.

| Hydrology | BRIDGE | NZT | REF |
|---|---:|---:|---:|
| Baseline W100 | w96 | w59 | w32 |
| Adverse W5 | w2 | w5 | w5 |

The selected realization is used only for trajectories that require internally consistent year/month/plant observations. Ensemble statistics continue to use every supplied realization.

### National transmission results

The supplied archives contain transmission investment components at realization level:

- new-line cost;
- existing-line reinforcement cost;
- new reinforced-circuit cost;
- total transmission cost.

They do not provide selected branch, investment year, power flow, utilization or available capacity by branch. The dashboard therefore reports aggregate transmission investment uncertainty and shows the 24-node reduced network as a static case definition. It does not infer line-specific investment decisions.

### National hydrology results

The 24-bus archives support:

- aggregate reservoir-storage uncertainty;
- robust representative storage, turbining, spill and release;
- monthly hydro generation and share;
- calendar-month Baseline/Adverse hydro profiles;
- generation by individual hydro plant in the representative trajectory.

The reservoir output does not contain a reservoir identifier. Plant-level storage and hydraulic transfers between cascade plants cannot be reconstructed from the supplied 24-bus archives.

## Ecuador 6-Bus reduced case

The current reduced case spans 2025–2050 and compares:

| Policy | Hydrology |
|---|---|
| BAU | Normal |
| BAU | Extreme |
| REN100 | Normal |
| REN100 | Extreme |

The public version uses one active realization (`W=1`) per configuration. The four cases share the same 330-generator, 6-node, 7-corridor model structure.

The result layer includes:

- total and component costs;
- annual/monthly energy balance;
- generation and installed/new capacity;
- direct CO₂ emissions;
- ENS, imports, curtailment and reserve indicators;
- corridor capacity, flow, utilization, reinforcement/new-circuit decisions and CAPEX;
- reservoir operation and water balance;
- selected cascade-ROR hydraulics.

## Map methodology

The public map separates three types of object:

1. **mainland Ecuador boundary**;
2. **existing physical grid:** only 500 and 230 kV georeferenced lines retained from the supplied `Lineas.geojson`;
3. **PARAMO reduced network:** 24-node or 6-node according to the selected case.

The physical and reduced networks can be enabled independently. Reduced planning branches/corridors are abstractions and are not treated as one-to-one physical lines.

## Public reporting transformation

The public layer is generated after optimization. Source outputs are audited offline and transformed into the minimum aggregate arrays required by the dashboard. Full generator-level and realization-level source tables remain outside the public repository.
