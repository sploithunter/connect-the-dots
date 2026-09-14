import {neighborhoodEdges} from './explore-graph.mjs';

/** Canonical view selection used by the single graph and each split pane.
 * @template {{id:string,source:string,target:string,type:string}} T
 * @param {{id:string}[]} nodes
 * @param {T[]} edges
 * @param {{overviewPositions:Record<string,number[]>,views:Record<string,{seeds:string[]}>}} config
 * @param {{view:string,anchor?:string,depth?:number,excluded?:string[],snapshot?:{ids:string[],edgeIds:string[]}|null}} options
 */
export function graphView(nodes,edges,config,{view,anchor='',depth=1,excluded=[],snapshot=null}){
 let records=edges.filter(e=>!excluded.includes(e.type));
 if(view==='overview')records=records.filter(e=>e.source in config.overviewPositions&&e.target in config.overviewPositions);
 else if(view==='neighborhood')records=anchor?neighborhoodEdges(records,anchor,depth):[];
 else if(view==='snapshot')records=records.filter(e=>snapshot?.edgeIds.includes(e.id));
 else if(view!=='all'){
  const seeds=new Set(config.views[view]?.seeds||[]);
  records=records.filter(e=>seeds.has(e.source)||seeds.has(e.target));
 }
 const ids=view==='all'?nodes.map(n=>n.id):view==='snapshot'?(snapshot?.ids||[]):[...new Set([...records.flatMap(e=>[e.source,e.target]),...(view==='neighborhood'&&anchor?[anchor]:[])])];
 return {ids,edges:records};
}

/** Actual records between two displayed node sets, independent of how either view was chosen. */
export function connectionsBetween(edges,leftIds,rightIds){
 const left=new Set(leftIds),right=new Set(rightIds);
 const shared=[...left].filter(id=>right.has(id));
 const cross=[];
 for(const edge of edges){
  if(left.has(edge.source)&&right.has(edge.target))cross.push({edge,left:edge.source,right:edge.target});
  else if(left.has(edge.target)&&right.has(edge.source))cross.push({edge,left:edge.target,right:edge.source});
 }
 return {cross,shared};
}
