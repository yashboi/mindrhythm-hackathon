import type { MobilitySource } from "@/lib/mobility/types";

export const mockSources: MobilitySource[] = [
  {
    id: "acs",
    name: "Census QuickFacts / ACS",
    agency: "U.S. Census Bureau",
    description: "Official city-level median household income and mean travel time where QuickFacts city geographies are available.",
    url: "https://www.census.gov/quickfacts/",
    lastUpdated: "Source page lists 2020-2024 ACS 5-year facts",
  },
  {
    id: "opportunity-atlas",
    name: "Opportunity Atlas",
    agency: "Census / Harvard / Brown",
    description: "Candidate source for intergenerational mobility outcomes; not yet wired into the prototype score.",
    lastUpdated: "Not wired",
  },
  {
    id: "equity-atlas",
    name: "Bay Area Equity Atlas",
    agency: "PolicyLink / USC Equity Research Institute",
    description: "Candidate source for regional equity indicators; not yet wired into the prototype score.",
    lastUpdated: "Not wired",
  },
  {
    id: "mtc",
    name: "MTC Open Data",
    agency: "Metropolitan Transportation Commission",
    description: "Candidate source for transit access, commute sheds, and regional planning geographies.",
    lastUpdated: "Not wired",
  },
  {
    id: "hcd",
    name: "California HCD Annual Progress Report",
    agency: "California HCD",
    description: "Candidate source for housing production and permits; not yet wired into the prototype housing output index.",
    lastUpdated: "Not wired",
  },
  {
    id: "edd",
    name: "California EDD Labor Market Information",
    agency: "California EDD",
    description: "Candidate source for labor market and wage signals; not yet wired into the prototype job access score.",
    lastUpdated: "Not wired",
  },
  {
    id: "hud",
    name: "HUD / Local Housing Instability Data",
    agency: "HUD CoC / local agencies",
    description: "Candidate source for severe housing instability context; not yet wired into the prototype displacement risk score.",
    lastUpdated: "Not wired",
  },
];
