# Methodology

## PARAMO

**PARAMO** stands for **Planning And Resource Allocation under Multi-scenario Optimization**. It is a long-term power-system planning framework for hydro-dependent systems, integrating investment and operational decisions under policy and hydrological uncertainty.

This repository exposes precomputed public research results. The optimization formulation, GAMS implementation, private InputData workbooks, GDX/LST files and solver logs are outside the public distribution.

## Ecuador 24-Bus National Planning Case

The national planning case evaluates **REF**, **BRIDGE** and **NZT** over 2025–2050 under two hydrological conditions:

- **Baseline hydrology:** 100 Monte Carlo realizations.
- **Adverse hydrology:** 5 realizations.

The explorer reports ensemble statistics together with representative-realization trajectories. Cost, generation expansion, emissions, energy not served, hydrology and reservoir behavior are presented through a common metric layer.

## Ecuador 6-Bus Reduced Planning Case

The reduced planning case evaluates **BAU** and **REN100** under **Normal** and **Extreme** hydrology. Its public result layer includes corridor-level outputs such as new circuits, peak absolute flow, utilization and transmission CAPEX.

## Public results layer

The dashboard separates three information classes:

1. **Optimization results** generated with PARAMO.
2. **Derived indicators** calculated from public result tables.
3. **Reference-system geography** from the Ecuador Power DataHub used for spatial context and crosswalks.

Reference geography must not be interpreted as a statement that every physical plant, substation or transmission asset is represented explicitly as an optimization object.

## Reliability metric

Energy not served (ENS) is calculated from realization-level PNS result tables in the national public layer, providing a consistent source for scenario, hydrology and uncertainty comparisons.

## Foundational publication

Guamán, W., Benalcazar, P., Cordova-Garcia, J., & Torres, M. (2025). *An integrated framework for the optimal expansion of hydro-dependent power systems under water-resource uncertainty*. **Energy Conversion and Management: X, 28**, 101297. https://doi.org/10.1016/j.ecmx.2025.101297

## Fuel-resolved reporting for the 6-Bus case

The 6-bus model retains its original `FossilThermal` reporting category. For public interpretation, PARAMO Ecuador additionally reports diesel, fuel oil/residual, and natural gas separately. This refinement changes only the reporting layer; it does not modify or re-solve the optimization cases.
