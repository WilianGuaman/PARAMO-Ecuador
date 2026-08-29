# Methodology summary

## PARAMO

PARAMO — **Planning And Resource Allocation under Multi-scenario Optimization** — is used to evaluate long-term generation and transmission expansion in hydro-dependent power systems. The public explorer reports precomputed outcomes; the optimization implementation is not distributed in this repository.

The integrated methodology includes generation expansion, transmission expansion/reconductoring, DC network representation, hydropower availability, reservoir/cascade operation, reserve/adequacy conditions, policy constraints and economic/emissions accounting.

The associated methodological publication is:

> Guamán, W., Benalcazar, P., Cordova-Garcia, J., & Torres, M. (2025). *An integrated framework for the optimal expansion of hydro-dependent power systems under water-resource uncertainty*. Energy Conversion and Management: X, 28, 101297. https://doi.org/10.1016/j.ecmx.2025.101297

## Ecuador 24-Bus national case

The national planning case spans 2025–2050 and compares REF, BRIDGE and NZT pathways under Baseline and Adverse hydrology. The public release retains the audited aggregate statistics from the Baseline W100 and Adverse W5 ensembles together with representative annual/monthly operational trajectories.

The visualizer reports generation/capacity, cost, emissions, reliability, hydrology and aggregate transmission-investment indicators. Realization-level source tables are not distributed.

## Ecuador 6-Bus reduced case

The current reduced case spans 2025–2050 and compares four configurations:

| Policy | Hydrology |
|---|---|
| BAU | Normal |
| BAU | Extreme |
| REN100 | Normal |
| REN100 | Extreme |

The public version uses one active realization (`W=1`) per configuration. The four cases share the same 330-generator, 6-node, 7-corridor model structure. REN100 activates the renewable-policy constraints used by the source model; BAU provides the business-as-usual comparison.

The result layer includes:

- total and component costs;
- annual/monthly energy balance;
- generation and installed/new capacity;
- direct CO₂ emissions;
- ENS, imports, curtailment and reserve indicators;
- corridor capacity, flow, utilization, reinforcement/new-circuit decisions and CAPEX;
- reservoir operation and water balance;
- selected cascade-ROR hydraulics.

## Hydropower representation

Hydro availability is time- and scenario-dependent. Reservoir plants retain storage-volume and water-balance equations. Zero-storage run-of-river plants in explicit cascades receive upstream water according to the configured total-release or turbine-only relationship.

The public visualizer presents these two output classes separately and recombines them only for interpretation of the Paute and Agoyán cascades.

## Public reporting transformation

The public layer is generated after the optimization run. Model outputs are audited, then transformed into aggregate arrays required by the dashboard. Full generator-level and realization-level source tables are kept outside the public repository.

This separation is intentional: publication logic can evolve without changing the mathematical optimization model, while the source run remains auditable through retained validation metadata.
