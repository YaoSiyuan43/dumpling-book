/* 小饺子团团 · kitchen painters (backgrounds), built on SB core helpers */
(function () {
  'use strict';
  const SB = window.SB, P = SB.P;
  const TAU = Math.PI * 2;

  // warm wooden table surface with plank seams + grain
  P.woodTable = (ctx, r, y0, col = '#c98a52', o = {}) => {
    SB.tex(ctx, (c) => c.rect(0, y0, 1600, 960 - y0), col, {
      r, box: [0, y0, 1600, 960 - y0], dens: 500, len: 60, lw: 3, ang: 0.02, aj: 0.03, a: 0.26, sc: o.sc || '#b87842',
      grad: (c) => { const g = c.createLinearGradient(0, y0, 0, 960); g.addColorStop(0, 'rgba(255,230,190,0.22)'); g.addColorStop(1, 'rgba(80,45,20,0.26)'); c.fillStyle = g; c.fillRect(0, y0, 1600, 960 - y0); },
    });
    // plank seams
    ctx.save(); ctx.strokeStyle = 'rgba(80,45,20,0.28)'; ctx.lineWidth = 3;
    for (let py = y0 + 150; py < 960; py += 160) { ctx.beginPath(); for (let x = 0; x <= 1600; x += 20) { const yy = py + Math.sin(x * 0.004 + py) * 4; x ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
    // knots
    for (let i = 0; i < 5; i++) { const x = r() * 1600, yy = y0 + 60 + r() * (900 - y0); ctx.strokeStyle = 'rgba(80,45,20,0.22)'; ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(x, yy, 7 + k * 5, 4 + k * 3, 0.5, 0, TAU); ctx.stroke(); } }
    ctx.restore();
  };
  // a tiled kitchen wall (upper band)
  P.tileWall = (ctx, r, h, col = '#eaf1f3') => {
    SB.tex(ctx, (c) => c.rect(0, 0, 1600, h), col, { r, box: [0, 0, 1600, h], dens: 900, len: 20, lw: 1.5, a: 0.14 });
    ctx.save(); ctx.strokeStyle = 'rgba(120,150,160,0.3)'; ctx.lineWidth = 2;
    for (let y = 60; y < h; y += 70) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1600, y); ctx.stroke(); }
    for (let y = 0, row = 0; y < h; y += 70, row++) for (let x = (row % 2 ? 70 : 0); x < 1600; x += 140) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 70); ctx.stroke(); }
    ctx.restore();
  };
  // floured wooden cutting board
  P.board = (ctx, r, cx, cy, w, h) => {
    ctx.save();
    SB.fillEll(ctx, cx, cy + h * 0.5 + 10, w * 0.52, h * 0.2, 'rgba(50,30,15,0.18)');
    SB.tex(ctx, (c) => SB.roundRect(c, cx - w / 2, cy - h / 2, w, h, 26), '#e2b878', { r, box: [cx - w / 2, cy - h / 2, w, h], dens: 300, len: 40, lw: 2.4, a: 0.22, sc: '#d4a765' });
    // handle hole
    SB.fillCirc(ctx, cx + w / 2 - 36, cy, 12, 'rgba(120,80,40,0.4)');
    // flour dusting
    for (let i = 0; i < 160; i++) { const x = cx - w / 2 + r() * w, y = cy - h / 2 + r() * h; SB.fillCirc(ctx, x, y, 0.8 + r() * 2.2, 'rgba(255,252,245,' + (0.3 + r() * 0.5) + ')'); }
    ctx.restore();
  };
  // a round ceramic bowl (empty, to be filled)
  P.bowl = (ctx, r, cx, cy, rw, col = '#eef3f7') => {
    SB.fillEll(ctx, cx, cy + rw * 0.42, rw * 0.95, rw * 0.2, 'rgba(50,30,15,0.18)');
    SB.body(ctx, (c) => { c.moveTo(cx - rw, cy - rw * 0.28); c.bezierCurveTo(cx - rw * 0.9, cy + rw * 0.55, cx + rw * 0.9, cy + rw * 0.55, cx + rw, cy - rw * 0.28); c.closePath(); }, col, { sb: [cx - rw, cy, cx + rw, cy + rw * 0.5], dark: 'rgba(90,110,130,0.3)' });
    SB.body(ctx, (c) => c.ellipse(cx, cy - rw * 0.28, rw, rw * 0.3, 0, 0, TAU), SB.shade(col, -6), { sb: [cx, cy - rw * 0.5, cx, cy] });
    SB.fillEll(ctx, cx, cy - rw * 0.28, rw * 0.86, rw * 0.24, SB.shade(col, -14));
    // blue rim motif
    ctx.strokeStyle = '#5a86c6'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, cy - rw * 0.28, rw * 0.98, rw * 0.3, 0, 0, TAU); ctx.stroke();
  };
  // window with warm morning light
  P.window = (ctx, r, cx, cy, w, h) => {
    ctx.fillStyle = '#8a5a3a'; ctx.fillRect(cx - w / 2 - 14, cy - h / 2 - 14, w + 28, h + 28);
    const g = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2); g.addColorStop(0, '#bfe0f2'); g.addColorStop(1, '#f6e2b0');
    ctx.fillStyle = g; ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
    // sun + rolling hills seen outside
    SB.fillCirc(ctx, cx + w * 0.26, cy - h * 0.2, 34, 'rgba(255,240,170,0.9)');
    ctx.fillStyle = 'rgba(140,190,120,0.6)'; ctx.beginPath(); ctx.moveTo(cx - w / 2, cy + h / 2); ctx.quadraticCurveTo(cx, cy + h * 0.1, cx + w / 2, cy + h / 2); ctx.fill();
    ctx.fillStyle = '#8a5a3a'; ctx.fillRect(cx - 7, cy - h / 2, 14, h); ctx.fillRect(cx - w / 2, cy - 7, w, 14);
  };
  // soft light shaft from a window corner
  P.lightShaft = (ctx, x0, y0, w, len) => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createLinearGradient(x0, y0, x0 + len * 0.4, y0 + len); g.addColorStop(0, 'rgba(255,245,200,0.5)'); g.addColorStop(1, 'rgba(255,245,200,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + w, y0); ctx.lineTo(x0 + w + len * 0.4, y0 + len); ctx.lineTo(x0 + len * 0.4, y0 + len); ctx.closePath(); ctx.fill();
    ctx.restore();
  };
})();
