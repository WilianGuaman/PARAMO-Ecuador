# Limitations

## Study-case abstraction

The Ecuador 24-Bus and 6-Bus cases are separate planning representations. Their results are not directly interchangeable system solutions.

Reduced planning nodes and branches/corridors aggregate the system. They must not be interpreted as a one-to-one physical transmission network.

## Ecuador 24-Bus

### Archive comparability

The Baseline W100 and Adverse W5 public labels correspond to two supplied result archives. The archive metadata refer to different working model directories and do not explicitly encode the Baseline/Adverse label. Their comparability under a common formulation should be documented with the retained private run records.

### Representative trajectories

The robust-multimetric realization is a representative observation, not a percentile trajectory. Mean/P10/P50/P90 statistics and representative time series answer different questions.

### Transmission

The supplied 24-bus result archives contain aggregate transmission costs but not selected line/year decisions, flows or utilization. The dashboard cannot identify which 24-bus branch was constructed or reinforced. The displayed 24-node network is a static case-definition layer.

### Hydrology

Reservoir outputs are system aggregates without reservoir IDs. Plant-specific storage, water balance and cascade transfers cannot be recovered. The dashboard reports aggregate uncertainty and representative seasonal operation only.

### Base-year calibration

The supplied national-case results allow positive endogenous capacity additions in 2025 and retain the calibration characteristics of an earlier model application. The 24-bus case should be read as a legacy national planning application, not as the same calibrated base-year representation used in the final 6-bus run.

The national validation archive also reports discrepancies between modelled and official 2025 supply/capacity components. These limitations should be considered when comparing the 24-bus and final 6-bus results.

## Ecuador 6-Bus

The public release uses `W=1` for each BAU/REN100 × Normal/Extreme configuration. It supports controlled scenario comparison but does not constitute an empirical Monte Carlo distribution.

The four cases were solved with a relative MIP-gap target of 1%. Reported solutions are optimal subject to that tolerance.

## Physical-grid layer

The public map retains only 500 and 230 kV features from the supplied geographic dataset. Lower-voltage lines are intentionally excluded. The mainland Ecuador polygon is geographic context and does not represent the electrical study boundary.

## Public data scope

The browser bundle intentionally excludes the complete model-result database. Additional material may be requested, but access is reviewed and may be constrained by provenance, licensing or research status.
