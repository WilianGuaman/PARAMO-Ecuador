# Validation

## Map layer

- Existing physical lines: 146
- 500 kV: 6
- 230 kV: 53
- 138 kV: 87
- PARAMO 24N branches: 30
- PARAMO 24N nodes: 24
- PARAMO 6N corridors: 7
- Colombia and Peru connections are rendered for both model views.

## Results layer

The four 6N cases report `ModelStat = 8`, `SolveStat = 1` and MIP gaps below 1%. The 24N view uses the ensemble statistics and representative trajectories available for the national case.

## Browser checks

The release test opens both map views, verifies all map layers and toggles, exercises the analytical tabs, and checks Plotly axis titles.
