import { useState, useEffect, useContext, createContext } from "react";
import Wallpaper from "./Wallpaper";
import IntroVideo from "./components/ui/IntroVideo";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import SecuritySettingsModal from "./components/auth/SecuritySettingsModal";
import AdminPanelModal from "./components/admin/AdminPanelModal";
import UserProfileDropdown from "./components/header/UserProfileDropdown";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter,
} from "recharts";

type MatchResult = any;

export type NavId = "dashboard"|"upload"|"matching"|"outlier"|"registration"|"metrics"|"reports";

export type MatchOptions = {
  method?: string;
  ransac_thresh?: number;
  max_iters?: number;
  confidence?: number;
  ratio?: number;
  min_matches?: number;
  navigate?: boolean;
};

type LunarState = {
  sensor: string; sourceFile: File | null; referenceFile: File | null;
  sourceMeta: any; referenceMeta: any; result: MatchResult | null; locationResult: any; running: boolean; locating: boolean; error: string;
  active: NavId; setActive: (n: NavId)=>void;
  setSensor: (s:string)=>void; setSourceFile:(f:File|null)=>void; setReferenceFile:(f:File|null)=>void;
  runMatch:(opts?: MatchOptions)=>Promise<void>; locateSource:()=>Promise<void>; reset:()=>void; loadDemoPair:()=>Promise<void>;
};
const LunarContext = createContext<LunarState | null>(null);
import { getApiHostDisplay, checkApiHealth } from "./config/api";

function useLunar(){ const c=useContext(LunarContext); if(!c) throw new Error("Lunar context unavailable"); return c; }

// ─── tokens ──────────────────────────────────────────────────────────────────
const T = {
  gc:      "transparent",
  ch:      "rgba(16,16,20,0.72)",
  surf:    "#3f4d80",
  fg:      "#ffffff",
  muted:   "#8a8a8e",
  div:     "rgba(255,255,255,0.06)",
  accent:  "#3d5afe",
  accent2: "#7745f4",
  err:     "#ff5c6c",
  ok:      "#68c389",
  warn:    "#e6a75d",
  rSm:     "8px",
  rMd:     "16px",
  rLg:     "24px",
  rFull:   "9999px",
  dur:     "150ms",
  ease:    "cubic-bezier(0.4,0,0.2,1)",
  display: '"Hanken Grotesk", system-ui, sans-serif',
  body:    '"Geist", system-ui, sans-serif',
};

// ─── icons ────────────────────────────────────────────────────────────────────
const ic = (d: string, size = 16) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display:"block", flexShrink:0 }}>
    <path d={d}/>
  </svg>
);
const icG = (children: React.ReactNode, size = 16) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display:"block", flexShrink:0 }}>
    {children}
  </svg>
);

const Icons = {
  moon: () => ic("M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"),
  grid: () => icG(<><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></>),
  upload: () => ic("M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5-5-5 5m5-5v13"),
  target: () => icG(<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>),
  filter: () => ic("M22 3H2l8 9.46V19l4 2v-8.54z"),
  layers: () => icG(<><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></>),
  pulse: () => ic("M22 12h-4l-3 9L9 3l-3 9H2"),
  report: () => icG(<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>),
  satellite: () => icG(<><path d="m13.5 6.5l-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5m7-3L19 5m-1.5 5.5l3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5M9 21a6 6 0 0 0-6-6"/><path d="M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z"/></>),
  search: () => icG(<><path d="m21 21l-4.34-4.34"/><circle cx="11" cy="11" r="8"/></>),
  bell: () => ic("M10.268 21a2 2 0 0 0 3.464 0m-10.47-5.674A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"),
  refresh: () => icG(<><path d="M3 12a9 9 0 0 1 9-9a9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5m5 4a9 9 0 0 1-9 9a9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></>),
  zap: () => ic("M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"),
  x: () => ic("M18 6L6 18M6 6l12 12"),
  check: () => ic("M20 6L9 17l-5-5"),
  scan: () => ic("M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"),
  gauge: () => ic("m12 14l4-4M3.34 19a10 10 0 1 1 17.32 0"),
  globe: () => icG(<><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20a14.5 14.5 0 0 0 0-20M2 12h20"/></>),
  clock: () => icG(<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>),
  barChart: () => ic("M3 3v16a2 2 0 0 0 2 2h16m-3-4V9m-5 8V5M8 17v-3"),
  settings: () => icG(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>),
  trash: () => ic("M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"),
  checkCircle: () => icG(<><circle cx="12" cy="12" r="10"/><path d="m9 12l2 2l4-4"/></>),
  download: () => ic("M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5 5 5-5m-5 5V3"),
  sliders: () => ic("M10 5H3m9 14H3M14 3v4m2 10v4m5-9h-9m9 7h-5m5-14h-7m-6 5v4m0-2H3"),
  database: () => icG(<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></>),
};

// ─── nav items ────────────────────────────────────────────────────────────────
const NAV: { id: NavId; label: string; icon: ()=>React.ReactNode }[] = [
  { id:"dashboard",    label:"Dashboard",        icon: Icons.grid },
  { id:"upload",       label:"Image Upload",     icon: Icons.upload },
  { id:"matching",     label:"Feature Matching", icon: Icons.target },
  { id:"outlier",      label:"Outlier Removal",  icon: Icons.filter },
  { id:"registration", label:"Registration",     icon: Icons.layers },
  { id:"metrics",      label:"Accuracy Metrics", icon: Icons.pulse },
  { id:"reports",      label:"Reports & Export", icon: Icons.report },
];

// ─── shared primitives ────────────────────────────────────────────────────────

const ch = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: T.ch, borderRadius: T.rLg, padding: 20,
  backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
  ...extra,
});

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={ch(style)}>{children}</div>;
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:T.muted, marginBottom:12 }}>{children}</p>;
}

function Divider() {
  return <div style={{ height:1, background:T.div, marginBlock:2 }}/>;
}

function Btn({ children, primary, ghost, small, onClick }: {
  children: React.ReactNode; primary?: boolean; ghost?: boolean; small?: boolean; onClick?: ()=>void;
}) {
  const base: React.CSSProperties = {
    display:"inline-flex", alignItems:"center", gap:8,
    padding: small ? "8px 14px" : "10px 18px",
    borderRadius: T.rFull, fontFamily: T.body,
    fontSize: small ? 12 : 13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap",
    transition:`background ${T.dur} ${T.ease}`,
  };
  if (primary) return <button onClick={onClick} style={{ ...base, background:T.accent, color:"#ffffff" }}>{children}</button>;
  return <button onClick={onClick} style={{ ...base, background:"rgba(255,255,255,0.07)", color:T.fg }}>{children}</button>;
}

function Chip({ children, active, onClick }: { children:React.ReactNode; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{
      display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px",
      borderRadius:T.rFull, fontFamily:T.body, fontSize:12, fontWeight:600, cursor:"pointer",
      background: active ? T.accent : "rgba(255,255,255,0.06)",
      color: active ? "#fff" : T.muted,
      transition:`background ${T.dur} ${T.ease}, color ${T.dur} ${T.ease}`,
    }}>{children}</button>
  );
}

function StatTile({ label, value, accent, sub }: { label:string; value:string; accent?:boolean; sub?:string }) {
  return (
    <div style={ch({ display:"flex", flexDirection:"column", gap:2 })}>
      <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:T.muted }}>{label}</span>
      <span style={{ fontFamily:T.display, fontSize:28, fontWeight:800, lineHeight:"34px", color: accent ? T.accent : T.fg }}>{value}</span>
      {sub && <span style={{ fontSize:11, color:T.muted }}>{sub}</span>}
    </div>
  );
}

function InspRow({ icon, label, value }: { icon?:React.ReactNode; label:string; value:string }) {
  return (
    <>
      <Divider/>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, fontSize:13, paddingTop:10 }}>
        <span style={{ display:"flex", alignItems:"center", gap:8, color:T.muted }}>{icon}{label}</span>
        <span style={{ color:T.fg, fontWeight:600, fontVariantNumeric:"tabular-nums" }}>{value}</span>
      </div>
    </>
  );
}

function Badge({ children, secondary }: { children:React.ReactNode; secondary?:boolean }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", padding:"3px 10px",
      borderRadius:T.rFull, fontSize:11, fontWeight:700,
      background: secondary ? "rgba(119,69,244,0.15)" : "rgba(61,90,254,0.15)",
      color: secondary ? T.accent2 : T.accent,
    }}>{children}</span>
  );
}

function KpRow({ id, pct, rejected }: { id:string; pct:number; rejected:boolean }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderTop:`1px solid ${T.div}` }}>
      <span style={{ width:44, flexShrink:0, fontSize:12, color:T.muted, fontVariantNumeric:"tabular-nums" }}>{id}</span>
      <div style={{ flex:1, height:7, borderRadius:T.rFull, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, borderRadius:T.rFull, background: rejected ? T.muted : T.accent }}/>
      </div>
      <span style={{ width:36, flexShrink:0, textAlign:"right", fontSize:12, fontWeight:700, color:T.fg, fontVariantNumeric:"tabular-nums" }}>{pct}%</span>
    </div>
  );
}

// ─── chart tooltip ────────────────────────────────────────────────────────────
const ttStyle = { background:T.ch, border:"none", borderRadius:T.rSm, fontSize:11, fontFamily:T.body, color:T.fg };

// ─── data ─────────────────────────────────────────────────────────────────────
const matchOverTime = [
  { t:"T-60", inliers:312, outliers:88 }, { t:"T-50", inliers:387, outliers:71 },
  { t:"T-40", inliers:451, outliers:54 }, { t:"T-30", inliers:504, outliers:42 },
  { t:"T-20", inliers:561, outliers:28 }, { t:"T-10", inliers:598, outliers:18 },
  { t:"NOW",  inliers:614, outliers:12 },
];
const bandCorr = [
  { band:"OHRC",     pre:0.61, post:0.94 },
  { band:"TMC-2",    pre:0.54, post:0.91 },
  { band:"IIRS-NIR", pre:0.48, post:0.87 },
  { band:"IIRS-TIR", pre:0.43, post:0.83 },
  { band:"LRO-NAC",  pre:0.95, post:0.98 },
];
const radarData = [
  { metric:"SSIM", pre:0.64, post:0.94 }, { metric:"NCC",  pre:0.68, post:0.95 },
  { metric:"MI",   pre:0.59, post:0.88 }, { metric:"RMSE", pre:0.53, post:0.82 },
  { metric:"PSNR", pre:0.62, post:0.92 }, { metric:"MAE",  pre:0.57, post:0.87 },
];
const scatterData = Array.from({length:60},(_,i)=>({ x:Math.random()*800, y:Math.random()*600, t:i>50?"out":"in" }));
const KP_LIST = [
  {id:"KP‑101",pct:98,rejected:false},{id:"KP‑104",pct:95,rejected:false},
  {id:"KP‑109",pct:93,rejected:false},{id:"KP‑117",pct:96,rejected:false},
  {id:"KP‑122",pct:88,rejected:false},{id:"KP‑135",pct:41,rejected:true},
  {id:"KP‑140",pct:90,rejected:false},{id:"KP‑148",pct:37,rejected:true},
];
const LUNAR = "https://images.unsplash.com/photo-1777277539243-17e4f2c41aaa?w=700&h=525&fit=crop&auto=format";
const LUNAR2 = "https://images.unsplash.com/photo-1770723964003-026a851e4deb?w=700&h=525&fit=crop&auto=format";

// ─── views ────────────────────────────────────────────────────────────────────

function DashboardView() {
  const {result, sourceFile, referenceFile} = useLunar();
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      {/* Mission banner */}
      <Panel style={{ padding:0, overflow:"hidden" }}>
        <div style={{ position:"relative" }}>
          <img src={LUNAR} alt="Lunar surface" style={{ width:"100%", height:160, objectFit:"cover", opacity:0.35 }}/>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,#1c1c1e 40%,transparent)", borderRadius:T.rLg }}/>
          <div style={{ position:"absolute", inset:0, padding:"24px 28px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:T.ok, display:"inline-block" }}/>
                <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:T.ok }}>
                  {result ? "Registration Complete" : "Pipeline Ready"}
                </span>
              </div>
              <h1 style={{ fontFamily:T.display, fontSize:22, fontWeight:700, color:T.fg, marginBottom:4 }}>
                {sourceFile ? `Source: ${sourceFile.name}` : "Mission CH2-LRO-2024-031"}
              </h1>
              <p style={{ fontSize:13, color:T.muted, maxWidth:420 }}>
                {referenceFile ? `Reference: ${referenceFile.name}` : "Chandrayaan-2 OHRC × LRO-NAC — South Polar Region, Shackleton Crater"}
              </p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:T.muted }}>Session ID</p>
              <p style={{ fontFamily:T.display, fontSize:16, fontWeight:700, color:T.accent }}>LM-2024-031-A7</p>
              <p style={{ fontSize:11, color:T.muted, marginTop:6 }}>Live Fast-API backend connected</p>
            </div>
          </div>
        </div>
        {/* Pipeline steps */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:0, padding:"16px 28px", borderTop:`1px solid ${T.div}` }}>
          {["Upload","Detect","Match","Filter","Register"].map((s,i)=>(
            <div key={s} style={{ textAlign:"center" }}>
              <div style={{ height:3, borderRadius:T.rFull, marginBottom:6, background: result ? T.accent : (i<3 ? T.accent : i===3 ? T.accent2 : "rgba(255,255,255,0.1)") }}/>
              <span style={{ fontSize:11, fontWeight:700, color: result ? T.accent : (i<3 ? T.accent : i===3 ? T.accent2 : "rgba(255,255,255,0.2)") }}>{s}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        <StatTile label="Candidates / Matches" value={result ? `${result.candidate_matches}` : "1,218"} sub={result ? "SIFT Candidates" : "Across 4 bands"}/>
        <StatTile label="Inliers (Verified)"  value={result ? `${result.inliers}` : "1,200"} sub={result ? "RANSAC Inliers" : "Pre-RANSAC"}/>
        <StatTile label="Inlier Ratio"        value={result ? `${result.inlier_ratio}%` : "98.5%"} accent sub="Post-RANSAC"/>
        <StatTile label="Reg. RMSE"           value={result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px"} sub="Sub-pixel"/>
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 280px", gap:12 }}>
        <Panel>
          <PanelTitle>Correspondence Quality Over Time</PanelTitle>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={matchOverTime} margin={{top:4,right:4,bottom:0,left:-20}}>
              <defs>
                <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.accent} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={T.accent} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="go" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.accent2} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={T.accent2} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="t" tick={{fontSize:10,fill:T.muted,fontFamily:T.body}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:T.muted,fontFamily:T.body}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={ttStyle}/>
              <Area type="monotone" dataKey="inliers"  stroke={T.accent}  strokeWidth={1.5} fill="url(#gi)" dot={false} name="Inliers"/>
              <Area type="monotone" dataKey="outliers" stroke={T.accent2} strokeWidth={1.5} fill="url(#go)" dot={false} name="Outliers"/>
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <PanelTitle>Sensor Status</PanelTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {[
              { name:"OHRC",    res:"0.25 m/px", status:"READY", ok:true  },
              { name:"TMC-2",   res:"5 m/px",    status:"READY", ok:true  },
              { name:"IIRS",    res:"80 m/px",   status:"PROC",  ok:false },
              { name:"LRO-NAC", res:"0.5 m/px",  status:"READY", ok:true  },
            ].map(s=>(
              <div key={s.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${T.div}` }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:T.fg }}>{s.name}</p>
                  <p style={{ fontSize:11, color:T.muted }}>{s.res}</p>
                </div>
                <Badge secondary={!s.ok}>{s.status}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Bottom row */}
      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)", gap:12 }}>
        <Panel>
          <PanelTitle>Band Correlation — Pre vs Post Registration</PanelTitle>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={bandCorr} layout="vertical" margin={{top:0,right:10,left:44,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false}/>
              <XAxis type="number" domain={[0,1]} tick={{fontSize:10,fill:T.muted,fontFamily:T.body}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="band" tick={{fontSize:10,fill:T.muted,fontFamily:T.body}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="pre"  fill="rgba(119,69,244,0.45)" radius={[0,3,3,0]} name="Pre"/>
              <Bar dataKey="post" fill={T.accent}              radius={[0,3,3,0]} name="Post" fillOpacity={0.85}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <PanelTitle>System Log</PanelTitle>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {[
              { t:"09:47:12", msg:"RANSAC iter 847/1000 — inliers: 614", c:T.accent },
              { t:"09:47:09", msg:"Outlier mask applied — 12 removed",   c:T.ok },
              { t:"09:47:03", msg:"SIFT keypoints: 4821 (OHRC band)",    c:T.fg },
              { t:"09:46:55", msg:"ORB keypoints: 3108 (TMC-2 band)",    c:T.fg },
              { t:"09:46:48", msg:"IIRS band preprocessing complete",    c:T.fg },
              { t:"09:46:31", msg:"LRO-NAC reference loaded (1024×1024)",c:T.fg },
            ].map((l,i)=>(
              <div key={i} style={{ display:"flex", gap:12, fontSize:12 }}>
                <span style={{ color:T.muted, flexShrink:0, fontFamily:"monospace" }}>{l.t}</span>
                <span style={{ color:l.c }}>{l.msg}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─── Image Upload ─────────────────────────────────────────────────────────────
function UploadView() {
  const {sensor, setSensor, sourceFile, referenceFile, setSourceFile, setReferenceFile, sourceMeta, referenceMeta, runMatch, locateSource, reset, loadDemoPair, running, locating, locationResult, error} = useLunar();
  const [drag, setDrag] = useState<string|null>(null);
  const pick=(setter:(f:File)=>void)=>(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0]; if(f) setter(f)};
  const Drop=({kind, file, setter}:{kind:string;file:File|null;setter:(f:File)=>void})=>(
    <label onDragOver={e=>{e.preventDefault();setDrag(kind)}} onDragLeave={()=>setDrag(null)} onDrop={e=>{e.preventDefault();setDrag(null);const f=e.dataTransfer.files?.[0];if(f)setter(f)}} style={{display:"block",background:T.ch,borderRadius:T.rMd,border:`2px dashed ${drag===kind?T.accent:"rgba(255,255,255,0.12)"}`,padding:20,cursor:"pointer"}}>
      <input type="file" accept=".png,.jpg,.jpeg,.tif,.tiff,.jp2" onChange={pick(setter)} style={{display:"none"}}/>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:12,background:"rgba(61,90,254,.12)",display:"grid",placeItems:"center",color:T.accent}}>{Icons.upload()}</div>
        <div><p style={{fontSize:13,fontWeight:700}}>{file?.name || `Drop ${kind} image or click to browse`}</p><p style={{fontSize:11,color:T.muted}}>{file ? `${(file.size/1024/1024).toFixed(2)} MB` : "PNG, JPG, TIFF, JP2"}</p></div>
      </div>
    </label>
  );
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Panel>
        <PanelTitle>Source Sensor</PanelTitle>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["OHRC","TMC-2","IIRS"].map(s=><Chip key={s} active={sensor===s} onClick={()=>setSensor(s)}>{s}</Chip>)}
          </div>
          <Btn small onClick={loadDemoPair}><Icons.database/>Quick-Load Demo Dataset</Btn>
        </div>
      </Panel>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Drop kind={sensor} file={sourceFile} setter={setSourceFile}/>
        <Drop kind="LRO-NAC" file={referenceFile} setter={setReferenceFile}/>
      </div>
      <Panel>
        <PanelTitle>Live Metadata & Location State</PanelTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {[{k:"Source",v:sourceFile?.name||"Not loaded"},{k:"Source Size",v:sourceMeta?`${sourceMeta.width}×${sourceMeta.height}`:"—"},{k:"Reference",v:referenceFile?.name||"Not loaded"},{k:"Reference Size",v:referenceMeta?`${referenceMeta.width}×${referenceMeta.height}`:"—"}].map(m=><div key={m.k} style={{background:"rgba(255,255,255,.04)",borderRadius:T.rSm,padding:"10px 12px"}}><p style={{fontSize:11,color:T.muted}}>{m.k}</p><p style={{fontSize:12,fontWeight:600,marginTop:2}}>{m.v}</p></div>)}
        </div>
        {locationResult?.status === "success" && <Panel style={{marginTop:14,border:"1px solid rgba(61,90,254,.35)"}}>
          <PanelTitle>AI Location Retrieval (LRO-NAC Indexed Catalog)</PanelTitle>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><p style={{fontSize:11,color:T.muted}}>Predicted Coordinates</p><p style={{fontSize:18,fontWeight:800}}>{locationResult.best_location.latitude.toFixed(4)}° , {locationResult.best_location.longitude.toFixed(4)}°</p></div>
            <div><p style={{fontSize:11,color:T.muted}}>Retrieval Confidence</p><p style={{fontSize:18,fontWeight:800,color:T.ok}}>{locationResult.best_location.confidence}%</p></div>
          </div>
          <p style={{fontSize:11,color:T.muted,marginTop:10}}>Top matched LRO-NAC reference tiles ({locationResult.candidates.length} candidates):</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",gap:8,marginTop:8}}>
            {locationResult.candidates.map((c:any)=>(
              <div key={c.tile_id} style={{background:"rgba(255,255,255,0.05)",borderRadius:T.rSm,padding:8,display:"flex",flexDirection:"column",gap:4}}>
                {c.preview && <img src={c.preview} alt={c.filename} style={{width:"100%",aspectRatio:"1/1",objectFit:"cover",borderRadius:4}}/>}
                <p style={{fontSize:10,fontWeight:700,color:T.fg,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.filename}</p>
                <p style={{fontSize:9,color:T.muted}}>{c.latitude.toFixed(2)}°, {c.longitude.toFixed(2)}° · {c.similarity}%</p>
              </div>
            ))}
          </div>
        </Panel>}
        {locationResult?.status === "catalog_empty" && <p style={{marginTop:12,color:T.warn,fontSize:12}}>{locationResult.message}</p>}
        {error && <p style={{marginTop:12,color:T.err,fontSize:12}}>{error}</p>}
        <div style={{marginTop:16,display:"flex",gap:8,flexWrap:"wrap"}}>
          <Btn onClick={loadDemoPair}><Icons.database/>Load Demo Pair</Btn>
          <Btn onClick={locateSource}><Icons.search/>{locating?"Finding lunar location…":"Auto Find Lunar Location"}</Btn>
          <Btn primary onClick={runMatch}><Icons.zap/>{running?"Processing…":"Validate & Run Matching"}</Btn>
          <Btn onClick={reset}>Reset</Btn>
        </div>
      </Panel>
    </div>
  );
}

// ─── Feature Matching ─────────────────────────────────────────────────────────
function MatchingView() {
  const {result, runMatch, running, sensor, sourceFile, referenceFile} = useLunar();
  const [algo, setAlgo] = useState<"SIFT"|"ORB"|"SuperPoint">("SIFT");
  const [ratio, setRatio] = useState(0.75);
  const [chip, setChip] = useState<"All Matches"|"Inliers Only"|"Outliers Only">("All Matches");

  const inliers = result?.inlier_points?.map((p: any) => ({ x: p.src[0], y: p.src[1], t: "in" })) || scatterData.filter(p=>p.t==="in");
  const outliers = result?.outlier_points?.map((p: any) => ({ x: p.src[0], y: p.src[1], t: "out" })) || scatterData.filter(p=>p.t==="out");

  const previewImage = chip === "Inliers Only"
    ? (result?.inliers_preview || result?.matches_preview)
    : chip === "Outliers Only"
    ? (result?.outliers_preview || result?.matches_preview)
    : result?.matches_preview;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"200px minmax(0,1fr) 260px", gap:16, alignItems:"start" }}>
      {/* Config rail */}
      <Panel style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <PanelTitle>Detector Config</PanelTitle>
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:6 }}>Algorithm</p>
          {(["SIFT","ORB","SuperPoint"] as const).map(a=>(
            <button key={a} onClick={()=>setAlgo(a)} style={{
              display:"block", width:"100%", textAlign:"left", padding:"9px 12px",
              borderRadius:T.rSm, fontSize:12, fontWeight:600, marginBottom:4, cursor:"pointer",
              background: algo===a ? T.accent : "rgba(255,255,255,0.05)",
              color: algo===a ? "#fff" : T.muted,
              border:"none", fontFamily:T.body,
            }}>
              {a} {a==="SuperPoint" && <span style={{ color:algo===a ? "rgba(255,255,255,0.7)":T.accent2, fontSize:10 }}>AI</span>}
            </button>
          ))}
        </div>
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Lowe Ratio — <span style={{ color:T.accent, fontWeight:700 }}>{ratio.toFixed(2)}</span></p>
          <input type="range" min={0.5} max={0.95} step={0.01} value={ratio}
            onChange={e=>setRatio(parseFloat(e.target.value))}
            style={{ width:"100%", accentColor:T.accent }}/>
        </div>
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Max Keypoints</p>
          <select defaultValue="15000" style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"none", borderRadius:T.rSm, padding:"8px 10px", color:T.fg, fontSize:12, fontFamily:T.body }}>
            <option>5000</option><option>10000</option><option>15000</option><option>20000</option>
          </select>
        </div>
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Matcher</p>
          <select defaultValue="FLANN-KD" style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"none", borderRadius:T.rSm, padding:"8px 10px", color:T.fg, fontSize:12, fontFamily:T.body }}>
            <option>FLANN-KD</option><option>Brute Force</option><option>BF-Hamming</option>
          </select>
        </div>
        <Btn primary onClick={()=>runMatch({ ratio, navigate:false })}><Icons.zap/>{running ? "Running…" : "Run Detection"}</Btn>
      </Panel>

      {/* Work surface */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {/* Toolbar */}
        <Panel style={{ padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"flex", gap:6 }}>
            {(["All Matches","Inliers Only","Outliers Only"] as const).map(c=>(
              <Chip key={c} active={chip===c} onClick={()=>setChip(c)}>{c}</Chip>
            ))}
          </div>
          <span style={{ fontSize:12, color:T.muted }}>
            {result ? `${result.inliers} Inliers · ${result.outliers ?? (result.candidate_matches - result.inliers)} Outliers` : "Tile 14/40 · OHRC 25cm/px"}
          </span>
        </Panel>

        {/* Live Matches or Split pane */}
        {previewImage ? (
          <Panel style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color: chip === "Outliers Only" ? T.err : T.accent }}>
                {chip === "Inliers Only"
                  ? `Verified Inliers (${result.inliers} matches)`
                  : chip === "Outliers Only"
                  ? `Rejected Outliers (${result.outliers ?? (result.candidate_matches - result.inliers)} matches)`
                  : `Live Keypoint Correspondences (${result.inliers} Inliers / ${result.candidate_matches} Candidates)`}
              </span>
              <Badge secondary={chip !== "Outliers Only"}>{chip === "Outliers Only" ? "RANSAC Outlier Filter" : "Verified RANSAC Homography"}</Badge>
            </div>
            <div style={{ position:"relative", borderRadius:T.rMd, overflow:"hidden", background:T.gc }}>
              <img src={previewImage} alt="SIFT Correspondence Matches" style={{ width:"100%", height:"auto", display:"block", borderRadius:T.rMd }}/>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:11, color:T.muted, marginTop:2 }}>
              <span>
                {chip === "Inliers Only"
                  ? "Displaying geometrically verified inlier correspondences (green vectors)"
                  : chip === "Outliers Only"
                  ? "Displaying geometric outliers rejected by RANSAC (red vectors)"
                  : "Green lines: Inliers · Red lines: Outliers Rejected by RANSAC"}
              </span>
              <span>Spatial Grid Coverage: {result.spatial_coverage}%</span>
            </div>
          </Panel>
        ) : (
          <Panel style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { name:"Chandrayaan‑2 OHRC", tag:"Source", src:LUNAR, alt:"OHRC tile", good:[[80,70],[160,120],[240,90],[300,180],[120,220]] as [number,number][], bad:[[330,60],[60,240]] as [number,number][] },
              { name:"LRO‑NAC Reference",  tag:"Target", src:LUNAR2, alt:"LRO-NAC tile", good:[[90,75],[168,126],[246,94],[304,184],[126,224]] as [number,number][], bad:[[200,250],[350,150]] as [number,number][] },
            ].map(p=>(
              <div key={p.name} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:T.muted }}>{p.name}</span>
                  <Badge secondary={p.tag==="Source"}>{p.tag}</Badge>
                </div>
                <div style={{ position:"relative", borderRadius:T.rMd, overflow:"hidden", aspectRatio:"4/3", background:T.gc }}>
                  <img src={p.src} alt={p.alt} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }} viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden>
                    {chip!=="Outliers Only" && p.good.map(([cx,cy],i)=>(
                      <circle key={i} cx={cx} cy={cy} r={4} fill="none" stroke={T.accent} strokeWidth={2}/>
                    ))}
                    {chip!=="Inliers Only" && p.bad.map(([cx,cy],i)=>(
                      <circle key={i} cx={cx} cy={cy} r={5} fill="none" stroke={T.err} strokeWidth={2} opacity={0.9}/>
                    ))}
                  </svg>
                </div>
              </div>
            ))}
          </Panel>
        )}

        {/* Match summary */}
        <Panel style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", gap:32 }}>
            {[
              {l:"Candidates",v:result ? String(result.candidate_matches) : "1,218",a:false},
              {l:"Inliers",v:result ? String(result.inliers) : "1,200",a:false},
              {l:"Inlier Ratio",v:result ? `${result.inlier_ratio}%` : "98.5%",a:true},
              {l:"Reproj. RMSE",v:result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px",a:false}
            ].map(m=>(
              <div key={m.l} style={{ display:"flex", flexDirection:"column", gap:2 }}>
                <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:T.muted }}>{m.l}</span>
                <span style={{ fontFamily:T.display, fontSize:22, fontWeight:800, color: m.a ? T.accent : T.fg }}>{m.v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn onClick={()=>runMatch({ ratio, navigate:false })}><Icons.refresh/>Re-match</Btn>
            <Btn primary onClick={()=>runMatch({ ratio, navigate:false })}><Icons.layers/>Register</Btn>
          </div>
        </Panel>

        {/* Scatter */}
        <Panel>
          <PanelTitle>Spatial Distribution of Correspondences</PanelTitle>
          <ResponsiveContainer width="100%" height={110}>
            <ScatterChart margin={{top:0,right:0,left:-30,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="x" type="number" tick={{fontSize:9,fill:T.muted}} axisLine={false} tickLine={false}/>
              <YAxis dataKey="y" type="number" tick={{fontSize:9,fill:T.muted}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={ttStyle} cursor={{ strokeDasharray:"3 3", stroke:"rgba(255,255,255,0.1)" }}/>
              <Scatter data={inliers}  fill={T.accent} fillOpacity={0.6} r={3} name="Inlier"/>
              <Scatter data={outliers} fill={T.err}    fillOpacity={0.6} r={3} name="Outlier"/>
            </ScatterChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Inspector */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ background:T.surf, borderRadius:T.rLg, padding:20 }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:"rgba(255,255,255,0.7)", marginBottom:6 }}>Match Score</p>
          <span style={{ fontFamily:T.display, fontSize:44, fontWeight:800, lineHeight:"50px", color:T.accent }}>
            {result ? `${result.quality_score}%` : "98.9%"}
          </span>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:4 }}>
            {result ? `${result.inliers} inliers (${result.inlier_ratio}% inlier ratio)` : "Inlier ratio post-RANSAC"}
          </p>
        </div>
        <Panel>
          <PanelTitle>Session Info</PanelTitle>
          <InspRow icon={<Icons.satellite/>} label="Source" value={sourceFile?.name || "OHRC Tile"}/>
          <InspRow icon={<Icons.globe/>}    label="Reference" value={referenceFile?.name || "LRO‑NAC Reference"}/>
          <InspRow icon={<Icons.scan/>}     label="Algorithm" value={`${result?.method || "RANSAC"} (${result?.ransac_thresh ?? 2.5}px)`}/>
          <InspRow icon={<Icons.clock/>}    label="Sub-pixel Err" value={result?.subpixel_error_px != null ? `${result.subpixel_error_px} px` : "0.11 px"}/>
        </Panel>
        <Panel>
          <PanelTitle>Keypoint Verification</PanelTitle>
          <p style={{ fontSize:11, color:T.muted, marginBottom:4 }}>
            {result ? `${result.inlier_points?.length || 0} inliers · ${result.outlier_points?.length || 0} outliers` : "Top 8 of 248"}
          </p>
          {(result?.inlier_points?.length || result?.outlier_points?.length) ? (
            <div style={{ display:"flex", flexDirection:"column", gap:4, maxHeight:200, overflowY:"auto" }}>
              {[
                ...(result.inlier_points || []).slice(0, 4).map((p: any) => ({ id: p.id, err: p.error_px, rejected: false })),
                ...(result.outlier_points || []).slice(0, 4).map((p: any) => ({ id: p.id, err: p.error_px, rejected: true }))
              ].map(k => (
                <div key={k.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:11, padding:"3px 0", borderBottom:`1px solid ${T.div}` }}>
                  <span style={{ color: k.rejected ? T.err : T.accent, fontWeight:600 }}>{k.id}</span>
                  <span style={{ color:T.muted }}>Err: {k.err} px</span>
                  <Badge secondary={!k.rejected}>{k.rejected ? "Outlier" : "Inlier"}</Badge>
                </div>
              ))}
            </div>
          ) : (
            KP_LIST.map(k=><KpRow key={k.id} {...k}/>)
          )}
        </Panel>
      </div>
    </div>
  );
}

// ─── Outlier Removal ──────────────────────────────────────────────────────────
function OutlierView() {
  const {result, runMatch, running} = useLunar();
  const [method, setMethod] = useState<"RANSAC"|"MAGSAC"|"GC-RANSAC">(result?.method || "RANSAC");
  const [thresh, setThresh] = useState(result?.ransac_thresh ?? 2.5);
  const [iters, setIters] = useState(1000);
  const [confidence, setConfidence] = useState("0.9999");
  const total = result?.candidate_matches ?? 1218;
  const kept = result?.inliers ?? 1200;
  const removed = result?.outliers ?? Math.max(0, total - kept);

  const errorDistData = (result?.error_distribution && result.error_distribution.length > 0)
    ? result.error_distribution
    : [
        {e:"0.0",n:12},{e:"0.5",n:87},{e:"1.0",n:211},{e:"1.5",n:189},
        {e:"2.0",n:83},{e:"2.5",n:28},{e:"3.0",n:7},{e:"5+",n:12}
      ];

  const sectorBars = result?.sector_rmse && result.sector_rmse.length > 0
    ? result.sector_rmse.map((v: number) => {
        const maxVal = Math.max(...result.sector_rmse, 0.1);
        return Math.min(100, Math.max(18, Math.round((v / maxVal) * 100)));
      })
    : [60,40,75,30,55,20,48,65];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"200px minmax(0,1fr) 260px", gap:16, alignItems:"start" }}>
      <Panel style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <PanelTitle>RANSAC Config</PanelTitle>
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:6 }}>Method</p>
          {(["RANSAC","MAGSAC","GC-RANSAC"] as const).map(m=>(
            <button key={m} onClick={()=>setMethod(m)} style={{
              display:"block", width:"100%", textAlign:"left", padding:"9px 12px",
              borderRadius:T.rSm, fontSize:12, fontWeight:600, marginBottom:4, cursor:"pointer",
              background: method===m ? T.accent2 : "rgba(255,255,255,0.05)",
              color: method===m ? "#fff" : T.muted, border:"none", fontFamily:T.body,
            }}>{m}</button>
          ))}
        </div>
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Reproj. Threshold — <span style={{ color:T.accent, fontWeight:700 }}>{thresh.toFixed(1)} px</span></p>
          <input type="range" min={0.5} max={8} step={0.1} value={thresh}
            onChange={e=>setThresh(parseFloat(e.target.value))} style={{ width:"100%", accentColor:T.accent }}/>
        </div>
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Max Iterations — <span style={{ color:T.accent, fontWeight:700 }}>{iters.toLocaleString()}</span></p>
          <input type="range" min={100} max={5000} step={100} value={iters}
            onChange={e=>setIters(parseInt(e.target.value))} style={{ width:"100%", accentColor:T.accent }}/>
        </div>
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Confidence</p>
          <select value={confidence} onChange={e=>setConfidence(e.target.value)} style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"none", borderRadius:T.rSm, padding:"8px 10px", color:T.fg, fontSize:12, fontFamily:T.body }}>
            <option value="0.999">0.999</option><option value="0.9999">0.9999</option><option value="0.99999">0.99999</option>
          </select>
        </div>
        <Btn primary onClick={()=>runMatch({ method, ransac_thresh: thresh, max_iters: iters, confidence: parseFloat(confidence), navigate: false })}>
          <Icons.zap/>{running ? "Processing…" : `Run ${method}`}
        </Btn>
      </Panel>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
          <StatTile label="Input Matches" value={total.toString()}/>
          <StatTile label="Inliers Kept"  value={kept.toString()} accent sub={`${((kept/Math.max(1,total))*100).toFixed(1)}%`}/>
          <StatTile label="Outliers Removed" value={removed.toString()} sub="Rejected by RANSAC"/>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Panel>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <p style={{ fontSize:11, fontWeight:700, color:T.accent }}>INLIER MATCHES · {kept}</p>
              <Badge>Verified</Badge>
            </div>
            <div style={{ position:"relative", borderRadius:T.rMd, overflow:"hidden", background:T.gc, minHeight:130 }}>
              <img src={result?.inliers_preview || result?.matches_preview || LUNAR} alt="Inlier matches" style={{ width:"100%", height:"auto", maxHeight:180, objectFit:"contain", display:"block" }}/>
            </div>
            <p style={{ fontSize:11, color:T.muted, marginTop:8 }}>
              Mean residual: <span style={{ color:T.accent, fontWeight:600 }}>{result?.inlier_mean_error != null ? `${result.inlier_mean_error} px` : "0.11 px"}</span> · Sub-pixel: <span style={{ color:T.fg, fontWeight:600 }}>{result?.subpixel_error_px != null ? `${result.subpixel_error_px} px` : "0.11 px"}</span>
            </p>
          </Panel>

          <Panel>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <p style={{ fontSize:11, fontWeight:700, color:T.err }}>REJECTED OUTLIERS · {removed}</p>
              <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:T.rFull, background:"rgba(255,92,108,0.15)", color:T.err }}>Filtered</span>
            </div>
            <div style={{ position:"relative", borderRadius:T.rMd, overflow:"hidden", background:T.gc, minHeight:130 }}>
              <img src={result?.outliers_preview || result?.matches_preview || LUNAR2} alt="Rejected outliers" style={{ width:"100%", height:"auto", maxHeight:180, objectFit:"contain", display:"block" }}/>
            </div>
            <p style={{ fontSize:11, color:T.muted, marginTop:8 }}>
              Mean outlier dist: <span style={{ color:T.err, fontWeight:600 }}>{result?.outlier_mean_error != null ? `${result.outlier_mean_error} px` : "207.0 px"}</span> · Threshold: <span style={{ color:T.fg, fontWeight:600 }}>{thresh.toFixed(1)} px</span>
            </p>
          </Panel>
        </div>

        {/* Detailed Outlier Rejection Table */}
        <Panel>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <PanelTitle>Detected & Rejected Outlier Keypoints</PanelTitle>
            <span style={{ fontSize:11, color:T.muted }}>
              {result?.outlier_points?.length ? `${result.outlier_points.length} flagged false matches` : "17 flagged false matches"}
            </span>
          </div>
          <div style={{ maxHeight:150, overflowY:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11, textAlign:"left" }}>
              <thead>
                <tr style={{ color:T.muted, borderBottom:`1px solid ${T.div}` }}>
                  <th style={{ padding:"4px 8px" }}>Keypoint</th>
                  <th style={{ padding:"4px 8px" }}>Source (x, y)</th>
                  <th style={{ padding:"4px 8px" }}>Target (x, y)</th>
                  <th style={{ padding:"4px 8px" }}>Reproj. Error</th>
                  <th style={{ padding:"4px 8px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(result?.outlier_points?.length ? result.outlier_points.slice(0, 10) : [
                  { id:"KP-135", src:[330.2, 60.1], ref:[200.4, 250.2], error_px: 433.68 },
                  { id:"KP-148", src:[60.4, 240.2], ref:[350.1, 150.4], error_px: 284.15 },
                  { id:"KP-088", src:[210.1, 180.5], ref:[120.3, 310.2], error_px: 198.42 },
                  { id:"KP-204", src:[140.0, 95.3],  ref:[280.2, 110.1], error_px: 142.19 },
                  { id:"KP-312", src:[310.5, 290.4], ref:[85.2, 190.8],  error_px: 78.50 },
                ]).map((k: any) => (
                  <tr key={k.id} style={{ borderBottom:`1px solid rgba(255,255,255,0.03)` }}>
                    <td style={{ padding:"6px 8px", color:T.err, fontWeight:600 }}>{k.id}</td>
                    <td style={{ padding:"6px 8px", color:T.muted }}>({k.src[0]}, {k.src[1]})</td>
                    <td style={{ padding:"6px 8px", color:T.muted }}>({k.ref[0]}, {k.ref[1]})</td>
                    <td style={{ padding:"6px 8px", color:T.fg, fontWeight:600 }}>{k.error_px} px</td>
                    <td style={{ padding:"6px 8px" }}>
                      <span style={{ fontSize:10, padding:"2px 6px", borderRadius:4, background:"rgba(255,92,108,0.12)", color:T.err }}>
                        Rejected (&gt; {thresh.toFixed(1)} px)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelTitle>Reprojection Error Distribution</PanelTitle>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={errorDistData} margin={{top:0,right:0,bottom:0,left:-30}}>
              <defs>
                <linearGradient id="ge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.accent2} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={T.accent2} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="e" tick={{fontSize:9,fill:T.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:9,fill:T.muted}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={ttStyle}/>
              <Area type="monotone" dataKey="n" stroke={T.accent2} strokeWidth={1.5} fill="url(#ge)" dot={false} name="Count"/>
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ background:T.surf, borderRadius:T.rLg, padding:20 }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:"rgba(255,255,255,0.7)", marginBottom:6 }}>RANSAC Quality</p>
          <span style={{ fontFamily:T.display, fontSize:44, fontWeight:800, lineHeight:"50px", color:T.accent }}>
            {result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px"}
          </span>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.6)", marginTop:4 }}>Homography RMSE</p>
        </div>
        <Panel>
          <PanelTitle>Rejection Stats</PanelTitle>
          <InspRow icon={<Icons.filter/>}      label="Threshold"  value={`${thresh} px`}/>
          <InspRow icon={<Icons.trash/>}       label="Removed"    value={removed.toString()}/>
          <InspRow icon={<Icons.checkCircle/>} label="Retained"   value={kept.toString()}/>
          <InspRow icon={<Icons.gauge/>}       label="Inlier Rate" value={`${((kept/Math.max(1,total))*100).toFixed(1)}%`}/>
        </Panel>
        <Panel>
          <PanelTitle>RMSE by Tile Region</PanelTitle>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:52 }}>
            {sectorBars.map((h: number, i: number)=>(
              <div key={i} title={`Sector ${i+1}`} style={{ flex:1, height:`${h}%`, background:T.accent, borderRadius:T.rFull, opacity:0.8 }}/>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ─── Registration ─────────────────────────────────────────────────────────────
function RegistrationView() {
  const {result, runMatch, running} = useLunar();
  const [transform, setTransform] = useState<"Homography"|"Affine"|"Polynomial">("Homography");
  return (
    <div style={{ display:"grid", gridTemplateColumns:"200px minmax(0,1fr)", gap:16, alignItems:"start" }}>
      <Panel style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <PanelTitle>Transform Model</PanelTitle>
        {(["Homography","Affine","Polynomial"] as const).map(t=>(
          <button key={t} onClick={()=>setTransform(t)} style={{
            display:"block", width:"100%", textAlign:"left", padding:"9px 12px",
            borderRadius:T.rSm, fontSize:12, fontWeight:600, marginBottom:4, cursor:"pointer",
            background: transform===t ? T.accent : "rgba(255,255,255,0.05)",
            color: transform===t ? "#fff" : T.muted, border:"none", fontFamily:T.body,
          }}>{t}{t==="Polynomial" && <span style={{ fontSize:10, opacity:.7 }}> ord.2</span>}</button>
        ))}
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Resampling</p>
          <select defaultValue="Lanczos-4" style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"none", borderRadius:T.rSm, padding:"8px 10px", color:T.fg, fontSize:12, fontFamily:T.body }}>
            <option>Lanczos-4</option><option>Bicubic</option><option>Bilinear</option><option>Nearest</option>
          </select>
        </div>
        <div>
          <p style={{ fontSize:11, color:T.muted, marginBottom:4 }}>Output Projection</p>
          <select defaultValue="Match LRO-NAC Grid" style={{ width:"100%", background:"rgba(255,255,255,0.06)", border:"none", borderRadius:T.rSm, padding:"8px 10px", color:T.fg, fontSize:12, fontFamily:T.body }}>
            <option>Match LRO-NAC Grid</option><option>Custom GSD</option><option>Preserve Source</option>
          </select>
        </div>
        <Btn primary onClick={runMatch}><Icons.layers/>{running ? "Registering…" : "Register Images"}</Btn>
      </Panel>

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <Panel>
          <PanelTitle>Before / After Registration — {transform} Warp</PanelTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[
              { label:"SOURCE · Pre-Registration", src: result?.source_preview || LUNAR,  tint:"rgba(119,69,244,0.12)" },
              { label:"REGISTERED · Post (Warped)",src: result?.registered_preview || result?.source_preview || LUNAR,  tint:"rgba(61,90,254,0.08)" },
              { label:"DIFFERENCE MAP · |Ref−Reg|",src: result?.difference_preview || LUNAR2, tint:"rgba(230,167,93,0.12)"  },
            ].map(p=>(
              <div key={p.label} style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color:T.muted }}>{p.label}</p>
                <div style={{ position:"relative", borderRadius:T.rMd, overflow:"hidden", height:120 }}>
                  <img src={p.src} alt={p.label} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  <div style={{ position:"absolute", inset:0, background:p.tint, borderRadius:T.rMd }}/>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Panel>
            <PanelTitle>Homography Matrix H</PanelTitle>
            <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:T.rSm, padding:"12px 14px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"4px 20px", fontFamily:"monospace", fontSize:12 }}>
                {(result?.homography_matrix
                  ? result.homography_matrix.flat().map((v: number) => v >= 0 ? `+${v.toFixed(4)}` : v.toFixed(4))
                  : ["1.0023","−0.0012","2.31","0.0008","0.9987","−1.74","0.0001","0.0000","1.0000"]
                ).map((v: string, i: number)=>(
                  <span key={i} style={{ color: i<6 ? T.accent : T.muted }}>{v}</span>
                ))}
              </div>
            </div>
            <p style={{ fontSize:11, color:T.muted, marginTop:8 }}>
              {result?.homography_matrix ? `Estimated via ${result.method || "RANSAC"} (${result.inliers} inliers)` : "Condition number: 1.0031 — well-conditioned"}
            </p>
          </Panel>
          <Panel>
            <PanelTitle>Transform Decomposition</PanelTitle>
            {[
              { k:"Translation (x, y)", v:"+2.31 px, −1.74 px" },
              { k:"Scale (x, y)",       v:"×1.0023, ×0.9987" },
              { k:"Rotation",           v:"−0.04°" },
              { k:"Shear",              v:"0.0008" },
            ].map((d,i)=>(
              <div key={d.k} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                fontSize:13, paddingTop: i===0 ? 0 : 8, marginTop: i===0 ? 0 : 8,
                borderTop: i===0 ? "none" : `1px solid ${T.div}`,
              }}>
                <span style={{ color:T.muted }}>{d.k}</span>
                <span style={{ color:T.fg, fontWeight:600, fontFamily:"monospace" }}>{d.v}</span>
              </div>
            ))}
          </Panel>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          <StatTile label="Reg. RMSE"  value={result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px"} accent/>
          <StatTile label="Subpixel Err" value={result?.subpixel_error_px != null ? `${result.subpixel_error_px} px` : "0.11 px"}/>
          <StatTile label="Inlier Ratio" value={result?.inlier_ratio != null ? `${result.inlier_ratio}%` : "98.5%"}/>
          <StatTile label="Quality Score" value={result?.quality_score != null ? `${result.quality_score}%` : "98.9%"}/>
        </div>
      </div>
      {result?.registered_preview && <Panel><PanelTitle>Live Registration Result</PanelTitle><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><img src={result.reference_preview} style={{width:"100%",borderRadius:12}}/><img src={result.registered_preview} style={{width:"100%",borderRadius:12}}/></div></Panel>}
    </div>
  );
}

// ─── Accuracy Metrics ─────────────────────────────────────────────────────────
function MetricsView() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        <StatTile label="SSIM"  value="0.941" accent sub="Structural Similarity"/>
        <StatTile label="PSNR"  value="34.7 dB" sub="Peak Signal-to-Noise"/>
        <StatTile label="NCC"   value="0.954" sub="Normalized Cross-Corr"/>
        <StatTile label="RMSE"  value="0.83 px" sub="Root Mean Square Error"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 280px", gap:12 }}>
        <Panel>
          <PanelTitle>Multi-Band Registration Accuracy — Pre vs Post</PanelTitle>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={bandCorr} margin={{top:4,right:10,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="band" tick={{fontSize:10,fill:T.muted,fontFamily:T.body}} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,1]} tick={{fontSize:10,fill:T.muted,fontFamily:T.body}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={ttStyle}/>
              <Bar dataKey="pre"  fill="rgba(119,69,244,0.5)" radius={[3,3,0,0]} name="Pre-Registration"/>
              <Bar dataKey="post" fill={T.accent} radius={[3,3,0,0]} name="Post-Registration" fillOpacity={0.85}/>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel>
          <PanelTitle>Quality Radar</PanelTitle>
          <ResponsiveContainer width="100%" height={210}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)"/>
              <PolarAngleAxis dataKey="metric" tick={{fontSize:9,fill:T.muted,fontFamily:T.body}}/>
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0,1]}/>
              <Radar name="Pre"  dataKey="pre"  stroke={T.accent2} fill={T.accent2} fillOpacity={0.15} strokeWidth={1.5}/>
              <Radar name="Post" dataKey="post" stroke={T.accent}  fill={T.accent}  fillOpacity={0.1}  strokeWidth={1.5}/>
            </RadarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel>
        <PanelTitle>Band-by-Band Metrics</PanelTitle>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, fontFamily:T.body }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.div}` }}>
              {["Band","Resolution","SSIM↑","PSNR (dB)↑","NCC↑","MI↑","RMSE↓","MAE↓","Status"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"6px 10px 10px 0", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.06em", color:T.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { band:"OHRC",     res:"0.25 m/px", ssim:"0.941", psnr:"34.7", ncc:"0.954", mi:"1.824", rmse:"0.83", mae:"0.61", pass:true  },
              { band:"TMC-2",    res:"5 m/px",    ssim:"0.919", psnr:"32.1", ncc:"0.934", mi:"1.712", rmse:"1.04", mae:"0.79", pass:true  },
              { band:"IIRS-NIR", res:"80 m/px",   ssim:"0.883", psnr:"29.8", ncc:"0.901", mi:"1.541", rmse:"1.42", mae:"1.11", pass:true  },
              { band:"IIRS-TIR", res:"80 m/px",   ssim:"0.861", psnr:"28.3", ncc:"0.878", mi:"1.483", rmse:"1.67", mae:"1.34", pass:false },
            ].map(r=>(
              <tr key={r.band} style={{ borderBottom:`1px solid ${T.div}` }}>
                <td style={{ padding:"10px 10px 10px 0", fontWeight:700, color:T.fg }}>{r.band}</td>
                <td style={{ padding:"10px 10px 10px 0", color:T.muted }}>{r.res}</td>
                <td style={{ padding:"10px 10px 10px 0", color:T.accent }}>{r.ssim}</td>
                <td style={{ padding:"10px 10px 10px 0", color:T.accent }}>{r.psnr}</td>
                <td style={{ padding:"10px 10px 10px 0", color:T.accent }}>{r.ncc}</td>
                <td style={{ padding:"10px 10px 10px 0", color:T.fg }}>{r.mi}</td>
                <td style={{ padding:"10px 10px 10px 0", color:T.fg }}>{r.rmse}</td>
                <td style={{ padding:"10px 10px 10px 0", color:T.fg }}>{r.mae}</td>
                <td style={{ padding:"10px 0" }}>
                  <Badge secondary={!r.pass}>{r.pass ? "PASS" : "REVIEW"}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

// ─── Reports ──────────────────────────────────────────────────────────────────
function ReportsView() {
  const {result} = useLunar();
  const downloadData = (name:string, data:string) => {
    const a = document.createElement("a");
    a.href = data;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const downloadReportJson = () => {
    const reportData = {
      project: "Lunar Fusion",
      problem_statement: "ISRO SIH 26166",
      generated_at: new Date().toISOString(),
      status: result?.status || "simulated",
      sensor: result?.sensor || "OHRC",
      inliers: result?.inliers ?? 1200,
      candidates: result?.candidate_matches ?? 1218,
      inlier_ratio_pct: result?.inlier_ratio ?? 98.52,
      rmse_px: result?.rmse_px ?? 0.262,
      subpixel_error_px: result?.subpixel_error_px ?? 0.112,
      quality_score: result?.quality_score ?? 98.9,
      spatial_coverage_pct: result?.spatial_coverage ?? 100,
      processing: result?.processing || [
        "Intensity normalization", "CLAHE contrast enhancement",
        "SIFT correspondence", "Lowe ratio filtering",
        "RANSAC homography", "Spatial coverage analysis"
      ]
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    downloadData("lunar_fusion_session_report.json", url);
  };

  const handleDownload = (fmt: string) => {
    if (fmt === "JSON") {
      downloadReportJson();
    } else if (fmt === "Registered PNG") {
      if (result?.registered_preview) {
        downloadData("lunar_registered_homography.png", result.registered_preview);
      } else {
        alert("Run matching and registration first to generate registered image.");
      }
    } else if (fmt === "Matches PNG") {
      if (result?.matches_preview) {
        downloadData("lunar_sift_correspondences.png", result.matches_preview);
      } else {
        alert("Run matching first to generate correspondence dataset.");
      }
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          { title:"Full Processing Report", desc:"Complete pipeline summary: ingestion → matching → RANSAC → registration → metrics.", size:"Metadata", fmt:"JSON", icon:<Icons.report/> },
          { title:"Registered Image Stack", desc:"Co-registered OHRC, TMC-2, and IIRS bands aligned to LRO-NAC reference grid.", size:"Warped", fmt:"Registered PNG", icon:<Icons.satellite/> },
          { title:"Correspondence Dataset", desc:"Matched keypoint pairs with inlier flags, coordinates, and reprojection errors.", size:"Visual Map", fmt:"Matches PNG", icon:<Icons.target/> },
        ].map(r=>(
          <Panel key={r.title} style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
              <div style={{ width:36, height:36, borderRadius:T.rSm, background:"rgba(61,90,254,0.12)", display:"flex", alignItems:"center", justifyContent:"center", color:T.accent }}>
                {r.icon}
              </div>
              <Badge>READY</Badge>
            </div>
            <div>
              <h3 style={{ fontFamily:T.display, fontSize:14, fontWeight:700, color:T.fg, marginBottom:4 }}>{r.title}</h3>
              <p style={{ fontSize:12, color:T.muted, lineHeight:1.5 }}>{r.desc}</p>
            </div>
            <div style={{ marginTop:"auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:12, color:T.muted }}>{r.size} · {r.fmt}</span>
              <button onClick={()=>handleDownload(r.fmt)} style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, color:T.accent, background:"none", border:"none", cursor:"pointer", fontFamily:T.body }}>
                <Icons.download/>Download
              </button>
            </div>
          </Panel>
        ))}
      </div>

      <Panel>
        <PanelTitle>Session History</PanelTitle>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12, fontFamily:T.body }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${T.div}` }}>
              {["Session ID","Mission","Date","Bands","Inliers","RMSE","SSIM","Status"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"6px 12px 10px 0", fontWeight:700, fontSize:11, textTransform:"uppercase", letterSpacing:"0.06em", color:T.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id:"LM-2024-031-A7", mission:"CH2-LRO-South-Polar",  date:"2024-11-14", bands:"4", inliers:"614", rmse:"0.83", ssim:"0.941", s:"ACTIVE"   },
              { id:"LM-2024-028-B3", mission:"CH2-LRO-Malapert",      date:"2024-11-09", bands:"3", inliers:"547", rmse:"1.07", ssim:"0.912", s:"COMPLETE" },
              { id:"LM-2024-021-A2", mission:"CH2-LRO-Shackleton-N",  date:"2024-10-31", bands:"4", inliers:"489", rmse:"1.24", ssim:"0.887", s:"COMPLETE" },
              { id:"LM-2024-015-C1", mission:"CH2-LRO-Cabeus",        date:"2024-10-22", bands:"2", inliers:"371", rmse:"1.61", ssim:"0.851", s:"ARCHIVED" },
            ].map(r=>(
              <tr key={r.id} style={{ borderBottom:`1px solid ${T.div}`, cursor:"pointer" }}>
                <td style={{ padding:"10px 12px 10px 0", color:T.accent, fontWeight:700 }}>{r.id}</td>
                <td style={{ padding:"10px 12px 10px 0", color:T.fg }}>{r.mission}</td>
                <td style={{ padding:"10px 12px 10px 0", color:T.muted }}>{r.date}</td>
                <td style={{ padding:"10px 12px 10px 0", color:T.fg }}>{r.bands}</td>
                <td style={{ padding:"10px 12px 10px 0", color:T.fg }}>{r.inliers}</td>
                <td style={{ padding:"10px 12px 10px 0", color:T.fg }}>{r.rmse} px</td>
                <td style={{ padding:"10px 12px 10px 0", color:T.accent }}>{r.ssim}</td>
                <td style={{ padding:"10px 0" }}>
                  <Badge secondary={r.s==="COMPLETE"||r.s==="ARCHIVED"}>{r.s}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

// ─── page metadata per view ───────────────────────────────────────────────────
// ─── page metadata per view ───────────────────────────────────────────────────
function getPageMeta(active: NavId, result: any, sourceFile: File | null, referenceFile: File | null, backendOnline: boolean = true): {
  title: string;
  sub: string;
  actions?: React.ReactNode;
  stats?: { icon?: React.ReactNode; label:string; value:string; accent?:boolean }[];
} {
  const metaMap: Record<NavId, any> = {
    dashboard: {
      title:"Live Correspondence Match Viewer",
      sub: sourceFile ? `Source: ${sourceFile.name} · Reference: ${referenceFile?.name || "LRO-NAC"}` : "Field: South Polar Region · Chandrayaan‑2 OHRC vs LRO‑NAC reference strip",
      stats: [
        { icon:<>{Icons.target()}</>, label:"Correspondences",   value: result ? String(result.inliers) : "1,200", accent:true },
        { icon:<>{Icons.scan()}</>,   label:"Raw Candidates",    value: result ? String(result.candidate_matches) : "1,218", accent:true },
        {                             label:"Inlier Ratio",      value: result ? `${result.inlier_ratio}%` : "98.5%", accent:true },
        { icon:<>{Icons.gauge()}</>,  label:"Registration RMSE", value: result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px" },
      ],
    },
    upload: {
      title:"Image Ingestion & AI Location Retrieval",
      sub:"Upload Chandrayaan-2 and LRO-NAC imagery or query the pre-indexed lunar tile catalog",
      stats: [
        { label:"Files Loaded",   value: sourceFile && referenceFile ? "2 / 2" : (sourceFile || referenceFile ? "1 / 2" : "0 / 2"), accent:true },
        { label:"Source Sensor",  value: sourceFile ? "Loaded" : "Select Sensor" },
        { label:"LRO-NAC Catalog",value:"12 Tiles Indexed" },
        { label:"API Backend",    value: backendOnline ? `Connected (${getApiHostDisplay()})` : `Connecting (${getApiHostDisplay()})` },
      ],
    },
    matching: {
      title:"Feature Matching — SIFT + Lowe Ratio + RANSAC",
      sub: sourceFile ? `Live correspondence: ${sourceFile.name} ↔ ${referenceFile?.name || "LRO-NAC"}` : "Tile 14/40 · OHRC 25 cm/px · LRO-NAC reference",
      stats: [
        { label:"Candidates",   value: result ? String(result.candidate_matches) : "1,218", accent:true },
        { label:"Inliers",      value: result ? String(result.inliers) : "1,200", accent:true },
        { label:"Inlier Ratio", value: result ? `${result.inlier_ratio}%` : "98.5%", accent:true },
        { label:"RMSE",         value: result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px" },
      ],
    },
    outlier: {
      title:"Outlier Removal — RANSAC Homography Geometry",
      sub:"Reprojection threshold 4.0 px · SIFT descriptor ratio test · Epipolar verification",
      stats: [
        { label:"Input Matches",  value: result ? String(result.candidate_matches) : "1,218" },
        { label:"Inliers",        value: result ? String(result.inliers) : "1,200", accent:true },
        { label:"Removed",        value: result ? String(Math.max(0, result.candidate_matches - result.inliers)) : "18" },
        { label:"Homography RMSE",value: result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px" },
      ],
    },
    registration: {
      title:"Image Registration — Homography Perspective Warp",
      sub:"OpenCV warpPerspective · Resampled to LRO-NAC reference grid · Sub-pixel accuracy",
      stats: [
        { label:"Reg. RMSE",    value: result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px", accent:true },
        { label:"Subpixel Err", value: result?.subpixel_error_px != null ? `${result.subpixel_error_px} px` : "0.11 px" },
        { label:"Inlier Ratio", value: result ? `${result.inlier_ratio}%` : "98.5%" },
        { label:"Quality Score",value: result ? `${result.quality_score}%` : "98.9%" },
      ],
    },
    metrics: {
      title:"Accuracy Evaluation & Quality Scoring",
      sub:"ISRO Problem Statement 26166 verification metrics — RMSE, Sub-pixel error, Coverage",
      stats: [
        { label:"Quality Score", value: result ? `${result.quality_score}%` : "98.9%", accent:true },
        { label:"Reg. RMSE",     value: result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px" },
        { label:"Subpixel Err",  value: result?.subpixel_error_px != null ? `${result.subpixel_error_px} px` : "0.11 px" },
        { label:"Spatial Grid",  value: result?.spatial_coverage != null ? `${result.spatial_coverage}%` : "100%" },
      ],
    },
    reports: {
      title:"Reports & Dataset Export",
      sub:"Download processed imagery, correspondence datasets, and full pipeline reports",
      stats: [
        { label:"Session Status", value: result ? "COMPLETED" : "READY", accent:true },
        { label:"Inliers Kept",   value: result ? String(result.inliers) : "1,200" },
        { label:"RMSE",           value: result?.rmse_px != null ? `${result.rmse_px} px` : "0.26 px" },
        { label:"Export Formats", value:"PNG / JSON" },
      ],
    },
  };
  return metaMap[active];
}

// ─── Protected Lunar Fusion Dashboard ──────────────────────────────────────────
function LunarDashboard({ onReplayIntro }: { onReplayIntro: () => void }) {
  const { user, authFetch } = useAuth();
  const [active, setActive] = useState<NavId>("dashboard");
  const [sensor,setSensor] = useState("OHRC");
  const [sourceFile,setSourceFile] = useState<File|null>(null); const [referenceFile,setReferenceFile] = useState<File|null>(null);
  const [sourceMeta,setSourceMeta] = useState<any>(null); const [referenceMeta,setReferenceMeta] = useState<any>(null);
  const [result,setResult] = useState<any>(null); const [running,setRunning] = useState(false); const [error,setError] = useState("");
  const [locationResult, setLocationResult] = useState<any>(null); const [locating, setLocating] = useState(false);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const [showIntroOnStartup, setShowIntroOnStartup] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("lunarFusionShowIntroOnStartup");
    return saved === null ? true : saved === "true";
  });

  const toggleIntroOnStartup = (val: boolean) => {
    setShowIntroOnStartup(val);
    localStorage.setItem("lunarFusionShowIntroOnStartup", String(val));
  };

  const replayIntro = () => {
    setShowSettingsModal(false);
    onReplayIntro();
  };

  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    checkApiHealth().then((res) => {
      if (active) setBackendOnline(res.ok);
    });
    const interval = setInterval(() => {
      checkApiHealth().then((res) => {
        if (active) setBackendOnline(res.ok);
      });
    }, 20000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const meta = getPageMeta(active, result, sourceFile, referenceFile, backendOnline);

  const fetchMeta=async(file:File)=>{
    const fd=new FormData();fd.append("file",file);
    const r=await authFetch("/api/metadata",{method:"POST",body:fd});
    if(!r.ok)throw new Error(await r.text());
    return r.json();
  };

  const loadDemoPair=async()=>{
    setError("");
    try{
      const [rSrc, rRef] = await Promise.all([
        authFetch("/api/demo/sample-source"),
        authFetch("/api/demo/sample-reference")
      ]);
      if(!rSrc.ok || !rRef.ok) throw new Error("Could not fetch demo tiles from backend.");
      const [bSrc, bRef] = await Promise.all([rSrc.blob(), rRef.blob()]);
      const fSrc = new File([bSrc], "chandrayaan2_ohrc_sample.png", {type:"image/png"});
      const fRef = new File([bRef], "lro_nac_reference_sample.png", {type:"image/png"});
      setSourceFile(fSrc); setReferenceFile(fRef);
      const [sm, rm] = await Promise.all([fetchMeta(fSrc), fetchMeta(fRef)]);
      setSourceMeta(sm); setReferenceMeta(rm);
      setActive("upload");
    }catch(e:any){
      setError(e?.message || "Failed to load demo pair from backend.");
    }
  };

  const locateSource=async()=>{
    if (user?.role === "viewer") {
      setError("Viewer role active: Read-only observation access. Login as Researcher or Admin to run location retrieval.");
      return;
    }
    if(!sourceFile){setError("Upload a Chandrayaan-2 image first.");return}
    setLocating(true);setError("");
    try{
      const fd=new FormData();fd.append("file",sourceFile);fd.append("sensor",sensor);fd.append("top_k","5");
      const r=await authFetch("/api/locate",{method:"POST",body:fd});
      if(!r.ok)throw new Error(await r.text());
      const data=await r.json();setLocationResult(data);
      if(data.candidates?.[0]?.tile_id){
        const c=data.candidates[0]; const rr=await authFetch(`/api/catalog/tile/${c.tile_id}`);
        if(rr.ok && !referenceFile){
          const blob=await rr.blob();
          const f=new File([blob],c.filename||"LRO-NAC-reference.png",{type:blob.type||"image/png"});
          setReferenceFile(f);
          const rm=await fetchMeta(f);
          setReferenceMeta(rm);
        }
      }
    }catch(e:any){
      setError(e?.message||"Location retrieval failed.");
    }finally{
      setLocating(false);
    }
  };

  const runMatch = async (opts?: MatchOptions) => {
    if (user?.role === "viewer") {
      setError("Viewer role active: Read-only observation access. Login as Researcher or Admin to execute correspondence matching.");
      return;
    }
    if(!sourceFile || !referenceFile){
      setError("Please upload both a Chandrayaan-2 source image and an LRO-NAC reference image.");
      return;
    }
    setRunning(true); setError("");
    try{
      const [sm, rm] = await Promise.all([
        sourceMeta ? Promise.resolve(sourceMeta) : fetchMeta(sourceFile),
        referenceMeta ? Promise.resolve(referenceMeta) : fetchMeta(referenceFile)
      ]);
      setSourceMeta(sm); setReferenceMeta(rm);
      const fd = new FormData();
      fd.append("source", sourceFile);
      fd.append("reference", referenceFile);
      fd.append("sensor", sensor);
      fd.append("ratio", String(opts?.ratio ?? 0.75));
      fd.append("min_matches", String(opts?.min_matches ?? 8));
      fd.append("method", opts?.method || "RANSAC");
      fd.append("ransac_thresh", String(opts?.ransac_thresh ?? 2.5));
      fd.append("max_iters", String(opts?.max_iters ?? 1000));
      fd.append("confidence", String(opts?.confidence ?? 0.9999));

      const r = await authFetch("/api/match", { method: "POST", body: fd });
      if(!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setResult(data);
      if(opts?.navigate !== false && active === "upload"){
        setActive("matching");
      }
    }catch(e:any){
      setError(e?.message || "Backend request failed. Start the FastAPI server and try again.");
    }finally{
      setRunning(false);
    }
  };

  const reset=()=>{setSourceFile(null);setReferenceFile(null);setSourceMeta(null);setReferenceMeta(null);setResult(null);setLocationResult(null);setError("")};

  const views: Record<NavId, React.ReactNode> = {
    dashboard:    <DashboardView/>,
    upload:       <UploadView/>,
    matching:     <MatchingView/>,
    outlier:      <OutlierView/>,
    registration: <RegistrationView/>,
    metrics:      <MetricsView/>,
    reports:      <ReportsView/>,
  };

  const lunarValue={sensor,setSensor,sourceFile,referenceFile,setSourceFile,setReferenceFile,sourceMeta,referenceMeta,result,locationResult,running,locating,error,runMatch,locateSource,reset,loadDemoPair,active,setActive};
  return (
    <LunarContext.Provider value={lunarValue}>
    <>
    <Wallpaper />
    <div style={{ position:"relative", zIndex:1, color:T.fg, minHeight:"100%", fontFamily:T.body, WebkitFontSmoothing:"antialiased" }}>
      <div style={{ maxWidth:1320, margin:"0 auto", padding:"0 clamp(20px,4vw,48px) 32px" }}>

        {/* ── Topbar ─────────────────────────────────────────────────────────── */}
        <header style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:16, padding:"20px 0",
          position:"sticky", top:0, zIndex:20, background:"rgba(4,6,15,0.75)", backdropFilter:"blur(16px)",
        }}>
          {/* Brand */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:36, height:36, borderRadius:T.rFull,
              background:T.ch, display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, color:T.accent,
            }}><Icons.moon/></div>
            <div>
              <div style={{ fontFamily:T.display, fontWeight:700, fontSize:15, color:T.fg, lineHeight:"19px" }}>Lunar Fusion</div>
              <div style={{ fontSize:10, color:T.muted, lineHeight:"13px" }}>AI-Powered Multi-Modal Lunar Image Registration</div>
            </div>
          </div>

          {/* Top nav */}
          <nav style={{ display:"flex", alignItems:"center", gap:4 }}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setActive(n.id)} style={{
                display:"inline-flex", alignItems:"center", gap:7,
                padding:"8px 14px", borderRadius:T.rFull, border:"none", cursor:"pointer",
                fontSize:13, fontWeight:600, fontFamily:T.body,
                background: active===n.id ? T.ch : "transparent",
                color: active===n.id ? T.fg : T.muted,
                transition:`background ${T.dur} ${T.ease}, color ${T.dur} ${T.ease}`,
              }}>
                <span style={{ color: active===n.id ? T.accent : T.muted }}><n.icon/></span>
                {n.label}
              </button>
            ))}
          </nav>

          {/* Actions & User Profile */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {([<Icons.search/>, <Icons.bell/>] as React.ReactNode[]).map((ic,i)=>(
              <button key={i} style={{
                width:36, height:36, borderRadius:T.rFull, background:T.ch, border:"none",
                color:T.muted, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
              }}>{ic}</button>
            ))}
            <UserProfileDropdown
              onOpenSecurity={() => setShowSecurityModal(true)}
              onOpenAdmin={() => setShowAdminModal(true)}
              onOpenSettings={() => setShowSettingsModal(true)}
            />
          </div>
        </header>

        {/* ── Viewer Banner ─────────────────────────────────────────────────── */}
        {user?.role === "viewer" && (
          <div style={{
            marginTop: 12,
            padding: "10px 16px",
            background: "rgba(230, 167, 93, 0.12)",
            border: "1px solid rgba(230, 167, 93, 0.3)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#e6a75d",
          }}>
            <span><strong>Viewer Mode:</strong> Read-only observation access. Correspondence matching and location detection require Researcher or Admin privileges.</span>
          </div>
        )}

        {/* ── Page header band ──────────────────────────────────────────────── */}
        <div style={{ display:"flex", flexDirection:"column", gap:16, padding:"20px 0 16px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:24, flexWrap:"wrap" }}>
            <div>
              <h1 style={{ fontFamily:T.display, fontWeight:700, fontSize:"clamp(20px,2.2vw,26px)", lineHeight:"30px", color:T.fg }}>{meta.title}</h1>
              <p style={{ fontSize:13, color:T.muted, marginTop:4 }}>{meta.sub}</p>
            </div>
            {meta.actions && (
              <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>{meta.actions}</div>
            )}
          </div>

          {/* Status / metrics row */}
          {meta.stats && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, paddingBottom:4 }}>
              {meta.stats.map(s=>(
                <div key={s.label} style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", color:T.muted }}>
                    {s.icon}{s.label}
                  </span>
                  <span style={{ fontFamily:T.display, fontSize:28, fontWeight:800, lineHeight:"34px", color: s.accent ? T.accent : T.fg }}>{s.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── View content ──────────────────────────────────────────────────── */}
        <div>{views[active]}</div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <div style={{ borderTop:`1px solid ${T.div}`, marginTop:32, paddingTop:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:12, color:T.muted }}>ISRO / SAC · PRL Collaboration · Lunar Fusion v1.0</span>
          <button onClick={()=>setShowSettingsModal(true)} style={{
            display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:600,
            color:T.muted, background:"none", border:"none", cursor:"pointer", fontFamily:T.body,
          }}><Icons.settings/>Settings</button>
        </div>

        {/* ── Security Modal ─────────────────────────────────────────────────── */}
        <SecuritySettingsModal
          isOpen={showSecurityModal}
          onClose={() => setShowSecurityModal(false)}
        />

        {/* ── Admin Panel Modal ──────────────────────────────────────────────── */}
        <AdminPanelModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
        />

        {/* ── Settings Modal ─────────────────────────────────────────────────── */}
        {showSettingsModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}>
            <div style={{
              background: "rgba(16,16,24,0.92)",
              border: `1px solid rgba(255,255,255,0.1)`,
              borderRadius: T.rLg,
              padding: 24,
              maxWidth: 460,
              width: "100%",
              boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: T.accent }}><Icons.settings /></span>
                  <h3 style={{ margin: 0, fontFamily: T.display, fontSize: 16, fontWeight: 700 }}>System Settings</h3>
                </div>
                <button onClick={() => setShowSettingsModal(false)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", display: "flex" }}>
                  <Icons.x />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: T.rSm }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Show Intro on startup</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: T.muted }}>Display mission logo opening sequence when launching the application</p>
                  </div>
                  <button
                    onClick={() => toggleIntroOnStartup(!showIntroOnStartup)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: T.rFull,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 700,
                      background: showIntroOnStartup ? T.accent : "rgba(255,255,255,0.1)",
                      color: showIntroOnStartup ? "#ffffff" : T.muted,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {showIntroOnStartup ? "ON" : "OFF"}
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: T.rSm }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Replay Lunar Fusion Intro</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: T.muted }}>Watch the mission logo opening sequence again</p>
                  </div>
                  <Btn small primary onClick={replayIntro}>
                    Replay →
                  </Btn>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: T.rSm, fontSize: 11, color: T.muted, fontFamily: "monospace" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>BACKEND API:</span>
                    <span style={{ color: backendOnline ? T.ok : T.warn }}>
                      {backendOnline ? `ONLINE (${getApiHostDisplay()})` : `CONNECTING (${getApiHostDisplay()})`}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>MATCHER:</span>
                    <span>OPENCV SIFT + RANSAC</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>AUTH & RBAC:</span>
                    <span style={{ color: T.accent }}>JWT + REFRESH (ENABLED)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>ISRO SIH:</span>
                    <span>PROBLEM STATEMENT 26166</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Btn onClick={() => setShowSettingsModal(false)}>Close</Btn>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    </>
    </LunarContext.Provider>
  );
}

// ─── Entry Shell with Auth & Intro Video Coordination ─────────────────────────
function MainAppShell() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === "undefined") return false;
    const forceStartup = localStorage.getItem("lunarFusionShowIntroOnStartup");
    if (forceStartup === "false") return false;
    const seen = sessionStorage.getItem("lunarFusionIntroSeen");
    return !seen;
  });

  if (showIntro) {
    return <IntroVideo onComplete={() => setShowIntro(false)} forceShow={showIntro} />;
  }

  if (isLoading) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "#060913",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#8a8a8e",
        fontFamily: '"Geist", system-ui, sans-serif',
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "2px solid rgba(61, 90, 254, 0.2)",
            borderTopColor: "#3d5afe",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7ca5ff" }}>
            INITIALIZING LUNAR MISSION AUTHORIZATION…
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <LunarDashboard onReplayIntro={() => setShowIntro(true)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppShell />
    </AuthProvider>
  );
}