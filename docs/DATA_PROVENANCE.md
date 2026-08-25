# Data provenance

The explorer combines two public information classes:

1. **PARAMO model results** derived from the national planning-result archives and the calibrated 6-bus result workbook.
2. **Reference-system geography** derived from Ecuador Power DataHub v0.10.1 crosswalk and canonical layers.

Reference geography does not imply that every physical Ecuadorian asset is represented one-to-one in the reduced optimization model. The 24-bus planning representation and the physical reference system are linked through explicit crosswalk fields.

National ENS statistics are recalculated from realization-level PNS source tables because a downstream summary workbook stored the metric at one hundredth of the source value. The public layer therefore uses the realization-level source tables as the authoritative basis for ENS aggregation.
