import {useEffect,useMemo,useRef,useState} from 'react';
import {Button} from '@/components/ui/button';
import {NetworkViewMenu,GraphSearch,GraphLegend} from '@/components/graph-controls';
import {GraphNode,nodeLabel} from '@/components/graph-node';
import raw from '@/data/evidence.json';
import network from '@/config/network.json';
import {graphView,connectionsBetween} from '@/lib/graph-view.mjs';
import {curve} from '@/lib/graph-geometry';
import {graphBounds} from '@/lib/graph-drag.mjs';

type Edge=typeof raw.edges[number];
type Point={id:string,x:number,y:number};
type Bounds=ReturnType<typeof graphBounds>;
type Selection={view:string,anchor:string,depth:number,excluded:string[]};
type Pane=Selection&{query:string,selected:string,zoom:number,pan:{x:number,y:number},positions:Record<string,{x:number,y:number}>,frame:Bounds|null,history:Selection[]};
const fresh=(view=network.defaultView,anchor='',depth=1,excluded:string[]=[]):Pane=>({view,anchor,depth,excluded,query:'',selected:view==='neighborhood'?anchor:'',zoom:1,pan:{x:0,y:0},positions:{},frame:null,history:[]});
const styles=network.relationshipTypes as Record<string,{color:string,label:string}>;
const WIDTH=620,HEIGHT=680,GAP=160;
const sideNames=['Left','Right'];
export default function SplitGraph({initial,focusRef,layout,onNode,onEdge,svgRef}:{initial:Selection&{snapshot:{ids:string[],edgeIds:string[]}},focusRef:React.RefObject<((id:string)=>void)|null>,layout:(ids:string[],edges:Edge[],overview:boolean)=>Point[],onNode:(id:string)=>void,onEdge:(edge:Edge)=>void,svgRef:React.RefObject<SVGSVGElement|null>}){
 const [panes,setPanes]=useState<Pane[]>(()=>[fresh(initial.view,initial.anchor,initial.depth,initial.excluded),fresh(initial.view,initial.anchor,initial.depth,initial.excluded)]);
 const [showShared,setShowShared]=useState(false),[hover,setHover]=useState('');
 const [activeSide,setActiveSide]=useState(0);
 const [nodeHover,setNodeHover]=useState<{side:number,id:string}|null>(null);
 const drag=useRef<{side:number,id?:string,x:number,y:number,origin:{x:number,y:number},scale:number,moved:boolean}|null>(null);
 const suppress=useRef(false);
 const leftGraph=useMemo(()=>graphView(raw.nodes,raw.edges,network,{...panes[0],snapshot:initial.snapshot}),[panes[0].view,panes[0].anchor,panes[0].depth,panes[0].excluded,initial.snapshot]);
 const rightGraph=useMemo(()=>graphView(raw.nodes,raw.edges,network,{...panes[1],snapshot:initial.snapshot}),[panes[1].view,panes[1].anchor,panes[1].depth,panes[1].excluded,initial.snapshot]);
 const between=useMemo(()=>connectionsBetween(raw.edges.filter(e=>panes.every(p=>!p.excluded.includes(e.type))),leftGraph.ids,rightGraph.ids),[leftGraph,rightGraph,panes[0].excluded,panes[1].excluded]);
 const data={panes:[leftGraph,rightGraph],...between};
 const leftBase=useMemo(()=>layout(leftGraph.ids,leftGraph.edges,panes[0].view==='overview'),[leftGraph,layout,panes[0].view]);
 const rightBase=useMemo(()=>layout(rightGraph.ids,rightGraph.edges,panes[1].view==='overview'),[rightGraph,layout,panes[1].view]);
 const bases=[leftBase,rightBase];
 const scene=panes.map((pane,i)=>{
  const base=bases[i],points=base.map(p=>({...p,...pane.positions[p.id]}));
  const bounds=pane.frame||graphBounds(base);
  const scale=Math.min((WIDTH-50)/bounds.w,(HEIGHT-70)/bounds.h)*pane.zoom;
  const project=(p:Point)=>({x:WIDTH/2+(p.x-bounds.x-bounds.w/2)*scale+pane.pan.x,y:HEIGHT/2+(p.y-bounds.y-bounds.h/2)*scale+pane.pan.y});
  const highlight=(nodeHover?.side===i?nodeHover.id:null)||pane.selected;
  const connected=new Set(highlight?data.panes[i].edges.filter((e:Edge)=>e.source===highlight||e.target===highlight).flatMap((e:Edge)=>[e.source,e.target]):data.panes[i].ids);
  return {points,scale,project,highlight,connected,map:new Map(points.map(p=>[p.id,project(p)]))};
 });
 function update(side:number,fn:(p:Pane)=>Pane){setActiveSide(side);setPanes(all=>all.map((p,i)=>i===side?fn(p):p));}
 function go(side:number,view:string,anchor='',depth=1){setHover('');setNodeHover(null);update(side,p=>({...fresh(view,anchor,depth),history:[...p.history,{view:p.view,anchor:p.anchor,depth:p.depth,excluded:p.excluded}].slice(-30)}));if(anchor)onNode(anchor);}
 function selectNode(side:number,id:string){update(side,p=>({...p,selected:id,query:''}));onNode(id);}
 function inspectEdge(edge:Edge,side=data.panes[0].ids.includes(edge.source)?0:1){setActiveSide(side);setPanes(all=>all.map(p=>({...p,selected:''})));onEdge(edge);}
 useEffect(()=>{focusRef.current=id=>go(activeSide,'neighborhood',id);return()=>{focusRef.current=null;};});
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
  <div className="split-headers">{panes.map((pane,side)=><section className="split-pane-controls" key={side} aria-label={`${sideNames[side]} pane controls`}>
   <span className="eyebrow">{sideNames[side]} graph</span>
   <NetworkViewMenu value={pane.view} onChange={view=>go(side,view)} label={`${sideNames[side]} network view`} snapshot={initial.view==='snapshot'}/>
   <GraphSearch value={pane.query} onChange={query=>update(side,p=>({...p,query}))} onChoose={id=>go(side,'neighborhood',id)} label={`${sideNames[side]} node search`}/>
   <div className="split-pane-actions"><Button variant="outline" disabled={!pane.history.length} onClick={()=>update(side,p=>{const prev=p.history.at(-1)!;return {...fresh(prev.view,prev.anchor,prev.depth,prev.excluded),history:p.history.slice(0,-1)};})}>← Back</Button>{pane.view!=='overview'&&<Button variant="ghost" onClick={()=>go(side,'overview')}>Overview</Button>}{pane.view==='neighborhood'&&<label>Depth <select aria-label={`${sideNames[side]} depth`} value={pane.depth} onChange={e=>update(side,p=>({...fresh(p.view,p.anchor,Number(e.target.value),p.excluded),history:p.history}))}>{[1,2,3].map(n=><option key={n}>{n}</option>)}</select></label>}</div>
   {pane.selected&&<div className="split-node-actions"><strong>{nodeLabel(pane.selected)}</strong><Button onClick={()=>go(side,'neighborhood',pane.selected)}>Focus connections</Button></div>}
   {pane.view==='neighborhood'&&<p className="subtle">Connections around {nodeLabel(pane.anchor)}</p>}
   <div className="split-pane-actions"><span>{data.panes[side].ids.length} nodes · {data.panes[side].edges.length} connections</span><Button variant="outline" aria-label={`Zoom out ${sideNames[side].toLowerCase()} pane`} onClick={()=>update(side,p=>({...p,zoom:Math.max(.5,p.zoom/1.3)}))}>−</Button><Button variant="outline" aria-label={`Zoom in ${sideNames[side].toLowerCase()} pane`} onClick={()=>update(side,p=>({...p,zoom:Math.min(5,p.zoom*1.3)}))}>+</Button><Button variant="outline" onClick={()=>update(side,p=>({...p,frame:graphBounds(scene[side].points),zoom:1,pan:{x:0,y:0}}))}>Fit graph</Button><Button variant="outline" onClick={()=>reset(side)}>Reset layout</Button></div>
  </section>)}</div>
  <div className="split-summary" aria-live="polite"><strong>{data.cross.length} relationship {data.cross.length===1?'record':'records'} between displayed graphs</strong><span>{data.shared.length} shared entities</span>{crossings.length<data.cross.length&&<span>{crossings.length} cross-pane records currently on screen; use Fit to see more.</span>}<label><input type="checkbox" checked={showShared} onChange={e=>setShowShared(e.target.checked)}/> Link copies of shared entities</label></div>
  <svg className="split-svg" ref={svgRef} viewBox={`0 0 ${WIDTH*2+GAP} ${HEIGHT}`} role="group" aria-label="Two independently focused graph panes" onPointerMove={move} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}>
   <defs>{[0,1].map(side=><clipPath id={`split-clip-${side}`} key={side}><rect x={side*(WIDTH+GAP)} y="0" width={WIDTH} height={HEIGHT} rx="10"/></clipPath>)}</defs>
   {[0,1].map(side=><g key={side} data-split-pane={sideNames[side].toLowerCase()}><rect x={side*(WIDTH+GAP)} y="0" width={WIDTH} height={HEIGHT} rx="10" fill={side===0?'#122431':'#17232e'} stroke="#40576a" onPointerDown={e=>start(e,side)}/><text x={side*(WIDTH+GAP)+16} y="24" fill="#b9cddc" fontSize="12">{sideNames[side]} · {(network.views as Record<string,{label:string}>)[panes[side].view]?.label||'Current graph'}</text><g clipPath={`url(#split-clip-${side})`}>{data.panes[side].edges.map((edge:Edge,index:number)=>{const a=scene[side].map.get(edge.source)!,b=scene[side].map.get(edge.target)!;return <path key={edge.id} data-internal-edge={edge.id} transform={`translate(${side*(WIDTH+GAP)},0)`} d={curve(a,b,index%3*7,scene[side].scale)} stroke={styles[edge.type].color} strokeWidth="2" opacity=".6" fill="none" strokeDasharray={edge.evidence==='unverified lead'||edge.type==='proposal'?'6 5':undefined} onClick={()=>inspectEdge(edge,side)}><title>{`${edge.source} → ${edge.target}: ${edge.relation}`}</title></path>;})}</g></g>)}
   <text x={WIDTH+GAP/2} y="24" textAnchor="middle" fill="#c5d5e2" fontSize="12">BETWEEN</text>
   {showShared&&shared.map(id=><path key={id} data-shared-entity={id} d={crossingPath(id,id)} fill="none" stroke="#91a7b7" strokeWidth="1.4" strokeDasharray="2 7" opacity=".5" onClick={()=>onNode(id)}><title>{`${id}: the same entity appears in both panes; this dotted line is not a relationship record.`}</title></path>)}
   {crossings.map(c=><g key={c.edge.id} data-cross-edge={c.edge.id} role="button" tabIndex={0} aria-label={`Inspect ${c.edge.source} to ${c.edge.target}: ${c.edge.relation}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();inspectEdge(c.edge);}}} onClick={()=>inspectEdge(c.edge)} onMouseEnter={()=>setHover(c.edge.id)} onMouseLeave={()=>setHover('')}><path d={crossingPath(c.left,c.right)} fill="none" stroke={styles[c.edge.type].color} strokeWidth={hover===c.edge.id?4:2} opacity={hover?(hover!==c.edge.id?.08:.95):.3} strokeDasharray={c.edge.evidence==='unverified lead'||c.edge.type==='proposal'?'6 5':undefined}/><path className="edge-hit" d={crossingPath(c.left,c.right)} fill="none" stroke="transparent" strokeWidth="10"><title>{`${c.edge.source} → ${c.edge.target}: ${c.edge.relation} · ${c.edge.date}`}</title></path></g>)}
   {[0,1].map(side=><g key={side} clipPath={`url(#split-clip-${side})`}>{scene[side].points.map(point=>{const p=scene[side].project(point),scale=scene[side].scale;return <g key={point.id} data-split-node={point.id} data-side={sideNames[side].toLowerCase()} role="button" tabIndex={0} aria-label={`Select ${point.id} in ${sideNames[side].toLowerCase()} pane`} transform={`translate(${p.x+side*(WIDTH+GAP)},${p.y}) scale(${scale})`} onPointerDown={e=>start(e,side,point.id)} opacity={scene[side].highlight&&!scene[side].connected.has(point.id)?.25:1} onMouseEnter={()=>setNodeHover({side,id:point.id})} onMouseLeave={()=>setNodeHover(null)} onClick={()=>{if(!suppress.current)selectNode(side,point.id);}} onDoubleClick={()=>{if(!suppress.current)go(side,'neighborhood',point.id);}} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(side,point.id);}}} style={{cursor:'grab'}}><GraphNode id={point.id} active={scene[side].highlight===point.id}/></g>;})}</g>)}
  </svg>
  <div className="split-legends">{panes.map((pane,side)=><section key={side} aria-label={`${sideNames[side]} relationship filters`}><GraphLegend excluded={pane.excluded} onToggle={type=>update(side,p=>({...p,excluded:p.excluded.includes(type)?p.excluded.filter(t=>t!==type):[...p.excluded,type],frame:null,zoom:1,pan:{x:0,y:0}}))}/></section>)}</div>
  <p className="split-help">Drag nodes to arrange; drag a pane’s background to pan. Colored lines are recorded relationships. Dotted gray lines identify copies of the same entity. Click a colored line for its direction, dates and sources.</p>
 </section>;
}
