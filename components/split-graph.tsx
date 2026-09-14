import {useMemo,useRef,useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import raw from '@/data/evidence.json';
import profileData from '@/data/node-profiles.json';
import network from '@/config/network.json';
import {splitNeighborhoods} from '@/lib/split-graph.mjs';
import {graphBounds} from '@/lib/graph-drag.mjs';

type Edge=typeof raw.edges[number];
type Point={id:string,x:number,y:number};
type Bounds=ReturnType<typeof graphBounds>;
type Pane={anchor:string,query:string,depth:number,zoom:number,pan:{x:number,y:number},positions:Record<string,{x:number,y:number}>,frame:Bounds|null,history:string[]};
const fresh=(anchor=''):Pane=>({anchor,query:anchor,depth:1,zoom:1,pan:{x:0,y:0},positions:{},frame:null,history:[]});
const styles=network.relationshipTypes as Record<string,{color:string,label:string}>;
const profiles=profileData as Record<string,{subtitle:string,kind:string}>;
const WIDTH=620,HEIGHT=680,GAP=160;
const sideNames=['Left','Right'];
function lines(text:string,max=24){const result:string[]=[];let line='';for(const word of text.split(' ')){if((line+' '+word).trim().length>max&&line){result.push(line);line=word;}else line+=(line?' ':'')+word;}if(line)result.push(line);return result;}

export default function SplitGraph({seedIds,initialAnchor,excluded,layout,onNode,onEdge,svgRef}:{seedIds:string[],initialAnchor:string,excluded:string[],layout:(ids:string[],edges:Edge[],overview:boolean)=>Point[],onNode:(id:string)=>void,onEdge:(edge:Edge)=>void,svgRef:React.RefObject<SVGSVGElement|null>}){
 const [panes,setPanes]=useState<Pane[]>([fresh(initialAnchor),fresh()]);
 const [showShared,setShowShared]=useState(true),[hover,setHover]=useState('');
 const drag=useRef<{side:number,id?:string,x:number,y:number,origin:{x:number,y:number},scale:number,moved:boolean}|null>(null);
 const suppress=useRef(false);
 const allowed=useMemo(()=>raw.edges.filter(e=>!excluded.includes(e.type)),[excluded]);
 const data=useMemo(()=>splitNeighborhoods(allowed,panes.map(p=>p.anchor),panes.map(p=>p.depth),seedIds),[allowed,panes[0].anchor,panes[1].anchor,panes[0].depth,panes[1].depth,seedIds]);
 const leftBase=useMemo(()=>layout(data.panes[0].ids,data.panes[0].edges,false),[data.panes[0],layout]);
 const rightBase=useMemo(()=>layout(data.panes[1].ids,data.panes[1].edges,false),[data.panes[1],layout]);
 const bases=[leftBase,rightBase];
 const scene=panes.map((pane,i)=>{
  const base=bases[i],points=base.map(p=>({...p,...pane.positions[p.id]}));
  const bounds=pane.frame||graphBounds(base);
  const scale=Math.min((WIDTH-50)/bounds.w,(HEIGHT-70)/bounds.h)*pane.zoom;
  const project=(p:Point)=>({x:WIDTH/2+(p.x-bounds.x-bounds.w/2)*scale+pane.pan.x,y:HEIGHT/2+(p.y-bounds.y-bounds.h/2)*scale+pane.pan.y});
  return {points,scale,project,map:new Map(points.map(p=>[p.id,project(p)]))};
 });
 function update(side:number,fn:(p:Pane)=>Pane){setPanes(all=>all.map((p,i)=>i===side?fn(p):p));}
 function focus(side:number,id:string){update(side,p=>({...fresh(id),depth:p.depth,history:[...p.history,p.anchor].slice(-30)}));if(id)onNode(id);}
 function reset(side:number){update(side,p=>({...p,zoom:1,pan:{x:0,y:0},positions:{},frame:null}));}
 function coordinates(e:React.PointerEvent<SVGElement>){const inverse=svgRef.current?.getScreenCTM()?.inverse();return inverse?new DOMPoint(e.clientX,e.clientY).matrixTransform(inverse):null;}
 function start(e:React.PointerEvent<SVGElement>,side:number,id?:string){
  if(e.button!==0||!e.isPrimary)return;
  const point=coordinates(e);if(!point)return;
  e.stopPropagation();suppress.current=false;
  const origin=id?scene[side].points.find(p=>p.id===id)!:panes[side].pan;
  drag.current={side,id,x:point.x,y:point.y,origin,scale:scene[side].scale,moved:false};
  e.currentTarget.setPointerCapture(e.pointerId);
 }
 function move(e:React.PointerEvent<SVGSVGElement>){
  const d=drag.current,point=coordinates(e);if(!d||!point)return;
  const dx=point.x-d.x,dy=point.y-d.y;if(!d.moved&&Math.hypot(dx,dy)<4)return;
  d.moved=true;suppress.current=true;
  if(d.id){const id=d.id;update(d.side,p=>({...p,positions:{...p.positions,[id]:{x:d.origin.x+dx/d.scale,y:d.origin.y+dy/d.scale}}}));}
  else update(d.side,p=>({...p,pan:{x:d.origin.x+dx,y:d.origin.y+dy}}));
 }
 const visible=(p:{x:number,y:number}|undefined)=>p&&p.x>=0&&p.x<=WIDTH&&p.y>=0&&p.y<=HEIGHT;
 const crossings=data.cross.filter(c=>visible(scene[0].map.get(c.left))&&visible(scene[1].map.get(c.right)));
 const shared=data.shared.filter(id=>visible(scene[0].map.get(id))&&visible(scene[1].map.get(id)));
 const crossingPath=(left:string,right:string)=>{const a=scene[0].map.get(left)!,b=scene[1].map.get(right)!;const x=b.x+WIDTH+GAP;return `M${a.x},${a.y} C${WIDTH+GAP/2},${a.y} ${WIDTH+GAP/2},${b.y} ${x},${b.y}`;};
 return <section className="split-explorer" aria-label="Split graph explorer">
  <p className="split-instructions">Click a node in either pane to focus its connections. Each side explores independently; lines across the middle connect the two neighborhoods.</p>
  <datalist id="split-entities">{raw.nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</datalist>
  <div className="split-headers">{panes.map((pane,side)=><section className="split-pane-controls" key={side} aria-label={`${sideNames[side]} pane controls`}>
   <span className="eyebrow">{sideNames[side]} graph</span><h2>{pane.anchor||'Pick a node in this pane'}</h2>
   <Input aria-label={`${sideNames[side]} node search`} list="split-entities" placeholder="Choose any node…" value={pane.query} onChange={e=>{const value=e.target.value;update(side,p=>({...p,query:value}));if(raw.nodes.some(n=>n.id===value))focus(side,value);}}/>
   <div className="split-pane-actions"><Button variant="outline" disabled={!pane.history.length} onClick={()=>update(side,p=>({...fresh(p.history.at(-1)!),depth:p.depth,history:p.history.slice(0,-1)}))}>Back</Button><Button variant="outline" onClick={()=>focus(side,'')}>Browse starting graph</Button><label>Depth <select aria-label={`${sideNames[side]} depth`} value={pane.depth} onChange={e=>update(side,p=>({...fresh(p.anchor),depth:Number(e.target.value),history:p.history}))}>{[1,2,3].map(n=><option key={n}>{n}</option>)}</select></label></div>
   <div className="split-pane-actions"><span>{data.panes[side].ids.length} nodes · {data.panes[side].edges.length} connections</span><Button variant="outline" aria-label={`Zoom out ${sideNames[side].toLowerCase()} pane`} onClick={()=>update(side,p=>({...p,zoom:Math.max(.3,p.zoom/1.3)}))}>−</Button><Button variant="outline" aria-label={`Zoom in ${sideNames[side].toLowerCase()} pane`} onClick={()=>update(side,p=>({...p,zoom:Math.min(8,p.zoom*1.3)}))}>+</Button><Button variant="outline" onClick={()=>update(side,p=>({...p,frame:graphBounds(scene[side].points),zoom:1,pan:{x:0,y:0}}))}>Fit</Button><Button variant="outline" onClick={()=>reset(side)}>Reset</Button></div>
  </section>)}</div>
  <div className="split-summary" aria-live="polite">{panes.every(p=>p.anchor)?<><strong>{data.cross.length} relationship {data.cross.length===1?'record':'records'} between neighborhoods</strong><span>{data.shared.length} shared entities</span>{crossings.length<data.cross.length&&<span>{crossings.length} cross-pane records currently on screen; use Fit to see more.</span>}</>:<strong>Choose a node on each side to reveal connections between them.</strong>}<label><input type="checkbox" checked={showShared} onChange={e=>setShowShared(e.target.checked)}/> Link copies of shared entities</label></div>
  <svg className="split-svg" ref={svgRef} viewBox={`0 0 ${WIDTH*2+GAP} ${HEIGHT}`} role="group" aria-label="Two independently focused graph panes" onPointerMove={move} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}>
   <defs>{[0,1].map(side=><clipPath id={`split-clip-${side}`} key={side}><rect x={side*(WIDTH+GAP)} y="0" width={WIDTH} height={HEIGHT} rx="10"/></clipPath>)}</defs>
   {[0,1].map(side=><g key={side} data-split-pane={sideNames[side].toLowerCase()}><rect x={side*(WIDTH+GAP)} y="0" width={WIDTH} height={HEIGHT} rx="10" fill={side===0?'#122431':'#17232e'} stroke="#40576a" onPointerDown={e=>start(e,side)}/><text x={side*(WIDTH+GAP)+16} y="24" fill="#b9cddc" fontSize="12">{sideNames[side]} · {panes[side].anchor||'Starting graph'}</text><g clipPath={`url(#split-clip-${side})`}>{data.panes[side].edges.map((edge:Edge)=>{const a=scene[side].map.get(edge.source)!,b=scene[side].map.get(edge.target)!;return <path key={edge.id} data-internal-edge={edge.id} transform={`translate(${side*(WIDTH+GAP)},0)`} d={`M${a.x},${a.y} Q${(a.x+b.x)/2+12},${(a.y+b.y)/2-12} ${b.x},${b.y}`} stroke={styles[edge.type].color} strokeWidth="2" opacity=".6" fill="none" strokeDasharray={edge.evidence==='unverified lead'||edge.type==='proposal'?'6 5':undefined} onClick={()=>onEdge(edge)}><title>{`${edge.source} → ${edge.target}: ${edge.relation}`}</title></path>;})}</g></g>)}
   <text x={WIDTH+GAP/2} y="24" textAnchor="middle" fill="#c5d5e2" fontSize="12">BETWEEN</text>
   {showShared&&shared.map(id=><path key={id} data-shared-entity={id} d={crossingPath(id,id)} fill="none" stroke="#91a7b7" strokeWidth="1.4" strokeDasharray="2 7" opacity=".5" onClick={()=>onNode(id)}><title>{`${id}: the same entity appears in both panes; this dotted line is not a relationship record.`}</title></path>)}
   {crossings.map(c=><g key={c.edge.id} data-cross-edge={c.edge.id} role="button" tabIndex={0} aria-label={`Inspect ${c.edge.source} to ${c.edge.target}: ${c.edge.relation}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onEdge(c.edge);}}} onClick={()=>onEdge(c.edge)} onMouseEnter={()=>setHover(c.edge.id)} onMouseLeave={()=>setHover('')}><path d={crossingPath(c.left,c.right)} fill="none" stroke={styles[c.edge.type].color} strokeWidth={hover===c.edge.id?4:2} opacity={hover&&hover!==c.edge.id?.15:.65} strokeDasharray={c.edge.evidence==='unverified lead'||c.edge.type==='proposal'?'6 5':undefined}/><path className="edge-hit" d={crossingPath(c.left,c.right)} fill="none" stroke="transparent" strokeWidth="10"><title>{`${c.edge.source} → ${c.edge.target}: ${c.edge.relation} · ${c.edge.date}`}</title></path></g>)}
   {[0,1].map(side=><g key={side} clipPath={`url(#split-clip-${side})`}>{scene[side].points.map(point=>{const p=scene[side].project(point),name=lines(point.id),subtitle=lines(profiles[point.id].subtitle,29),scale=scene[side].scale;return <g key={point.id} data-split-node={point.id} data-side={sideNames[side].toLowerCase()} role="button" tabIndex={0} aria-label={`Focus ${point.id} in ${sideNames[side].toLowerCase()} pane`} transform={`translate(${p.x+side*(WIDTH+GAP)},${p.y}) scale(${scale})`} onPointerDown={e=>start(e,side,point.id)} onClick={()=>{if(!suppress.current)focus(side,point.id);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focus(side,point.id);}}} style={{cursor:'grab'}}><rect x="-103" y="-50" width="206" height="100" rx={profiles[point.id].kind==='person'?28:8} fill={panes[side].anchor===point.id?'#304b5d':'#162936'} stroke={panes[side].anchor===point.id?'#e5bf89':data.shared.includes(point.id)?'#a9c5d6':'#567285'} strokeWidth="2"/>{name.map((line,i)=><text key={i} x="0" y={-24+i*17} textAnchor="middle" fill="#f1f6fa" fontSize="14" fontFamily="Arial, sans-serif">{line}</text>)}{subtitle.slice(0,2).map((line,i)=><text key={i} x="0" y={-18+name.length*17+i*13} textAnchor="middle" fill="#b9cddc" fontSize="11" fontFamily="Arial, sans-serif">{line}</text>)}</g>;})}</g>)}
  </svg>
  <p className="split-help">Drag nodes to arrange; drag a pane’s background to pan. Colored lines are recorded relationships. Dotted gray lines identify copies of the same entity. Click a colored line for its direction, dates and sources.</p>
 </section>;
}
