import type { CommandResponse, CompareResult, MobilityLocation, MobilityReport, MobilitySource, TimeSeriesPoint } from "./types";
async function json<T>(url:string, init?:RequestInit):Promise<T>{const r=await fetch(url,init); if(!r.ok) throw new Error((await r.text())||`HTTP ${r.status}`); return r.json();}
export const getLocations=()=>json<MobilityLocation[]>("/api/locations");
export const getLocation=(id:string)=>json<{location:MobilityLocation;timeSeries:TimeSeriesPoint[];sources:MobilitySource[]}>(`/api/locations/${id}`);
export const getRiskScan=()=>json<MobilityLocation[]>("/api/risk-scan");
export const compareLocations=(left:string,right:string)=>json<CompareResult>(`/api/compare?left=${left}&right=${right}`);
export const runCommand=(command:string)=>json<CommandResponse>("/api/command",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({command})});
export const generateReport=(locationId:string)=>json<MobilityReport>("/api/report",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({locationId})});
export const getSources=()=>json<MobilitySource[]>("/api/sources");
