import { useState, useMemo, useEffect, useCallback } from "react";

const DEFAULT_CONFS = [
  { id:"infocom27", name:"INFOCOM '27", rank:"A*", cycle:"", deadline:"2026-07-31", notify:"2026-12-08", conf:"May 24–27, 2027", loc:"Honolulu, HI", url:"https://infocom2027.ieee-infocom.org/", tags:["networking"], note:"Abstracts Jul 24. IEEE.", sq:"INFOCOM 2027 paper submission deadline", custom:false },
  { id:"hotnets26", name:"HotNets '26", rank:"A*", cycle:"", deadline:"2026-07-16", notify:"2026-09-24", conf:"Nov 16–17, 2026", loc:"Salt Lake City, UT", url:"https://conferences.sigcomm.org/hotnets/2026/", tags:["networking"], note:"Workshop. Position papers.", sq:"HotNets 2026 submission deadline", custom:false },
  { id:"mobicom27", name:"MobiCom '27", rank:"A*", cycle:"Summer", deadline:"2026-09-02", notify:"2026-11-19", conf:"Oct 18-24, 2027", loc:"TBD", url:"https://www.sigmobile.org/mobicom/", tags:["mobile","networking"], note:"Multi-deadline model.", sq:"MobiCom 2027 summer submission deadline", custom:false },
  { id:"percom27", name:"PerCom '27", rank:"A*", cycle:"", deadline:"2026-09-11", notify:"2026-12-18", conf:"Mar 8–12, 2027", loc:"Goa, India", url:"https://percom.org/", tags:["pervasive","mobile","sensing"], note:"IEEE. 25th edition.", sq:"PerCom 2027 paper submission deadline", custom:false },
  { id:"chi27", name:"CHI '27", rank:"A*", cycle:"", deadline:"2026-09-10", notify:"2026-12-17", conf:"May 10–14, 2027", loc:"Pittsburgh, PA", url:"https://chi2027.acm.org/", tags:["HCI"], note:"No abstract deadline. R&R Dec 3.", sq:"CHI 2027 paper submission deadline", custom:false },
  { id:"nsdi27f", name:"NSDI '27", rank:"A*", cycle:"Fall", deadline:"2026-09-17", notify:"2026-12-08", conf:"May 11–13, 2027", loc:"Providence, RI", url:"https://www.usenix.org/conference/nsdi27", tags:["networking","systems"], note:"Abstracts Sep 10. USENIX.", sq:"NSDI 2027 fall submission deadline", custom:false },
  { id:"imwut-nov", name:"IMWUT", rank:"A*", cycle:"Nov '26", deadline:"2026-11-01", notify:"~Feb 2027", conf:"UbiComp '27", loc:"TBD", url:"https://dl.acm.org/journal/imwut/how-to-submit", tags:["ubicomp","mobile","sensing"], note:"Rolling journal, 3x/yr.", sq:"IMWUT November 2026 submission deadline", custom:false },
  { id:"sensys27-2", name:"SenSys '27", rank:"A*", cycle:"Round 2", deadline:"2026-11-05", notify:"2027-01-28", conf:"May 17-20, 2027", loc:"Boulder, CO, USA", url:"https://sensys.acm.org/2027/cfp.html", tags:["sensing","embedded","IoT"], note:"Merged IPSN+IoTDI. CPS-IoT Week.", sq:"SenSys 2027 round 2 submission deadline", custom:false },
  { id:"mobisys27", name:"MobiSys '27", rank:"A*", cycle:"", deadline:"2026-12-05", notify:"2027-03-05", conf:"Jun 2027", loc:"TBD", url:"https://www.sigmobile.org/mobisys/", tags:["mobile","systems"], note:"", sq:"MobiSys 2027 paper submission deadline", custom:false },
  { id:"imwut-feb", name:"IMWUT", rank:"A*", cycle:"Feb '27", deadline:"2027-02-01", notify:"~May 2027", conf:"UbiComp '27", loc:"TBD", url:"https://dl.acm.org/journal/imwut/how-to-submit", tags:["ubicomp","mobile","sensing"], note:"Rolling journal.", sq:"IMWUT February 2027 deadline", custom:false },
  { id:"imwut-may", name:"IMWUT", rank:"A*", cycle:"May '27", deadline:"2027-05-01", notify:"~Aug 2027", conf:"UbiComp '27/28", loc:"TBD", url:"https://dl.acm.org/journal/imwut/how-to-submit", tags:["ubicomp","mobile","sensing"], note:"Rolling journal.", sq:"IMWUT May 2027 deadline", custom:false },
  { id:"imc26", name:"IMC '26", rank:"A", cycle:"Cycle 2", deadline:"2026-04-29", notify:"2026-08-04", conf:"Oct 12–16, 2026", loc:"Karlsruhe, DE", url:"https://conferences.sigcomm.org/imc/2026/", tags:["networking","measurement"], note:"Two deadlines/yr.", sq:"IMC 2026 cycle 2 submission deadline", custom:false },
  { id:"conext26", name:"CoNEXT '26", rank:"A", cycle:"June", deadline:"2026-06-05", notify:"2026-09-11", conf:"Dec 7–10, 2026", loc:"Utrecht, NL", url:"https://conferences.sigcomm.org/co-next/2026/", tags:["networking"], note:"", sq:"CoNEXT 2026 June submission deadline", custom:false },
  { id:"hotmobile27", name:"HotMobile '27", rank:"A", cycle:"", deadline:"2026-10-9", notify:"2026-12-16", conf:"Feb 24–25, 2027", loc:"Tucson, AZ", url:"https://www.sigmobile.org/hotmobile/2027/", tags:["mobile"], note:"Deadline est. ~Oct.", sq:"HotMobile 2027 submission deadline", custom:false },
  { id:"mobihoc26", name:"MobiHoc '26", rank:"A", cycle:"", deadline:"2026-04-06", notify:"2026-08-23", conf:"Nov 23–26, 2026", loc:"Tokyo, Japan", url:"https://www.sigmobile.org/mobihoc/2026/", tags:["mobile","networking"], note:"Expanded scope 2026.", sq:"MobiHoc 2026 paper submission deadline", custom:false },
  { id:"rfid27", name:"IEEE RFID '27", rank:"B+", cycle:"", deadline:"2027-01-15", notify:"~Mar 2027", conf:"Jun 2027", loc:"USA (TBD)", url:"https://www.ieee-rfid.org/conferences/", tags:["RFID","IoT","wireless"], note:"Deadline est. Verify.", sq:"IEEE RFID 2027 paper submission deadline", custom:false },
  { id:"ewsn26", name:"EWSN '26", rank:"B+", cycle:"Spring", deadline:"2026-05-03", notify:"2026-07-15", conf:"Sep 16–18, 2026", loc:"Dresden, DE", url:"https://ewsn26.netd.cs.tu-dresden.de/", tags:["embedded","wireless","IoT"], note:"Battery-free AirTag target.", sq:"EWSN 2026 spring submission deadline", custom:false },
  { id:"islped26", name:"ISLPED '26", rank:"B+", cycle:"", deadline:"2026-03-15", notify:"2026-05-15", conf:"Aug 5–7, 2026", loc:"Chicago, IL", url:"https://www.islped.org/", tags:["low-power","electronics"], note:"M2 demo accepted.", sq:"ISLPED 2026 submission deadline", custom:false },
  { id:"buildsys26", name:"BuildSys '26", rank:"B+", cycle:"", deadline:"2026-02-15", notify:"2026-04-15", conf:"Jun 22–25, 2026", loc:"Banff, Canada", url:"https://buildsys.acm.org/2026/", tags:["systems","IoT"], note:"ACM Sustainability Week.", sq:"BuildSys 2026 paper submission deadline", custom:false },
  { id:"sigcomm26", name:"SIGCOMM '26", rank:"A*", cycle:"", deadline:"2026-01-30", notify:"2026-05-15", conf:"Aug 17–21, 2026", loc:"Denver, CO", url:"https://conferences.sigcomm.org/sigcomm/2026/", tags:["networking"], note:"", sq:"SIGCOMM 2026 submission deadline", custom:false },
  { id:"sensys27-1", name:"SenSys '27", rank:"A*", cycle:"Round 1", deadline:"2026-06-05", notify:"2026-08-31", conf:"May 11, 2027", loc:"New York City", url:"https://sensys.acm.org/2027/cfp.html", tags:["sensing","embedded","IoT"], note:"Merged SenSys+IPSN+IoTDI.", sq:"SenSys 2027 round 1 submission deadline", custom:false },
];

const ALL_TAGS = ["networking","mobile","systems","sensing","embedded","IoT","HCI","ubicomp","pervasive","wireless","RFID","measurement","low-power","electronics"];
const TE = {networking:"🌐",mobile:"📱",systems:"⚙️",sensing:"📡",embedded:"🔧",IoT:"💡",HCI:"🖱️",ubicomp:"🏠",pervasive:"🔗",wireless:"📶",RFID:"🏷️",measurement:"📊","low-power":"🔋",electronics:"⚡"};
const RS = {"A*":{bg:"#151528",fg:"#f0e8ff"},"A":{bg:"#2a4470",fg:"#fff"},"B+":{bg:"#606878",fg:"#fff"},"B":{bg:"#808890",fg:"#fff"},"C":{bg:"#a0a0a8",fg:"#fff"}};
const RANKS = ["A*","A","B+","B","C"];

function parseD(d){if(!d)return null;return new Date(d+"T23:59:00")}
function daysTo(s){const d=parseD(s);if(!d)return null;const n=new Date();n.setHours(0,0,0,0);return Math.ceil((d-n)/864e5)}
function fmt(s){if(!s||s.startsWith("~"))return s||"TBD";const d=new Date(s+"T00:00:00");return d.toLocaleDateString("en-US",{month:"short",day:"numeric"})}
function urg(d){if(d===null)return{fg:"#999",ac:"#ddd"};if(d<0)return{fg:"#b8b0a0",ac:"#ddd"};if(d<=14)return{fg:"#c0392b",ac:"#e74c3c"};if(d<=45)return{fg:"#d4880e",ac:"#f39c12"};if(d<=90)return{fg:"#27864a",ac:"#27ae60"};return{fg:"#4a6fa5",ac:"#5b8ec9"}}
function ago(ts){if(!ts)return"Never";const m=Math.floor((Date.now()-ts)/6e4);if(m<1)return"Just now";if(m<60)return`${m}m ago`;const h=Math.floor(m/60);if(h<24)return`${h}h ago`;const d=Math.floor(h/24);return`${d}d ago`}

const SK="conf-deadlines-v3", VK="conf-last-verified", CK="conf-changes";

export default function App(){
  const[confs,setConfs]=useState(DEFAULT_CONFS);
  const[lastV,setLastV]=useState(null);
  const[changes,setChanges]=useState({});
  const[view,setView]=useState("upcoming");
  const[at,setAt]=useState([]);
  const[search,setSearch]=useState("");
  const[verifying,setVerifying]=useState(false);
  const[vProg,setVProg]=useState({done:0,total:0,cur:""});
  const[vRes,setVRes]=useState(null);
  const[showAdd,setShowAdd]=useState(false);
  const[addForm,setAddForm]=useState({name:"",rank:"A",deadline:"",notify:"",conf:"",loc:"",url:"",tags:"",note:"",cycle:""});
  const[editId,setEditId]=useState(null);
  const[confirmDel,setConfirmDel]=useState(null);

  useEffect(()=>{(async()=>{
    try{const r=(() => { try { const v = localStorage.getItem(SK); return v ? { value: v } : null } catch(e) { return null } })();if(r?.value){const p=JSON.parse(r.value);if(p.length)setConfs(p)}}catch(e){}
    try{const r=(() => { try { const v = localStorage.getItem(VK); return v ? { value: v } : null } catch(e) { return null } })();if(r?.value)setLastV(parseInt(r.value))}catch(e){}
    try{const r=(() => { try { const v = localStorage.getItem(CK); return v ? { value: v } : null } catch(e) { return null } })();if(r?.value)setChanges(JSON.parse(r.value))}catch(e){}
  })()},[]);

  const save=useCallback(async(c)=>{try{localStorage.setItem(SK,JSON.stringify(c))}catch(e){}},[]);

  const tog=t=>setAt(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);
  const ut=useMemo(()=>{const s=new Set();confs.forEach(c=>c.tags.forEach(t=>s.add(t)));return[...new Set([...ALL_TAGS.filter(t=>s.has(t)),...[...s].filter(t=>!ALL_TAGS.includes(t))])];},[confs]);

  const list=useMemo(()=>{
    let l=[...confs];
    if(search.trim()){const q=search.toLowerCase();l=l.filter(c=>c.name.toLowerCase().includes(q)||c.loc?.toLowerCase().includes(q)||(c.cycle||"").toLowerCase().includes(q)||c.tags.some(t=>t.toLowerCase().includes(q))||(c.note||"").toLowerCase().includes(q))}
    if(at.length)l=l.filter(c=>c.tags.some(t=>at.includes(t)));
    if(view==="upcoming")l=l.filter(c=>{const d=daysTo(c.deadline);return d===null||d>=0});
    else if(view==="passed")l=l.filter(c=>{const d=daysTo(c.deadline);return d!==null&&d<0});
    l.sort((a,b)=>{const da=parseD(a.deadline),db=parseD(b.deadline);if(!da&&!db)return 0;if(!da)return 1;if(!db)return -1;return da-db});
    return l;
  },[view,at,confs,search]);

  const nx=list.find(c=>{const d=daysTo(c.deadline);return d!==null&&d>=0});

  // Add conference
  const handleAdd=()=>{
    if(!addForm.name||!addForm.deadline)return;
    const id=addForm.name.toLowerCase().replace(/[^a-z0-9]/g,"")+"-"+Date.now().toString(36);
    const tags=addForm.tags.split(",").map(t=>t.trim()).filter(Boolean);
    const nc={id,name:addForm.name,rank:addForm.rank,cycle:addForm.cycle,deadline:addForm.deadline,notify:addForm.notify,conf:addForm.conf,loc:addForm.loc,url:addForm.url,tags,note:addForm.note,sq:`${addForm.name} submission deadline`,custom:true};
    const up=editId?confs.map(c=>c.id===editId?{...nc,id:editId}:c):[...confs,nc];
    setConfs(up);save(up);
    setAddForm({name:"",rank:"A",deadline:"",notify:"",conf:"",loc:"",url:"",tags:"",note:"",cycle:""});
    setShowAdd(false);setEditId(null);
  };

  const startEdit=(c)=>{
    setAddForm({name:c.name,rank:c.rank,deadline:c.deadline,notify:c.notify||"",conf:c.conf||"",loc:c.loc||"",url:c.url||"",tags:c.tags.join(", "),note:c.note||"",cycle:c.cycle||""});
    setEditId(c.id);setShowAdd(true);
  };

  const delConf=(id)=>{const up=confs.filter(c=>c.id!==id);setConfs(up);save(up);setConfirmDel(null)};

  // Verify
  const verify=useCallback(async()=>{
    setVerifying(true);setVRes(null);
    const upc=confs.filter(c=>{const d=daysTo(c.deadline);return d===null||d>=0});
    const total=upc.length;setVProg({done:0,total,cur:"Starting..."});
    const nc={};const updated=[...confs];

    for(let i=0;i<upc.length;i+=3){
      const batch=upc.slice(i,i+3);
      setVProg({done:i,total,cur:batch.map(c=>c.name).join(", ")});
      try{
        const res=await fetch("/api/verify",{
          method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({conferences:batch.map(c=>({id:c.id,name:c.name,cycle:c.cycle||"",sq:c.sq,deadline:c.deadline,notify:c.notify,url:c.url}))})
        });
        const data=await res.json();
        const text=data.text||"";
        try{
          const results=JSON.parse(text.replace(/```json|```/g,"").trim());
          for(const r of results){
            if(r.changed&&r.deadline){
              const idx=updated.findIndex(c=>c.id===r.id);
              if(idx!==-1){nc[r.id]={old:updated[idx].deadline,new:r.deadline,note:r.note||""};updated[idx]={...updated[idx],deadline:r.deadline};if(r.notify)updated[idx].notify=r.notify}
            }
          }
        }catch(e){}
      }catch(e){}
    }
    setVProg({done:total,total,cur:"Done!"});
    const now=Date.now();
    setConfs(updated);setLastV(now);setChanges(nc);
    try{localStorage.setItem(SK,JSON.stringify(updated))}catch(e){}
    try{localStorage.setItem(VK,String(now))}catch(e){}
    try{localStorage.setItem(CK,JSON.stringify(nc))}catch(e){}
    setVRes(Object.keys(nc).length>0?nc:"no-changes");
    setTimeout(()=>setVerifying(false),1200);
  },[confs]);

  const F=({label,children})=><div style={{marginBottom:10}}><label style={{display:"block",fontSize:11,fontWeight:600,color:"#777",marginBottom:3,textTransform:"uppercase",letterSpacing:.8}}>{label}</label>{children}</div>;
  const inp={width:"100%",padding:"8px 12px",borderRadius:8,border:"1.5px solid #e0ddd8",fontSize:13,fontFamily:"'Inter',sans-serif",outline:"none",background:"#fafaf8",transition:"border .15s"};

  return(
  <div style={{fontFamily:"'Inter',-apple-system,system-ui,sans-serif",color:"#1e1e2e",background:"#f5f4f1",minHeight:"100vh"}}>
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    .cd{transition:transform .15s,box-shadow .15s}.cd:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.06)}
    .pl{transition:all .12s;cursor:pointer;user-select:none}.pl:hover{transform:scale(1.04)}
    .ar{opacity:0;transition:opacity .15s;font-size:11px;color:#aaa;margin-left:4px;vertical-align:1px}.cd:hover .ar{opacity:1}
    .vt{cursor:pointer;transition:all .12s;border:none;outline:none}.vt:hover{background:rgba(0,0,0,.04)!important}
    .cl:hover{color:#4a3f8a!important}
    .btn{cursor:pointer;transition:all .2s;border:none;outline:none}.btn:hover{transform:scale(1.02)}.btn:active{transform:scale(.98)}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}.pulsing{animation:pulse 1.5s infinite}
    @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}.si{animation:slideIn .3s ease-out}
    input:focus,select:focus,textarea:focus{border-color:#5a4faa!important}
    .actions{opacity:0;transition:opacity .15s}.cd:hover .actions{opacity:1}
  `}</style>

  {/* ── Header ── */}
  <div style={{background:"linear-gradient(155deg,#12121f 0%,#1e1d3a 40%,#2a2758 80%,#332e6a 100%)",padding:"40px 24px 32px",color:"#fff",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,opacity:.03,backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,.6) 1px, transparent 0)",backgroundSize:"32px 32px"}}/>
    <div style={{maxWidth:700,margin:"0 auto",position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:nx&&daysTo(nx.deadline)<=14?"#ff6b6b":"#6bffa0",boxShadow:nx&&daysTo(nx.deadline)<=14?"0 0 10px #ff6b6b":"0 0 10px #6bffa0"}}/>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:2.5,textTransform:"uppercase",color:"rgba(255,255,255,.4)",fontWeight:500}}>
          {confs.filter(c=>daysTo(c.deadline)===null||daysTo(c.deadline)>=0).length} upcoming
        </span>
      </div>
      <h1 style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,letterSpacing:-.8,lineHeight:1.15,marginBottom:6}}>Conference Deadlines</h1>
      <p style={{fontSize:13,color:"rgba(255,255,255,.38)",lineHeight:1.5}}>Battery-free sensing · Backscatter · Low-power IoT · Ubiquitous computing · HCI · RFID</p>

      {nx&&(
      <a href={nx.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",color:"inherit",display:"block"}}>
        <div style={{marginTop:22,background:"rgba(255,255,255,.06)",borderRadius:14,padding:"16px 20px",border:"1px solid rgba(255,255,255,.08)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div>
            <p style={{fontSize:10,textTransform:"uppercase",letterSpacing:2,color:"rgba(255,255,255,.3)",marginBottom:4,fontWeight:500}}>Next deadline</p>
            <p style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:600}}>{nx.name}{nx.cycle&&<span style={{fontSize:12,fontWeight:400,color:"rgba(255,255,255,.35)",marginLeft:6}}>{nx.cycle}</span>}<span style={{fontSize:11,color:"rgba(255,255,255,.25)",marginLeft:5}}>↗</span></p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:30,fontWeight:600,color:daysTo(nx.deadline)<=14?"#ff8a7a":daysTo(nx.deadline)<=45?"#ffd07a":"#8af0aa",lineHeight:1}}>{daysTo(nx.deadline)}</p>
            <p style={{fontSize:10.5,color:"rgba(255,255,255,.3)",marginTop:2}}>days · {fmt(nx.deadline)}</p>
          </div>
        </div>
      </a>)}
    </div>
  </div>

  {/* ── Verify + Add bar ── */}
  <div style={{maxWidth:700,margin:"0 auto",padding:"16px 24px 0"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",background:"#fff",borderRadius:12,padding:"12px 16px",border:"1px solid #eae8e3"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:180}}>
        <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:lastV?"#27ae60":"#f39c12"}}/>
        <div>
          <p style={{fontSize:12,fontWeight:600,color:"#333"}}>Deadline verification</p>
          <p style={{fontSize:10.5,color:"#aaa"}}>{lastV?`Last checked ${ago(lastV)}`:"Never verified"}</p>
        </div>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button className="btn" onClick={()=>{setShowAdd(!showAdd);setEditId(null);setAddForm({name:"",rank:"A",deadline:"",notify:"",conf:"",loc:"",url:"",tags:"",note:"",cycle:""})}} style={{padding:"8px 14px",borderRadius:10,background:showAdd?"#eee":"#f5f4f0",color:showAdd?"#999":"#555",fontSize:12,fontWeight:600}}>
          {showAdd?"✕ Cancel":"+ Add"}
        </button>
        <button className="btn" onClick={verify} disabled={verifying} style={{padding:"8px 16px",borderRadius:10,background:verifying?"#e8e6f0":"linear-gradient(135deg,#4a3fa0,#6355c0)",color:verifying?"#8880b0":"#fff",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:5}}>
          {verifying?<><span className="pulsing">⟳</span> {vProg.done}/{vProg.total}</>:<>🔍 Verify</>}
        </button>
      </div>
    </div>

    {verifying&&vProg.cur&&<p style={{fontSize:10.5,color:"#8880b0",marginTop:6,marginLeft:4,fontStyle:"italic"}}>Looking up {vProg.cur}…</p>}

    {vRes&&!verifying&&(
    <div className="si" style={{marginTop:8,padding:"10px 14px",borderRadius:10,background:vRes==="no-changes"?"#f0faf0":"#fff8ee",border:vRes==="no-changes"?"1px solid #c8e8c8":"1px solid #f0dca8"}}>
      {vRes==="no-changes"?<p style={{fontSize:12,color:"#27864a"}}>✓ All deadlines up to date.</p>:(
      <div><p style={{fontSize:12,fontWeight:600,color:"#c08820",marginBottom:4}}>⚠ {Object.keys(vRes).length} changed:</p>
        {Object.entries(vRes).map(([id,ch])=>{const c=confs.find(x=>x.id===id);return <p key={id} style={{fontSize:12,color:"#666",lineHeight:1.6}}><strong>{c?.name} {c?.cycle||""}</strong>: {ch.old} → <span style={{color:"#c0392b",fontWeight:600}}>{ch.new}</span>{ch.note&&<span style={{color:"#999"}}> — {ch.note}</span>}</p>})}
      </div>)}
    </div>)}

    {/* ── Add/Edit form ── */}
    {showAdd&&(
    <div className="si" style={{marginTop:10,background:"#fff",borderRadius:14,padding:"20px",border:"1.5px solid #d8d4ee"}}>
      <p style={{fontSize:14,fontWeight:700,marginBottom:14,color:"#333"}}>{editId?"Edit Conference":"Add Conference"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
        <F label="Name *"><input style={inp} value={addForm.name} onChange={e=>setAddForm(f=>({...f,name:e.target.value}))} placeholder="e.g. ASPLOS '27"/></F>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 10px"}}>
          <F label="Rank"><select style={{...inp,cursor:"pointer"}} value={addForm.rank} onChange={e=>setAddForm(f=>({...f,rank:e.target.value}))}>{RANKS.map(r=><option key={r} value={r}>{r}</option>)}</select></F>
          <F label="Cycle"><input style={inp} value={addForm.cycle} onChange={e=>setAddForm(f=>({...f,cycle:e.target.value}))} placeholder="e.g. Fall"/></F>
        </div>
        <F label="Submission Deadline *"><input type="date" style={inp} value={addForm.deadline} onChange={e=>setAddForm(f=>({...f,deadline:e.target.value}))}/></F>
        <F label="Notification Date"><input type="date" style={inp} value={addForm.notify} onChange={e=>setAddForm(f=>({...f,notify:e.target.value}))}/></F>
        <F label="Conference Dates"><input style={inp} value={addForm.conf} onChange={e=>setAddForm(f=>({...f,conf:e.target.value}))} placeholder="e.g. Jun 10–14, 2027"/></F>
        <F label="Location"><input style={inp} value={addForm.loc} onChange={e=>setAddForm(f=>({...f,loc:e.target.value}))} placeholder="e.g. Singapore"/></F>
        <F label="Official Website"><input style={inp} value={addForm.url} onChange={e=>setAddForm(f=>({...f,url:e.target.value}))} placeholder="https://..."/></F>
        <F label="Tags (comma-separated)"><input style={inp} value={addForm.tags} onChange={e=>setAddForm(f=>({...f,tags:e.target.value}))} placeholder="e.g. networking, IoT"/></F>
      </div>
      <F label="Notes"><input style={inp} value={addForm.note} onChange={e=>setAddForm(f=>({...f,note:e.target.value}))} placeholder="Optional notes"/></F>
      <div style={{display:"flex",gap:8,marginTop:6}}>
        <button className="btn" onClick={handleAdd} disabled={!addForm.name||!addForm.deadline} style={{padding:"9px 20px",borderRadius:10,background:(!addForm.name||!addForm.deadline)?"#e0ddd8":"linear-gradient(135deg,#4a3fa0,#6355c0)",color:(!addForm.name||!addForm.deadline)?"#aaa":"#fff",fontSize:13,fontWeight:600}}>
          {editId?"Save Changes":"Add Conference"}
        </button>
        <button className="btn" onClick={()=>{setShowAdd(false);setEditId(null)}} style={{padding:"9px 16px",borderRadius:10,background:"#f5f4f0",color:"#888",fontSize:13,fontWeight:500}}>Cancel</button>
      </div>
    </div>)}
  </div>

  {/* ── Search + Filters ── */}
  <div style={{maxWidth:700,margin:"0 auto",padding:"14px 24px 0"}}>
    <div style={{position:"relative",marginBottom:12}}>
      <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:14,color:"#bbb",pointerEvents:"none"}}>⌕</span>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conferences, tags, locations..." style={{width:"100%",padding:"9px 12px 9px 34px",borderRadius:10,border:"1.5px solid #e0ddd8",fontSize:13,fontFamily:"'Inter',sans-serif",outline:"none",background:"#fff",transition:"border .15s"}}/>
      {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#ccc",cursor:"pointer",fontSize:14}}>✕</button>}
    </div>
    <div style={{display:"flex",gap:4,marginBottom:10}}>
      {["upcoming","all","passed"].map(v=>(
        <button key={v} className="vt" onClick={()=>setView(v)} style={{padding:"6px 16px",borderRadius:8,background:view===v?"#1e1e2e":"transparent",color:view===v?"#fff":"#999",fontSize:12.5,fontWeight:500,textTransform:"capitalize"}}>{v}</button>
      ))}
    </div>
    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
      {ut.map(t=>(
        <button key={t} className="pl" onClick={()=>tog(t)} style={{padding:"4px 10px",borderRadius:20,border:at.includes(t)?"1.5px solid #5a4faa":"1.5px solid #e0ddd8",background:at.includes(t)?"#eee6ff":"#fff",color:at.includes(t)?"#4a3fa0":"#888",fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>
          {TE[t]||"🔹"} {t}
        </button>
      ))}
      {at.length>0&&<button onClick={()=>setAt([])} style={{padding:"4px 10px",borderRadius:20,border:"none",background:"transparent",color:"#bbb",fontSize:11,cursor:"pointer"}}>✕</button>}
    </div>
  </div>

  {/* ── Cards ── */}
  <div style={{maxWidth:700,margin:"0 auto",padding:"0 24px 48px"}}>
    {list.length===0&&<p style={{color:"#bbb",fontSize:13,textAlign:"center",padding:48}}>{search?"No conferences match your search.":"No matches."}</p>}

    {list.map(c=>{
      const d=daysTo(c.deadline),u=urg(d),rc=RS[c.rank]||RS["B"],p=d!==null&&d<0;
      const ch=changes[c.id];
      return(
      <div key={c.id} className="cd" style={{background:"#fff",borderRadius:14,padding:"16px 20px",marginBottom:7,border:ch?"1.5px solid #f0c860":"1px solid #eae8e3",borderLeft:`4px solid ${p?"#e0ddd8":u.ac}`,opacity:p?.45:1,position:"relative"}}>
        {/* Actions */}
        <div className="actions" style={{position:"absolute",top:10,right:12,display:"flex",gap:4}}>
          <button onClick={()=>startEdit(c)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#ccc",padding:2}} title="Edit">✏️</button>
          {confirmDel===c.id?(
            <span style={{fontSize:11,color:"#c0392b"}}>
              Sure? <button onClick={()=>delConf(c.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#c0392b",fontWeight:700,fontSize:11,textDecoration:"underline"}}>Yes</button>
              <button onClick={()=>setConfirmDel(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#999",fontSize:11,marginLeft:4}}>No</button>
            </span>
          ):(
            <button onClick={()=>setConfirmDel(c.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"#ccc",padding:2}} title="Delete">🗑</button>
          )}
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,flexWrap:"wrap"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:600,padding:"2px 6px",borderRadius:4,background:rc.bg,color:rc.fg,letterSpacing:.3}}>{c.rank}</span>
              <a href={c.url} target="_blank" rel="noopener noreferrer" className="cl" style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:600,letterSpacing:-.2,textDecoration:"none",color:"#1e1e2e"}}>{c.name}<span className="ar">↗</span></a>
              {c.cycle&&<span style={{fontSize:10.5,color:"#aaa",fontWeight:500,background:"#f5f4f0",padding:"1px 7px",borderRadius:4}}>{c.cycle}</span>}
              {c.custom&&<span style={{fontSize:9,fontWeight:500,padding:"1px 6px",borderRadius:4,background:"#e8f4ff",color:"#4a8ac0"}}>CUSTOM</span>}
              {ch&&<span className="si" style={{fontSize:9,fontWeight:600,padding:"2px 7px",borderRadius:4,background:"#fff3d0",color:"#b8860b"}}>UPDATED</span>}
            </div>
            <div style={{display:"flex",gap:14,fontSize:12,color:"#999",flexWrap:"wrap",lineHeight:1.7}}>
              <span><span style={{color:"#ccc"}}>Due </span><span style={{color:p?"#ccc":"#555",fontWeight:500}}>{fmt(c.deadline)}</span></span>
              {c.notify&&<span><span style={{color:"#ccc"}}>Notify </span><span style={{color:"#777"}}>{fmt(c.notify)}</span></span>}
              {c.conf&&<span><span style={{color:"#ccc"}}>Conf </span><span style={{color:"#777"}}>{c.conf}</span></span>}
              {c.loc&&c.loc!=="TBD"&&<span style={{color:"#bbb"}}>📍 {c.loc}</span>}
            </div>
            {c.note&&<p style={{fontSize:11.5,color:"#bbb",marginTop:6,lineHeight:1.5}}>{c.note}</p>}
            {ch&&<p style={{fontSize:11,color:"#b8860b",marginTop:4}}>Changed from {ch.old}{ch.note?` — ${ch.note}`:""}</p>}
          </div>
          <div style={{flexShrink:0,textAlign:"right",minWidth:52,marginTop:2}}>
            {d===null?<span style={{fontSize:11,color:"#ddd"}}>TBD</span>
            :p?<span style={{fontSize:11,color:"#ccc",fontWeight:500}}>Passed</span>
            :<><p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:26,fontWeight:600,color:u.fg,lineHeight:1}}>{d}</p><p style={{fontSize:10,color:"#ccc",marginTop:2}}>days</p></>}
          </div>
        </div>
      </div>);
    })}

    <p style={{color:"#d0ccc5",fontSize:10.5,textAlign:"center",marginTop:32,lineHeight:1.7}}>
      Dates from official CFPs · Click Verify to check for updates · {confs.filter(c=>c.custom).length>0&&`${confs.filter(c=>c.custom).length} custom`}
    </p>
  </div>
  </div>);
}
