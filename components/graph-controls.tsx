import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Search,ArrowUpRight} from 'lucide-react';
import network from '@/config/network.json';
import raw from '@/data/evidence.json';
import profileData from '@/data/node-profiles.json';
const profiles=profileData as Record<string,{subtitle:string}>;
const viewLabels:Record<string,string>={...Object.fromEntries(Object.entries(network.views).map(([id,v])=>[id,v.label])),path:'Selected path',bridge:'Between two nodes',snapshot:'Current graph'};

export function NetworkViewMenu({value,onChange,label='Network view',snapshot=false}:{value:string,onChange:(v:string)=>void,label?:string,snapshot?:boolean}){
 return <div><span className="eyebrow">NETWORK VIEW</span><Select value={value} onValueChange={v=>v&&onChange(v)}><SelectTrigger className="view-select" aria-label={label}><SelectValue>{viewLabels[value]}</SelectValue></SelectTrigger><SelectContent>{Object.entries(network.views).filter(([id])=>id!=='neighborhood').map(([id,v])=><SelectItem key={id} value={id}>{v.label}</SelectItem>)}{snapshot&&<SelectItem value="snapshot">Current graph</SelectItem>}</SelectContent></Select></div>;
}
export function GraphSearch({value,onChange,onChoose,label='Find a person or organization'}:{value:string,onChange:(s:string)=>void,onChoose:(id:string)=>void,label?:string}){
 const results=value?raw.nodes.filter(n=>`${n.label} ${profiles[n.id].subtitle}`.toLowerCase().includes(value.toLowerCase())).slice(0,8):[];
 return <div className="search"><Search size={17}/><Input aria-label={label} placeholder="Find a person or organization" value={value} onChange={e=>onChange(e.target.value)}/>{value&&<div className="search-results">{results.length?results.map(n=><Button variant="ghost" key={n.id} onClick={()=>onChoose(n.id)}>{n.label}<ArrowUpRight size={15}/></Button>):<p>No matching entity.</p>}</div>}</div>;
}
export function GraphLegend({excluded,onToggle}:{excluded:string[],onToggle:(type:string)=>void}){
 return <div className="legend">{Object.entries(network.relationshipTypes).filter(([type])=>raw.edges.some(e=>e.type===type)).map(([type,style])=><button key={type} aria-pressed={!excluded.includes(type)} onClick={()=>onToggle(type)}><i style={{background:style.color,opacity:excluded.includes(type)?.25:1}}/>{style.label}</button>)}<span className="legend-note">Dashed: proposal or open lead</span></div>;
}
