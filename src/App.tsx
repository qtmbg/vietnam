import React, { useState } from 'react';
import { 
  BarChart, Calendar, CheckCircle2, ChevronRight, CircleDollarSign, 
  Layers, Lightbulb, LineChart, Shield, Target, Zap, Clock, Users,
  Globe, FileText, ArrowRight, Check
} from 'lucide-react';

// --- DATA STRUCTURES ---

const roadmapData = [
  {
    month: 1,
    name: "March 2026",
    title: "Agitation",
    theme: "Your project runs on duct tape.",
    accent: "text-[#F59E0B]", // Amber
    dot: "bg-[#F59E0B]",
    desc: "Build the waitlist and seed the conversation before the April 29 V2.0 launch.",
    deliverables: [
      "4x LinkedIn Founder Posts (Thought leadership on tool fragmentation crisis)",
      "2x Instagram Reels (\"The Friday Nightmare\" — timesheet chaos visualization)",
      "2x LinkedIn Carousels (Before/After: 8 tools vs. 1 Lacroo screen)",
      "1x Long-Form Article — \"Why Your $20M Project Runs on Duct Tape\"",
      "1x Email Nurture Sequence (7-email automated ICP journey)",
      "1x Gated Lead Magnet — \"Civil Tech Stack Audit\" checklist",
      "Paid Amplification: $500 (LinkedIn waitlist retargeting)"
    ],
    kpis: ["400+ waitlist signups", "15,000 LinkedIn impressions", "2,500 article views", "8% email open rate"]
  },
  {
    month: 2,
    name: "April 2026",
    title: "Launch",
    theme: "The AI Construction OS is live.",
    accent: "text-[#8B5CF6]", // Purple
    dot: "bg-[#8B5CF6]",
    desc: "The V2.0 migration email goes out to 1,300+ existing users April 29. Content must prime the market before that date lands.",
    deliverables: [
      "Launch Announcement Sequence: 3x LinkedIn, 2x Instagram, 1x Email blast",
      "Product Demo Video Series: 4x short-form videos showcasing core modules",
      "Interactive ROI Calculator — embedded on homepage",
      "2x Case Study Teasers (LinkedIn carousels)",
      "Newsletter Launch — \"The Blueprint\" Issue #1",
      "4x Instagram Reels (UI walkthroughs with calm voiceover)",
      "1x 7-Day Automated Email Nurture (ICP-routed)",
      "Paid Amplification: $1,200 (peak launch week)"
    ],
    kpis: ["200 active trial signups", "50,000 launch week impressions", "30% waitlist-to-trial conversion", "ROI calculator: 150 uses"]
  },
  {
    month: 3,
    name: "May 2026",
    title: "Field Proof & Event Authority",
    theme: "We're in the field. Are you?",
    accent: "text-[#10B981]", // Green
    dot: "bg-[#10B981]",
    desc: "Brisbane Future of Construction Summit (May 19–20) is the single highest-leverage IRL moment.",
    deliverables: [
      "Brisbane FCON26 Summit Pack (Pre, Live, Post coverage)",
      "\"Product in the Wild\" Series: 4x IG posts showing Lacroo on tablets",
      "1x Long-Form Article — \"Predictive vs. Reactive Cost Management\"",
      "The Blueprint Issues #2 & #3",
      "3x LinkedIn Founder Posts (technical deep-dives)",
      "Paid Amplification: $600 (geo-fenced Instagram ads near venue)"
    ],
    kpis: ["80 qualified leads from summit", "25,000 geo-targeted impressions", "8% content engagement rate", "3 on-site testimonials"]
  },
  {
    month: 4,
    name: "June 2026",
    title: "Commercial Pivot",
    theme: "Built for the field. Trusted by the boardroom.",
    accent: "text-[#3B82F6]", // Blue
    dot: "bg-[#3B82F6]",
    desc: "Shift messaging from supervisors to CFOs, Commercial Managers, and Procurement leads — the people who sign contracts.",
    deliverables: [
      "3x Audited Case Studies (PDF format, dark UI branding)",
      "1x Procurement Readiness Pack (Gated PDF: Security, SOC2, SLAs)",
      "4x LinkedIn ABM Campaigns (Targeted to Commercial Managers)",
      "The Blueprint Issues #4 & #5 (ROI justification)",
      "2x Instagram Educational Carousels",
      "1x Long-Form Article — \"Procore vs. Lacroo: A TCO Comparison\"",
      "Paid Amplification: $800 (LinkedIn Lead Gen Forms)"
    ],
    kpis: ["120 case study downloads", "60 enterprise demo requests", "40% email open rate", "15% demo-to-trial conversion"]
  },
  {
    month: 5,
    name: "July 2026",
    title: "Automation & SEO",
    theme: "The machine runs itself. The pipeline keeps moving.",
    accent: "text-[#8B5CF6]",
    dot: "bg-[#8B5CF6]",
    desc: "Scale back paid spend. The organic flywheel — SEO, nurture sequences, newsletter compounding — should now be self-feeding.",
    deliverables: [
      "SEO Content Cluster: 2x long-form articles",
      "The Blueprint Issues #6 & #7 (Advanced workflow tips)",
      "4x LinkedIn Founder Posts (Category leadership)",
      "2x Instagram Reels (Customer testimonials)",
      "Zapier/CRM Automation Optimization",
      "Paid Amplification: $400 (Google Search ads)"
    ],
    kpis: ["10,000 organic search visits", "50 inbound demo requests", "5+ backlinks", "25% trial-to-paid conversion"]
  },
  {
    month: 6,
    name: "August 2026",
    title: "Expansion",
    theme: "The community is the moat.",
    accent: "text-[#3B82F6]",
    dot: "bg-[#3B82F6]",
    desc: "Convert happy users into vocal advocates. Shift from acquisition to retention and expansion revenue.",
    deliverables: [
      "Customer Success Spotlight Series: 4x LinkedIn posts",
      "1x Webinar — \"Mastering Lacroo: Advanced Forecasting\"",
      "The Blueprint Issues #8 & #9",
      "3x Instagram Reels (Feature announcements)",
      "In-App Referral Campaign Assets",
      "1x Long-Form Article — \"Why Tech Consolidation in 2026\"",
      "Paid Amplification: $500 (Retargeting campaigns)"
    ],
    kpis: ["40% trial-to-paid conversion", "25 referrals", "150 webinar registrations", "80 attendees"]
  }
];

const inventoryData = [
  { type: "Long-Form SEO Articles", vol: "6", dist: "Blog, Medium, LinkedIn Articles" },
  { type: "The Blueprint Newsletter", vol: "9 issues", dist: "Email, Substack" },
  { type: "LinkedIn Founder Posts", vol: "22", dist: "Organic + boosted" },
  { type: "LinkedIn Carousels/ABM", vol: "10", dist: "Organic + ABM targeting" },
  { type: "Instagram Reels", vol: "19", dist: "Organic + selective boosts" },
  { type: "Instagram Stories/Posts", vol: "15", dist: "Event coverage, product demos" },
  { type: "Case Studies (PDF)", vol: "3", dist: "Gated downloads" },
  { type: "Demo Videos", vol: "4", dist: "YouTube, landing pages, homepage" },
  { type: "Email Sequences", vol: "2 (14 total)", dist: "Automated nurture" },
  { type: "Interactive Tools", vol: "1", dist: "Homepage embed (ROI Calc)" },
  { type: "Webinar", vol: "1", dist: "Gated registration" },
  { type: "Gated PDFs/Packs", vol: "2", dist: "Lead/Procurement capture" }
];

const kpiData = [
  { metric: "Qualified Leads (MQL)", target: "800+", desc: "Pipeline health" },
  { metric: "Active Paying Customers", target: "150", desc: "Revenue traction" },
  { metric: "Total Impressions", target: "250k+", desc: "Brand reach (organic + paid)" },
  { metric: "Newsletter Subscribers", target: "15,000+", desc: "Owned audience for retargeting" },
  { metric: "Monthly Organic Visits", target: "15,000", desc: "Reduced CAC dependency" },
  { metric: "Customer Acquisition Cost", target: "<$400", desc: "Unit economics viability" }
];

// --- COMPONENTS ---

const Logo = () => (
  <div className="flex items-center text-xl tracking-tight font-extrabold select-none">
    <span className="text-white">lacroo</span>
    <span className="text-[#8B5CF6]">.ai</span>
  </div>
);

const TrafficLights = ({ dotColor = "bg-[#8B5CF6]" }) => (
  <div className="flex gap-1.5 items-center">
    <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
  </div>
);

const Badge = ({ children, color = "purple" }) => {
  const colors = {
    purple: "bg-[#8B5CF6] text-white",
    amber: "bg-[#F59E0B] text-white",
    blue: "bg-[#3B82F6] text-white",
    green: "bg-[#10B981] text-white",
    dark: "bg-[#2A2A2A] text-gray-300"
  };
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 w-fit ${colors[color]}`}>
      {children}
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('strategy');
  const [activeMonth, setActiveMonth] = useState(1);
  const [budgetPlan, setBudgetPlan] = useState('lean');

  const renderNav = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center gap-8">
          {['strategy', 'roadmap', 'inventory', 'budget'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
          Approve Proposal
        </button>
      </div>
    </nav>
  );

  const renderStrategy = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto pt-12 text-center mb-20">
        <Badge color="purple" className="mx-auto mb-6"><Zap size={14} /> THE PROPOSAL</Badge>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
          Content-First <br/>
          <span className="text-[#8B5CF6]">Growth Strategy.</span>
        </h1>
        <p className="text-[#9CA3AF] text-xl max-w-2xl mx-auto leading-relaxed">
          Positioning Lacroo as the <span className="text-white font-bold">single data layer</span> for Australian Tier 1 civil infrastructure. We are not another SaaS tool; we are the OS that replaces 20+ disconnected ones.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="bg-[#1C1C1E] border border-[#2A2A2A] rounded-xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#F59E0B]"></div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#F59E0B] mb-4">The Market Opportunity</p>
          <h3 className="text-2xl text-white font-bold mb-4">The $250B Consolidation Window</h3>
          <p className="text-[#9CA3AF] leading-relaxed mb-6">
            64% of Australian firms invested in digitalisation last year, yet tools remain fragmented. Varicon lacks Lacroo's MA000025-compliant positioning. <span className="text-white font-bold">That gap is the wedge.</span>
          </p>
        </div>

        <div className="bg-[#1C1C1E] border border-[#2A2A2A] rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#8B5CF6]"></div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#8B5CF6] mb-4">Strategic North Star</p>
          <h3 className="text-2xl text-white font-bold mb-4">Capture "Ian Slap"</h3>
          <p className="text-[#9CA3AF] leading-relaxed">
            Move Civil Engineers and Commercial Managers from awareness → conviction → champion. No wasted brand awareness plays. Every asset is engineered to accelerate a buying decision.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-16">
         <h3 className="text-2xl text-white font-bold mb-8 text-center">6-Month Success Targets</h3>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {kpiData.map((kpi, i) => (
              <div key={i} className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2A2A2A]">
                <div className="text-[#8B5CF6] font-mono text-3xl font-bold mb-2">{kpi.target}</div>
                <div className="text-white font-semibold mb-1">{kpi.metric}</div>
                <div className="text-gray-500 text-sm">{kpi.desc}</div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderRoadmap = () => {
    const activeData = roadmapData.find(d => d.month === activeMonth);

    return (
      <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pt-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-white tracking-tighter mb-4">The 6-Month Roadmap</h2>
          <p className="text-[#9CA3AF]">Precision execution, step-by-step category takeover.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Timeline Selector */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            {roadmapData.map(m => (
              <button
                key={m.month}
                onClick={() => setActiveMonth(m.month)}
                className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 flex items-center justify-between border ${
                  activeMonth === m.month 
                    ? `bg-[#1C1C1E] border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]` 
                    : `bg-[#161616] border-transparent text-gray-500 hover:bg-[#1A1A1A] hover:text-gray-300`
                }`}
              >
                <div>
                  <div className="text-xs font-mono mb-1">MONTH 0{m.month}</div>
                  <div className="font-bold text-sm">{m.title}</div>
                </div>
                {activeMonth === m.month && <ChevronRight size={16} className="text-[#8B5CF6]" />}
              </button>
            ))}
          </div>

          {/* Software-style Detail View */}
          <div className="flex-1 bg-[#1C1C1E] rounded-xl border border-[#2A2A2A] overflow-hidden flex flex-col shadow-2xl">
            {/* Window Header */}
            <div className="bg-[#161616] px-4 py-3 border-b border-[#2A2A2A] flex items-center justify-between">
              <TrafficLights dotColor={activeData.dot} />
              <div className="text-gray-400 text-xs font-mono flex items-center gap-2">
                <Calendar size={12}/> roadmap_m0{activeData.month}.config
              </div>
              <div className="w-12"></div> {/* Spacer for balance */}
            </div>

            {/* Window Content */}
            <div className="p-8 md:p-10 flex-1 relative">
              <p className={`text-xs font-semibold tracking-widest uppercase mb-4 ${activeData.accent}`}>
                PHASE {activeData.month} — {activeData.name}
              </p>
              <h3 className="text-3xl font-bold text-white mb-2">{activeData.title}</h3>
              <p className="text-xl text-white font-medium italic mb-6">"{activeData.theme}"</p>
              
              <p className="text-[#9CA3AF] mb-10 leading-relaxed max-w-2xl">
                {activeData.desc}
              </p>

              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Layers size={18} className="text-[#8B5CF6]" /> Deliverables
                  </h4>
                  <ul className="space-y-3">
                    {activeData.deliverables.map((item, i) => (
                      <li key={i} className="text-[#9CA3AF] text-sm flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-gray-600 shrink-0 mt-0.5" />
                        <span dangerouslySetInnerHTML={{__html: item.replace(/(\d+x|\$\d+(?:,\d+)?)/g, '<strong class="text-white">$1</strong>')}} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Target size={18} className="text-[#10B981]" /> Success KPIs
                  </h4>
                  <div className="space-y-3">
                    {activeData.kpis.map((kpi, i) => (
                      <div key={i} className="bg-[#161616] border border-[#2A2A2A] rounded-lg p-3 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                        <span className="text-white font-mono text-sm">{kpi}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Window Footer */}
            <div className="bg-[#161616] border-t border-[#2A2A2A] px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#8B5CF6] font-mono">
                <Zap size={14} /> AI-Assisted Output Validation Active
              </div>
              <Badge color="dark">Status: Ready</Badge>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInventory = () => (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pt-8">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Content Inventory (103 Assets)</h2>
        <p className="text-[#9CA3AF]">Strategically mapped to the buyer journey over 6 months.</p>
      </div>

      <div className="bg-[#1C1C1E] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161616] border-b border-[#2A2A2A]">
                <th className="p-5 text-xs font-semibold tracking-widest uppercase text-gray-500">Asset Type</th>
                <th className="p-5 text-xs font-semibold tracking-widest uppercase text-gray-500">Volume</th>
                <th className="p-5 text-xs font-semibold tracking-widest uppercase text-gray-500">Distribution / Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {inventoryData.map((row, i) => (
                <tr key={i} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="p-5 text-white font-medium">{row.type}</td>
                  <td className="p-5 text-[#8B5CF6] font-mono font-bold">{row.vol}</td>
                  <td className="p-5 text-[#9CA3AF] text-sm">{row.dist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#161616] border-t border-[#2A2A2A] p-4 text-center">
          <p className="text-sm text-gray-400 font-mono">Total Assets to be Produced: <span className="text-white font-bold text-lg ml-2">103 pieces</span></p>
        </div>
      </div>
    </div>
  );

  const renderBudget = () => (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pt-8">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-white tracking-tighter mb-4">Budget Allocation</h2>
        <p className="text-[#9CA3AF]">Risk-appropriate models for a scaling startup.</p>
      </div>

      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-[#161616] p-1 rounded-full border border-[#2A2A2A] inline-flex">
          <button 
            onClick={() => setBudgetPlan('lean')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${budgetPlan === 'lean' ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Option A: Lean Startup
          </button>
          <button 
            onClick={() => setBudgetPlan('full')}
            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all ${budgetPlan === 'full' ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            Option B: Full-Service
          </button>
        </div>
      </div>

      {/* Active Plan Details */}
      <div className="bg-[#1C1C1E] border border-[#2A2A2A] rounded-xl p-8 md:p-12 relative overflow-hidden max-w-3xl mx-auto">
        {budgetPlan === 'lean' && <div className="absolute top-4 right-4"><Badge color="green">Recommended</Badge></div>}
        
        <h3 className="text-3xl font-bold text-white mb-2">
          {budgetPlan === 'lean' ? 'Lean Startup Model' : 'Full-Service Model'}
        </h3>
        <p className="text-[#9CA3AF] mb-8">
          {budgetPlan === 'lean' 
            ? 'Assumes in-house content creation by founders. 100% of budget goes to distribution.' 
            : 'Includes external content production, copywriting, design, and video editing.'}
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
            <span className="text-white font-medium">LinkedIn Ads (ABM + Retargeting)</span>
            <span className="text-[#8B5CF6] font-mono font-bold">{budgetPlan === 'lean' ? '$2,500' : '$4,000'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
            <span className="text-white font-medium">Google Search Ads</span>
            <span className="text-[#8B5CF6] font-mono font-bold">{budgetPlan === 'lean' ? '$800' : '$2,000'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
            <span className="text-white font-medium">Meta / Instagram Ads</span>
            <span className="text-[#8B5CF6] font-mono font-bold">{budgetPlan === 'lean' ? '$1,200' : '$1,500'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
            <span className="text-white font-medium">Event Geo-Fencing (Brisbane Summit)</span>
            <span className="text-[#8B5CF6] font-mono font-bold">{budgetPlan === 'lean' ? '$600' : '$1,000'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
            <span className="text-white font-medium">Automation Stack & CRM</span>
            <span className="text-[#8B5CF6] font-mono font-bold">{budgetPlan === 'lean' ? '$600' : '$1,000'}</span>
          </div>
          {budgetPlan === 'full' && (
            <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A]">
              <span className="text-white font-medium flex items-center gap-2"><FileText size={16} className="text-[#F59E0B]"/> External Content Production</span>
              <span className="text-[#F59E0B] font-mono font-bold">+$8,000 - $12,000</span>
            </div>
          )}
        </div>

        <div className="bg-[#161616] rounded-lg p-6 flex items-center justify-between border border-[#2A2A2A]">
          <span className="text-xl text-white font-bold">Total Estimate</span>
          <span className="text-4xl text-white font-mono font-bold">
            {budgetPlan === 'lean' ? '$6,000' : '$18,000+'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white selection:bg-[#8B5CF6] selection:text-white pb-24">
      {renderNav()}
      
      <main className="pt-24 px-6">
        {activeTab === 'strategy' && renderStrategy()}
        {activeTab === 'roadmap' && renderRoadmap()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'budget' && renderBudget()}
      </main>

      {/* Floating App-like Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/80 backdrop-blur-md border-t border-[#1A1A1A] py-4 px-6 z-40 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500 font-mono">DOCUMENT: LACROO_Q1_PROPOSAL.AI</span>
            <span className="text-xs text-[#10B981] font-mono flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span> SYSTEM LIVE</span>
          </div>
          <div className="text-xs text-gray-500">
            The AI Construction OS <span className="text-[#8B5CF6] ml-2">⚡</span>
          </div>
        </div>
      </div>
    </div>
  );
}
