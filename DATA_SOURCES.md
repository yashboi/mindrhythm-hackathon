# Mobility Terminal data source upgrade path

The current prototype uses typed mock data in `lib/data`. Production adapters can replace these files without changing the UI contract:

- Census ACS: income, rent burden, commute, demographics.
- Opportunity Atlas: mobility outcome indicators.
- Bay Area Equity Atlas: equity and displacement context.
- MTC Open Data: transit, commute sheds, planning geographies.
- California HCD APR: housing permits and production progress.
- California EDD LMI: wages, jobs, industry access.
- HUD and local PIT counts: homelessness and severe housing instability.

Recommended next step: add server-side source adapters that normalize records into the `MobilityLocation`, `MobilityMetric`, and `TimeSeriesPoint` types.
