# PARAMO Ecuador Results Explorer v2.5.0

Release date: 31 August 2026

## National 24-bus refresh

- rebuilt representative trajectories from the supplied Baseline W100 and Adverse W5 archives;
- applied `robust_multimetric` consistently to both archives;
- representative runs: Baseline BRIDGE w96, NZT w59, REF w32; Adverse BRIDGE w2, NZT w5, REF w5;
- added aggregate transmission-investment uncertainty by investment type;
- added aggregate reservoir uncertainty and robust representative seasonal operation;
- added Baseline/Adverse calendar-month hydro profiles.

## Map redesign

- added the mainland Ecuador boundary;
- restricted the existing physical grid to 500 and 230 kV lines only;
- retained 59 georeferenced features: 6 at 500 kV and 53 at 230 kV;
- made the PARAMO reduced network independently switchable for both 24N and 6N;
- corrected the 24-node reduced network to use its supplied endpoint coordinates.

## Methodological safeguards

- no line-specific 24-bus investment decision is inferred from aggregate cost data;
- no reservoir-specific storage or cascade transfer is inferred from aggregate 24-bus reservoir outputs;
- documented the legacy/base-year limitations of the national application;
- retained the final four-case 6-bus results and detailed corridor/cascade outputs unchanged.

## Public-data policy

The release continues to exclude complete Results workbooks, GDX/LST/log files, generator-level build tables and realization-level Monte Carlo data.
