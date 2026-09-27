() => {
  const out = {vars:{}, fonts:[], keyframes:[], media:new Set(), sticky:[], fixed:[]};
  for (const ss of document.styleSheets) { let rules; try { rules = ss.cssRules } catch(e){ continue }
    const walk = rs => { for (const r of rs) {
      if (r.selectorText && (r.selectorText===':root'||r.selectorText==='html'||r.selectorText.includes(':root'))) for (const p of r.style) if (p.startsWith('--')) out.vars[r.selectorText+' '+p]=r.style.getPropertyValue(p).trim();
      if (r.constructor.name==='CSSFontFaceRule') out.fonts.push(r.style.fontFamily+' '+r.style.fontWeight+' '+r.style.fontStyle);
      if (r.constructor.name==='CSSKeyframesRule') out.keyframes.push(r.name+': '+[...r.cssRules].map(k=>k.keyText+'{'+k.style.cssText+'}').join(' ').slice(0,300));
      if (r.media) out.media.add(r.media.mediaText);
      if (r.cssRules) walk(r.cssRules);
    }}; walk(rules); }
  for (const el of document.querySelectorAll('*')) { const cs=getComputedStyle(el); if (cs.position==='sticky'||cs.position==='fixed') (cs.position==='sticky'?out.sticky:out.fixed).push({cls:el.className.toString().slice(0,70), tag:el.tagName, top:cs.top, bottom:cs.bottom, h:Math.round(el.getBoundingClientRect().height), z:cs.zIndex, mix:cs.mixBlendMode, bg:cs.backgroundColor, bf:cs.backdropFilter}); }
  out.media=[...out.media];
  return JSON.stringify(out,null,1);
}
