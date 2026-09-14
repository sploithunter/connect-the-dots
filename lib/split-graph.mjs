import {neighborhoodEdges} from './explore-graph.mjs';

/** Independent neighborhoods; crossing lines are actual records, shared IDs are separate. */
export function splitNeighborhoods(edges, anchors, depths, seeds){
 const panes=anchors.map((anchor,i)=>{
  const records=anchor?neighborhoodEdges(edges,anchor,depths[i]):edges.filter(e=>seeds.includes(e.source)&&seeds.includes(e.target));
  return {edges:records,ids:anchor?[...new Set([anchor,...records.flatMap(e=>[e.source,e.target])])]:seeds};
 });
 const left=new Set(panes[0].ids),right=new Set(panes[1].ids);
 const shared=anchors.every(Boolean)?[...left].filter(id=>right.has(id)):[];
 const cross=[];
 if(anchors.every(Boolean))for(const edge of edges){
  if(left.has(edge.source)&&right.has(edge.target))cross.push({edge,left:edge.source,right:edge.target});
  else if(left.has(edge.target)&&right.has(edge.source))cross.push({edge,left:edge.target,right:edge.source});
 }
 return {panes,cross,shared};
}
