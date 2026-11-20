/* 沿折线旋开的纸面。每段弧长固定，不靠放大图片把纸拉开。 */
const PaperMotion = (() => {
  const count = 16;
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t=clamp(value); return t*t*(3-2*t); };
  const xAngles = [1.28,-1.08,1.38,-1.19,1.10,-1.32,1.05,-1.16,1.30,-1.13,1.25,-1.38,1.12,-1.29,1.32,-1.10];
  const yAngles = [-1.05,1.28,-1.13,1.04,-1.25,1.18,-1.08,1.24,-1.13,1.04,-1.26,1.14,-1.06,1.23,-1.17,1.08];
  const xKnots=[0,.075,.115,.205,.265,.31,.405,.47,.535,.605,.65,.735,.775,.855,.90,.955,1];
  const yKnots=[0,.045,.13,.185,.255,.33,.365,.46,.525,.575,.66,.705,.79,.835,.915,.95,1];

  function axis(seconds, vertical) {
    const points = new Float32Array((count+1)*2);
    const angles = vertical ? yAngles : xAngles;
    const knots = vertical ? yKnots : xKnots;
    let energy=0;
    for(let i=0;i<count;i++) {
      const distance=Math.abs((knots[i]+knots[i+1])-1);
      // 上半张先翻开，四个角和最外层的折片稍晚跟随。
      const delay=.035 + distance*.075 + (vertical ? (i/count)*.035 : .025);
      const age=Math.max(0,seconds-delay);
      const spring=Math.exp(-10.5*age)*(Math.cos(13*age)+(10.5/13)*Math.sin(13*age));
      const finish=1-smooth((seconds-.72)/.33);
      const angle=angles[i]*(vertical ? .72 : .92)*spring*finish;
      const length=2*(knots[i+1]-knots[i]);
      points[(i+1)*2]=points[i*2]+length*Math.cos(angle);
      points[(i+1)*2+1]=points[i*2+1]+length*Math.sin(angle);
      energy+=Math.abs(angle)/count;
    }
    const centerX=(points[0]+points[count*2])*.5;
    const centerZ=points[count+1];
    for(let i=0;i<=count;i++) {points[i*2]-=centerX; points[i*2+1]-=centerZ;}
    return {points,energy};
  }

  function sample(seconds) {
    const x=axis(seconds,false), y=axis(seconds,true);
    return {x:x.points,y:y.points,fold:Math.min(1,(x.energy+y.energy)*.5)};
  }
  return {sample,count,xKnots,yKnots};
})();
if(typeof module!=="undefined") module.exports=PaperMotion;
