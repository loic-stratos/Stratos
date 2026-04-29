import { useState, useEffect, useCallback } from "react";
import {
  FileText, TrendingUp, Layers, Database, Settings, Zap, Target,
  ChevronRight, ChevronDown, Clock, Home, ArrowRight, Menu, X
} from "lucide-react";

// ─── DESIGN SYSTEM ──────────────────────────────────────────────────────────
const DS = {
  deepForest: "#091E1A",
  forestMed: "#15453C",
  sage: "#93B7A3",
  sageLight: "#90B4A0",
  amber: "#D4883A",
  white: "#FFFFFF",
  lightGrey: "#F5F5F3",
  textGrey: "#4B5563",
  amberBg: "#FFF3E0",
  saddleBrown: "#8B4513",
  redBg: "#FFEBEB",
  darkRed: "#8B1A1A",
  border: "#E5E7EB",
};

// ─── NAV ────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "intro",          label: "01 · Introduction",        icon: FileText   },
  { id: "executive",      label: "02 · Executive Summary",   icon: TrendingUp },
  { id: "cartographie",   label: "03 · Application Mapping", icon: Layers     },
  { id: "data",           label: "04 · Data",                icon: Database   },
  { id: "processus",      label: "05 · Processes",           icon: Settings   },
  { id: "ia",             label: "06 · AI",                  icon: Zap        },
  { id: "transformation", label: "07 · Transformation Plan", icon: Target     },
];

// ─── HIGHLIGHTS DATA ────────────────────────────────────────────────────────
const HIGHLIGHTS = [
  {
    id: "01", severity: "orange" as const,
    title: "Tool Adoption Gap",
    content: "The Group operates with tools that have been deployed without adequate training, change management support, or documented processes. High staff turnover — particularly among care teams and residence managers — leads to systematic knowledge loss: tools are used inconsistently across residences, Excel workarounds are pervasive, and data entry remains non-systematic (resident attendance logs, care schedules, shift planning). Usage quality is not monitored, and deviations from input standards are never escalated.",
    impact: "Deployed tools fail to generate the expected ROI. Residence-level operational reporting is unreliable and requires extensive manual rework before any group-level consolidation can be attempted.",
  },
  {
    id: "02", severity: "orange" as const,
    title: "Fragmented Application Portfolio",
    content: "The Group operates with redundant tools at every layer of its IT stack — 2 to 3 competing solutions per functional domain. Business departments procure solutions independently without DSI validation, creating a pervasive shadow IT landscape with unmanaged duplicates. On CRM: Salesforce and Microsoft Dynamics co-exist without clear ownership. On HRIS: Lucas was deployed but placed on hold. On finance: Turbo and Kyriba are both still active for resident billing despite an ongoing migration.",
    impact: "Estimated cost overrun of several hundred thousand euros per year due to duplicate licenses and maintenance. Data silos prevent consolidated group-level reporting and make any BI or AI initiative impossible without prior rationalization.",
  },
  {
    id: "03", severity: "red" as const,
    title: "Stalled Transformation Projects",
    content: "The Group has initiated several structuring IT initiatives that have not delivered their intended value. The HRIS Lucas was deployed, then placed on hold due to lack of change management. The Group abandoned a structuring ERP whose capabilities matched its operational needs. A 100K€ investment was made with an external provider for a DataHub — no deliverable has been received to date. A further 100K€+ was committed to Power BI / MS Fabric dashboards, now on standby.",
    impact: "Over 400K€ in IT investments with no measurable return. Legacy tools (Turbo, manual reconciliation workflows) remain in place due to the absence of a stable operational target architecture.",
  },
  {
    id: "04", severity: "red" as const,
    title: "No Master Data Reference",
    content: "No shared master data system exists between Sage, Agesoft, Lucas, and the ARS / Departmental authority portals. Each system has independently generated its own identifiers with no cross-reference table. The list of residences was requested from 4 separate departments; 4 different lists were received, ranging from 75 to 120 establishments depending on the source. Monthly group reporting is produced entirely by hand by a single Controller using Excel.",
    impact: "It is impossible to determine occupancy rates or per-residence profitability in real time. No BI or AI initiative can be considered without a validated, shared group-level data reference.",
  },
  {
    id: "05", severity: "red" as const,
    title: "Data Infrastructure to Build",
    content: "All group data flows (Salesforce, Sage, Agesoft, Lucas, Kyriba) pass through an in-house ESB developed and maintained by a single developer — undocumented, with no high-availability setup or real-time monitoring. A second DataHub project was contracted out to an external provider for 100K€, with no deliverable communicated to date. Power BI / MS Fabric dashboards remain on standby due to the absence of documented and validated data sources.",
    impact: "Over 200K€ already invested in BI with no operational benefit. BI and AI roadmap items cannot be launched until the data foundation is secured, documented, and handed over.",
  },
  {
    id: "06", severity: "red" as const,
    title: "Unresolved Cyber Vulnerabilities",
    content: "In January 2025, the Group suffered a crypto-mining incident exploiting an administrator account with no MFA enabled. The France LAN network relies on end-of-life switches with Telnet still active and no administration VLAN in place. Suspicious outbound connections from Agesoft have been identified, raising a material GDPR risk on resident health data. Thousands of frontline employees — care workers, nurses, auxiliary staff — do not have a professional email address, making secure identity management structurally impossible.",
    impact: "Material risk of a major cyber incident. No formalized Business Continuity Plan (BCP) exists for critical systems (Agesoft, Sage, Kyriba). Regulatory exposure on GDPR for resident health data.",
  },
  {
    id: "07", severity: "orange" as const,
    title: "Manual and Time-Consuming Processes",
    content: "Bank reconciliation requires 4 to 5 FTE in France due to the absence of integration between Kyriba and Sage. Turbo and Kyriba still co-exist for resident billing with no confirmed migration end date. ARS declarations are 100% manual: as of March 31, 2026, only 20% of residences had submitted on time. No purchase order tool exists — residence managers commit spend without any budget validation. Monthly financial close takes several weeks beyond market standards.",
    impact: "Between 5 and 10 FTE estimated as recoverable in the short term, equivalent to 300–600K€ in redeployable capacity. Structural impact on ARS funding allocations: 80% of declarations submitted after the regulatory deadline.",
  },
  {
    id: "08", severity: "orange" as const,
    title: "DSI Governance to Structure",
    content: "No formal IT demand management, project prioritization, or steering process exists between the DSI and business units. High business-team turnover prevents stable requirement definition. The DSI is perceived solely as a logistics cost center rather than a strategic partner. No Group IT Steering Committee (COPIL SI) is in place. IT architecture decisions are made reactively, without forward planning or ROI tracking.",
    impact: "Risk of continued investment in non-ROI projects. No mechanism exists to arbitrate and sequence cross-functional workstreams (Sage finalization, Kyriba integration, HRIS Lucas, Agesoft API).",
  },
];

// ─── INTERVIEWEES ───────────────────────────────────────────────────────────
const INTERVIEWEES = [
  { role: "CEO",                                    scope: "Group"  },
  { role: "CFO",                                    scope: "Group"  },
  { role: "CIO / DSI",                              scope: "Group"  },
  { role: "CHRO",                                   scope: "Group"  },
  { role: "IT Infrastructure Lead",                 scope: "Group"  },
  { role: "Data & BI Lead",                         scope: "Group"  },
  { role: "VP Operations France",                   scope: "France" },
  { role: "VP Commercial France",                   scope: "France" },
  { role: "Head of Finance France",                 scope: "France" },
  { role: "Financial Controller",                   scope: "France" },
  { role: "Head of Quality",                        scope: "France" },
  { role: "Regional Director — Île-de-France",      scope: "France" },
  { role: "Regional Director — PACA",               scope: "France" },
  { role: "Regional Director — Occitanie",          scope: "France" },
  { role: "EHPAD Residence Director (×4)",          scope: "France" },
  { role: "HR Manager",                             scope: "France" },
  { role: "Commercial Manager — Key Accounts",      scope: "France" },
  { role: "Commercial Manager — Public Tenders",    scope: "France" },
  { role: "Marketing Manager",                      scope: "France" },
  { role: "CRM Administrator (Salesforce)",         scope: "Group"  },
  { role: "Agesoft Key User",                       scope: "France" },
  { role: "Talent Acquisition Manager",             scope: "France" },
  { role: "Care Operations Manager",                scope: "France" },
  { role: "Compliance & Regulatory Manager",        scope: "France" },
  { role: "Treasury & Cash Manager",                scope: "France" },
];

// ─── TOOLS DATA ─────────────────────────────────────────────────────────────
type ToolStatus = "ok" | "partial" | "ko";
interface Tool { name: string; status: ToolStatus; desc: string; opex: string; }
interface ToolCategory { category: string; tools: Tool[]; }

const TOOLS_FRANCE: ToolCategory[] = [
  { category: "Finance & ERP", tools: [
    { name: "Sage",        status: "ok",      desc: "SaaS ERP — accounting, billing, financial master data", opex: "~95K€" },
    { name: "Kyriba",      status: "ok",      desc: "Treasury management and supplier payments", opex: "~42K€" },
    { name: "Cegid Conso", status: "ok",      desc: "Group accounting consolidation", opex: "~18K€" },
    { name: "Cegid Paie",  status: "ok",      desc: "Outsourced payroll — France", opex: "outsourced" },
    { name: "Yooz",        status: "partial", desc: "Supplier invoice dematerialization — covers 70% of invoices; 30% still manually entered", opex: "~22K€" },
    { name: "Turbo",       status: "ko",      desc: "Resident billing legacy tool — Kyriba migration ongoing with no confirmed end date", opex: "~12K€" },
    { name: "EBP Compta",  status: "ko",      desc: "Legacy ERP — retained for archive access only; decommission planned", opex: "~8K€" },
    { name: "Etafi",       status: "ok",      desc: "Consolidated tax filings", opex: "~9K€" },
    { name: "CIEL",        status: "ko",      desc: "100% manual billing on residual scope — decommission required", opex: "~5K€" },
    { name: "Jenji",       status: "partial", desc: "Employee expense reports", opex: "~6K€" },
  ]},
  { category: "Care Operations", tools: [
    { name: "Agesoft", status: "partial", desc: "Core EHPAD ERP — admissions, resident attendance, Section Soins & Dépendance billing, ARS/Departmental portal connections. Heavy client. API available.", opex: "~48K€" },
  ]},
  { category: "CRM & Commercial", tools: [
    { name: "Salesforce",              status: "partial", desc: "BtoB/BtoC CRM — leads, pipeline, institutional partner contracts. 86 active licenses. Outlook sync broken, emails disabled.", opex: "~92K€" },
    { name: "Microsoft Dynamics",      status: "ko",      desc: "Shadow CRM — adopted by certain teams without DSI validation, creating data silos alongside Salesforce", opex: "~35K€" },
    { name: "LinkedIn Sales Navigator",status: "ok",      desc: "BtoB commercial prospecting", opex: "~72K€" },
    { name: "Plezi",                   status: "partial", desc: "B2B marketing automation — fully configured but never launched", opex: "~8,400€" },
    { name: "Partoo",                  status: "ok",      desc: "Google listings and online directory management across all residences", opex: "~58K€" },
    { name: "Mailjet",                 status: "ok",      desc: "Marketing and transactional email sending platform", opex: "~840€" },
    { name: "Airtable",               status: "partial", desc: "Marketing support requests tracking — 1 active license only", opex: "~1,320€" },
    { name: "N8N",                     status: "partial", desc: "Lead automation and scoring — 25 critical undocumented workflows", opex: "~1,140€" },
    { name: "Softr.io",               status: "ok",      desc: "Group website management", opex: "~3,600€" },
    { name: "Meta / Google Ads",       status: "ok",      desc: "Digital acquisition campaigns (SEA, social media)", opex: "~160K€" },
  ]},
  { category: "HR & HRIS", tools: [
    { name: "Lucas",    status: "partial", desc: "Group SaaS HRIS — employee records, recruitment, training, absences. Deployed then placed on hold. No change management plan.", opex: "~224K€" },
    { name: "RiseUp",   status: "ok",      desc: "LMS and online training platform", opex: "~71K€" },
    { name: "PILA",     status: "ok",      desc: "Employee onboarding and offboarding workflows", opex: "included" },
    { name: "DocuSign", status: "partial", desc: "Electronic signatures — 114 active licenses incl. 7 admin accounts on departed employees", opex: "~18K€" },
  ]},
  { category: "Quality", tools: [
    { name: "BlueKanGo", status: "partial", desc: "Quality management — EHPAD audits, adverse event reporting, ARS compliance tracking. Also misused as IT helpdesk.", opex: "~31K€" },
  ]},
  { category: "Data & BI", tools: [
    { name: "Power BI / MS Fabric",  status: "ko",      desc: "Reporting and dashboards — on standby; no documented data sources validated by business teams", opex: "~10,800€" },
    { name: "DataHub (in-house ESB)",status: "partial", desc: "Internal service bus — fragile architecture, single developer, no documentation, no monitoring", opex: "~12K€" },
    { name: "GED with OCR",          status: "partial", desc: "Document management with optical recognition — new 2026 project, not yet live", opex: "~27K€" },
  ]},
  { category: "Infrastructure & Security", tools: [
    { name: "Partitio",      status: "ok",      desc: "OVH private cloud — HDS certified hosting", opex: "included" },
    { name: "Safeo",         status: "ok",      desc: "Health data certified hosting (données de santé)", opex: "included" },
    { name: "Microsoft 365", status: "partial", desc: "Productivity suite, email, collaboration — deployment in progress across residences", opex: "included" },
    { name: "Intune",        status: "partial", desc: "MDM and device fleet management — deployment in progress", opex: "included" },
    { name: "Entra ID",      status: "ok",      desc: "Identity and access management — group directory", opex: "included" },
    { name: "MailInBlack",   status: "ok",      desc: "Email security and anti-spam filtering", opex: "included" },
    { name: "Sophos XDR",    status: "ok",      desc: "Endpoint detection and threat response", opex: "included" },
    { name: "SFR Business",  status: "ok",      desc: "Mobile and fixed network connectivity", opex: "included" },
    { name: "Jira",          status: "ok",      desc: "DSI project and ticket management", opex: "included" },
  ]},
];

// ─── SWOT DATA ───────────────────────────────────────────────────────────────
const SWOT_DATA = [
  {
    tool: "Agesoft", category: "Core EHPAD ERP",
    forces: [
      "Highly customized tool with a rich feature set tailored for EHPAD operations",
      "API available to connect external data flows and third-party systems",
      "Natively connected to ARS and Departmental authority portals",
      "Advanced configuration possible for per-residence billing rules (Section Soins, Dépendance tariffs)",
    ],
    faiblesses: [
      "Heavy client architecture — no native MFA support, security risk",
      "Ageing interface, poorly adapted to frontline care staff usability needs",
      "Suspicious outbound connections identified — material GDPR risk on resident health data",
      "High administrative burden on residence directors due to poor ergonomics",
    ],
    opportunites: [
      "Full web version migration planned by the vendor for 2026 — modern UX",
      "Agesoft API available: Salesforce integration technically within reach for real-time room availability",
    ],
    menaces: [
      "Uncertain long-term viability — vendor relies on a single founder with no succession plan",
      "Very small vendor team — limited support capacity and slow development roadmap",
      "The Group is the vendor's primary client — co-dependency risk with no competitive leverage",
    ],
    conclusion: "Agesoft is operational and must be maintained in the short term. A tool change will be considered at medium term, after group processes are aligned — not now, to avoid disrupting resident care operations. Priorities: stabilize data entry discipline, activate the API for Salesforce, patch the GDPR risk, and migrate to the full-web version in 2026.",
  },
  {
    tool: "Salesforce", category: "CRM BtoB/BtoC",
    forces: [
      "Market-leading CRM product — robust, scalable, extensively customizable",
      "86 active licenses across commercial and admission teams",
      "B2C lead flow (admission requests) is functional end-to-end",
      "Salesforce API available — Agesoft integration is technically within reach",
    ],
    faiblesses: [
      "No internal Salesforce expert since the reference administrator left in late 2025",
      "No certified integration partner was ever appointed — zero documentation of existing configuration",
      "Core functions broken: Outlook synchronization disconnected, email sending disabled",
      "No 'Public Tender' or 'DSP' object configured — public market pipeline is entirely untraceable",
    ],
    opportunites: [
      "Salesforce ↔ Agesoft API integration: expose real-time room availability to commercial teams",
      "Salesforce Einstein: occupancy risk scoring and institutional contract renewal prediction",
      "Plezi integration: push warm B2B leads directly into Salesforce pipeline",
    ],
    menaces: [
      "2-year renewal clause currently blocking any standardization decision on CRM architecture",
      "Microsoft Dynamics already adopted in shadow by certain regional teams — risk of permanent CRM split",
    ],
    conclusion: "Top priority: appoint a certified Salesforce integration partner to repair core functions (Outlook sync, email) and build the Agesoft API bridge. Expected impact: real-time room availability for commercial teams, elimination of Excel-based admission tracking, full public tender pipeline visibility, and Plezi activation for B2B lead nurturing.",
  },
  {
    tool: "Sage", category: "SaaS ERP — Finance",
    forces: [
      "Managed SaaS ERP — no on-premise maintenance or infrastructure overhead",
      "Database accessible via OData/ODBC — directly usable as a BI source layer",
      "Strong potential to become the group master repository for financial reference data (suppliers, cost centers, SIRET)",
    ],
    faiblesses: [
      "Deployed in parallel with Kyriba without prior stabilization of target processes",
      "Strong user frustration reported — finance teams report loss of efficiency versus the prior tool",
      "Sage and legacy EBP Compta still co-exist, creating confusion and data duplication in daily operations",
    ],
    opportunites: [
      "Kyriba ↔ Sage integration: automate bank reconciliation, eliminate 2–3 FTE of manual matching work",
      "Sage as the single source of financial truth feeding the future BI/data warehouse layer",
    ],
    menaces: [
      "Risk of user rejection if parameterization does not account for EHPAD-specific constraints: Section Soins invoicing, ARS tariff rules, per-residence cost center structure",
    ],
    conclusion: "Finalize deployment and stabilize the configuration before adding any new integration layer. Then build the Kyriba/Sage integration as first priority. Expected impact: 2–3 FTE freed from manual bank reconciliation (~150–200K€/year), Turbo decommission, monthly financial close at D+5, and Sage as the group's single source of financial truth.",
  },
];

// ─── MISSING TOOLS ───────────────────────────────────────────────────────────
const MISSING_TOOLS = [
  { name: "Workforce Management & Scheduling", severity: "red" as const,
    desc: "No group-level tool exists to calculate staffing needs per residence or manage carer schedules. All scheduling is done manually in Excel. This creates regulatory risk on carer-to-resident ratios, prevents inter-residence staff pooling, and drives excess agency staffing costs estimated at several hundred thousand euros per year." },
  { name: "Purchase Order / P2P Tool", severity: "red" as const,
    desc: "No purchase order system. Residence managers commit spend with no budget validation — across ~4,000 active suppliers. No supplier/PO matching is possible, and Yooz cannot reconcile invoices against orders. Uncontrolled spend is a direct risk to EBITDA." },
  { name: "Document Management System (DMS with OCR)", severity: "orange" as const,
    desc: "No structured tool to process incoming document flows: ARS regulatory correspondence, sick leave certificates, resident admission files, supplier invoices outside Yooz scope. A 2026 project has been initiated but is not yet live." },
  { name: "IT Helpdesk Ticketing Tool", severity: "orange" as const,
    desc: "BlueKanGo is currently being misused as an IT support channel — it was not designed for this purpose. The absence of an ITIL-compliant tool severely limits DSI responsiveness, escalation tracking, and SLA measurement." },
  { name: "FP&A / Budgeting Tool", severity: "orange" as const,
    desc: "No FP&A tool in France. Group budget and reforecast are managed entirely in Excel by the CFO team. No real-time scenario modeling, no automated variance analysis, no bottom-up consolidation from residence level." },
];

// ─── SHARED STYLES ──────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  backgroundColor: DS.white,
  borderRadius: 12,
  padding: 24,
  border: `1px solid ${DS.border}`,
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: DS.sage,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 14,
  display: "block",
};

const h1Style: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 800,
  color: DS.deepForest,
  margin: "4px 0 0",
  lineHeight: 1.2,
};

const bodyText: React.CSSProperties = {
  fontSize: 14,
  color: DS.textGrey,
  lineHeight: 1.75,
  margin: 0,
};

// ─── SECTION 01 — INTRODUCTION ──────────────────────────────────────────────
const IntroSection = () => (
  <div>
    <div style={{ marginBottom: 32 }}>
      <span style={labelStyle}>Section 01</span>
      <h1 style={h1Style}>Introduction</h1>
    </div>

    {/* Context + Pillars */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
      <div style={card}>
        <span style={labelStyle}>Context & Objectives</span>
        <p style={bodyText}>
          The Groupement EHPAD engaged an independent audit of its IT ecosystem to support its digital
          transformation and better align technology with operational performance across its{" "}
          <strong style={{ color: DS.deepForest }}>120 residences in France</strong>.
        </p>
        <p style={{ ...bodyText, marginTop: 12 }}>
          A decline in overall operational performance has been observed over the past three years,
          attributed in part to fragmented tool usage, poor system integration, and a widening gap
          between the technology in place and the actual needs of care and administrative teams.
        </p>
        <p style={{ ...bodyText, marginTop: 12 }}>
          This audit was commissioned to produce an independent, actionable assessment and a
          prioritized transformation roadmap across four workstreams: Tools, Data, AI, and
          Process & Governance.
        </p>
      </div>
      <div style={card}>
        <span style={labelStyle}>The 4 Audit Pillars</span>
        {[
          { n: "01", t: "Application Ecosystem", d: "Full audit of tools, usage patterns, costs, and functional coverage across all business domains" },
          { n: "02", t: "Data Stack",             d: "Assessment of data flows, quality, governance, and business intelligence architecture" },
          { n: "03", t: "Hardware & Managed Services", d: "Device fleet review, SLA compliance verification, and cost benchmarking" },
          { n: "04", t: "Business Processes",     d: "Process efficiency mapping, tool-to-process fit analysis, and operational pain points" },
        ].map(p => (
          <div key={p.n} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", backgroundColor: DS.deepForest, color: DS.white, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.n}</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: DS.deepForest, margin: "0 0 3px" }}>{p.t}</p>
              <p style={{ fontSize: 12, color: DS.textGrey, margin: 0, lineHeight: 1.5 }}>{p.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Scope */}
    <div style={card}>
      <span style={labelStyle}>Audit Scope</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {[
          { label: "Geography",    value: "France",          sub: "120 residences in scope" },
          { label: "Teams",        value: "6 departments",   sub: "IT · Finance · Ops · HR · Commercial · Quality" },
          { label: "Applications", value: "40+ tools",       sub: "ERP · CRM · HRIS · Agesoft · BI · Infra" },
          { label: "Infrastructure", value: "Full review",   sub: "Hosting · Network · Security · Fleet" },
          { label: "Data",         value: "End-to-end",      sub: "References · Flows · BI · Governance" },
        ].map(s => (
          <div key={s.label} style={{ backgroundColor: DS.lightGrey, borderRadius: 8, padding: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>{s.label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: DS.deepForest, margin: "0 0 3px" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: DS.textGrey, margin: 0, lineHeight: 1.4 }}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Methodology */}
    <div style={card}>
      <span style={labelStyle}>Methodology</span>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { phase: "Phase 01", title: "Document Review",       desc: "Application cartographies, vendor contracts, security reports, management dashboards, ongoing project documentation, and financial reporting files." },
          { phase: "Phase 02", title: "Stakeholder Interviews", desc: "25 individual interviews conducted with key stakeholders: CIO, CFO, CEO, Regional Directors, EHPAD residence directors, commercial, HR, care, and compliance teams." },
          { phase: "Phase 03", title: "Analysis & Synthesis",  desc: "Consolidation of findings, cross-referencing of multiple data sources, formulation of prioritized recommendations organized across 4 transformation workstreams." },
        ].map(p => (
          <div key={p.phase} style={{ backgroundColor: DS.lightGrey, borderRadius: 8, padding: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>{p.phase}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: DS.deepForest, margin: "0 0 8px" }}>{p.title}</p>
            <p style={{ fontSize: 12, color: DS.textGrey, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Interviewees */}
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ ...labelStyle, marginBottom: 0 }}>Stakeholders Interviewed</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: DS.sage, backgroundColor: DS.lightGrey, borderRadius: 20, padding: "4px 12px" }}>25 interviews</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {INTERVIEWEES.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 7, backgroundColor: DS.lightGrey }}>
            <span style={{ fontSize: 13, color: DS.deepForest, fontWeight: 500 }}>{p.role}</span>
            <span style={{ fontSize: 11, color: DS.sage, fontWeight: 700, letterSpacing: "0.05em" }}>{p.scope}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── SECTION 02 — EXECUTIVE SUMMARY ─────────────────────────────────────────
const ExecutiveSection = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <span style={labelStyle}>Section 02</span>
        <h1 style={h1Style}>Executive Summary</h1>
      </div>

      {/* Maturity banner */}
      <div style={{ backgroundColor: DS.deepForest, borderRadius: 12, padding: 28, marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 10px" }}>IT Maturity Assessment — France</p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, margin: "0 0 20px" }}>
          France concentrates the most significant challenges identified in this audit. The application ecosystem is highly fragmented, shadow IT is present at multiple layers of the stack, and the absence of governance translates into a deep organizational dysfunction in how IT tools are selected, deployed, and sustained over time.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "DIGITAL MATURITY",  verdict: "Fragile", detail: "Undocumented ESB • pervasive shadow IT • ageing LAN network • single developer dependency on data flows", color: DS.darkRed, bg: DS.redBg },
            { label: "FINANCIAL MATURITY", verdict: "Low",     detail: "No monthly financial close • structural accounting backlog • Excel-driven group consolidation by a single person", color: DS.darkRed, bg: DS.redBg },
          ].map(m => (
            <div key={m.label} style={{ backgroundColor: m.bg, borderRadius: 8, padding: 16 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: m.color, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>{m.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: m.color, margin: "0 0 6px" }}>{m.verdict}</p>
              <p style={{ fontSize: 12, color: DS.textGrey, margin: 0, lineHeight: 1.5 }}>{m.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
        {[
          { value: "400K€+", label: "IT investments with no measured return", color: DS.darkRed, bg: DS.redBg },
          { value: "4–5 FTE", label: "Mobilized on manual bank reconciliation", color: DS.saddleBrown, bg: DS.amberBg },
          { value: "20%",    label: "Residences compliant with ARS deadline", color: DS.darkRed, bg: DS.redBg },
          { value: "5–10 FTE", label: "Recoverable through quick-win automation", color: DS.forestMed, bg: "#E6F2EC" },
        ].map(k => (
          <div key={k.label} style={{ backgroundColor: k.bg, borderRadius: 10, padding: 16, textAlign: "center" }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: k.color, margin: "0 0 6px" }}>{k.value}</p>
            <p style={{ fontSize: 11, color: DS.textGrey, margin: 0, lineHeight: 1.4 }}>{k.label}</p>
          </div>
        ))}
      </div>

      {/* 8 Highlights */}
      <p style={{ ...labelStyle, marginBottom: 12 }}>8 Key Findings</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {HIGHLIGHTS.map(h => {
          const isOpen = openId === h.id;
          const isOrange = h.severity === "orange";
          const borderColor = isOrange ? DS.amber : DS.darkRed;
          const bgColor     = isOrange ? DS.amberBg : DS.redBg;
          const textColor   = isOrange ? DS.saddleBrown : DS.darkRed;

          return (
            <div key={h.id} style={{ borderRadius: 10, border: `1.5px solid ${isOpen ? borderColor : DS.border}`, overflow: "hidden", backgroundColor: DS.white }}>
              <button
                onClick={() => toggle(h.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "15px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: DS.sageLight, width: 22, flexShrink: 0 }}>{h.id}</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: isOrange ? DS.amber : DS.darkRed, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: DS.deepForest }}>{h.title}</span>
                <span style={{ color: DS.sageLight, flexShrink: 0 }}>{isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 20px 20px", backgroundColor: bgColor }}>
                  <p style={{ fontSize: 14, color: DS.deepForest, lineHeight: 1.8, margin: "14px 0 14px" }}>{h.content}</p>
                  <div style={{ backgroundColor: DS.white, borderRadius: 8, padding: "14px 16px", border: `1px solid ${borderColor}33` }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: textColor, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Business Impact</p>
                    <p style={{ fontSize: 13, color: DS.deepForest, lineHeight: 1.65, margin: 0 }}>{h.impact}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── DATA SECTION CONTENT ────────────────────────────────────────────────────
const MDM_GAPS = [
  {
    ref: "Residence Reference",
    severity: "red" as const,
    detail: "No unique identifier links a given residence across Agesoft, Sage, Lucas, and the ARS/Departmental portals. The list of residences was requested from 4 separate departments — 4 different lists were returned, ranging from 75 to 120 establishments depending on the source. Monthly group reporting is produced manually by a single Controller in Excel.",
    impact: "Impossible to determine real-time occupancy rates or per-residence profitability. The reference discrepancy alone blocks any reliable group dashboard.",
  },
  {
    ref: "Supplier Reference",
    severity: "red" as const,
    detail: "Approximately 4,000 active third-party suppliers in Sage, with frequent duplicates and no normalization. No PO/invoice/delivery matching is structurally possible without a clean supplier master.",
    impact: "Prevents any P2P automation. Yooz cannot reconcile invoices against purchase orders without a deduplicated supplier reference.",
  },
  {
    ref: "Employee Reference",
    severity: "orange" as const,
    detail: "No unique group employee ID in Lucas. HR data is retransmitted manually to Cegid Paie each month. No single source of truth for headcount, org chart, or training records across 120 residences.",
    impact: "Monthly payroll data transfer is entirely manual — source of recurring errors and corrections. Makes any group workforce analytics impossible.",
  },
  {
    ref: "Resident & Care Contract Reference",
    severity: "orange" as const,
    detail: "Resident records and care contracts (contrats de séjour) are not unified between Agesoft and Salesforce. Admission requests tracked in Salesforce cannot be reconciled with actual admissions in Agesoft.",
    impact: "Real conversion rate from admission request to admission is unknown. Impossible to calculate accurate pipeline-to-occupancy metrics.",
  },
];

const MEDALLION_LAYERS = [
  {
    tier: "BRONZE", color: "#92400E", bg: "#FEF3C7",
    label: "Raw Layer — Ingestion",
    items: ["Agesoft → DataHub (admissions, attendance, billing)", "Sage → DataHub (accounting, supplier, cost centers)", "Lucas → DataHub (employees, absences, training)", "Salesforce → DataHub (leads, pipeline, contracts)", "Kyriba → DataHub (treasury, cash, payments)"],
  },
  {
    tier: "SILVER", color: "#374151", bg: "#F3F4F6",
    label: "Cleansed Layer — Master Data",
    items: ["Unique Residence ID (Group identifier)", "Deduplicated supplier reference", "Unified employee master (Lucas + Cegid)", "ARS/Departmental tariff reference per residence", "Data quality rules validated by business owners"],
  },
  {
    tier: "GOLD", color: "#854D0E", bg: "#FEF9C3",
    label: "Reporting Layer — Business Value",
    items: ["Occupancy rate dashboard — per residence, per DR, group", "P&L / EBITDA by residence and consolidated", "Rolling reforecast 3+9 — automated from Sage", "Investor reporting (consolidated EBITDA)", "Alerts: frozen beds, carer ratios, overdue ARS declarations, payment delays"],
  },
];

// ─── AI SECTION CONTENT ───────────────────────────────────────────────────────
const AI_PRIORITY = [
  {
    title: "M365 Copilot — Support Functions",
    roi: "~30–50 min/person/day",
    horizon: "P1",
    detail: "Deploy on Finance, HR, and executive teams for drafting, meeting summaries, and document analysis. Immediate ROI — no data infrastructure required. Start with a pilot of 20 users, measure and expand.",
  },
  {
    title: "Automated Bank Reconciliation (Kyriba / Sage)",
    roi: "~2–3 FTE freed (~150–200K€/yr)",
    horizon: "P1",
    detail: "AI-assisted payment matching between Kyriba and Sage to eliminate manual reconciliation of ~80 bank accounts. Prerequisite: Kyriba/Sage integration must be live. Highest ROI quick win identified in the audit.",
  },
  {
    title: "AI-Assisted Public Tender Responses (DSP / AO)",
    roi: "~50 days/year saved",
    horizon: "P2",
    detail: "Automate the drafting of technical memoranda for public procurement calls (DSP). The commercial team currently spends ~50 days/year on these documents. An AI assistant trained on past winning bids would cut this by 60–70%.",
  },
  {
    title: "Commercial Meeting Summary Assistant",
    roi: "~1h30/sales rep/day",
    horizon: "P2",
    detail: "Reduce manual CRM data entry — currently ~1h30 of note-taking and Salesforce updates per commercial per day. AI transcription and structured CRM push via Salesforce integration eliminates this entirely.",
  },
  {
    title: "ARS Declaration Monitoring Assistant",
    roi: "Regulatory compliance",
    horizon: "P2",
    detail: "Centralize and automate ARS/Departmental declaration tracking with automated alerts per residence. As of March 2026, only 20% of residences submitted on time. An AI assistant with automated reminders would structurally resolve the non-compliance pattern.",
  },
];

const AI_LONGTERM = [
  {
    title: "Salesforce Einstein — Renewal Risk Scoring",
    detail: "Score institutional contracts and DSP partnerships by renewal risk. Feed the commercial team with prioritized retention alerts 6 months before contract expiry.",
  },
  {
    title: "Room Availability Prediction (3–6 months)",
    detail: "Anticipate resident entries and exits using historical patterns and current care records in Agesoft. Feed real-time projected availability into the Salesforce commercial pipeline.",
  },
  {
    title: "Carer-to-Resident Ratio Predictive Alerts",
    detail: "Detect in advance residences at risk of regulatory non-compliance on staffing ratios. Enable proactive scheduling adjustments before ARS inspection windows.",
  },
  {
    title: "Partner Residence Matching Engine",
    detail: "Automatically route admission requests to the most suitable partner residence based on care profile, geographic proximity, and real-time availability.",
  },
  {
    title: "Predictive Occupancy Rate (per residence, 3-month horizon)",
    detail: "Anticipate occupancy trends per residence to pre-trigger commercial actions. Feed the occupancy prediction model from Agesoft attendance data and historical discharge patterns.",
  },
  {
    title: "Accounting Anomaly Detection (Sage)",
    detail: "Automated alerts on unusual patterns in financial data — duplicate payments, abnormal supplier transactions, budget overruns. Reduce audit workload and financial risk.",
  },
];

// ─── SECTION 04 — DATA ───────────────────────────────────────────────────────
const DataSection = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [subTab, setSubTab] = useState<"architecture" | "mdm" | "target">("architecture");

  const SUB_TABS = [
    { id: "architecture" as const, label: "Current Architecture" },
    { id: "mdm"          as const, label: "Master Data Gaps"     },
    { id: "target"       as const, label: "Target Architecture"  },
  ];

  const ESB_SOURCES = ["Salesforce", "Sage", "Agesoft", "Lucas", "Kyriba"];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <span style={labelStyle}>Section 04</span>
        <h1 style={h1Style}>Data</h1>
      </div>

      <SubTabBar tabs={SUB_TABS} active={subTab} onChange={setSubTab} isMobile={isMobile} />

      {/* ── Current Architecture ── */}
      {subTab === "architecture" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, padding: 28 }}>
            <p style={{ ...labelStyle, marginBottom: 20 }}>Current Data Flow — ESB Architecture</p>
            {/* Visual ESB diagram */}
            <div style={{ backgroundColor: DS.lightGrey, borderRadius: 12, padding: 28 }}>
              {/* Sources row */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 16 }}>
                {ESB_SOURCES.map(s => (
                  <div key={s} style={{ backgroundColor: DS.white, border: `1.5px solid ${DS.border}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: DS.deepForest, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>{s}</div>
                ))}
              </div>
              {/* Arrows down */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 6 }}>
                {ESB_SOURCES.map(s => <div key={s} style={{ width: 80, textAlign: "center", color: DS.sageLight, fontSize: 18 }}>↓</div>)}
              </div>
              {/* ESB box */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                <div style={{ backgroundColor: DS.amberBg, border: `2px solid ${DS.amber}`, borderRadius: 10, padding: "14px 32px", textAlign: "center" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: DS.saddleBrown, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>In-house ESB / DataHub</p>
                  <p style={{ fontSize: 12, color: DS.saddleBrown, margin: 0 }}>JavaScript · 1 developer · undocumented · no monitoring</p>
                </div>
              </div>
              {/* Arrow down */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                <div style={{ color: DS.sageLight, fontSize: 18 }}>↓</div>
              </div>
              {/* Power BI */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ backgroundColor: DS.redBg, border: `2px solid ${DS.darkRed}44`, borderRadius: 10, padding: "14px 32px", textAlign: "center" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: DS.darkRed, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>Power BI / MS Fabric</p>
                  <p style={{ fontSize: 12, color: DS.darkRed, margin: 0 }}>On standby — no validated data sources</p>
                </div>
              </div>
            </div>
          </div>
          {/* Risk callouts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Single point of failure", detail: "The entire group data pipeline relies on one developer with no backup, no documentation, and no high-availability setup. Any absence creates a full reporting blackout.", sev: "red" as const },
              { label: "No real-time monitoring", detail: "No alerting system exists on data flow failures. A broken sync between Agesoft and the DataHub can go unnoticed for days before being detected manually.", sev: "red" as const },
              { label: "Manual BI exports", detail: "Power BI / MS Fabric dashboards are fed through manual exports — there is no automated pipeline from the DataHub to the reporting layer.", sev: "orange" as const },
              { label: "200K€+ invested in BI with no output", detail: "Multiple BI investment rounds have been made without a stable data foundation. Dashboards remain on standby pending a reliable and documented source layer.", sev: "orange" as const },
            ].map(r => {
              const isRed = r.sev === "red";
              return (
                <div key={r.label} style={{ backgroundColor: isRed ? DS.redBg : DS.amberBg, borderRadius: 10, padding: 16, border: `1px solid ${isRed ? DS.darkRed + "33" : DS.amber + "33"}` }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: isRed ? DS.darkRed : DS.saddleBrown, margin: "0 0 6px" }}>{r.label}</p>
                  <p style={{ fontSize: 12, color: DS.textGrey, margin: 0, lineHeight: 1.6 }}>{r.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MDM Gaps ── */}
      {subTab === "mdm" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 14, color: DS.textGrey, lineHeight: 1.7, margin: "0 0 8px" }}>
            No master data management system exists across the Group. Each application has independently generated its own identifiers with no cross-reference table between systems. This is the single most critical blocker for any BI, reporting, or AI initiative.
          </p>
          {MDM_GAPS.map(g => {
            const isRed = g.severity === "red";
            return (
              <div key={g.ref} style={{ backgroundColor: DS.white, borderRadius: 10, border: `1.5px solid ${isRed ? DS.darkRed + "44" : DS.amber + "44"}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", backgroundColor: isRed ? DS.redBg : DS.amberBg, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: isRed ? DS.darkRed : DS.amber }} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: isRed ? DS.darkRed : DS.saddleBrown, margin: 0 }}>{g.ref}</p>
                </div>
                <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Finding</p>
                    <p style={{ fontSize: 13, color: DS.textGrey, lineHeight: 1.65, margin: 0 }}>{g.detail}</p>
                  </div>
                  <div style={{ borderLeft: `1px solid ${DS.border}`, paddingLeft: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Business Impact</p>
                    <p style={{ fontSize: 13, color: DS.textGrey, lineHeight: 1.65, margin: 0 }}>{g.impact}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Target Architecture ── */}
      {subTab === "target" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 14, color: DS.textGrey, lineHeight: 1.7, margin: "0 0 8px" }}>
            The recommended target architecture follows a medallion model — three progressive data layers that transform raw source data into business-ready reporting. Each layer must be validated before the next is built.
          </p>
          {MEDALLION_LAYERS.map((layer, i) => (
            <div key={layer.tier} style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", backgroundColor: layer.bg, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ backgroundColor: layer.color, color: DS.white, fontSize: 11, fontWeight: 800, borderRadius: 6, padding: "3px 10px", letterSpacing: "0.1em" }}>{layer.tier}</span>
                <p style={{ fontSize: 13, fontWeight: 700, color: layer.color, margin: 0 }}>{layer.label}</p>
                {i < 2 && <span style={{ marginLeft: "auto", fontSize: 20, color: layer.color }}>→</span>}
              </div>
              <div style={{ padding: "14px 20px" }}>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {layer.items.map((item, j) => (
                    <li key={j} style={{ display: "flex", gap: 8, fontSize: 13, color: DS.textGrey, lineHeight: 1.5 }}>
                      <span style={{ color: DS.sage, flexShrink: 0 }}>·</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div style={{ backgroundColor: DS.deepForest, borderRadius: 12, padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Sequencing Principle</p>
            <p style={{ fontSize: 14, color: DS.white, lineHeight: 1.75, margin: 0 }}>
              Bronze must be documented and stable before Silver is built. Silver master data references must be validated by business owners before Gold dashboards are activated. This sequencing is non-negotiable — skipping layers is what led to the current 200K€+ BI investment with no output.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SECTION 06 — AI ─────────────────────────────────────────────────────────
const AISection = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <span style={labelStyle}>Section 06</span>
        <h1 style={h1Style}>Artificial Intelligence</h1>
      </div>

      {/* Guiding principle */}
      <div style={{ backgroundColor: DS.deepForest, borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 10px" }}>Guiding Principle</p>
        <p style={{ fontSize: 14, color: DS.white, lineHeight: 1.8, margin: 0 }}>
          The Group must not wait for a perfect data system before launching its first AI use cases. The right approach is to start from available data, begin small, validate before scaling, and systematically measure ROI. <strong style={{ color: DS.sage }}>AI governance must be established before any deployment.</strong>
        </p>
      </div>

      {/* Governance */}
      <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, padding: 24, marginBottom: 20 }}>
        <p style={labelStyle}>AI Governance — Prerequisites</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { n: "01", text: "Define the Group AI usage policy: authorized data types, validated tools, prohibited use cases (resident data, health records, personal data under GDPR)." },
            { n: "02", text: "Appoint a Group AI lead (within DSI or a dedicated function) to steer experiments, track ROI, and manage vendor relationships." },
            { n: "03", text: "Establish a quarterly AI committee to validate use cases, review outcomes, and prioritize the roadmap." },
            { n: "04", text: "Deploy a short prompt engineering training module (4h) for all office-based staff — delivered via RiseUp." },
            { n: "05", text: "Frame GDPR compliance on health and resident data before any AI use case touches care records or clinical data." },
          ].map(g => (
            <div key={g.n} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 16px", backgroundColor: DS.lightGrey, borderRadius: 8 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: DS.deepForest, color: DS.white, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{g.n}</span>
              <p style={{ fontSize: 13, color: DS.textGrey, lineHeight: 1.6, margin: 0 }}>{g.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority use cases */}
      <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, padding: 24, marginBottom: 20 }}>
        <p style={labelStyle}>Priority Use Cases — Click for details</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {AI_PRIORITY.map((uc, i) => {
            const isOpen = selected === i;
            const isP1 = uc.horizon === "P1";
            return (
              <div key={i} style={{ borderRadius: 10, border: `1.5px solid ${isOpen ? DS.forestMed : DS.border}`, overflow: "hidden" }}>
                <button onClick={() => setSelected(isOpen ? null : i)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 20, backgroundColor: isP1 ? DS.redBg : DS.amberBg, color: isP1 ? DS.darkRed : DS.saddleBrown, flexShrink: 0 }}>{uc.horizon}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: DS.deepForest }}>{uc.title}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: DS.forestMed, backgroundColor: "#E6F2EC", borderRadius: 20, padding: "3px 10px", flexShrink: 0 }}>{uc.roi}</span>
                  <span style={{ color: DS.sageLight, flexShrink: 0 }}>{isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 18px 18px", backgroundColor: DS.lightGrey, borderTop: `1px solid ${DS.border}` }}>
                    <p style={{ fontSize: 14, color: DS.textGrey, lineHeight: 1.75, margin: "14px 0 0" }}>{uc.detail}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Long-term use cases */}
      <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, padding: 24 }}>
        <p style={labelStyle}>Long-Term Use Cases (P3 Horizon)</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {AI_LONGTERM.map((uc, i) => (
            <div key={i} style={{ backgroundColor: DS.lightGrey, borderRadius: 8, padding: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: DS.deepForest, margin: "0 0 6px" }}>{uc.title}</p>
              <p style={{ fontSize: 12, color: DS.textGrey, lineHeight: 1.6, margin: 0 }}>{uc.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── PROCESS SECTION DATA ────────────────────────────────────────────────────
type ProcStatus = "ok" | "partial" | "ko";
const PROC_STATUS: Record<ProcStatus, { label: string; dot: string; color: string; bg: string }> = {
  ok:      { label: "Operational", dot: "#22C55E", color: "#166534", bg: "#DCFCE7" },
  partial: { label: "Partial",     dot: DS.amber,  color: DS.saddleBrown, bg: DS.amberBg },
  ko:      { label: "Broken",      dot: DS.darkRed, color: DS.darkRed, bg: DS.redBg },
};
const ProcChip = ({ s }: { s: ProcStatus }) => {
  const c = PROC_STATUS[s];
  return <span style={{ fontSize: 11, fontWeight: 600, color: c.color, backgroundColor: c.bg, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>{c.label}</span>;
};
const RecTag = ({ type }: { type: "QUICK WIN" | "LONG TERM" }) => (
  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, backgroundColor: type === "QUICK WIN" ? "#DCFCE7" : "#DBEAFE", color: type === "QUICK WIN" ? "#166534" : "#1E40AF", flexShrink: 0, whiteSpace: "nowrap" }}>{type}</span>
);

// ── COMMERCIAL DATA ───────────────────────────────────────────────────────────
const COMMERCIAL_OVERVIEW: { process: string; status: ProcStatus; tools: string; issue: string }[] = [
  { process: "Lead sourcing & enrichment",              status: "partial", tools: "Salesforce, N8N",           issue: "100% manual enrichment — ~15 min/lead, no API connector"         },
  { process: "Admission request pipeline (B2C)",        status: "ko",      tools: "Excel, Salesforce",         issue: "Tracked outside Salesforce in a shared Excel file"               },
  { process: "Room availability visibility",            status: "ko",      tools: "Agesoft, phone",            issue: "No real-time data — requires calling each residence director"     },
  { process: "Salesforce CRM daily usage",              status: "partial", tools: "Salesforce",                issue: "Outlook sync broken, email disabled, manual CR entry ~1h30/day"  },
  { process: "B2B lead nurturing",                      status: "ko",      tools: "Plezi (inactive)",          issue: "Plezi configured but never launched — zero B2B automation"       },
  { process: "Public tender pipeline (DSP / AO)",       status: "ko",      tools: "Double Thread, Salesforce", issue: "No DSP object in Salesforce — pipeline entirely untraceable"     },
  { process: "Tender documentation drafting",           status: "partial", tools: "Word, SharePoint",          issue: "~50 days/year spent on manual mémoire writing"                   },
  { process: "EHPAD partner referral management",       status: "ko",      tools: "Phone, email",              issue: "6-week matching delay, no automated availability alerts to partners" },
  { process: "Institutional contract billing (B2B)",    status: "partial", tools: "Sage, Salesforce",          issue: "100% manual invoice verification before sending — 30min to 4h/client" },
];

const FIELD_SALES = {
  title: "Field Sales & Admission Pipeline",
  subtitle: "Commercial managers responsible for filling residences — individual admission requests (B2C) and institutional referrals (hospitals, CLIC, social services).",
  context: "Each regional commercial manager handles the admission pipeline for their residences. Admission requests come from multiple channels: web form, phone, Salesforce lead flow, and direct referrals from partner institutions. The target is to minimize time-to-admission and maximize occupancy rate.",
  dysfonctionnements: [
    "Lead enrichment is 100% manual — approximately 15 minutes per lead to fill company/contact data from public sources. With hundreds of leads per month group-wide, this represents hundreds of hours of non-value-added work.",
    "The Salesforce lead scoring threshold (set to 85 points) systematically blocks incoming leads, which typically reach only 15 points on arrival. Commercial managers must manually override the score to access their leads.",
    "Admission requests (B2C) are not managed in Salesforce. A shared Excel file with 400+ active dossiers is used instead — no traceability, no conversion tracking, no historical data.",
    "Outlook synchronization is broken in Salesforce. Commercial managers manually copy/paste meeting notes into CRM, representing approximately 1h30 per person per day of non-value-added data entry.",
    "Room availability is unknown in real time. To confirm a room is available before completing an admission process, commercial managers must call the residence director — creating delays and frequent missed placements.",
    "Plezi (B2B marketing automation) has been fully configured but never launched. B2B lead nurturing is entirely absent from the commercial process.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Connect the Pappers API to Salesforce to auto-enrich company leads — eliminate the 15 min/lead manual enrichment task." },
    { type: "QUICK WIN" as const, text: "Reconfigure Salesforce lead scoring: lower the conversion threshold, allow opportunity creation directly from an existing account." },
    { type: "QUICK WIN" as const, text: "Repair Outlook synchronization in Salesforce — restore automatic meeting and email logging to eliminate ~1h30/day of manual CRM entry." },
    { type: "QUICK WIN" as const, text: "Activate automated Agesoft alerts on room status changes (admission confirmed, discharge notified) and push them into Salesforce." },
    { type: "LONG TERM" as const, text: "Build the Agesoft ↔ Salesforce API integration to expose real-time room availability per residence directly in the commercial pipeline." },
    { type: "LONG TERM" as const, text: "Deploy an admission pipeline dashboard in Salesforce: lead-to-admission conversion rate, average time-to-placement, occupancy impact per commercial." },
    { type: "LONG TERM" as const, text: "Launch Plezi and connect it to Salesforce to activate B2B lead nurturing flows toward referring institutions (hospitals, CLIC, CCAS)." },
  ],
};

const MARCHES_PUBLICS = {
  title: "Public Tenders & DSP Contracts",
  subtitle: "~50 public tender responses per year — DSP contracts represent 50% of group revenue, with 5–10 year durations and 2–3 year sales cycles.",
  context: "The public tender and DSP (Délégation de Service Public) commercial track is the Group's largest revenue driver. Contract renewals require multi-year anticipation. The team uses Double Thread for tender monitoring and Salesforce for pipeline tracking — with no native integration between the two.",
  dysfonctionnements: [
    "50–70% of DSP renewal losses are directly linked to operational dysfunction — primarily payroll issues (Lucas/Agesoft interface failures) that surface during tender evaluation by public authorities. The commercial team cannot compensate for operational non-performance at renewal stage.",
    "No 'DSP' or 'AO' object exists in Salesforce. The public tender pipeline is entirely untraceable — no visibility on which tenders are in progress, at what stage, or with what win probability.",
    "Tender monitoring in Double Thread is not connected to Salesforce. Every alert requires manual double-entry: Double Thread → Salesforce. This creates data gaps and monitoring delays.",
    "Tender documentation (mémoires techniques) is produced manually from scratch for each AO, with no shared repository of reusable content blocks. The team estimates ~50 days/year spent on documentation writing.",
    "No post-loss analysis process exists. When a tender is lost, there is no structured review of reasons, no scoring of competing offers, and no feedback loop to improve future submissions.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Create a 'DSP / Public Tender' object in Salesforce with fields: tender type, contracting authority, submission deadline, contract duration, status, win probability." },
    { type: "QUICK WIN" as const, text: "Connect Double Thread to Salesforce via N8N or Zapier — automate the push of new tender alerts into Salesforce opportunities without manual re-entry." },
    { type: "QUICK WIN" as const, text: "Build a structured post-loss analysis template and systematize it after every lost tender. Feed a shared learnings repository for future submissions." },
    { type: "LONG TERM" as const, text: "Deploy an AI assistant for tender memorandum drafting — trained on past winning bids. Estimated savings: 60–70% of the ~50 days/year currently spent on documentation." },
    { type: "LONG TERM" as const, text: "Build a DSP pipeline dashboard: active tenders by region, renewal calendar for existing DSP contracts, win rate by authority type." },
  ],
};

const EHPAD_PARTENAIRES = {
  title: "Partner Residences & Referral Network",
  subtitle: "Network of partner residences and institutional referrers (hospitals, CLIC, CCAS, social workers) that route admission requests to Group residences.",
  context: "The Group relies on a network of institutional partners — hospitals, CLIC (Centres Locaux d'Information et de Coordination), CCAS, and social workers — who refer individuals needing EHPAD placement. The matching process between an admission request and an available room currently takes 4–6 weeks due to the absence of real-time availability data.",
  dysfonctionnements: [
    "The average matching time between an admission request from a partner institution and an available room is 4–6 weeks. This delay is caused entirely by the absence of real-time room availability data — the commercial team must call each residence director individually to check availability.",
    "No automated reporting is sent to partner institutions on the status of their referrals. Partners have no visibility after submitting a referral, leading to frustration and referral diversion to competing EHPAD operators.",
    "Partner satisfaction is not measured. There is no NPS, no feedback loop, and no tracking of referral volume per partner over time. High-value partners are not identified or prioritized.",
    "No automated room availability alerts are sent to partner networks. When a room becomes available, partners are not proactively notified — the Group loses potential admissions to faster competitors.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Set up automated email alerts to key partner institutions when a room becomes available — triggered by Agesoft admission status changes via N8N." },
    { type: "QUICK WIN" as const, text: "Send monthly partner performance reports: referral volume, admission conversion rate, average placement time. Build partner loyalty through transparency." },
    { type: "QUICK WIN" as const, text: "Create a 'Partner Institution' object in Salesforce with referral tracking — volume, type, conversion, geographic coverage." },
    { type: "LONG TERM" as const, text: "Build a partner portal (via Softr.io or Salesforce Experience Cloud) giving partner institutions real-time visibility on room availability by residence and care profile." },
    { type: "LONG TERM" as const, text: "Deploy an AI-assisted matching engine: automatically match incoming admission requests with the most suitable available room based on care profile, geography, and availability." },
  ],
};

// ── FINANCE DATA ─────────────────────────────────────────────────────────────
const FINANCE_OVERVIEW: { process: string; status: ProcStatus; tools: string; issue: string }[] = [
  { process: "Purchasing & purchase orders", status: "ko",      tools: "None",              issue: "No PO tool — managers commit spend with no budget validation"          },
  { process: "Invoice dematerialization",    status: "partial", tools: "Yooz, Sage",        issue: "Yooz covers 70% of invoices; 30% manually entered in Sage"             },
  { process: "Resident billing (Soins / Dépendance)", status: "partial", tools: "Agesoft", issue: "Billing rules not centralized — per-residence inconsistencies"         },
  { process: "Resident payment collection",  status: "ko",      tools: "Turbo, Kyriba",     issue: "Turbo and Kyriba co-exist — no confirmed Turbo decommission date"      },
  { process: "ARS/Departmental declarations",status: "ko",      tools: "Manual",            issue: "100% manual — 20% of residences compliant at March 31 deadline"       },
  { process: "Payroll",                      status: "partial", tools: "Cegid, Lucas",      issue: "Lucas/Cegid interface broken — monthly data transferred manually"       },
  { process: "Monthly financial close",      status: "ko",      tools: "Sage, Excel",       issue: "Close takes several weeks beyond standards — target is D+5"            },
  { process: "Group reporting",              status: "ko",      tools: "Excel",             issue: "Manual consolidation by one Controller — Power BI on standby"          },
];

const FINANCE_ACHATS = {
  title: "Purchasing & Purchase Orders",
  subtitle: "Procurement process across ~4,000 active suppliers — no purchase order system exists anywhere in the Group.",
  context: "Residence directors and department heads can engage suppliers and commit spend without any prior validation or budget check. There is no purchase order tool. Yooz handles invoice dematerialization for 70% of incoming invoices, but cannot match invoices to orders because no orders exist in the system. 30% of invoices are still entered manually in Sage.",
  dysfonctionnements: [
    "No purchase order tool exists — residence managers can commit spend across ~4,000 active suppliers with no budget validation and no approval workflow. Financial commitments are discovered at invoice stage, not at order stage.",
    "Yooz covers approximately 70% of supplier invoices — the remaining 30% are manually entered into Sage, representing a significant source of input errors and delays in the accounting close.",
    "The supplier master in Sage contains ~4,000 active third-party records with frequent duplicates and no normalization. Invoice-to-PO matching is structurally impossible without a clean supplier reference and a PO system.",
    "No spend analytics exist. Without POs, it is impossible to track committed spend versus invoiced spend, identify budget overruns in real time, or consolidate purchasing power at group level.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Deploy a simple purchase order module — either via Sage or Yooz — mandatory for all residence managers above a defined spend threshold (e.g., 500€)." },
    { type: "QUICK WIN" as const, text: "Extend Yooz to cover 100% of supplier invoices — eliminate all manual entries in Sage. This is a prerequisite for full invoice-to-PO matching." },
    { type: "LONG TERM" as const, text: "Deploy a full P2P (purchase-to-pay) solution integrated with Sage and Yooz. Define supplier categories, approval thresholds, and a group-level preferred supplier list." },
    { type: "LONG TERM" as const, text: "Deduplicate and normalize the ~4,000 supplier records in Sage. This supplier master becomes the Bronze layer reference for all procurement analytics." },
  ],
};

const FINANCE_FACTURATION = {
  title: "Billing — Resident & Institutional",
  subtitle: "Three billing streams: resident billing (Section Soins / Dépendance via Agesoft), institutional billing (B2B via Sage/Salesforce), and ARS/Departmental declarations.",
  context: "Resident billing is the most complex stream — tariffs vary by residence, by GIR group, and by funding type (Section Soins, Tarif Dépendance, Tarif Hébergement). These rules are managed locally in Agesoft, inconsistently applied, and are the root cause of frequent billing corrections. ARS/Departmental declarations, which determine the Group's funding allocations, are produced 100% manually with structural non-compliance.",
  dysfonctionnements: [
    "Billing rules for Section Soins and Tarif Dépendance are not centralized in Agesoft. Each residence manages its own configuration, leading to inconsistencies, billing errors, and frequent manual corrections that delay the accounting close.",
    "ARS and Departmental authority declarations are produced 100% manually with no digital tools. As of March 31, 2026, only 20% of residences had submitted declarations on time. This structural non-compliance creates a direct risk to the Group's funding allocations.",
    "Turbo and Kyriba co-exist for resident payment collection — Turbo is the legacy tool, Kyriba is the target. The migration has no confirmed end date, forcing the finance team to operate two systems in parallel.",
    "CIEL is still used for manual billing on a residual perimeter that has not been migrated. This creates a third billing system in the finance stack with no integration to Sage.",
    "Institutional invoice verification (B2B) is 100% manual before sending — 30 minutes to 4 hours per client depending on complexity, with no automated matching against the Salesforce contract.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Centralize all Section Soins and Dépendance billing rules in Agesoft — create a group-level configuration template per residence type and fund it with the finance team." },
    { type: "QUICK WIN" as const, text: "Urgently audit ARS declaration status across all 120 residences. Deploy a catch-up plan and formalize a mandatory submission calendar with automated reminders." },
    { type: "QUICK WIN" as const, text: "Set a firm Turbo decommission date. Complete the Kyriba migration for all residences — eliminate the dual-system overhead for resident payment collection." },
    { type: "LONG TERM" as const, text: "Automate ARS/Departmental declaration generation from Agesoft attendance and billing data — reduce manual effort by 80% and structurally eliminate late submissions." },
    { type: "LONG TERM" as const, text: "Connect Salesforce contracts to Sage billing — automate institutional invoice generation and verification from the signed contract data." },
  ],
};

const FINANCE_PAIE = {
  title: "Payroll",
  subtitle: "Payroll outsourced to Cegid Paie — disconnected from Lucas HRIS. Monthly data transfer is entirely manual.",
  context: "The Group's payroll is processed by Cegid Paie on an outsourced basis. The Lucas HRIS was supposed to serve as the upstream source for variable payroll data (absences, overtime, agency hours). The Lucas/Cegid interface was never made operational — every month, the HR team manually extracts data from Lucas and re-enters it into Cegid's input templates.",
  dysfonctionnements: [
    "The Lucas ↔ Cegid Paie interface is not functional. Every month, HR managers manually extract variable data from Lucas (absences, overtime, shift adjustments) and re-enter it into Cegid's Excel input templates. This takes several days and is the primary source of payroll errors.",
    "There is no connection between the scheduling/planning tool and payroll. Agency staff hours, validated absences, and overtime are all entered manually from paper records or local Excel files — with no audit trail.",
    "Payroll corrections are frequent and require Cegid to reprocess batches, creating delays in payslip delivery and employee dissatisfaction, particularly among care staff.",
    "The absence of a Lucas/Cegid interface also means that the HR team cannot trust Lucas as a source of record for headcount or cost reporting — the payroll system and the HRIS contain inconsistent employee data.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Automate the Lucas → Cegid Paie monthly data transfer via API or structured file export. This is the single highest-impact HR quick win — eliminates manual re-entry and the root cause of most payroll errors." },
    { type: "QUICK WIN" as const, text: "Standardize the variable payroll data collection process across all residences — one shared input template, one submission deadline, one validation step per Regional Director." },
    { type: "LONG TERM" as const, text: "Connect the future WFM/scheduling tool to Lucas and Cegid Paie — automate the flow of scheduled hours, absences, and agency hours into payroll without any manual intervention." },
    { type: "LONG TERM" as const, text: "Build a payroll audit trail and anomaly detection layer — flag unusual payroll variations (headcount spikes, overtime outliers) before payroll is transmitted to Cegid." },
  ],
};

const FINANCE_REPORTING = {
  title: "Financial Reporting & Close",
  subtitle: "Monthly financial close and group reporting — fully manual, driven by a single Controller in Excel. Power BI dashboards on standby.",
  context: "The Group's monthly financial reporting is produced by a single Financial Controller who manually consolidates data from Sage, Kyriba, and residence-level Excel files. The monthly close process takes several weeks beyond market standards. Power BI and MS Fabric dashboards have been purchased and partially configured but remain on standby due to the absence of reliable, automated data sources.",
  dysfonctionnements: [
    "Monthly group P&L consolidation is performed manually by a single Controller in Excel — this creates a critical single point of failure, a lack of real-time visibility, and data that is always 3–4 weeks old before it reaches management.",
    "The monthly financial close consistently exceeds market standards. The root causes are multiple: no automated Kyriba/Sage reconciliation, no clear close calendar with assigned responsibilities, and late inputs from residence directors.",
    "The Group's budget and reforecast process is managed entirely in Excel with no consolidation tool. Bottom-up inputs from residences are collected via email and manually aggregated — no scenario modeling, no automated variance analysis.",
    "Power BI / MS Fabric dashboards were purchased and partially built but remain entirely on standby. The data sources were never documented or validated by the business, and the automated feed from the DataHub was never made operational.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Formalize a monthly close calendar — clear ownership per step, hard deadlines for each team, D+5 as the group target for management P&L delivery." },
    { type: "QUICK WIN" as const, text: "Activate Sage OData/ODBC access and build a direct Power BI connector — eliminate manual exports and produce the first automated financial dashboard within 30 days." },
    { type: "LONG TERM" as const, text: "Relaunch Power BI / MS Fabric with validated Silver-layer data sources. Build the group CDG dashboard: P&L by residence, by DR, and consolidated — updated daily." },
    { type: "LONG TERM" as const, text: "Deploy an FP&A tool (Pigment, Anaplan, or equivalent) for structured bottom-up budget consolidation, automated variance analysis, and rolling reforecast 3+9." },
  ],
};

// ── EHPAD OPS DATA ────────────────────────────────────────────────────────────
const EHPAD_OVERVIEW: { process: string; status: ProcStatus; tools: string; issue: string }[] = [
  { process: "Admission & care contract",       status: "partial", tools: "Agesoft, Salesforce, Excel", issue: "Requests tracked in Excel — no Salesforce/Agesoft bridge"        },
  { process: "Room availability visibility",    status: "ko",      tools: "Agesoft, phone",             issue: "No real-time data — requires calling each residence director"     },
  { process: "Care staff planning & staffing",  status: "ko",      tools: "Excel",                      issue: "All scheduling in Excel — no group tool, no inter-residence pool" },
  { process: "Quality & ARS compliance",        status: "partial", tools: "BlueKanGo, manual",          issue: "Audit modules partially configured — ARS tracking still manual"   },
];

const EHPAD_ADMISSION = {
  title: "Admission & Care Contract",
  subtitle: "End-to-end admission process — from initial request to signed care contract (contrat de séjour) and activated room in Agesoft.",
  context: "Admission requests arrive through multiple channels: the group website, phone, Salesforce lead flow, and institutional referrals from hospitals, CLIC, and social services. The target process should seamlessly connect the commercial pipeline (Salesforce) to the operational onboarding (Agesoft) — today these two systems are entirely disconnected, and the handoff between commercial and care operations is manual and error-prone.",
  dysfonctionnements: [
    "Admission requests are not managed in Salesforce. A shared Excel file containing 400+ active dossiers is used by the admission team — no conversion tracking, no dossier history, no visibility for management on pipeline-to-admission rates.",
    "Care contract (contrat de séjour) templates and billing rules (Section Soins, Tarif Dépendance, Tarif Hébergement) are not standardized across residences. Each residence director maintains their own version, leading to compliance inconsistencies and billing errors at admission.",
    "There is no operational handoff process between Salesforce (commercial stage) and Agesoft (care operations stage). When a commercial manager closes an admission, the residence director must manually re-enter all resident data into Agesoft from scratch.",
    "Document collection for admission dossiers (health records, APA entitlement, identity documents, insurance) is entirely paper-based and managed locally. No GED or structured checklist exists at group level.",
    "New resident onboarding is not standardized — the quality of the welcome process varies significantly between residences, with no structured protocol or digital workflow.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Move all admission requests into Salesforce — create a standardized 'Admission Request' object replacing the shared Excel file. Immediate gain in visibility and traceability." },
    { type: "QUICK WIN" as const, text: "Standardize the contrat de séjour template at group level and centralize billing rules (Section Soins, Dépendance, Hébergement) in Agesoft — one configuration template per residence type." },
    { type: "QUICK WIN" as const, text: "Define and document the commercial-to-care handoff protocol — clear responsibilities, data transfer checklist, and maximum handoff delay." },
    { type: "LONG TERM" as const, text: "Build the Salesforce ↔ Agesoft admission bridge via API: from signed care contract in Salesforce to automatically created resident record in Agesoft — eliminate all manual re-entry." },
    { type: "LONG TERM" as const, text: "Deploy a digital admission dossier via the GED/OCR tool — structured document checklist, automated completeness check, and secure family-facing upload portal." },
  ],
};

const EHPAD_DISPO = {
  title: "Room Availability",
  subtitle: "Real-time visibility on room availability across 120 residences — currently unknown without calling each residence director individually.",
  context: "The occupancy rate is the Group's primary operational and commercial KPI. Yet there is no real-time, consolidated view of room availability across the 120 residences. Commercial managers, regional directors, and the group management team all operate blind — relying on weekly phone rounds and manually updated Excel files. This invisibility directly costs the Group in missed admissions and delayed placements.",
  dysfonctionnements: [
    "Room availability is unknown in real time. To confirm whether a room is available before completing an admission, commercial managers must call each residence director individually. This creates delays of days to weeks and results in missed placements when a competitor responds faster.",
    "Frozen rooms (lits gelés — rooms temporarily taken out of service for renovation, sanitary reasons, or equipment maintenance) are not tracked systematically in Agesoft. The actual available bed count is unknown even to residence directors without a manual count.",
    "The commercial team has no forward visibility on projected availability (3–6 month horizon). Anticipated discharges and planned admissions exist in Agesoft but are never surfaced to the commercial pipeline — preventing proactive placement planning.",
    "The Group management has no consolidated occupancy dashboard. Monthly occupancy data is collected manually via email from regional directors, aggregated in Excel, and delivered with a 3–4 week lag.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Build a daily group occupancy dashboard from Agesoft data — available rooms, occupied rooms, frozen rooms, and occupancy rate per residence, per DR, and group total. Feed via the existing DataHub." },
    { type: "QUICK WIN" as const, text: "Set up automated alerts to commercial managers when a room becomes available in their perimeter — triggered by Agesoft discharge or room status change events via N8N." },
    { type: "QUICK WIN" as const, text: "Standardize the 'frozen room' status in Agesoft — mandatory field, reason code, and expected return-to-service date. Measure and track the frozen bed rate at group level." },
    { type: "LONG TERM" as const, text: "Integrate Agesoft availability data into Salesforce via API — give commercial managers a real-time room availability view directly inside their CRM, without switching tools." },
    { type: "LONG TERM" as const, text: "Deploy predictive occupancy modeling (AI) — anticipate availability 3–6 months ahead from discharge patterns, care contract end dates, and seasonal trends. Feed directly into the commercial pipeline." },
  ],
};

const EHPAD_PLANNING = {
  title: "Care Staff Planning & Staffing",
  subtitle: "Scheduling of care teams across 120 residences — entirely managed in Excel per residence, with no group-level tool and no inter-residence staff pooling.",
  context: "Care staff scheduling is a critical operational and regulatory challenge for EHPAD operators. Staffing ratios (soignants/résidents) are regulated and inspected by the ARS. Today, all planning is done locally in Excel by each residence director — with no visibility at regional or group level, no inter-residence staff pooling, and no connection between planning and payroll.",
  dysfonctionnements: [
    "All care staff scheduling is done manually in Excel at residence level. There is no group planning tool. Regional directors have no consolidated view of staffing levels, planned absences, or coverage gaps across their residences.",
    "Inter-residence staff pooling is structurally impossible without a group planning tool. When a residence faces an unexpected absence, the director's only recourse is agency staffing — even when available staff from a nearby residence could cover the shift.",
    "The absence of a planning tool connected to payroll means that all variable hours (overtime, shift changes, agency hours) are manually communicated to HR each month, creating systematic errors in the Lucas/Cegid Paie transfer.",
    "The Group has no consolidated view of its staffing ratio (soignants/résidents) across residences and no early-warning system for residences approaching regulatory non-compliance thresholds.",
    "Agency staffing costs are structurally elevated due to the lack of anticipation. Last-minute agency requests attract premium rates and represent a material, avoidable cost driver across the network.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Deploy a group WFM/scheduling tool (Skello or Combo) across all 120 residences — replace Excel-based planning with a unified, connected platform. Start with a pilot on a region before rolling out group-wide." },
    { type: "QUICK WIN" as const, text: "Create an inter-residence replacement pool within the WFM tool — visible availability of off-duty staff across nearby residences, with a direct shift-offer workflow. Reduce last-minute agency staffing." },
    { type: "LONG TERM" as const, text: "Connect the WFM tool to Lucas and Cegid Paie — automate the transfer of worked hours, absences, and overtime into payroll. Eliminate all manual monthly HR data entry." },
    { type: "LONG TERM" as const, text: "Build a real-time staffing ratio dashboard from WFM + Agesoft data. Add AI-driven predictive alerts for residences approaching regulatory thresholds — enabling proactive scheduling adjustments before ARS inspection windows." },
  ],
};

const EHPAD_QUALITE = {
  title: "Quality & ARS Compliance",
  subtitle: "Quality management and ARS regulatory compliance across 120 residences — partially digitized via BlueKanGo, with structural gaps in process and tooling.",
  context: "The Group uses BlueKanGo as its quality management tool — covering EHPAD internal audits, adverse event (événement indésirable) reporting, and ARS compliance tracking. BlueKanGo is partially configured and unevenly used across residences. It is also being misused as an IT helpdesk, which degrades its utility for quality purposes and creates tool confusion for users.",
  dysfonctionnements: [
    "BlueKanGo's audit modules are only partially configured. EHPAD-specific audit templates do not cover all ARS inspection dimensions, and the tool is used inconsistently — some residences use it rigorously, others barely at all.",
    "BlueKanGo is currently used as an informal IT helpdesk by residence teams. This misuse clutters the quality database with non-quality events, and creates confusion between IT support requests and genuine quality incidents.",
    "Adverse events (événements indésirables) are not systematically recorded across all residences. Declarations depend on individual initiative rather than a structured, mandatory workflow — creating blind spots in the Group's safety monitoring.",
    "ARS inspection preparation relies on manual document gathering across multiple local systems and paper archives. There is no structured digital checklist or shared preparation protocol at group level.",
    "The Group has no consolidated quality dashboard. There is no real-time visibility on audit scores, adverse event frequency, or ARS compliance status across the 120 residences.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Clean up BlueKanGo immediately — remove all IT helpdesk misuse, reassign those users to a proper IT ticketing tool, and reconfigure the quality modules for EHPAD-specific audit coverage." },
    { type: "QUICK WIN" as const, text: "Deploy a mandatory adverse event (EI) declaration workflow in BlueKanGo — zero-tolerance policy for unreported events, supported by a short training module on RiseUp." },
    { type: "QUICK WIN" as const, text: "Create a standardized ARS inspection preparation checklist and document repository in the GED/OCR tool — shared across all residences, updated centrally." },
    { type: "LONG TERM" as const, text: "Build a consolidated quality and compliance dashboard from BlueKanGo + Agesoft data: audit scores per residence, EI frequency and trends, ARS compliance status, and inspection calendar." },
    { type: "LONG TERM" as const, text: "Connect BlueKanGo quality events to the AI alert layer — detect early signals of quality deterioration (rising EI rate, declining audit scores) before they escalate to ARS-reportable incidents." },
  ],
};

// ── HR DATA ───────────────────────────────────────────────────────────────────
const HR_OVERVIEW: { process: string; status: ProcStatus; tools: string; issue: string }[] = [
  { process: "Recruitment",          status: "partial", tools: "Lucas, email, Excel",  issue: "Lucas ATS deployed but not used — teams revert to email and spreadsheets"  },
  { process: "Onboarding",           status: "partial", tools: "PILA, Lucas",          issue: "IT kit not standardized — access, email, device vary by residence"          },
  { process: "Payroll administration",status: "partial", tools: "Lucas, Cegid Paie",   issue: "Lucas/Cegid interface broken — monthly variable data entered manually"       },
  { process: "Training",             status: "partial", tools: "RiseUp, Lucas",        issue: "RiseUp and Lucas disconnected — completions not visible in employee record"  },
];

const HR_RECRUITMENT = {
  title: "Recruitment",
  subtitle: "Recruitment across 120 residences — care roles represent the majority of volume, with structural high turnover making recruitment a continuous operational priority.",
  context: "The Lucas HRIS includes a full recruitment module (ATS) that was deployed but then placed on hold alongside the rest of the HRIS. In the absence of a functional ATS, HR managers and residence directors revert to email, phone, and Excel to manage applications. There is no group-level visibility on open positions, time-to-fill, or recruitment pipeline status.",
  dysfonctionnements: [
    "The Lucas recruitment module was deployed but is not used in practice — HR managers and residence directors manage all candidate flows via email and local Excel files. There is no group-wide ATS in operation.",
    "Job postings are published independently by each residence on external job boards, with no group-level campaign or employer brand consistency. The Group's employer brand is fragmented and unmanaged at network level.",
    "There is no standardized interview process or scoring grid across the Group. Interview quality and candidate evaluation criteria vary significantly between residences, making cross-residence comparison impossible.",
    "Time-to-fill metrics are not tracked. The Group has no visibility on how long it takes to fill a care role vacancy, which residences have chronic recruitment difficulties, or what the cost-per-hire is.",
    "High early turnover (within the first 3 months) in care roles is not monitored — its root causes are not analyzed, and no structured action plan exists to improve retention at the recruitment and onboarding stage.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Reactivate the Lucas recruitment module — deploy a targeted training session for HR managers and residence directors. Define a 3-month adoption target with clear metrics." },
    { type: "QUICK WIN" as const, text: "Standardize interview scoring grids per role type (care worker, nurse, residence director) and centralize them in Lucas. Enable cross-residence comparison of candidate quality." },
    { type: "QUICK WIN" as const, text: "Build a recruitment pipeline dashboard in Lucas: open positions, applications in progress, time-to-fill per role, and offer acceptance rate — updated weekly for the CHRO." },
    { type: "LONG TERM" as const, text: "Connect Lucas to external job boards (Indeed, APEC, France Travail) via API — single job posting in Lucas automatically distributed across all relevant channels." },
    { type: "LONG TERM" as const, text: "Develop a group employer brand strategy for care roles — dedicated landing page, video content, care-role specific EVP. Feed into the Lucas job posting flow." },
  ],
};

const HR_ONBOARDING = {
  title: "Onboarding",
  subtitle: "Employee onboarding via PILA — inconsistently applied across residences, with a non-standardized IT kit and thousands of frontline employees without professional email addresses.",
  context: "The Group uses PILA for onboarding and offboarding workflows. PILA is in place but its quality of execution varies significantly across residences. The most critical structural gap is that thousands of frontline care workers — nurses, care assistants, auxiliary staff — do not have a professional email address, making secure digital access and identity management structurally impossible for this population.",
  dysfonctionnements: [
    "The IT onboarding kit (professional email, device, application access) is not standardized across residences. New hires in some residences receive full digital access on Day 1; in others, they wait weeks. This inconsistency drives early frustration and disengagement.",
    "Thousands of frontline care workers do not have a professional email address. This prevents MFA enrollment, blocks Microsoft 365 rollout to care teams, and makes it impossible to enforce a consistent digital identity and access policy across the Group.",
    "PILA is deployed but its use is inconsistent — some residences follow the full onboarding workflow, others bypass it entirely. There is no compliance tracking on PILA task completion rates.",
    "Mandatory regulatory training (fire safety, AFGSU first aid, care protocol certifications) is not systematically scheduled or tracked at the point of onboarding. New hires may begin care duties before completing required certifications.",
    "The offboarding process has the same inconsistency issues — access revocation is not systematically enforced. The DocuSign audit identified 7 active admin accounts belonging to employees who had already left.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Standardize the Day 1 IT kit for all new hires — professional email, device assignment, and application access as a mandatory PILA task completed before the first day of work." },
    { type: "QUICK WIN" as const, text: "Roll out professional email addresses to all frontline care workers — this is a prerequisite for MFA, Microsoft 365 adoption, and secure identity management across the network." },
    { type: "QUICK WIN" as const, text: "Enforce PILA task completion tracking — generate a weekly report for HR managers on incomplete onboarding steps, with escalation for residences below 90% completion." },
    { type: "LONG TERM" as const, text: "Build a structured care-role onboarding track in RiseUp — mandatory modules (care protocols, resident rights, emergency procedures) auto-assigned on Day 1 in Lucas, completion tracked in the employee record." },
    { type: "LONG TERM" as const, text: "Connect PILA offboarding to Entra ID for automated access revocation — ensure zero access remains active for departed employees within 24h of departure confirmation." },
  ],
};

const HR_PAYROLL = {
  title: "Payroll Administration",
  subtitle: "Payroll outsourced to Cegid Paie — the Lucas/Cegid interface is non-functional, forcing a full manual data transfer every month across 120 residences.",
  context: "The Group's payroll is processed by Cegid Paie on an outsourced basis. Lucas HRIS was designed to be the upstream source for all variable payroll data (absences, overtime, shift changes, agency hours). The Lucas/Cegid interface was deployed but never made operational. Every month, HR managers at residence and regional level manually extract variable data and re-enter it into Cegid's input templates — a process that takes several days, generates systematic errors, and is the root cause of repeated payroll corrections.",
  dysfonctionnements: [
    "The Lucas ↔ Cegid Paie interface is not functional. Every monthly payroll cycle, HR managers manually extract variable data (absences, overtime, agency hours) from Lucas and re-enter it into Cegid's Excel input templates. This takes several days and is the primary source of payroll errors.",
    "There is no standardized variable data collection process across the 120 residences. Each residence submits inputs in different formats, on different timelines, to different HR contacts — creating a reconciliation challenge at the start of every payroll cycle.",
    "Payroll corrections are frequent, require Cegid to reprocess batches, and delay payslip delivery. For care staff paid monthly and often managing tight personal budgets, late or incorrect payslips are a significant retention risk.",
    "Because the Lucas/Cegid interface is broken, Lucas cannot be trusted as the source of record for headcount or labor cost reporting. The payroll system and the HRIS contain divergent employee data — making any group-level HR analytics structurally unreliable.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Automate the Lucas → Cegid Paie monthly data transfer via API or structured SFTP file — this is the single highest-impact HR quick win. Eliminates all manual re-entry and the root cause of most payroll errors." },
    { type: "QUICK WIN" as const, text: "Define and enforce a standardized variable data collection calendar: one input template, one submission deadline per residence, one regional HR validation step before transfer to Cegid." },
    { type: "LONG TERM" as const, text: "Connect the WFM/scheduling tool (Skello or Combo) to Lucas and then to Cegid Paie — fully automate the chain from worked shift to payroll entry, eliminating all manual intervention in the variable data flow." },
    { type: "LONG TERM" as const, text: "Build a payroll pre-validation layer — automated anomaly detection that flags unusual payroll variations (headcount spikes, overtime outliers, unexpected agency hours) before submission to Cegid." },
  ],
};

const HR_TRAINING = {
  title: "Training & Development",
  subtitle: "RiseUp LMS in place — disconnected from Lucas HRIS. Training completions not visible in employee records. Mandatory care certifications not consolidated at group level.",
  context: "The Group uses RiseUp as its LMS for online training delivery and Lucas as its HRIS for training plan management. The two tools are not connected. Training completion data in RiseUp is not reflected in the Lucas employee record, making it impossible to have a unified view of each employee's certification and development status. Mandatory care certifications (fire safety, AFGSU, care protocols) are tracked locally and inconsistently.",
  dysfonctionnements: [
    "RiseUp and Lucas are not connected — training completions recorded in RiseUp are not visible in the Lucas employee dossier. HR managers must manually cross-reference the two systems to produce any training compliance report.",
    "The annual training plan is not integrated into Lucas HR KPIs or the performance management cycle. Training budget per residence is not tracked systematically — making it impossible to measure training ROI or optimize spend across the network.",
    "Mandatory regulatory training compliance (fire safety, AFGSU first aid, care protocol certifications) is tracked locally by each residence in Excel. There is no consolidated group dashboard on certification compliance, and expiry dates are not monitored proactively.",
    "The RiseUp course library is not organized around EHPAD-specific care roles. Generic courses are available, but residence-specific care protocols, ARS regulatory requirements, and mandatory certification renewal paths are not structured as learning pathways in the platform.",
  ],
  recommandations: [
    { type: "QUICK WIN" as const, text: "Connect RiseUp to Lucas via API or SCORM/xAPI integration — training completions and certification statuses automatically visible in the Lucas employee dossier." },
    { type: "QUICK WIN" as const, text: "Build a mandatory training compliance dashboard in RiseUp: certification expiry tracking per employee, compliance rate per residence, and automated alerts for upcoming expiries." },
    { type: "QUICK WIN" as const, text: "Structure the RiseUp course library into role-based learning pathways — care worker, nurse, residence director, administrative staff — with mandatory and optional modules per role." },
    { type: "LONG TERM" as const, text: "Integrate training into the annual performance management cycle in Lucas — training completion feeds into performance reviews, and development needs identified in reviews trigger automatic RiseUp course assignments." },
    { type: "LONG TERM" as const, text: "Deploy AI-assisted personalized learning paths in RiseUp — adaptive content recommendations based on role, certification gaps, and care protocol updates. Reduce certification non-compliance through proactive nudging." },
  ],
};

// ─── SECTION 05 — PROCESSES ───────────────────────────────────────────────────
const ProcessSection = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [domain, setDomain] = useState<"commercial" | "finance" | "ehpad" | "rh">("commercial");
  const [commTab,  setCommTab]  = useState<"overview" | "fieldsales" | "marches" | "partenaires">("overview");
  const [finTab,   setFinTab]   = useState<"overview" | "achats" | "facturation" | "paie" | "reporting">("overview");
  const [ehpadTab, setEhpadTab] = useState<"overview" | "admission" | "dispo" | "planning" | "qualite">("overview");
  const [hrTab,    setHrTab]    = useState<"overview" | "recruitment" | "onboarding" | "payroll" | "training">("overview");

  const DOMAINS = [
    { id: "commercial" as const, label: "Commercial" },
    { id: "finance"    as const, label: "Finance"    },
    { id: "ehpad"      as const, label: "EHPAD Ops"  },
    { id: "rh"         as const, label: "HR"         },
  ];

  const COMM_TABS = [
    { id: "overview"    as const, label: "Overview"          },
    { id: "fieldsales"  as const, label: "Field Sales"       },
    { id: "marches"     as const, label: "Public Tenders"    },
    { id: "partenaires" as const, label: "Partner Residences"},
  ];

  const renderSubProcess = (data: typeof FIELD_SALES) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, padding: 24 }}>
        <p style={{ fontSize: 18, fontWeight: 800, color: DS.deepForest, margin: "0 0 4px" }}>{data.title}</p>
        <p style={{ fontSize: 13, color: DS.sageLight, margin: "0 0 16px" }}>{data.subtitle}</p>
        <p style={{ fontSize: 13, color: DS.textGrey, lineHeight: 1.75, margin: 0, padding: "14px 16px", backgroundColor: DS.lightGrey, borderRadius: 8 }}>{data.context}</p>
      </div>
      <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, padding: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: DS.darkRed, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Issues Identified</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.dysfonctionnements.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px 16px", backgroundColor: DS.redBg, borderRadius: 8, border: `1px solid ${DS.darkRed}22` }}>
              <span style={{ color: DS.darkRed, flexShrink: 0, fontWeight: 700, fontSize: 13 }}>▸</span>
              <p style={{ fontSize: 13, color: DS.deepForest, lineHeight: 1.7, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, padding: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: DS.forestMed, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Recommendations</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.recommandations.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px", backgroundColor: DS.lightGrey, borderRadius: 8 }}>
              <RecTag type={r.type} />
              <p style={{ fontSize: 13, color: DS.textGrey, lineHeight: 1.65, margin: 0 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <span style={labelStyle}>Section 05</span>
        <h1 style={h1Style}>Processes</h1>
      </div>

      <SubTabBar tabs={DOMAINS} active={domain} onChange={setDomain} isMobile={isMobile} />

      {/* COMMERCIAL */}
      {domain === "commercial" && (
        <div>
          {/* Sub-tab nav */}
          <SubTabBar tabs={COMM_TABS} active={commTab} onChange={setCommTab} isMobile={isMobile} />

          {commTab === "overview" && (
            <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", backgroundColor: DS.deepForest }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: DS.sage, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Commercial processes — status overview</p>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: DS.lightGrey }}>
                    {["Process", "Status", "Tools", "Key Issue"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMMERCIAL_OVERVIEW.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${DS.border}` }}>
                      <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 600, color: DS.deepForest }}>{r.process}</td>
                      <td style={{ padding: "11px 16px" }}><ProcChip s={r.status} /></td>
                      <td style={{ padding: "11px 16px", fontSize: 12, color: DS.textGrey }}>{r.tools}</td>
                      <td style={{ padding: "11px 16px", fontSize: 12, color: DS.textGrey }}>{r.issue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {commTab === "fieldsales"  && renderSubProcess(FIELD_SALES)}
          {commTab === "marches"     && renderSubProcess(MARCHES_PUBLICS)}
          {commTab === "partenaires" && renderSubProcess(EHPAD_PARTENAIRES)}
        </div>
      )}

      {/* FINANCE */}
      {domain === "finance" && (
        <div>
          <SubTabBar
            tabs={[
              { id: "overview"     as const, label: "Overview"     },
              { id: "achats"       as const, label: "Purchasing"   },
              { id: "facturation"  as const, label: "Billing"      },
              { id: "paie"         as const, label: "Payroll"      },
              { id: "reporting"    as const, label: "Reporting"    },
            ]}
            active={finTab}
            onChange={setFinTab}
            isMobile={isMobile}
          />
          {finTab === "overview" && (
            <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", backgroundColor: DS.deepForest }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: DS.sage, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Finance processes — status overview</p>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: DS.lightGrey }}>
                    {["Process", "Status", "Tools", "Key Issue"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FINANCE_OVERVIEW.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${DS.border}` }}>
                      <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 600, color: DS.deepForest }}>{r.process}</td>
                      <td style={{ padding: "11px 16px" }}><ProcChip s={r.status} /></td>
                      <td style={{ padding: "11px 16px", fontSize: 12, color: DS.textGrey }}>{r.tools}</td>
                      <td style={{ padding: "11px 16px", fontSize: 12, color: DS.textGrey }}>{r.issue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {finTab === "achats"      && renderSubProcess(FINANCE_ACHATS)}
          {finTab === "facturation" && renderSubProcess(FINANCE_FACTURATION)}
          {finTab === "paie"        && renderSubProcess(FINANCE_PAIE)}
          {finTab === "reporting"   && renderSubProcess(FINANCE_REPORTING)}
        </div>
      )}

      {/* EHPAD OPS */}
      {domain === "ehpad" && (
        <div>
          <SubTabBar
            tabs={[
              { id: "overview"   as const, label: "Overview"         },
              { id: "admission"  as const, label: "Admission"        },
              { id: "dispo"      as const, label: "Availability"     },
              { id: "planning"   as const, label: "Planning"         },
              { id: "qualite"    as const, label: "Quality"          },
            ]}
            active={ehpadTab}
            onChange={setEhpadTab}
            isMobile={isMobile}
          />
          {ehpadTab === "overview" && (
            <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", backgroundColor: DS.deepForest }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: DS.sage, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>EHPAD Operations — status overview</p>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: DS.lightGrey }}>
                    {["Process", "Status", "Tools", "Key Issue"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EHPAD_OVERVIEW.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${DS.border}` }}>
                      <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 600, color: DS.deepForest }}>{r.process}</td>
                      <td style={{ padding: "11px 16px" }}><ProcChip s={r.status} /></td>
                      <td style={{ padding: "11px 16px", fontSize: 12, color: DS.textGrey }}>{r.tools}</td>
                      <td style={{ padding: "11px 16px", fontSize: 12, color: DS.textGrey }}>{r.issue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {ehpadTab === "admission" && renderSubProcess(EHPAD_ADMISSION)}
          {ehpadTab === "dispo"     && renderSubProcess(EHPAD_DISPO)}
          {ehpadTab === "planning"  && renderSubProcess(EHPAD_PLANNING)}
          {ehpadTab === "qualite"   && renderSubProcess(EHPAD_QUALITE)}
        </div>
      )}

      {/* HR */}
      {domain === "rh" && (
        <div>
          <SubTabBar
            tabs={[
              { id: "overview"    as const, label: "Overview"    },
              { id: "recruitment" as const, label: "Recruitment" },
              { id: "onboarding"  as const, label: "Onboarding"  },
              { id: "payroll"     as const, label: "Payroll"     },
              { id: "training"    as const, label: "Training"    },
            ]}
            active={hrTab}
            onChange={setHrTab}
            isMobile={isMobile}
          />
          {hrTab === "overview" && (
            <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", backgroundColor: DS.deepForest }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: DS.sage, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>HR processes — status overview</p>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: DS.lightGrey }}>
                    {["Process", "Status", "Tools", "Key Issue"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HR_OVERVIEW.map((r, i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${DS.border}` }}>
                      <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 600, color: DS.deepForest }}>{r.process}</td>
                      <td style={{ padding: "11px 16px" }}><ProcChip s={r.status} /></td>
                      <td style={{ padding: "11px 16px", fontSize: 12, color: DS.textGrey }}>{r.tools}</td>
                      <td style={{ padding: "11px 16px", fontSize: 12, color: DS.textGrey }}>{r.issue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {hrTab === "recruitment" && renderSubProcess(HR_RECRUITMENT)}
          {hrTab === "onboarding"  && renderSubProcess(HR_ONBOARDING)}
          {hrTab === "payroll"     && renderSubProcess(HR_PAYROLL)}
          {hrTab === "training"    && renderSubProcess(HR_TRAINING)}
        </div>
      )}
    </div>
  );
};

// ─── TRANSFORMATION PLAN DATA ────────────────────────────────────────────────
type Phase = "P1" | "P2" | "P3";
interface GanttItem { id: string; ws: 1|2|3|4; label: string; start: number; end: number; phase: Phase; detail: string; tools: string; }

const PHASE_COLORS: Record<Phase, { bg: string; text: string; border: string }> = {
  P1: { bg: "#166534", text: DS.white,       border: "#14532D" },
  P2: { bg: DS.saddleBrown, text: DS.white,  border: "#7C2D12" },
  P3: { bg: "#1E40AF", text: DS.white,       border: "#1E3A8A" },
};

const WS_LABELS: Record<number, string> = {
  1: "WS1 · Tools & Adoption",
  2: "WS2 · Data & BI",
  3: "WS3 · Process & Governance",
  4: "WS4 · AI",
};

const GANTT_ITEMS: GanttItem[] = [
  // WS1 — Tools & Adoption
  { id:"w1-1", ws:1, phase:"P1", start:1,  end:3,  label:"Salesforce repair",              detail:"Repair Outlook sync, re-enable email sending, reconfigure lead scoring threshold. Appoint a certified Salesforce integration partner.", tools:"Salesforce" },
  { id:"w1-2", ws:1, phase:"P1", start:1,  end:4,  label:"Lucas HRIS reactivation",        detail:"Deploy a change management and training plan to reactivate Lucas across all residences. Start with recruitment and absence modules.", tools:"Lucas" },
  { id:"w1-3", ws:1, phase:"P1", start:2,  end:3,  label:"DocuSign & access audit",        detail:"Revoke the 7 active admin accounts belonging to departed employees. Audit all DocuSign licenses and clean up inactive accounts.", tools:"DocuSign, Entra ID" },
  { id:"w1-4", ws:1, phase:"P1", start:3,  end:6,  label:"Turbo decommission",             detail:"Complete Kyriba migration for all residences. Set and enforce a firm Turbo decommission date. Eliminate CIEL on residual scope.", tools:"Kyriba, Turbo, Sage" },
  { id:"w1-5", ws:1, phase:"P1", start:3,  end:5,  label:"Plezi activation",               detail:"Launch Plezi B2B marketing automation. Connect to Salesforce pipeline. Deploy first nurturing flow toward referring institutions.", tools:"Plezi, Salesforce" },
  { id:"w1-6", ws:1, phase:"P2", start:7,  end:10, label:"Salesforce ↔ Agesoft API",       detail:"Build the Agesoft/Salesforce API integration: real-time room availability in the commercial pipeline. Admission requests managed in Salesforce end-to-end.", tools:"Salesforce, Agesoft" },
  { id:"w1-7", ws:1, phase:"P2", start:7,  end:11, label:"WFM/scheduling deployment",      detail:"Deploy Skello or Combo as the group scheduling tool across all 120 residences. Pilot on one region, then roll out group-wide.", tools:"Skello/Combo, Lucas" },
  { id:"w1-8", ws:1, phase:"P2", start:9,  end:12, label:"GED/OCR go-live",                detail:"Complete GED/OCR deployment for admission dossiers, ARS correspondence, supplier invoices. Connect to Yooz and Sage.", tools:"GED/OCR, Yooz, Sage" },
  { id:"w1-9", ws:1, phase:"P3", start:13, end:16, label:"P2P / purchase order tool",      detail:"Deploy a full purchase-to-pay solution integrated with Sage and Yooz. Define approval thresholds and preferred supplier list.", tools:"Sage, Yooz" },
  { id:"w1-10",ws:1, phase:"P3", start:14, end:18, label:"Microsoft Dynamics decommission",detail:"Migrate all Microsoft Dynamics users to Salesforce. Eliminate shadow CRM and consolidate all pipeline data into a single system.", tools:"Salesforce, MS Dynamics" },
  // WS2 — Data & BI
  { id:"w2-1", ws:2, phase:"P1", start:1,  end:3,  label:"ESB documentation & handover",   detail:"Document all existing DataHub/ESB flows, data schemas, and connectors. Assign a second developer as backup. Set up monitoring alerts.", tools:"DataHub ESB" },
  { id:"w2-2", ws:2, phase:"P1", start:2,  end:5,  label:"Residence master data build",    detail:"Build the group's unique residence identifier — reconcile the 4 divergent residence lists (75–120 entries) into one validated reference across Agesoft, Sage, Lucas.", tools:"Agesoft, Sage, Lucas" },
  { id:"w2-3", ws:2, phase:"P1", start:3,  end:6,  label:"Sage → Power BI connector",      detail:"Activate Sage OData/ODBC access. Build a direct Power BI connector eliminating all manual exports. Deliver first automated financial report.", tools:"Sage, Power BI, MS Fabric" },
  { id:"w2-4", ws:2, phase:"P1", start:4,  end:6,  label:"Bronze layer — occupancy data",  detail:"Build the first Bronze data layer: daily occupancy feed from Agesoft into the DataHub. Validate with the Operations team before moving to Silver.", tools:"Agesoft, DataHub" },
  { id:"w2-5", ws:2, phase:"P2", start:7,  end:10, label:"Supplier & employee master data", detail:"Deduplicate the ~4,000 supplier records in Sage. Build unified employee master connecting Lucas and Cegid Paie. Validate both with business owners.", tools:"Sage, Lucas, Cegid" },
  { id:"w2-6", ws:2, phase:"P2", start:8,  end:12, label:"Silver layer — MDM validation",  detail:"Build the Silver data layer with all 4 validated master references: Residence, Supplier, Employee, Resident. Business-owner sign-off required before Gold layer.", tools:"DataHub, Power BI" },
  { id:"w2-7", ws:2, phase:"P2", start:10, end:12, label:"Group CDG dashboard",             detail:"Launch the group finance and operations dashboard: P&L by residence and consolidated, occupancy, payroll headcount — updated daily from Silver layer.", tools:"Power BI, MS Fabric" },
  { id:"w2-8", ws:2, phase:"P3", start:13, end:16, label:"Gold layer — consolidated reporting", detail:"Build the Gold reporting layer: investor-ready consolidated P&L, rolling reforecast, board dashboard. Feed from validated Silver layer only.", tools:"Power BI, MS Fabric" },
  { id:"w2-9", ws:2, phase:"P3", start:15, end:18, label:"FP&A tool deployment",            detail:"Deploy Pigment or equivalent for structured bottom-up budgeting, automated variance analysis, and rolling 3+9 reforecast consolidation.", tools:"Pigment/Anaplan" },
  // WS3 — Process & Governance
  { id:"w3-1", ws:3, phase:"P1", start:1,  end:2,  label:"Monthly close calendar (D+5)",   detail:"Formalize the monthly financial close calendar with clear ownership per step, hard deadlines, and D+5 as the group delivery target for management P&L.", tools:"Sage, Excel" },
  { id:"w3-2", ws:3, phase:"P1", start:1,  end:3,  label:"ARS compliance catch-up plan",   detail:"Audit ARS declaration status across all 120 residences. Deploy a catch-up plan for overdue declarations. Formalize the annual declaration calendar.", tools:"Agesoft, manual" },
  { id:"w3-3", ws:3, phase:"P1", start:2,  end:4,  label:"BlueKanGo reconfiguration",      detail:"Remove IT helpdesk misuse from BlueKanGo. Configure EHPAD-specific audit modules and mandatory EI declaration workflow. Deploy training via RiseUp.", tools:"BlueKanGo, RiseUp" },
  { id:"w3-4", ws:3, phase:"P1", start:4,  end:6,  label:"IT COPIL SI launch",             detail:"Establish the Group IT Steering Committee. Monthly cadence. Define IT demand management process: request submission, DSI review, prioritization, ROI tracking.", tools:"Jira" },
  { id:"w3-5", ws:3, phase:"P2", start:7,  end:9,  label:"Admission process standardization", detail:"Move all admission requests into Salesforce. Standardize care contract templates and billing rules in Agesoft. Define commercial-to-care handoff protocol.", tools:"Salesforce, Agesoft" },
  { id:"w3-6", ws:3, phase:"P2", start:8,  end:11, label:"Purchase order process",          detail:"Deploy PO tool and enforce mandatory purchase orders for all spend above threshold. Connect to Yooz for invoice-to-PO matching.", tools:"Sage, Yooz" },
  { id:"w3-7", ws:3, phase:"P2", start:9,  end:12, label:"ARS declaration automation",      detail:"Automate ARS/Departmental declaration generation from Agesoft data. Reduce manual effort by 80% and structurally eliminate late submissions.", tools:"Agesoft, GED" },
  { id:"w3-8", ws:3, phase:"P3", start:14, end:18, label:"Group process governance",        detail:"Deploy a formal group process governance framework: process owners per domain, annual process review cycle, performance metrics dashboard.", tools:"Jira, Power BI" },
  // WS4 — AI
  { id:"w4-1", ws:4, phase:"P1", start:1,  end:2,  label:"AI governance & policy",         detail:"Define the Group AI usage policy: authorized data types, validated tools, prohibited use cases (resident health data, GDPR). Appoint the Group AI Lead.", tools:"Internal" },
  { id:"w4-2", ws:4, phase:"P1", start:2,  end:5,  label:"M365 Copilot pilot",             detail:"Deploy M365 Copilot on a 20-user pilot (Finance, HR, executive teams). Measure time savings, validate use cases, produce ROI report before group rollout.", tools:"Microsoft 365 Copilot" },
  { id:"w4-3", ws:4, phase:"P1", start:3,  end:6,  label:"Prompt engineering training",    detail:"Deploy 4-hour prompt engineering module via RiseUp for all office-based staff. Prerequisite before any Copilot group rollout.", tools:"RiseUp" },
  { id:"w4-4", ws:4, phase:"P2", start:7,  end:10, label:"Bank reconciliation AI",         detail:"AI-assisted payment matching between Kyriba and Sage. Prerequisite: Kyriba/Sage integration live. Target: eliminate 2–3 FTE of manual reconciliation (~150–200K€/yr).", tools:"Kyriba, Sage, AI" },
  { id:"w4-5", ws:4, phase:"P2", start:8,  end:11, label:"AI tender drafting assistant",   detail:"AI assistant trained on past winning bids for public tender memorandum drafting. Target: 60–70% reduction on ~50 days/year currently spent on documentation.", tools:"AI, SharePoint" },
  { id:"w4-6", ws:4, phase:"P2", start:10, end:13, label:"Commercial meeting AI assistant",detail:"AI transcription and structured CRM push eliminating ~1h30/day of manual Salesforce data entry per commercial manager.", tools:"AI, Salesforce" },
  { id:"w4-7", ws:4, phase:"P3", start:13, end:16, label:"Salesforce Einstein deployment", detail:"Deploy Einstein for renewal risk scoring on institutional contracts and DSP partnerships. Prioritized retention alerts 6 months before contract expiry.", tools:"Salesforce Einstein" },
  { id:"w4-8", ws:4, phase:"P3", start:14, end:17, label:"ARS declaration AI monitoring",  detail:"AI assistant centralizing ARS/Departmental declaration tracking with automated alerts per residence. Structurally resolve the non-compliance pattern.", tools:"AI, Agesoft" },
  { id:"w4-9", ws:4, phase:"P3", start:15, end:18, label:"Predictive occupancy AI",        detail:"Anticipate room availability 3–6 months ahead from discharge patterns and care data. Feed directly into the Salesforce commercial pipeline.", tools:"AI, Agesoft, Salesforce" },
];

const BUSINESS_OBJECTIVES = [
  { id:"OB1", label:"5–10 FTE recovered through automation",      detail:"Bank reconciliation (~3 FTE), ARS declarations (~1 FTE), manual CRM entry (~1–2 FTE), payroll transfers (~1–2 FTE). Equivalent to 300–600K€/yr in redeployable capacity.",    color: DS.forestMed, bg: "#E6F2EC" },
  { id:"OB2", label:"Real-time occupancy dashboard live",         detail:"Group occupancy rate known in real time across all 120 residences — no manual Excel consolidation. Updated daily from the Agesoft/DataHub Bronze layer.",                      color: "#1D4ED8", bg: "#DBEAFE" },
  { id:"OB3", label:"100% ARS declaration compliance",            detail:"Structural elimination of the current 80% late-submission rate through Agesoft-driven automation and centralized declaration tracking.",                                          color: "#166534", bg: "#DCFCE7" },
  { id:"OB4", label:"Monthly financial close at D+5",             detail:"Close timeline reduced from several weeks to D+5 through automated Kyriba/Sage reconciliation, formal close calendar, and Power BI dashboard eliminating manual consolidation.",   color: DS.saddleBrown, bg: DS.amberBg },
  { id:"OB5", label:"Zero critical cyber vulnerabilities",        detail:"MFA deployed group-wide, end-of-life switches replaced, VLAN architecture in place, professional emails for all staff, ESB documented and monitored — BCP validated.",             color: DS.darkRed, bg: DS.redBg },
];

// ─── SECTION 07 — TRANSFORMATION ─────────────────────────────────────────────
const TransformationSection = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [subTab,   setSubTab]   = useState<"objectives"|"gantt"|"workstreams"|"phases">("objectives");
  const [selected, setSelected] = useState<GanttItem | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<Phase | "all">("all");

  const MONTHS = Array.from({ length: 18 }, (_, i) => i + 1);
  const WS_IDS = [1, 2, 3, 4] as const;

  const filteredItems = phaseFilter === "all"
    ? GANTT_ITEMS
    : GANTT_ITEMS.filter(i => i.phase === phaseFilter);

  const WS_DETAIL: Record<number, { p1: string[]; p2: string[]; p3: string[] }> = {
    1: {
      p1: ["Repair Salesforce core functions (Outlook, email, scoring)", "Reactivate Lucas HRIS with change management plan", "Complete Turbo decommission — finalize Kyriba migration", "Launch Plezi B2B automation", "DocuSign & access rights cleanup"],
      p2: ["Build Salesforce ↔ Agesoft API integration", "Deploy WFM/scheduling tool (Skello or Combo)", "GED/OCR go-live for admission and financial document flows"],
      p3: ["Deploy P2P / purchase order solution", "Decommission Microsoft Dynamics — consolidate into Salesforce"],
    },
    2: {
      p1: ["Document and secure the in-house ESB/DataHub", "Build the Residence master data reference", "Connect Sage to Power BI via OData/ODBC", "First Bronze layer: daily Agesoft occupancy feed"],
      p2: ["Deduplicate supplier and employee master data", "Build Silver layer — 4 validated master references", "Launch group CDG dashboard (P&L, occupancy)"],
      p3: ["Build Gold reporting layer — investor-ready consolidated reporting", "Deploy FP&A tool for automated budget consolidation"],
    },
    3: {
      p1: ["Formalize monthly close calendar — D+5 target", "ARS declaration compliance audit and catch-up plan", "BlueKanGo reconfiguration — remove IT misuse, deploy EHPAD audit modules", "Launch Group IT Steering Committee (COPIL SI)"],
      p2: ["Standardize admission process end-to-end in Salesforce/Agesoft", "Deploy PO process with mandatory approval thresholds", "Automate ARS/Departmental declaration generation from Agesoft"],
      p3: ["Deploy formal group process governance framework"],
    },
    4: {
      p1: ["Define AI governance policy and appoint Group AI Lead", "M365 Copilot pilot — 20 users, Finance and HR teams", "Deploy prompt engineering training module on RiseUp"],
      p2: ["AI-assisted bank reconciliation (Kyriba/Sage)", "AI public tender drafting assistant", "Commercial meeting summary AI assistant"],
      p3: ["Salesforce Einstein — renewal risk scoring", "ARS declaration AI monitoring assistant", "Predictive occupancy AI — 3–6 month horizon"],
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <span style={labelStyle}>Section 07</span>
        <h1 style={h1Style}>Transformation Plan</h1>
      </div>

      <SubTabBar
        tabs={[
          { id:"objectives"  as const, label:"Business Objectives" },
          { id:"gantt"       as const, label:"Gantt (M1–M18)"     },
          { id:"workstreams" as const, label:"Workstreams"         },
          { id:"phases"      as const, label:"Phases P1 / P2 / P3" },
        ]}
        active={subTab}
        onChange={setSubTab}
        isMobile={isMobile}
      />

      {/* ── OBJECTIVES ── */}
      {subTab === "objectives" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 14, color: DS.textGrey, lineHeight: 1.7, margin: "0 0 8px" }}>
            The transformation roadmap is designed to deliver 5 measurable business outcomes across the 18-month horizon. Each workstream action maps directly to one or more of these objectives.
          </p>
          {BUSINESS_OBJECTIVES.map(ob => (
            <div key={ob.id} style={{ backgroundColor: DS.white, borderRadius: 10, border: `1px solid ${DS.border}`, display: "flex", alignItems: "flex-start", gap: 16, padding: 20 }}>
              <div style={{ backgroundColor: ob.bg, borderRadius: 8, padding: "8px 12px", flexShrink: 0, textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 800, color: ob.color, margin: 0 }}>{ob.id}</p>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: DS.deepForest, margin: "0 0 6px" }}>{ob.label}</p>
                <p style={{ fontSize: 13, color: DS.textGrey, lineHeight: 1.65, margin: 0 }}>{ob.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── GANTT ── */}
      {subTab === "gantt" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Legend + filter */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {(["all","P1","P2","P3"] as const).map(p => (
                <button key={p} onClick={() => setPhaseFilter(p)} style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${phaseFilter === p ? DS.deepForest : DS.border}`, cursor: "pointer", fontSize: 12, fontWeight: 600, backgroundColor: phaseFilter === p ? DS.deepForest : DS.white, color: phaseFilter === p ? DS.white : DS.textGrey }}>
                  {p === "all" ? "All phases" : p}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {(["P1","P2","P3"] as const).map(p => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: PHASE_COLORS[p].bg }} />
                  <span style={{ fontSize: 12, color: DS.textGrey }}>{p} {p==="P1"?"M1–M6":p==="P2"?"M7–M12":"M13–M18"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt grid */}
          <div style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, overflow: "hidden" }}>
            {/* Month header */}
            <div style={{ display: "grid", gridTemplateColumns: "160px repeat(18, 1fr)", backgroundColor: DS.deepForest }}>
              <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.08em" }}>Workstream</div>
              {MONTHS.map(m => (
                <div key={m} style={{ padding: "8px 4px", fontSize: 11, fontWeight: 700, color: m<=6 ? "#86EFAC" : m<=12 ? "#FCD34D" : "#93C5FD", textAlign: "center", borderLeft: m===7||m===13 ? "2px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.07)" }}>
                  M{m}
                </div>
              ))}
            </div>
            {/* WS rows */}
            {WS_IDS.map(ws => {
              const wsItems = filteredItems.filter(i => i.ws === ws);
              return (
                <div key={ws} style={{ borderTop: `1px solid ${DS.border}` }}>
                  {/* WS label */}
                  <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", alignItems: "center", padding: "6px 0", backgroundColor: DS.lightGrey }}>
                    <div style={{ padding: "4px 12px", fontSize: 11, fontWeight: 700, color: DS.deepForest }}>{WS_LABELS[ws]}</div>
                    {/* relative bar container */}
                    <div style={{ position: "relative", height: wsItems.length > 0 ? wsItems.length * 28 + 8 : 28 }}>
                      {wsItems.map((item, rowIdx) => {
                        const left  = ((item.start - 1) / 18) * 100;
                        const width = ((item.end - item.start + 1) / 18) * 100;
                        const pc = PHASE_COLORS[item.phase];
                        const isSelected = selected?.id === item.id;
                        return (
                          <button key={item.id} onClick={() => setSelected(isSelected ? null : item)}
                            title={item.label}
                            style={{ position: "absolute", top: rowIdx * 28 + 4, left: `${left}%`, width: `${width}%`, height: 22, borderRadius: 4, backgroundColor: pc.bg, border: `1.5px solid ${isSelected ? DS.white : pc.border}`, cursor: "pointer", padding: "0 6px", overflow: "hidden", boxShadow: isSelected ? "0 0 0 2px " + DS.sage : "none" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: pc.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ backgroundColor: DS.deepForest, borderRadius: 12, padding: 24, display: "flex", gap: 20, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 10px", borderRadius: 20, backgroundColor: PHASE_COLORS[selected.phase].bg, color: PHASE_COLORS[selected.phase].text }}>{selected.phase}</span>
                  <span style={{ fontSize: 11, color: DS.sageLight }}>{WS_LABELS[selected.ws]}</span>
                  <span style={{ fontSize: 11, color: DS.sageLight }}>· M{selected.start} → M{selected.end}</span>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: DS.white, margin: "0 0 10px" }}>{selected.label}</p>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: "0 0 10px" }}>{selected.detail}</p>
                <p style={{ fontSize: 12, color: DS.sage, margin: 0 }}>Tools involved: {selected.tools}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: DS.sageLight, background: "none", border: "none", cursor: "pointer", fontSize: 20, lineHeight: 1, flexShrink: 0 }}>✕</button>
            </div>
          )}
        </div>
      )}

      {/* ── WORKSTREAMS ── */}
      {subTab === "workstreams" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {WS_IDS.map(ws => {
            const d = WS_DETAIL[ws];
            return (
              <div key={ws} style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", backgroundColor: DS.deepForest }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: DS.sage, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{WS_LABELS[ws]}</p>
                </div>
                <div style={{ padding: 18 }}>
                  {(["p1","p2","p3"] as const).map((p, pi) => (
                    <div key={p} style={{ marginBottom: pi < 2 ? 14 : 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: ["#166534",DS.saddleBrown,"#1E40AF"][pi], textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>{p.toUpperCase()} — {["M1–M6","M7–M12","M13–M18"][pi]}</p>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                        {d[p].map((a, i) => (
                          <li key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: DS.textGrey, lineHeight: 1.5 }}>
                            <span style={{ color: DS.sage, flexShrink: 0 }}>›</span>{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── PHASES ── */}
      {subTab === "phases" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {(["P1","P2","P3"] as const).map((ph, pi) => {
            const phItems = GANTT_ITEMS.filter(i => i.phase === ph);
            const colors = [{ label:"#166534", bg:"#DCFCE7", border:"#86EFAC" }, { label:DS.saddleBrown, bg:DS.amberBg, border:"#FCD34D" }, { label:"#1E40AF", bg:"#DBEAFE", border:"#93C5FD" }][pi];
            const ranges = ["Months 1–6","Months 7–12","Months 13–18"][pi];
            return (
              <div key={ph} style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", backgroundColor: colors.bg, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: colors.label, padding: "4px 14px", backgroundColor: DS.white, borderRadius: 20 }}>{ph}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.label }}>{ranges} — {phItems.length} actions across 4 workstreams</span>
                </div>
                <div style={{ padding: 18 }}>
                  {WS_IDS.map(ws => {
                    const items = phItems.filter(i => i.ws === ws);
                    if (!items.length) return null;
                    return (
                      <div key={ws} style={{ marginBottom: 14 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>{WS_LABELS[ws]}</p>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                          {items.map(item => (
                            <li key={item.id} style={{ display: "flex", gap: 10, fontSize: 13, color: DS.textGrey, lineHeight: 1.5, padding: "6px 10px", backgroundColor: DS.lightGrey, borderRadius: 6 }}>
                              <span style={{ color: colors.label, flexShrink: 0, fontWeight: 700 }}>›</span>
                              <span style={{ fontWeight: 600, color: DS.deepForest }}>{item.label}</span>
                              <span style={{ color: DS.sageLight, marginLeft: "auto", fontSize: 11, flexShrink: 0 }}>M{item.start}→M{item.end}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── SECTION 03 — APPLICATION MAPPING ───────────────────────────────────────
const STATUS_CFG: Record<ToolStatus, { dot: string; label: string; labelColor: string; labelBg: string }> = {
  ok:      { dot: "#22C55E", label: "Operational",    labelColor: "#166534", labelBg: "#DCFCE7" },
  partial: { dot: "#F59E0B", label: "Partial",        labelColor: DS.saddleBrown, labelBg: DS.amberBg },
  ko:      { dot: DS.darkRed, label: "Dysfunctional", labelColor: DS.darkRed, labelBg: DS.redBg },
};

const StatusChip = ({ status }: { status: ToolStatus }) => {
  const c = STATUS_CFG[status];
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: c.labelColor, backgroundColor: c.labelBg, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap" }}>{c.label}</span>
  );
};

const CartographieSection = ({ isMobile = false }: { isMobile?: boolean }) => {
  const [tab, setTab]         = useState<"inventory" | "swot" | "missing">("inventory");
  const [filter, setFilter]   = useState<"all" | ToolStatus>("all");
  const [swotIdx, setSwotIdx] = useState(0);

  const TAB_LABELS: { id: "inventory" | "swot" | "missing"; label: string }[] = [
    { id: "inventory", label: "Tool Inventory" },
    { id: "swot",      label: "SWOT Analysis"  },
    { id: "missing",   label: "Missing Tools"  },
  ];

  const filtered = filter === "all"
    ? TOOLS_FRANCE
    : TOOLS_FRANCE.map(cat => ({ ...cat, tools: cat.tools.filter(t => t.status === filter) }))
                  .filter(cat => cat.tools.length > 0);

  const totalOk      = TOOLS_FRANCE.flatMap(c => c.tools).filter(t => t.status === "ok").length;
  const totalPartial = TOOLS_FRANCE.flatMap(c => c.tools).filter(t => t.status === "partial").length;
  const totalKo      = TOOLS_FRANCE.flatMap(c => c.tools).filter(t => t.status === "ko").length;
  const total        = totalOk + totalPartial + totalKo;

  const sw = SWOT_DATA[swotIdx];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <span style={labelStyle}>Section 03</span>
        <h1 style={h1Style}>Application Mapping</h1>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { value: total,        label: "Tools in scope",    color: DS.deepForest, bg: DS.lightGrey },
          { value: totalOk,      label: "Operational",       color: "#166534",      bg: "#DCFCE7"    },
          { value: totalPartial, label: "Partial / Issues",  color: DS.saddleBrown, bg: DS.amberBg  },
          { value: totalKo,      label: "Dysfunctional",     color: DS.darkRed,     bg: DS.redBg    },
        ].map(k => (
          <div key={k.label} style={{ backgroundColor: k.bg, borderRadius: 10, padding: "16px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: k.color, margin: "0 0 4px" }}>{k.value}</p>
            <p style={{ fontSize: 12, color: DS.textGrey, margin: 0 }}>{k.label}</p>
          </div>
        ))}
      </div>

      <SubTabBar tabs={TAB_LABELS} active={tab} onChange={setTab} isMobile={isMobile} />

      {/* ── TAB: Inventory ── */}
      {tab === "inventory" && (
        <div>
          {/* Filter bar */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {(["all","ok","partial","ko"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === f ? DS.deepForest : DS.border}`, cursor: "pointer", fontSize: 12, fontWeight: 600, backgroundColor: filter === f ? DS.deepForest : DS.white, color: filter === f ? DS.white : DS.textGrey }}>
                {f === "all" ? "All tools" : STATUS_CFG[f].label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(cat => (
              <div key={cat.category} style={{ backgroundColor: DS.white, borderRadius: 12, border: `1px solid ${DS.border}`, overflow: "hidden" }}>
                <div style={{ padding: "12px 20px", backgroundColor: DS.deepForest }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: DS.sage, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{cat.category}</p>
                </div>
                <div style={{ padding: "8px 0" }}>
                  {cat.tools.map((t, i) => (
                    <div key={t.name} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "10px 20px", borderBottom: i < cat.tools.length - 1 ? `1px solid ${DS.lightGrey}` : "none" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: STATUS_CFG[t.status].dot, flexShrink: 0, marginTop: 5 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: DS.deepForest }}>{t.name}</span>
                        <span style={{ fontSize: 12, color: DS.textGrey, marginLeft: 8 }}>{t.desc}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        {t.opex !== "included" && t.opex !== "outsourced" && (
                          <span style={{ fontSize: 11, color: DS.sageLight, fontWeight: 500 }}>{t.opex}/yr</span>
                        )}
                        <StatusChip status={t.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: SWOT ── */}
      {tab === "swot" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {SWOT_DATA.map((s, i) => (
              <button key={s.tool} onClick={() => setSwotIdx(i)} style={{ padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${swotIdx === i ? DS.deepForest : DS.border}`, cursor: "pointer", fontSize: 13, fontWeight: 600, backgroundColor: swotIdx === i ? DS.deepForest : DS.white, color: swotIdx === i ? DS.white : DS.textGrey }}>
                {s.tool}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: DS.sageLight, marginBottom: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>{sw.category}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            {[
              { key: "forces",      label: "Strengths",      dot: "#22C55E", items: sw.forces      },
              { key: "faiblesses",  label: "Weaknesses",     dot: DS.darkRed,  items: sw.faiblesses },
              { key: "opportunites",label: "Opportunities",  dot: "#3B82F6",  items: sw.opportunites },
              { key: "menaces",     label: "Threats",        dot: DS.amber,   items: sw.menaces    },
            ].map(q => (
              <div key={q.key} style={{ backgroundColor: DS.white, borderRadius: 10, padding: 20, border: `1px solid ${DS.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: q.dot }} />
                  <p style={{ fontSize: 12, fontWeight: 700, color: DS.deepForest, margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{q.label}</p>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.items.map((item, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: DS.textGrey, lineHeight: 1.5 }}>
                      <span style={{ color: q.dot, flexShrink: 0, marginTop: 2 }}>›</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: DS.deepForest, borderRadius: 10, padding: 20 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: DS.sage, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Conclusion & Recommendation</p>
            <p style={{ fontSize: 14, color: DS.white, lineHeight: 1.75, margin: 0 }}>{sw.conclusion}</p>
          </div>
        </div>
      )}

      {/* ── TAB: Missing Tools ── */}
      {tab === "missing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 13, color: DS.textGrey, margin: "0 0 8px", lineHeight: 1.6 }}>
            The following capabilities are absent from the Group's current IT landscape and are required to close critical operational gaps identified during the audit.
          </p>
          {MISSING_TOOLS.map(m => {
            const isRed = m.severity === "red";
            return (
              <div key={m.name} style={{ backgroundColor: DS.white, borderRadius: 10, border: `1.5px solid ${isRed ? DS.darkRed + "44" : DS.amber + "44"}`, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: `1px solid ${DS.border}`, backgroundColor: isRed ? DS.redBg : DS.amberBg }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: isRed ? DS.darkRed : DS.amber, flexShrink: 0 }} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: isRed ? DS.darkRed : DS.saddleBrown, margin: 0 }}>{m.name}</p>
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: isRed ? DS.darkRed : DS.saddleBrown, backgroundColor: DS.white, borderRadius: 20, padding: "2px 10px" }}>{isRed ? "Critical" : "Important"}</span>
                </div>
                <div style={{ padding: "14px 20px" }}>
                  <p style={{ fontSize: 13, color: DS.textGrey, lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── PLACEHOLDER ────────────────────────────────────────────────────────────
const Placeholder = ({ label }: { label: string }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, textAlign: "center" }}>
    <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: DS.lightGrey, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <Clock size={28} color={DS.sage} />
    </div>
    <p style={{ fontSize: 18, fontWeight: 700, color: DS.deepForest, margin: "0 0 8px" }}>{label}</p>
    <p style={{ fontSize: 14, color: DS.textGrey, margin: 0 }}>This section is being prepared — coming in the next update.</p>
  </div>
);

// ─── LANDING PAGE ────────────────────────────────────────────────────────────
const SECTION_CARDS = [
  { id: "intro",          icon: FileText,   label: "01 · Introduction",        blurb: "Context, methodology & 25 stakeholder interviews"          },
  { id: "executive",      icon: TrendingUp, label: "02 · Executive Summary",   blurb: "8 key findings — maturity assessment & business impact"    },
  { id: "cartographie",   icon: Layers,     label: "03 · Application Mapping", blurb: "40+ tools audited — SWOT, status & missing capabilities"   },
  { id: "data",           icon: Database,   label: "04 · Data",                blurb: "ESB architecture, 4 master data gaps & medallion target"    },
  { id: "processus",      icon: Settings,   label: "05 · Processes",           blurb: "Commercial, Finance, EHPAD Ops & HR — drill-down by domain" },
  { id: "ia",             icon: Zap,        label: "06 · AI",                  blurb: "Governance, 5 priority use cases & long-term roadmap"       },
  { id: "transformation", icon: Target,     label: "07 · Transformation Plan", blurb: "26 actions across 4 workstreams — Gantt M1→M18"             },
];

const LandingSection = ({ onEnter }: { onEnter: (id: string) => void }) => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: DS.deepForest }}>
    {/* Left panel */}
    <div style={{ width: 420, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 48px", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Header */}
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "rgba(147,183,163,0.12)", border: "1px solid rgba(147,183,163,0.25)", borderRadius: 20, padding: "6px 14px", marginBottom: 40 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: DS.sage }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: DS.sage, letterSpacing: "0.12em", textTransform: "uppercase" }}>Stratos · Confidential</span>
        </div>
        <p style={{ fontSize: 11, fontWeight: 700, color: DS.sageLight, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px" }}>Audit Report · April 2026</p>
        <h1 style={{ fontSize: 38, fontWeight: 900, color: DS.white, lineHeight: 1.15, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
          IT, Data<br />& AI Audit
        </h1>
        <p style={{ fontSize: 18, fontWeight: 600, color: DS.sage, margin: "0 0 28px" }}>Groupement EHPAD · France</p>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: "0 0 40px" }}>
          An independent assessment of the Group's application ecosystem, data infrastructure, business processes, and AI readiness — with a prioritized 18-month transformation roadmap.
        </p>
        <button
          onClick={() => onEnter("executive")}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, backgroundColor: DS.sage, color: DS.deepForest, fontSize: 14, fontWeight: 800, padding: "13px 24px", borderRadius: 10, border: "none", cursor: "pointer", letterSpacing: "0.01em" }}
        >
          Enter Report
          <ArrowRight size={16} />
        </button>
      </div>
      {/* Stratos footer */}
      <div>
        <div style={{ width: 32, height: 2, backgroundColor: DS.sage, marginBottom: 14, borderRadius: 2 }} />
        <p style={{ fontSize: 13, fontWeight: 700, color: DS.white, margin: "0 0 4px" }}>Stratos</p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6 }}>
          Digital transformation advisory<br />for healthcare & social care operators
        </p>
      </div>
    </div>

    {/* Right panel — section cards */}
    <div style={{ flex: 1, overflowY: "auto", padding: "52px 40px" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: DS.sageLight, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 24px" }}>7 Sections — click to navigate directly</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {SECTION_CARDS.map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onEnter(s.id)}
              style={{ textAlign: "left", backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "20px 20px", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(147,183,163,0.1)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(147,183,163,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={15} color={DS.sage} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: DS.sage, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.55 }}>{s.blurb}</p>
            </button>
          );
        })}
      </div>
      {/* KPI strip at bottom */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 24 }}>
        {[
          { v: "120", l: "Residences" },
          { v: "25",  l: "Interviews" },
          { v: "40+", l: "Tools audited" },
          { v: "18m", l: "Roadmap horizon" },
        ].map(k => (
          <div key={k.l} style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
            <p style={{ fontSize: 22, fontWeight: 800, color: DS.white, margin: "0 0 4px" }}>{k.v}</p>
            <p style={{ fontSize: 11, color: DS.sageLight, margin: 0 }}>{k.l}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ─── MOBILE SUB-TAB SELECT ───────────────────────────────────────────────────
// Renders a <select> on mobile and regular tab buttons on desktop
interface SubTabBarProps<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  isMobile: boolean;
}
function SubTabBar<T extends string>({ tabs, active, onChange, isMobile }: SubTabBarProps<T>) {
  if (isMobile) {
    return (
      <div style={{ marginBottom: 20 }}>
        <select
          value={active}
          onChange={e => onChange(e.target.value as T)}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 8,
            border: `1.5px solid ${DS.border}`,
            fontSize: 14,
            fontWeight: 600,
            color: DS.deepForest,
            backgroundColor: DS.white,
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%234B5563' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            cursor: "pointer",
          }}
        >
          {tabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: `1px solid ${DS.border}` }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{ padding: "10px 18px", border: "none", cursor: "pointer", borderRadius: "8px 8px 0 0", fontSize: 13, fontWeight: 600, backgroundColor: active === t.id ? DS.deepForest : "transparent", color: active === t.id ? DS.white : DS.textGrey }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function AuditReport() {
  const [active, setActive] = useState("landing");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close drawer on section change
  const navigate = useCallback((id: string) => {
    setActive(id);
    setDrawerOpen(false);
  }, []);

  // Close drawer on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (active === "landing") {
    return (
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <LandingSection onEnter={(id) => navigate(id)} />
      </div>
    );
  }

  const currentIndex = NAV.findIndex(n => n.id === active);
  const prevSection  = currentIndex > 0             ? NAV[currentIndex - 1] : null;
  const nextSection  = currentIndex < NAV.length - 1 ? NAV[currentIndex + 1] : null;

  const renderSection = () => {
    switch (active) {
      case "intro":          return <IntroSection />;
      case "executive":      return <ExecutiveSection />;
      case "cartographie":   return <CartographieSection isMobile={isMobile} />;
      case "data":           return <DataSection isMobile={isMobile} />;
      case "ia":             return <AISection />;
      case "processus":      return <ProcessSection isMobile={isMobile} />;
      case "transformation": return <TransformationSection isMobile={isMobile} />;
      default:               return <Placeholder label={NAV.find(n => n.id === active)?.label ?? ""} />;
    }
  };

  // ── Sidebar nav content (shared by sidebar + drawer) ──
  const SidebarContent = () => (
    <>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={() => navigate("landing")} style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 14 }}>
          <Home size={12} color={DS.sageLight} />
          <span style={{ fontSize: 11, color: DS.sageLight, fontWeight: 600, letterSpacing: "0.05em" }}>Back to overview</span>
        </button>
        <p style={{ fontSize: 15, fontWeight: 800, color: DS.white, margin: "0 0 2px", lineHeight: 1.3 }}>IT, Data & AI Audit</p>
        <p style={{ fontSize: 12, color: DS.sageLight, margin: 0 }}>Groupement EHPAD</p>
      </div>
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {NAV.map(n => {
          const Icon = n.icon;
          const isActive = active === n.id;
          return (
            <button key={n.id} onClick={() => navigate(n.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 3, textAlign: "left", backgroundColor: isActive ? DS.sage : "transparent", color: isActive ? DS.deepForest : DS.sageLight }}>
              <Icon size={14} />
              <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, lineHeight: 1.3 }}>{n.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ fontSize: 11, color: DS.sageLight, margin: "0 0 2px" }}>Version 1.0 · April 2026</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", margin: 0 }}>CONFIDENTIAL</p>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: DS.lightGrey }}>

      {/* ── DESKTOP SIDEBAR (≥1024px) ── */}
      {!isMobile && (
        <aside style={{ width: 248, backgroundColor: DS.deepForest, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
          <SidebarContent />
        </aside>
      )}

      {/* ── MOBILE DRAWER OVERLAY (<1024px) ── */}
      {isMobile && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 40, backdropFilter: "blur(2px)" }}
        />
      )}
      {isMobile && (
        <aside style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: 272,
          backgroundColor: DS.deepForest,
          display: "flex", flexDirection: "column",
          zIndex: 50,
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: drawerOpen ? "4px 0 32px rgba(0,0,0,0.35)" : "none",
        }}>
          {/* Close button inside drawer */}
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ position: "absolute", top: 16, right: 14, background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, color: DS.sageLight }}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
          <SidebarContent />
        </aside>
      )}

      {/* ── CONTENT ── */}
      <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ position: "sticky", top: 0, zIndex: 30, backgroundColor: DS.deepForest, display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: DS.white, display: "flex", alignItems: "center" }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: DS.white, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {NAV.find(n => n.id === active)?.label ?? ""}
              </p>
            </div>
            <button onClick={() => navigate("landing")} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", gap: 5, color: DS.sageLight }}>
              <Home size={14} />
            </button>
          </div>
        )}

        <div style={{ maxWidth: 900, margin: "0 auto", padding: isMobile ? "24px 16px 100px" : "44px 44px 100px", width: "100%" }}>
          {renderSection()}

          {/* ── PREV / NEXT NAVIGATION ── */}
          <div style={{ display: "flex", gap: 12, marginTop: 48, paddingTop: 24, borderTop: `1px solid ${DS.border}` }}>
            {prevSection ? (
              <button
                onClick={() => navigate(prevSection.id)}
                style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 10, border: `1.5px solid ${DS.border}`, backgroundColor: DS.white, cursor: "pointer", textAlign: "left" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = DS.sage; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = DS.border; }}
              >
                <ChevronRight size={16} color={DS.sage} style={{ transform: "rotate(180deg)", flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, color: DS.sageLight, margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Previous</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: DS.deepForest, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prevSection.label}</p>
                </div>
              </button>
            ) : <div style={{ flex: 1 }} />}

            {nextSection ? (
              <button
                onClick={() => navigate(nextSection.id)}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "14px 18px", borderRadius: 10, border: `1.5px solid ${DS.border}`, backgroundColor: DS.white, cursor: "pointer", textAlign: "right" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = DS.sage; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = DS.border; }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11, color: DS.sageLight, margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Next</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: DS.deepForest, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nextSection.label}</p>
                </div>
                <ChevronRight size={16} color={DS.sage} style={{ flexShrink: 0 }} />
              </button>
            ) : <div style={{ flex: 1 }} />}
          </div>
        </div>
      </main>
    </div>
  );
}
