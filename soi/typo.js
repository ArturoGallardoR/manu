() => {
  const rs=getComputedStyle(document.documentElement);
  const v={}; for (const k of ['--margin','--gutter','--header-h','--text-body','--text-question','--text-title','--measure']) v[k]=rs.getPropertyValue(k);
  const pick=(el)=>{const cs=getComputedStyle(el), r=el.getBoundingClientRect(); return {cls:el.className.toString().replace(/[A-Za-z]+-module__\w+__/g,'').slice(0,60), txt:(el.innerText||'').trim().replace(/\s+/g,' ').slice(0,40), ff:cs.fontFamily.split(',')[0], fs:cs.fontSize, fw:cs.fontWeight, lh:cs.lineHeight, ls:cs.letterSpacing, tt:cs.textTransform, col:cs.color, x:Math.round(r.left), y:Math.round(r.top+scrollY), w:Math.round(r.width), h:Math.round(r.height), tr:cs.transition.slice(0,120)}};
  const seen=new Set(), out=[];
  for (const el of document.querySelectorAll('main *, header *, footer *, [class*=Chrome] *')) {
    const hasText=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
    if(!hasText) continue; const p=pick(el); const key=p.cls+p.fs+p.fw; if(seen.has(key)) continue; seen.add(key); out.push(p);
  }
  return JSON.stringify({v,out});
}
