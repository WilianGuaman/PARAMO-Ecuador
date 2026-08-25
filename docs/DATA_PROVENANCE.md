# Data provenance

The explorer combines two public information classes:

1. **PARAMO model results** derived from the national planning-result archives and the calibrated 6-bus result workbook.
2. **Reference-system geography** derived from Ecuador Power DataHub v0.10.1 crosswalk and canonical layers.

Reference geography does not imply that every physical Ecuadorian asset is represented one-to-one in the reduced optimization model. The 24-bus planning representation and the physical reference system are linked through explicit crosswalk fields.

National ENS statistics are recalculated from realization-level PNS source tables because a downstream summary workbook stored the metric at one hundredth of the source value. The public layer therefore uses the realization-level source tables as the authoritative basis for ENS aggregation.

## International systems and 6-bus zone codes

The 24-bus visualization includes Colombia and Peru because both external systems are part of the planning representation. Colombia is represented by the modeled import resource connected at `Node_3 / B12_Pomasqui`; Peru is represented by the external `Node_24 / B24_Piura` and `Line_41`. External display coordinates are identified as schematic model/geographic anchors when they are not verified physical substation coordinates.

The 6-bus source model uses a historical zone-code convention that differs from the canonical Ecuador Power DataHub convention. Public files use the canonical zone codes and retain the original model codes in explicit traceability fields. The mapping is distributed in `data/cases/ecuador_6bus/zone_crosswalk.csv`.
## Ecuador 6-Bus fuel taxonomy

The original 6-bus reporting table groups diesel-, oil-, and gas-fired units under `FossilThermal`. The public explorer preserves that aggregate as a technology view and adds a fuel-resolved view derived from generator-level model results.

Fuel classification uses the `Combustible` field from the 6-bus source trace:

- `Diesel` → `DIESEL`
- `FuelOil` and `Residual` → `FUEL OIL`
- `Gas` and `GasCC` → `GAS`
- imports are identified from the model class rather than the source-fuel label

For generation, the reconstruction uses the complete twelve-month `GeneratedPower` output for every modeled generator and year. Installed capacity uses `YearOperatingPlants`, and additions use `BuildActivity`. The reconstructed diesel + fuel oil + gas totals reproduce the original `FossilThermal` series for all four cases and all years within listing-output precision. The detailed public tables are `generation_by_fuel.csv`, `capacity_by_fuel.csv`, `new_capacity_by_fuel.csv`, and `emissions_by_fuel.csv`.

