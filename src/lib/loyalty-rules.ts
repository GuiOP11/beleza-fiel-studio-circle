export function redemptionBalance(points:number,cost:number,available:boolean) {
 if(!Number.isInteger(points)||!Number.isInteger(cost)||cost<=0||points<cost)throw new Error('Pontos insuficientes');
 if(!available)throw new Error('Horário indisponível');
 return points-cost;
}
export function canUseCoupon(role:string,status:string) {return role==='owner'&&status==='scheduled';}
