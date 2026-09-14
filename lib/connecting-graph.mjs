/** All records on any simple undirected path between two node sets.
 * Biconnected blocks on the terminal-to-terminal block-cut-tree route give the
 * exact union without enumerating paths or imposing a hop/result limit.
 * @template {{id:string,source:string,target:string}} T
 * @param {T[]} edges
 * @param {string[]} leftIds
 * @param {string[]} rightIds
 * @returns {T[]}
 */
function pathCandidateEdges(edges,leftIds,rightIds){
 if(!leftIds.length||!rightIds.length)return [];
 const left=Symbol('left'),right=Symbol('right');
 const links=edges.filter(e=>e.source!==e.target).map(e=>({a:e.source,b:e.target,record:e}));
 for(const id of new Set(leftIds))links.push({a:left,b:id,record:null});
 for(const id of new Set(rightIds))links.push({a:right,b:id,record:null});
 const adj=new Map();
 links.forEach((e,index)=>{for(const [a,b] of [[e.a,e.b],[e.b,e.a]]){if(!adj.has(a))adj.set(a,[]);adj.get(a).push({to:b,index});}});
 const discovered=new Map(),low=new Map(),stack=[],blocks=[];let time=0;
 // Explicit DFS frames avoid a call-stack limit for long chains.
 discovered.set(left,++time);low.set(left,time);
 const frames=[{node:left,parent:null,edge:-1,next:0}];
 while(frames.length){
  const f=frames.at(-1),neighbors=adj.get(f.node)||[];
  if(f.next<neighbors.length){
   const {to,index}=neighbors[f.next++];if(index===f.edge)continue;
   if(!discovered.has(to)){stack.push(index);discovered.set(to,++time);low.set(to,time);frames.push({node:to,parent:f.node,edge:index,next:0});}
   else if(discovered.get(to)<discovered.get(f.node)){stack.push(index);low.set(f.node,Math.min(low.get(f.node),discovered.get(to)));}
  }else{
   frames.pop();if(f.edge<0)continue;
   low.set(f.parent,Math.min(low.get(f.parent),low.get(f.node)));
   if(low.get(f.node)>=discovered.get(f.parent)){
    const block=[];let index;do{index=stack.pop();block.push(index);}while(index!==f.edge);blocks.push(block);
   }
  }
 }
 if(!discovered.has(right))return [];
 const tree=new Map(),blockEdges=new Map();
 const join=(a,b)=>{if(!tree.has(a))tree.set(a,[]);tree.get(a).push(b);};
 for(const block of blocks){const key=Symbol('block');blockEdges.set(key,block);const vertices=new Set(block.flatMap(i=>[links[i].a,links[i].b]));for(const vertex of vertices){join(key,vertex);join(vertex,key);}}
 const prev=new Map([[left,null]]),queue=[left];
 for(let i=0;i<queue.length&&!prev.has(right);i++)for(const next of tree.get(queue[i])||[])if(!prev.has(next)){prev.set(next,queue[i]);queue.push(next);}
 const selected=new Set();
 for(let n=right;n!==null;n=prev.get(n))for(const index of blockEdges.get(n)||[])if(links[index].record)selected.add(links[index].record.id);
 return edges.filter(e=>selected.has(e.id));
}

/** Shortest-first connecting routes through at most seven links by default.
 * @template {{id:string,source:string,target:string}} T
 * @param {T[]} edges
 * @param {string[]} leftIds
 * @param {string[]} rightIds
 * @param {{maxHops?:number,maxExpansions?:number}} options
 */
export function connectingEdges(edges,leftIds,rightIds,{maxHops=7,maxExpansions=50000}={}){
 const candidates=pathCandidateEdges(edges,leftIds,rightIds),adj=new Map(),targets=new Set(rightIds);
 for(const e of candidates)for(const [a,b] of [[e.source,e.target],[e.target,e.source]]){if(!adj.has(a))adj.set(a,[]);adj.get(a).push({node:b,edge:e});}
 const distance=new Map(rightIds.map(id=>[id,0])),queue=[...new Set(rightIds)];
 for(let i=0;i<queue.length;i++)for(const next of adj.get(queue[i])||[])if(!distance.has(next.node)){distance.set(next.node,distance.get(queue[i])+1);queue.push(next.node);}
 let frontier=[...new Set(leftIds)].filter(id=>(distance.get(id)??Infinity)<=maxHops).map(id=>({nodes:[id],edges:[]}));
 const found=new Set(),nodeHops=new Map();let expansions=0;
 const result=truncated=>({edges:edges.filter(e=>found.has(e.id)),nodeHops,truncated,expansions,maxHops});
 if(!candidates.length)return result(false);
 for(let depth=1;depth<=maxHops&&frontier.length;depth++){
  const next=[];
  for(const path of frontier)for(const step of adj.get(path.nodes.at(-1))||[]){
   if(++expansions>maxExpansions)return result(true);
   if(path.nodes.includes(step.node))continue;
   const candidate={nodes:[...path.nodes,step.node],edges:[...path.edges,step.edge]};
   if(targets.has(step.node)){
    for(const e of candidate.edges)found.add(e.id);
    for(const id of candidate.nodes)nodeHops.set(id,Math.min(nodeHops.get(id)??Infinity,depth));
    if(found.size===candidates.length)return result(false);
   }
   if(depth<maxHops&&depth+(distance.get(step.node)??Infinity)<=maxHops)next.push(candidate);
  }
  frontier=next;
 }
 return result(false);
}

/** Preserve each configured/context view and add connecting nodes beyond its depth.
 * @template {{id:string,source:string,target:string}} T
 * @param {T[]} allowed
 * @param {{ids:string[],edges:T[]}[]} base
 * @param {string[][]} terminals
 */
export function expandConnectingGraphs(allowed,base,terminals=base.map(g=>g.ids)){
 const search=connectingEdges(allowed,terminals[0],terminals[1]);
 const bridge=search.edges;
 const sets=base.map(g=>new Set(g.ids));
 const distances=terminals.map(ids=>{
  const seeds=new Set(ids);
  const adjacency=new Map();for(const e of allowed)for(const [a,b] of [[e.source,e.target],[e.target,e.source]]){if(!adjacency.has(a))adjacency.set(a,[]);adjacency.get(a).push(b);}
  const dist=new Map([...seeds].map(id=>[id,0])),queue=[...seeds];
  for(let i=0;i<queue.length;i++)for(const id of adjacency.get(queue[i])||[])if(!dist.has(id)){dist.set(id,dist.get(queue[i])+1);queue.push(id);}
  return dist;
 });
 /** @type {string[][]} */
 const added=[[],[]];
 for(const id of new Set(bridge.flatMap(e=>[e.source,e.target])))if(!sets[0].has(id)&&!sets[1].has(id)){
  const side=(distances[0].get(id)??Infinity)<=(distances[1].get(id)??Infinity)?0:1;sets[side].add(id);added[side].push(id);
 }
 const panes=base.map((graph,side)=>{
  const records=new Map(graph.edges.map(e=>[e.id,e]));
  for(const e of bridge)if(sets[side].has(e.source)&&sets[side].has(e.target))records.set(e.id,e);
  return {ids:[...sets[side]],edges:[...records.values()]};
 });
 return {panes,added,bridge,search};
}
