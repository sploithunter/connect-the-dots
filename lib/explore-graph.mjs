/** Connections reachable within a radius, including links between reached nodes. */
export function neighborhoodEdges(edges, anchor, depth=1){
 const reached=new Set([anchor]);
 for(let i=0;i<depth;i++){
  const next=new Set(reached);
  for(const e of edges)if(reached.has(e.source)||reached.has(e.target)){next.add(e.source);next.add(e.target);}
  for(const id of next)reached.add(id);
 }
 return edges.filter(e=>reached.has(e.source)&&reached.has(e.target));
}

/** Place the two focal nodes at opposite sides, with path intermediates in columns. */
export function bridgeLayout(ids,paths,left,right){
 const layers=Math.max(2,...paths.map(p=>p.nodes.length-1));
 const fractions=new Map(), lanes=new Map();
 paths.forEach((path,i)=>path.nodes.forEach(id=>{const values=lanes.get(id)||[];values.push((i-(paths.length-1)/2)*Math.min(170,510/Math.max(1,paths.length-1)));lanes.set(id,values);}));
 for(const path of paths)path.nodes.forEach((id,i)=>{const values=fractions.get(id)||[];values.push(i/(path.nodes.length-1));fractions.set(id,values);});
 const columns=new Map();
 for(const id of ids){
  const values=fractions.get(id)||[.5];
  const column=id===left?0:id===right?layers:Math.max(1,Math.min(layers-1,Math.round(values.reduce((a,b)=>a+b,0)/values.length*layers)));
  if(!columns.has(column))columns.set(column,[]);columns.get(column).push(id);
 }
 const lane=id=>{const values=lanes.get(id)||[0];return values.reduce((a,b)=>a+b,0)/values.length;};
 return [...columns].flatMap(([column,nodes])=>{
  let last=-Infinity;
  const points=nodes.sort((a,b)=>lane(a)-lane(b)||a.localeCompare(b)).map(id=>{const y=Math.max(last+135,lane(id));last=y;return {id,x:column*310,y};});
  if(nodes.length>1){const center=(points[0].y+points.at(-1).y)/2;for(const p of points)p.y-=center;}
  return points;
 });
}
