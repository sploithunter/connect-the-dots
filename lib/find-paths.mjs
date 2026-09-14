/** Enumerate bounded simple paths, shortest first. Edges retain their original direction.
 * @param {Array<{id:string,source:string,target:string,type:string,evidence:string}>} edges
 * @param {string} from
 * @param {string} to
 * @param {{maxHops?:number,maxResults?:number,maxExpansions?:number,directed?:boolean,types?:string[],statuses?:string[]}} options
 */
export function findPaths(edges,from,to,options={}){
 const {maxHops=4,maxResults=100,maxExpansions=50000,directed=false,types,statuses}=options;
 if(!from||!to||from===to)return {paths:[],truncated:false,expansions:0};
 const adjacency=new Map();
 const add=(a,b,e,reverse)=>{if(!adjacency.has(a))adjacency.set(a,[]);adjacency.get(a).push({node:b,edgeId:e.id,reverse});};
 for(const e of edges){if(types&&!types.includes(e.type)||statuses&&!statuses.includes(e.evidence))continue;add(e.source,e.target,e,false);if(!directed&&e.source!==e.target)add(e.target,e.source,e,true);}
 let frontier=[{nodes:[from],steps:[]}],paths=[],expansions=0;
 for(let depth=0;depth<Math.min(8,Math.max(1,maxHops));depth++){
  const next=[];
  for(const path of frontier)for(const step of adjacency.get(path.nodes.at(-1))||[]){
   if(++expansions>maxExpansions)return {paths,truncated:true,expansions};
   if(path.nodes.includes(step.node))continue;
   const candidate={nodes:[...path.nodes,step.node],steps:[...path.steps,step]};
   if(step.node===to){if(paths.length===maxResults)return {paths,truncated:true,expansions};paths.push(candidate);}
   else if(depth+1<maxHops)next.push(candidate);
  }
  frontier=next;if(!frontier.length)break;
 }
 return {paths,truncated:false,expansions};
}
