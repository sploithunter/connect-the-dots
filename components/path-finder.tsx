import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import raw from '@/data/evidence.json';
import network from '@/config/network.json';
import {findPaths} from '@/lib/find-paths.mjs';
type Result=ReturnType<typeof findPaths>;
const amountText=(amount:unknown)=>typeof amount==='object'?JSON.stringify(amount):String(amount);
export default function PathFinder({from,to,setFrom,setTo,onPath}:{from:string,to:string,setFrom:(s:string)=>void,setTo:(s:string)=>void,onPath:(ids:string[])=>void}){
 const [hops,setHops]=useState(4),[directed,setDirected]=useState(false),[types,setTypes]=useState(Object.keys(network.relationshipTypes)),[statuses,setStatuses]=useState(['documented','reported']);
 const [result,setResult]=useState<Result|null>(null),[error,setError]=useState(''),[shown,setShown]=useState(10);
 const [query,setQuery]=useState('');
 const toggle=(values:string[],value:string)=>values.includes(value)?values.filter(x=>x!==value):[...values,value];
 const signature=JSON.stringify([from,to,hops,directed,types,statuses]);
 const stale=query!==signature;
 function search(){
  if(!raw.nodes.some(n=>n.id===from)||!raw.nodes.some(n=>n.id===to)){setError('Choose two entities from the suggestions.');setResult(null);return;}
  if(from===to){setError('Choose two different entities.');setResult(null);return;}
  setError('');setShown(10);setQuery(signature);setResult(findPaths(raw.edges,from,to,{maxHops:hops,directed,types,statuses}));
 }
 const sourceMap=raw.sources as Record<string,{title:string,url:string}>;
 return <section className="path-finder" aria-label="Find connections">
  <h2>Find connections</h2>
  <p className="subtle">Choose two people or organizations. Paths are listed shortest first.</p>
  <datalist id="path-entities">{raw.nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</datalist>
  <label>From<Input list="path-entities" aria-label="Path start" value={from} onChange={e=>setFrom(e.target.value)} placeholder="Search an entity"/></label>
  <Button variant="ghost" onClick={()=>{setFrom(to);setTo(from);}}>Swap endpoints ↕</Button>
  <label>To<Input list="path-entities" aria-label="Path destination" value={to} onChange={e=>setTo(e.target.value)} placeholder="Search an entity"/></label>
  <div className="path-options"><label>Maximum connections<select aria-label="Maximum connections" value={hops} onChange={e=>setHops(Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map(n=><option key={n}>{n}</option>)}</select></label><label><input type="checkbox" checked={directed} onChange={e=>setDirected(e.target.checked)}/> Follow recorded direction only</label></div>
  <details className="path-filters"><summary>Relationship & evidence filters</summary>
   <Button variant="ghost" onClick={()=>{setTypes(['investment','funding']);setDirected(true);}}>Funding paths only</Button><Button variant="ghost" onClick={()=>{setTypes(Object.keys(network.relationshipTypes));setDirected(false);}}>All connection types</Button>
   <fieldset><legend>Relationship types</legend>{Object.entries(network.relationshipTypes).map(([id,t])=><label key={id}><input type="checkbox" checked={types.includes(id)} onChange={()=>setTypes(toggle(types,id))}/>{t.label}</label>)}</fieldset>
   <fieldset><legend>Evidence status</legend>{['documented','reported','unverified lead'].map(s=><label key={s}><input type="checkbox" checked={statuses.includes(s)} onChange={()=>setStatuses(toggle(statuses,s))}/>{s}</label>)}</fieldset>
  </details>
  <Button onClick={search}>Find paths</Button>
  {error&&<p role="alert">{error}</p>}
  {result&&stale&&<p role="status">Selections changed. Choose Find paths to refresh results.</p>}
  {result&&!stale&&<div aria-live="polite"><p className="path-count">{result.paths.length} paths found within {hops} connections.{result.truncated?' Search limit reached; more paths may exist. Narrow the filters or maximum length.':' All matching paths within this limit were found.'}</p>{!result.paths.length&&<p>No path matches these settings. Try a larger maximum or broader filters.</p>}
   {result.paths.slice(0,shown).map((path,index)=><article className="path-result" key={path.steps.map(s=>s.edgeId).join('|')}>
    <h3>Path {index+1} · {path.steps.length} connections</h3><p className="path-route">{path.nodes.join(' → ')}</p>
    <p className="subtle">{path.steps.map(s=>{const edge=raw.edges.find(e=>e.id===s.edgeId)!;return network.relationshipTypes[edge.type as keyof typeof network.relationshipTypes].label;}).join(" · ")}</p>
    <Button variant="outline" onClick={()=>onPath(path.steps.map(s=>s.edgeId))}>Show this path</Button>
    <details><summary>Dates, amounts & sources</summary>{path.steps.map((step,i)=>{const e=raw.edges.find(e=>e.id===step.edgeId)!;return <div className="path-step" key={e.id}><strong>{i+1}. {e.source} → {e.target}</strong><p>{e.relation}</p><small>{e.date} · {e.type} · {e.evidence}</small>{step.reverse&&<small>Traversed in reverse along this relationship</small>}{e.amount!==null&&<p>Recorded amount: {amountText(e.amount)}</p>}{e.note&&<p>{e.note}</p>}<div>{e.sources.map(id=><a key={id} href={sourceMap[id].url} target="_blank" rel="noopener noreferrer">{sourceMap[id].title} ↗</a>)}</div></div>;})}</details>
   </article>)}
   {shown<result.paths.length&&<Button variant="outline" onClick={()=>setShown(n=>n+10)}>Show more paths</Button>}
  </div>}
  <p className="source-help">Search covers the full dataset. Routes never revisit a node. Up to 100 paths are returned within a 50,000-step search budget. Each step keeps its own relationship type, direction, date and evidence status.</p>
 </section>;
}
