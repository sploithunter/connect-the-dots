/** Shared edge curvature; scale converts the original graph units into pane coordinates. */
export function curve(a:{x:number,y:number},b:{x:number,y:number},offset=0,scale=1){
 const dx=b.x-a.x,dy=b.y-a.y,d=Math.max(1,Math.hypot(dx,dy));
 const bend=(26+offset)*scale,cx=(a.x+b.x)/2-dy/d*bend,cy=(a.y+b.y)/2+dx/d*bend;
 return `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`;
}
