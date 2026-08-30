# PARAMO Ecuador Results Explorer v2.4.0 — release validation

**Release date:** 30 August 2026  
**Scope:** final Ecuador 6-bus result refresh; Ecuador 24-bus public layer retained.

## Final 6-bus outcomes

| Case | Cost [MUSD] | CO₂ [MtCO₂] | Imports [GWh] | ENS [GWh] | Curtailment [GWh] | Renewable share 2050 | Gap [%] |
|---|---:|---:|---:|---:|---:|---:|---:|
| BAU_Normal | 32,615.81 | 23.44 | 0.00 | 0.00 | 0.00 | 97.81% | 0.686 |
| BAU_Extreme | 36,823.54 | 146.95 | 93.13 | 61.59 | 0.00 | 85.19% | 0.979 |
| REN100_Normal | 32,741.32 | 21.12 | 576.97 | 0.00 | 0.00 | 100.00% | 0.746 |
| REN100_Extreme | 50,872.92 | 41.81 | 19,918.67 | 10,012.06 | 4,874.71 | 100.00% | 0.646 |

All four cases have `ModelStat = 8`, `SolveStat = 1` and MIP gap below 1%. The final renewable-generation share and system adequacy are reported separately; therefore a 100% final-year renewable share does not imply zero ENS.

## Source-result checks

- 330 generators: 147 existing and 183 candidates;
- 6 reduced planning nodes and 7 planning corridors;
- 209 hydro generators, including 4 reservoirs and 4 directed hydraulic links;
- `W=1` for every public 6-bus case;
- base-year endogenous construction: 0 MW;
- peak-snapshot PNS: 0 MW;
- maximum annual demand residual: `2.910e-11 GWh`;
- maximum water-balance residual: `1.705e-13 hm³`.

## Public transformation checks

- annual rows: 26 per case;
- monthly rows: 312 per case;
- transmission rows: 182 per case (`26 × 7`);
- reservoir rows: 1,248 per case (`26 × 12 × 4`);
- selected-hydro rows: 2,184 per case (`26 × 12 × 7`);
- monthly demand, hydro regimes, annual hydropower and fuel/resource aggregates reconcile with native model outputs within numerical precision.

## Runtime checks

- Plot contexts audited: **59**;
- browser JavaScript errors: **0**;
- missing visible Cartesian axis titles: **0**;
- numeric y-axes without visible units: **0**;
- 6-bus network map: **22 traces, 332 rendered paths, 6 model-node points**;
- Paute Sankey: **6 positive links and 4 plant rows**.

The national 24-bus `hydroCascadeFlow` element is an intentional text placeholder with hidden axes because that public case does not include plant-level hydraulic transfer variables.

## Package audit

**58 / 58 checks passed.**

See:

- [`docs/VALIDATION.md`](docs/VALIDATION.md) — scientific/result validation;
- [`data/metadata/validation/ecuador_6bus_v2_validation.json`](data/metadata/validation/ecuador_6bus_v2_validation.json) — machine-readable source audit;
- [`data/metadata/validation/runtime_v2.4.0.json`](data/metadata/validation/runtime_v2.4.0.json) — browser/runtime audit.
