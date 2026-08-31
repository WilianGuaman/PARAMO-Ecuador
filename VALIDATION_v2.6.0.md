# PARAMO Ecuador v2.6.0 validation

This release updates the public visualizer to address three map-layer issues:

1. The 24-bus reduced planning/model lines are rendered explicitly from the georeferenced planning-line dataset.
2. The physical transmission grid is limited to the 138 kV, 230 kV and 500 kV network.
3. The Ecuador mainland boundary is displayed with a stronger outline and fill to improve geographic context.

Notes:
- The 24-bus transmission investment results remain aggregated by investment type in the supplied results. The dashboard therefore shows the reduced 24-node planning topology, but not line-by-line optimized 24-bus construction decisions.
- Detailed hydraulic cascade and reservoir operations remain richer in the 6-bus case because the public 24-bus result package does not contain plant-level hydraulic state variables.
