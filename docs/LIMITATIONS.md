# Limitations

The Results Explorer is a public interpretation layer for precomputed PARAMO studies. The following boundaries are important when using or citing the visualizations.

## Study-case abstraction

The Ecuador 6-Bus case is a reduced planning representation. Its internal nodes and corridors aggregate parts of the power system and must not be interpreted as a one-to-one physical transmission network. Reference plants and the reference planning-network overlay are contextual layers, not additional optimization nodes or branches.

The Ecuador 24-Bus case and the 6-Bus case are separate study representations. Their numerical results should not be interpreted as directly interchangeable system solutions.

## Uncertainty representation

The current 6-bus public release uses `W=1` for each of the four BAU/REN100 × Normal/Extreme configurations. It therefore supports controlled scenario comparison but does not represent an empirical Monte Carlo distribution for that case.

The 24-bus case retains aggregate uncertainty information from W100 Baseline and W5 Adverse ensembles. Representative annual/monthly trajectories are not percentile trajectories.

## Optimization tolerance

The four current 6-bus cases were solved with a relative MIP-gap target of 1%. Reported solutions are optimal subject to the configured solver tolerance, not mathematical proofs of a zero-gap global optimum.

## Public data scope

Only the chart-ready public bundle and reference metadata required for the explorer are distributed. The absence of a full table in the repository does not mean that the underlying model omitted that variable. Additional research data are handled through the controlled request process described in [`DATA_ACCESS.md`](DATA_ACCESS.md).

## Static-site transparency

GitHub Pages is static. Values embedded for visualization are technically accessible through the browser. The release therefore minimizes the embedded dataset instead of attempting to conceal a full research database behind disabled download buttons.

## Fuel/resource categories

The 6-bus fuel/resource view is an offline reporting reconstruction from the validated generator roster. It is an interpretation layer over the model's native technology reporting. Annual reconstruction was checked against native technology totals before publication.

## Geographic coordinates

Reference coordinates are intended for visualization and crosswalk context. External-system anchors and reduced-node display locations should not be treated as surveyed substation coordinates unless the underlying source explicitly identifies them as such.
