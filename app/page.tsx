'use client';

import {useState,useMemo,useRef} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Network,Search,Plus,Minus,Maximize,ArrowUpRight,ArrowRight,Download,X,Focus,RotateCcw} from 'lucide-react';
import raw from '@/data/evidence.json';
import {draggedPosition,graphBounds} from '@/lib/graph-drag.mjs';
import network from '@/config/network.json';
const core=network.overviewPositions as Record<string,number[]>;
const viewNames:Record<string,string>=Object.fromEntries(Object.entries(network.views).map(([id,v])=>[id,v.label]));
const groups:Record<string,string[]>=Object.fromEntries(Object.entries(network.views).map(([id,v])=>[id,v.seeds]));
const COLORS:Record<string,string>=Object.fromEntries(Object.entries(network.relationshipTypes).map(([id,t])=>[id,t.color]));
const TYPE:Record<string,string>=Object.fromEntries(Object.entries(network.relationshipTypes).map(([id,t])=>[id,t.label]));
import profileData from '@/data/node-profiles.json';
const profiles:Record<string,{kind:string,subtitle:string,summary:string,sources:string[],updated:string}>=profileData;

type Edge=typeof raw.edges[number];
type Point={id:string,x:number,y:number};
const sources=raw.sources as Record<string,{title:string,url:string,kind:string,note:string,archiveUrl?:string}>;


const short=(s:string)=>(network.displayLabels as Record<string,string>)[s]||raw.nodes.find(n=>n.id===s)?.label||s;



function wrap(s:string,max=22){const words=short(s).split(' '),lines:string[]=[];let line='';for(const w of words){if((line+' '+w).trim().length>max&&line){lines.push(line);line=w;}else line+=(line?' ':'')+w;}if(line)lines.push(line);return lines;}
function layout(ids:string[],edges:Edge[],overview:boolean):Point[]{
 if(overview)return ids.map(id=>({id,x:core[id][0],y:core[id][1]}));
 const deg=(id:string)=>edges.filter(e=>e.source===id||e.target===id).length;
 const sorted=[...ids].sort((a,b)=>deg(b)-deg(a)||a.localeCompare(b));
 const radius=ids.length>65?1050:ids.length>30?730:520;
 const p=sorted.map((id,i)=>({id,x:Math.cos(i*2.39996)*Math.sqrt((i+1)/ids.length)*radius,y:Math.sin(i*2.39996)*Math.sqrt((i+1)/ids.length)*radius*.8}));
 const index=new Map(p.map((n,i)=>[n.id,i]));
 for(let t=0;t<450;t++){
  const f=p.map(()=>({x:0,y:0}));
  for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){
   let dx=p[i].x-p[j].x,dy=p[i].y-p[j].y;const dist=Math.max(1,Math.hypot(dx,dy));
   const repel=Math.min(12,12000/(dist*dist));f[i].x+=dx/dist*repel;f[i].y+=dy/dist*repel;f[j].x-=dx/dist*repel;f[j].y-=dy/dist*repel;
   if(Math.abs(dx)<226&&Math.abs(dy)<120){const ox=226-Math.abs(dx),oy=120-Math.abs(dy);if(ox<oy*2){const push=(dx>=0?1:-1)*ox*.2;f[i].x+=push;f[j].x-=push;}else{const push=(dy>=0?1:-1)*oy*.3;f[i].y+=push;f[j].y-=push;}}
  }
  edges.forEach(e=>{const i=index.get(e.source),j=index.get(e.target);if(i===undefined||j===undefined)return;const dx=p[j].x-p[i].x,dy=p[j].y-p[i].y,d=Math.max(1,Math.hypot(dx,dy));const force=(d-300)*.011;f[i].x+=dx/d*force;f[i].y+=dy/d*force;f[j].x-=dx/d*force;f[j].y-=dy/d*force;});
  const cooling=.6*(1-t/550);p.forEach((n,i)=>{n.x+=Math.max(-15,Math.min(15,f[i].x-n.x*.0009))*cooling;n.y+=Math.max(-15,Math.min(15,f[i].y-n.y*.0009))*cooling;});
 }
 // Resolve label rectangles after the force pass.
 for(let t=0;t<100;t++)for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){const dx=p[i].x-p[j].x,dy=p[i].y-p[j].y;if(Math.abs(dx)<220&&Math.abs(dy)<112){const push=(112-Math.abs(dy))/2+.1;p[i].y+=(dy>=0?1:-1)*push;p[j].y-=(dy>=0?1:-1)*push;}}
 return p;
}
function curve(a:Point,b:Point,offset=0){const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(1,Math.hypot(dx,dy));const cx=(a.x+b.x)/2-dy/d*(26+offset),cy=(a.y+b.y)/2+dx/d*(26+offset);return `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`;}
function context(e:Edge){return e.note.split(/(?<=\.)\s+/).filter(s=>!/(not proof|not evidence|not a verified|not a personal|not organizational|not current SBF|no inferred|not a traced|is commentary)/i.test(s)).join(' ');}

function SourceNotes({records,profileSources=[]}:{records:Edge[],profileSources?:string[]}){
 const ids=[...new Set([...profileSources,...records.flatMap(record=>record.sources)])];
 return <section className="source-notes" aria-label="Sources and notes">
  <h3>Sources & notes <span>({ids.length})</span></h3>
  <p className="source-help">Expand a source to see its use in this profile and the relationship records.</p>
  {ids.map(id=>{const source=sources[id],supported=records.filter(record=>record.sources.includes(id));return <details className="source-card" key={id}>
   <summary><span>{source.title}<small>{source.kind} source · {new URL(source.url).hostname.replace(/^www\./,'')}</small></span></summary>
   <div className="source-body">
    {profileSources.includes(id)&&<p className="source-profile-note">Cited in the node’s About section.</p>}<p className="source-summary-label">Referenced for</p>
    <ul>{supported.map(record=><li key={record.id}><strong>{record.source} → {record.target}</strong><span>{record.relation}</span><small>{record.date} · {record.evidence}</small></li>)}</ul>
    <a className="source-link" href={source.url} target="_blank" rel="noopener noreferrer">Read original source <ArrowUpRight size={16}/><span className="sr-only"> (opens in a new tab)</span></a>
    {source.archiveUrl&&<a className="source-link" href={source.archiveUrl} target="_blank" rel="noopener noreferrer">Browse archive <ArrowUpRight size={16}/><span className="sr-only"> (opens in a new tab)</span></a>}
   </div>
  </details>;})}
 </section>;
}

export default function Home(){
 const [view,setView]=useState<string>(network.defaultView),[selected,setSelected]=useState<string|null>(null),[active,setActive]=useState<Edge|null>(null),[search,setSearch]=useState(''),[zoom,setZoom]=useState(1),[pan,setPan]=useState({x:0,y:0}),[hover,setHover]=useState<string|null>(null);
 const [anchor,setAnchor]=useState<string|null>(null);
 const [excluded,setExcluded]=useState<string[]>([]);
 const svg=useRef<SVGSVGElement>(null),drag=useRef<{x:number,y:number,px:number,py:number}|null>(null);
 const [positions,setPositions]=useState<Record<string,Record<string,{x:number,y:number}>>>({});
 const [frame,setFrame]=useState<ReturnType<typeof graphBounds>|null>(null);
 const [draggingNode,setDraggingNode]=useState<string|null>(null);
 const nodeDrag=useRef<{id:string,pointerId:number,x:number,y:number,origin:{x:number,y:number},inverse:DOMMatrix,moved:boolean}|null>(null);
 const suppressClick=useRef(false);
 const viewKey=JSON.stringify([view,view==='neighborhood'?anchor:null]);
 const edges=useMemo(()=>{
  let es=raw.edges;
  if(view==='overview')es=es.filter(e=>e.source in core&&e.target in core);
  else if(view==='neighborhood'&&anchor)es=es.filter(e=>e.source===anchor||e.target===anchor);
  else if(view!=='all'){const set=new Set(groups[view]||[]);es=es.filter(e=>set.has(e.source)||set.has(e.target));}
  return es.filter(e=>!excluded.includes(e.type));
 },[view,anchor,excluded]);
 const ids=useMemo(()=>view==='all'?raw.nodes.map(n=>n.id):[...new Set(edges.flatMap(e=>[e.source,e.target]))],[edges,view]);
 const basePoints=useMemo(()=>layout(ids,edges,view==='overview'),[ids,edges,view]);
 const points=useMemo(()=>basePoints.map(p=>({...p,...positions[viewKey]?.[p.id]})),[basePoints,positions,viewKey]);
 const map=useMemo(()=>new Map(points.map(p=>[p.id,p])),[points]);
 const baseBox=useMemo(()=>graphBounds(basePoints),[basePoints]);
 const box=frame||baseBox;
 const resetCamera=()=>{setFrame(null);setZoom(1);setPan({x:0,y:0});};
 const fit=()=>{setFrame(graphBounds(points));setZoom(1);setPan({x:0,y:0});};
 const resetLayout=()=>{setPositions(all=>{const next={...all};delete next[viewKey];return next;});resetCamera();};
 function startNodeDrag(e:React.PointerEvent<SVGGElement>,n:Point){
  if(e.button!==0||!e.isPrimary)return;
  const matrix=svg.current?.getScreenCTM();if(!matrix)return;
  e.stopPropagation();suppressClick.current=false;
  nodeDrag.current={id:n.id,pointerId:e.pointerId,x:e.clientX,y:e.clientY,origin:{x:n.x,y:n.y},inverse:matrix.inverse(),moved:false};
  e.currentTarget.setPointerCapture(e.pointerId);
 }
 function moveNode(e:React.PointerEvent<SVGSVGElement>){
  const d=nodeDrag.current;if(!d||d.pointerId!==e.pointerId)return false;
  const delta={x:e.clientX-d.x,y:e.clientY-d.y};
  if(!d.moved&&Math.hypot(delta.x,delta.y)<4)return true;
  d.moved=true;suppressClick.current=true;setDraggingNode(d.id);setHover(null);
  const next=draggedPosition(d.origin,delta,d.inverse);
  setPositions(all=>({...all,[viewKey]:{...all[viewKey],[d.id]:next}}));
  return true;
 }
 function endNodeDrag(e:React.PointerEvent<SVGSVGElement>){
  if(nodeDrag.current?.pointerId===e.pointerId){nodeDrag.current=null;setDraggingNode(null);}
  drag.current=null;
 }
 const focus=(id:string)=>{setSelected(id);setActive(null);setSearch('');};
 const changeView=(v:string)=>{setView(v);setActive(null);setSelected(null);setExcluded([]);resetCamera();};
 const neighborhood=(id:string)=>{focus(id);setAnchor(id);setView('neighborhood');setExcluded([]);resetCamera();};
 const highlighted=hover||selected;
 const connected=new Set(highlighted?edges.filter(e=>e.source===highlighted||e.target===highlighted).flatMap(e=>[e.source,e.target]):ids);
 const links=selected?raw.edges.filter(e=>e.source===selected||e.target===selected):[];
 const results=search?raw.nodes.filter(n=>`${n.label} ${profiles[n.id].subtitle}`.toLowerCase().includes(search.toLowerCase())).slice(0,8):[];
 const vbox=`${box.x+box.w*(1-1/zoom)/2-pan.x} ${box.y+box.h*(1-1/zoom)/2-pan.y} ${box.w/zoom} ${box.h/zoom}`;
 function exportSvg(){if(!svg.current)return;const box=graphBounds(points);const s=svg.current.cloneNode(true) as SVGSVGElement;s.setAttribute('xmlns','http://www.w3.org/2000/svg');s.setAttribute('width','2000');s.setAttribute('height',String(Math.round(2000*box.h/box.w)));s.setAttribute('viewBox',`${box.x} ${box.y} ${box.w} ${box.h}`);s.querySelectorAll('.edge-hit').forEach(n=>n.remove());const bg=document.createElementNS('http://www.w3.org/2000/svg','rect');bg.setAttribute('x',String(box.x));bg.setAttribute('y',String(box.y));bg.setAttribute('width',String(box.w));bg.setAttribute('height',String(box.h));bg.setAttribute('fill','#101923');s.insertBefore(bg,s.firstChild);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(s)],{type:'image/svg+xml'}));a.download=`connections-${view}.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
 return <main className="explorer">
  <header className="masthead"><div className="brand"><Network size={24}/><div><h1>Connect the Dots</h1><span>AI safety · funding · institutions · policy</span></div></div><div className="dateline"><span className="live-dot"/>Evidence through {raw.as_of}</div><Button variant="outline" onClick={exportSvg}><Download/>Export graph</Button></header>
  <div className="workspace">
   <section className="canvas-section">
    <div className="toolbar"><div><span className="eyebrow">NETWORK VIEW</span><Select value={view} onValueChange={v=>v&&changeView(v)}><SelectTrigger className="view-select"><SelectValue>{viewNames[view]}</SelectValue></SelectTrigger><SelectContent>{Object.entries(viewNames).filter(([v])=>v!=='neighborhood').map(([v,n])=><SelectItem key={v} value={v}>{n}</SelectItem>)}</SelectContent></Select></div><div className="search"><Search size={17}/><Input aria-label="Find a person or organization" placeholder="Find a person or organization" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<div className="search-results">{results.length?results.map(n=><Button variant="ghost" key={n.id} onClick={()=>neighborhood(n.id)}>{n.label}<ArrowUpRight size={15}/></Button>):<p>No matching entity.</p>}</div>}</div></div>
    <div className="graph-wrap">
    <svg ref={svg} className="network-graph" viewBox={vbox} role="img" aria-label={`${viewNames[view]}: ${ids.length} nodes and ${edges.length} connections. Use search or the relationship panel to explore with a keyboard.`} onPointerDown={e=>{suppressClick.current=false;if(e.button!==0||!e.isPrimary)return;if((e.target as Element).closest('[data-node], [data-edge]'))return;drag.current={x:e.clientX,y:e.clientY,px:pan.x,py:pan.y};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(moveNode(e))return;if(drag.current){const r=e.currentTarget.getBoundingClientRect();const scale=Math.max(box.w/zoom/r.width,box.h/zoom/r.height);setPan({x:drag.current.px+(e.clientX-drag.current.x)*scale,y:drag.current.py+(e.clientY-drag.current.y)*scale});}}} onPointerUp={endNodeDrag} onPointerCancel={endNodeDrag} onLostPointerCapture={endNodeDrag}>
     <defs><pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="#405164" opacity=".3"/></pattern></defs>
     <rect x={box.x-5000} y={box.y-5000} width={box.w+10000} height={box.h+10000} fill="url(#dots)"/>
     {edges.map((e,i)=>{const a=map.get(e.source)!,b=map.get(e.target)!,on=active?.id===e.id||e.source===highlighted||e.target===highlighted;const color=COLORS[e.type];return <g key={e.id} data-edge={e.id} onClick={()=>{setActive(e);setSelected(null);}} style={{cursor:'pointer'}}><path d={curve(a,b,i%3*7)} fill="none" stroke={color} strokeWidth={on?2.8:1.4} opacity={highlighted&&!on?.09:on?.95:.35} strokeDasharray={e.type==='proposal'||e.evidence==='unverified lead'?'6 5':undefined}/><path className="edge-hit" d={curve(a,b,i%3*7)} fill="none" stroke="transparent" strokeWidth="14"><title>{`${e.source} → ${e.target}: ${e.relation} · ${e.date}`}</title></path></g>;})}
     {points.map(n=>{const on=highlighted===n.id,dim=highlighted&&!connected.has(n.id),isOrg=profiles[n.id].kind!=='person';const lines=wrap(n.id),subtitle=wrap(profiles[n.id].subtitle,28),top=-(lines.length*18+subtitle.length*14+8)/2+13;return <g key={n.id} data-node={n.id} onPointerDown={e=>startNodeDrag(e,n)} transform={`translate(${n.x},${n.y})`} opacity={dim?.25:1} onMouseEnter={()=>setHover(n.id)} onMouseLeave={()=>setHover(null)} onClick={()=>{if(!suppressClick.current)focus(n.id);}} onDoubleClick={()=>{if(!suppressClick.current)neighborhood(n.id);}} style={{cursor:draggingNode===n.id?'grabbing':'grab'}}><rect x="-103" y="-50" width="206" height="100" rx={isOrg?8:32} fill={on?'#263e50':'#16232f'} stroke={on?'#e2eff8':'#3c5265'} strokeWidth={on?2:1}/>{lines.map((line,i)=><text key={i} x="0" y={top+i*18} textAnchor="middle" fill="#e8eef3" fontFamily="Arial, sans-serif" fontSize="15" fontWeight={on?600:400}>{line}</text>)}{subtitle.map((line,i)=><text key={`sub-${i}`} x="0" y={top+lines.length*18+7+i*14} textAnchor="middle" fill="#b7c9d7" fontFamily="Arial, sans-serif" fontSize="12">{line}</text>)}</g>;})}
    </svg>
    {!ids.length&&<div className="no-edges">No connections in this view with the selected types.</div>}
    <div className="graph-caption"><span>{ids.length} nodes / {edges.length} connections</span><span>Drag nodes to arrange · drag background to pan</span></div>
    <div className="zoom-controls"><Button variant="outline" onClick={resetLayout} title="Restore this view’s original node positions and zoom"><RotateCcw/>Reset layout</Button><Button variant="outline" size="icon" aria-label="Zoom in" onClick={()=>setZoom(z=>Math.min(5,z*1.3))}><Plus/></Button><Button variant="outline" size="icon" aria-label="Zoom out" onClick={()=>setZoom(z=>Math.max(.5,z/1.3))}><Minus/></Button><Button variant="outline" size="icon" aria-label="Fit graph" onClick={fit}><Maximize/></Button></div>
    </div>
    <div className="legend">{Object.entries(TYPE).filter(([t])=>raw.edges.some(e=>e.type===t)).map(([t,label])=><button key={t} aria-pressed={!excluded.includes(t)} onClick={()=>{setExcluded(x=>x.includes(t)?x.filter(v=>v!==t):[...x,t]);resetCamera();}}><i style={{background:COLORS[t],opacity:excluded.includes(t)?.25:1}}/>{label}</button>)}<span className="legend-note">Dashed: proposal or open lead</span></div>
   </section>
   <aside className="inspector" aria-live="polite">
    <div className="inspector-head"><span className="eyebrow">CONNECTION RECORD</span>{(selected||active)&&<Button size="icon" variant="ghost" aria-label="Clear selection" onClick={()=>{setActive(null);setSelected(null);}}><X/></Button>}</div>
    {active?<><span className="relation-tag" style={{color:COLORS[active.type]}}>{TYPE[active.type]}</span><h2>{active.source}</h2><ArrowRight className="record-arrow"/><h2>{active.target}</h2><p className="relationship">{active.relation}</p><dl><dt>Date / period</dt><dd>{active.date}</dd><dt>Source status</dt><dd>{active.evidence}</dd></dl>{context(active)&&<p className="note">{context(active)}</p>}<SourceNotes key={active.id} records={[active]}/><Button variant="outline" onClick={()=>neighborhood(active.source)}><Focus/>Explore {short(active.source)}</Button></>:
    selected?<><span className="relation-tag">{profiles[selected].kind}</span><h2>{selected}</h2><p className="subtle">{profiles[selected].subtitle}</p><section className="node-profile" aria-label="About this node"><h3>About</h3><p>{profiles[selected].summary}</p><div className="profile-citations">Profile sources: {profiles[selected].sources.map(id=><a key={id} href={sources[id].url} target="_blank" rel="noopener noreferrer" title={`${sources[id].title} (opens in a new tab)`}>{id}</a>)}</div><small>Profile updated {profiles[selected].updated}</small></section><p className="subtle">{links.length} recorded connections</p><Button variant="outline" className="neighbor-button" onClick={()=>neighborhood(selected)}><Focus/>Explore neighborhood</Button><SourceNotes key={selected} records={links} profileSources={profiles[selected].sources}/><h3>Connections</h3><div className="connection-list">{links.map(e=><button key={e.id} onClick={()=>setActive(e)}><span className="line-type" style={{background:COLORS[e.type]}}/><span><small>{e.source===selected?'→':'←'} {e.relation}</small><strong>{e.source===selected?e.target:e.source}</strong><em>{e.date}</em></span><ArrowUpRight size={14}/></button>)}</div></>:
    <><h2>Follow a connection.</h2><p className="intro">People, capital, organizations and policy work in one sourced network.</p><div className="start-points"><h3>Start with</h3>{network.startNodes.map(n=><Button variant="ghost" key={n} onClick={()=>neighborhood(n)}>{n}<ArrowRight size={16}/></Button>)}</div><div className="reading-key"><h3>Reading the graph</h3><p>Lines represent the relationship named in the record. Dates identify the relevant period.</p><p>Color follows connection type. Each record includes source links.</p></div></>}
    <footer>Public-source investigation<br/>{raw.nodes.length} nodes · {raw.edges.length} relationship records<br/><a href="https://github.com/sploithunter/connect-the-dots/blob/main/wiki/index.md" target="_blank" rel="noopener noreferrer">Research & contributor wiki ↗</a></footer>
   </aside>
  </div>
 </main>;
}
