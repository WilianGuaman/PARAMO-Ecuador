# Data provenance

The national interactive series are reconstructed from six solved model outputs: REF, BRIDGE and NZT under Baseline and Adverse. The public [source manifest](../data/metadata/source_manifest.json) records hashes, realization counts, selected identifiers and numerical checks. No new optimization is performed by the website.

Monthly generation, emissions, ENS, installed capacity, investment states and reservoir variables retain their model units. Exported summaries are derived from the same records. The six-node case remains a separate dataset. Geographic reference lines provide context and do not replace the reduced planning network.

Annual demand totals support the ENS percentages. They are obtained by aggregating the common demand trajectory over each model year. The public layer does not include the nodal or monthly demand input tables.
