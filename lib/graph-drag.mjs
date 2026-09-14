/** Convert a screen-space drag through the captured inverse SVG transform.
 * @param {{x:number,y:number}} origin
 * @param {{x:number,y:number}} delta
 * @param {{a:number,b:number,c:number,d:number}} inverse
 */
export function draggedPosition(origin,delta,inverse){
 return {x:origin.x+delta.x*inverse.a+delta.y*inverse.c,y:origin.y+delta.x*inverse.b+delta.y*inverse.d};
}
/** @param {{x:number,y:number}[]} points */
export function graphBounds(points){
 if(!points.length)return {x:0,y:0,w:1400,h:900};
 const xs=points.map(p=>p.x),ys=points.map(p=>p.y);
 return {x:Math.min(...xs)-145,y:Math.min(...ys)-100,w:Math.max(...xs)-Math.min(...xs)+290,h:Math.max(...ys)-Math.min(...ys)+200};
}
