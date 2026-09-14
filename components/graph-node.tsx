import raw from '@/data/evidence.json';
import network from '@/config/network.json';
import profileData from '@/data/node-profiles.json';
const profiles=profileData as Record<string,{kind:string,subtitle:string}>;
export const nodeLabel=(id:string)=>(network.displayLabels as Record<string,string>)[id]||raw.nodes.find(n=>n.id===id)?.label||id;
function wrap(text:string,max:number){const words=text.split(' '),lines:string[]=[];let line='';for(const w of words){if((line+' '+w).trim().length>max&&line){lines.push(line);line=w;}else line+=(line?' ':'')+w;}if(line)lines.push(line);return lines;}
export function GraphNode({id,active=false,accent=false}:{id:string,active?:boolean,accent?:boolean}){
 const lines=wrap(nodeLabel(id),22),subtitle=wrap(profiles[id].subtitle,28),top=-(lines.length*18+subtitle.length*14+8)/2+13;
 return <><rect x="-103" y="-50" width="206" height="100" rx={profiles[id].kind==='person'?32:8} fill={active?'#263e50':'#16232f'} stroke={active?'#e2eff8':accent?'#d8a45f':'#3c5265'} strokeWidth={active?2:1}/>{lines.map((line,i)=><text key={i} x="0" y={top+i*18} textAnchor="middle" fill="#e8eef3" fontFamily="Arial, sans-serif" fontSize="15" fontWeight={active?600:400}>{line}</text>)}{subtitle.map((line,i)=><text key={`sub-${i}`} x="0" y={top+lines.length*18+7+i*14} textAnchor="middle" fill="#b7c9d7" fontFamily="Arial, sans-serif" fontSize="12">{line}</text>)}</>;
}
