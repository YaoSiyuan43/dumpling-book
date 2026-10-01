/* 小饺子团团 · food characters — each procedurally drawn, animated by state */
(function () {
  'use strict';
  const SB = window.SB;
  const C = (SB.C = {});
  const { fillEll, fillCirc } = SB;
  const TAU = Math.PI * 2;

  /* ---- shared face bits (reused from the cloud book's visual language) ---- */
  let pat = null;
  SB.crayonPat = (ctx) => {
    if (!pat) {
      const c = document.createElement('canvas'); c.width = c.height = 160;
      const g = c.getContext('2d'); const r = SB.rng(9); g.lineCap = 'round';
      for (let i = 0; i < 420; i++) {
        const x = r() * 160, y = r() * 160, a = -0.5 + (r() - 0.5) * 0.8, L = 5 + r() * 14;
        g.strokeStyle = r() < 0.55 ? `rgba(255,255,255,${0.1 + r() * 0.16})` : `rgba(60,40,30,${0.04 + r() * 0.07})`;
        g.lineWidth = 1 + r() * 1.8;
        for (const ox of [-160, 0, 160]) for (const oy of [-160, 0, 160]) { g.beginPath(); g.moveTo(x + ox, y + oy); g.lineTo(x + ox + Math.cos(a) * L, y + oy + Math.sin(a) * L); g.stroke(); }
      }
      pat = c;
    }
    return ctx.createPattern(pat, 'repeat');
  };
  const body = (SB.body = (ctx, pathFn, col, o = {}) => {
    ctx.beginPath(); pathFn(ctx); ctx.fillStyle = col; ctx.fill();
    ctx.save(); ctx.clip();
    if (o.shade !== false) {
      const [x0, y0, x1, y1] = o.sb || [-200, -200, 200, 200];
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      g.addColorStop(0, 'rgba(255,255,255,0.16)'); g.addColorStop(0.55, 'rgba(255,255,255,0)'); g.addColorStop(1, o.dark || 'rgba(90,50,40,0.18)');
      ctx.fillStyle = g; ctx.fillRect(-400, -400, 800, 800);
    }
    ctx.fillStyle = SB.crayonPat(ctx); ctx.fillRect(-400, -400, 800, 800);
    ctx.restore();
  });
  const eye = (ctx, x, y, r, blink = 0, look = [0, 0]) => {
    if (blink > 0.5) { ctx.strokeStyle = '#43322c'; ctx.lineWidth = r * 0.55; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y - r * 0.3, r * 0.9, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); return; }
    fillEll(ctx, x + look[0] * r * 0.25, y + look[1] * r * 0.25, r * 0.85, r, '#43322c');
    fillCirc(ctx, x + look[0] * r * 0.25 + r * 0.3, y + look[1] * r * 0.25 - r * 0.35, r * 0.32, '#fff');
  };
  const happyEye = (ctx, x, y, r) => { ctx.strokeStyle = '#43322c'; ctx.lineWidth = r * 0.55; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y + r * 0.4, r * 0.9, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); };
  const cheek = (ctx, x, y, r, a = 0.5) => fillEll(ctx, x, y, r, r * 0.62, `rgba(245,140,120,${a})`);
  C.blink = (t, seed = 0) => { const p = (t + seed * 1.7) % 3.7; return p < 0.13 ? 1 : 0; };
  // generic mouth
  const mouth = (ctx, x, y, mood, t, talk) => {
    ctx.strokeStyle = '#7a3f34'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    if (mood === 'sad') { ctx.beginPath(); ctx.arc(x, y + 8, 7, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
    else if (mood === 'wow') { fillEll(ctx, x, y, 6, 7, '#7a3434'); }
    else if (mood === 'laugh' || talk) { const o = talk ? 0.4 + Math.abs(Math.sin(t * 14)) * 0.6 : 1; fillEll(ctx, x, y + 2, 7, 7 * o, '#7a3434'); fillEll(ctx, x, y + 2 + 3 * o, 4, 3 * o, '#f18c8c'); }
    else { ctx.beginPath(); ctx.arc(x, y - 2, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  };

  /* ================= 团团 the little dumpling ================= */
  // a classic crescent jiaozi: a plump belly with a pleated crimped top ridge
  C.dumpling = (ctx, st) => {
    const s = st.s || 1, f = st.f || 1, t = st.t || 0;
    const run = st.run || 0, ph = st.legPh != null ? st.legPh : t * 10;
    const hop = st.hop || 0, mood = st.mood || 'happy';
    ctx.save(); ctx.translate(st.x, st.y);
    if (!st.noShadow) fillEll(ctx, 0, 2, 60 * s * (1 - hop / 300), 10 * s, 'rgba(80,60,40,0.16)');
    ctx.scale(s * f, s); ctx.translate(0, -hop / s);
    const bob = run ? Math.abs(Math.sin(ph)) * -6 : Math.sin(t * 2.3) * 1.4;
    ctx.translate(0, bob); ctx.rotate((st.tilt || 0) + (run ? Math.sin(ph) * 0.04 : 0));
    // little feet
    for (const [lx, o] of [[-20, 0], [20, 1]]) {
      const sw = run ? Math.sin(ph + o * Math.PI) * 0.5 : 0;
      ctx.save(); ctx.translate(lx, 30); ctx.rotate(sw);
      body(ctx, (c) => c.ellipse(0, 10, 11, 8, 0, 0, TAU), '#f0d9a8', { sb: [0, 0, 0, 14] });
      ctx.restore();
    }
    // arms (little dough nubs)
    const wave = st.wave || 0, armsUp = st.armsUp || 0;
    ctx.save(); ctx.translate(-56, -6); ctx.rotate(-0.5 - Math.sin(t * 11) * 0.5 * wave - armsUp * 1.3);
    body(ctx, (c) => c.ellipse(-6, 0, 13, 9, 0.2, 0, TAU), '#f6e7c4', { sb: [0, -9, 0, 9] }); ctx.restore();
    ctx.save(); ctx.translate(56, -6); ctx.rotate(0.5 + Math.sin(t * 11 + 1) * 0.5 * wave + armsUp * 1.3);
    body(ctx, (c) => c.ellipse(6, 0, 13, 9, -0.2, 0, TAU), '#f6e7c4', { sb: [0, -9, 0, 9] }); ctx.restore();
    // body — plump dumpling belly
    body(ctx, (c) => { c.moveTo(-62, -6); c.bezierCurveTo(-66, 34, -36, 44, 0, 44); c.bezierCurveTo(36, 44, 66, 34, 62, -6); c.bezierCurveTo(40, 6, -40, 6, -62, -6); }, st.col || '#f7e6c0', { sb: [-30, -30, 30, 44], dark: 'rgba(150,110,60,0.25)' });
    // crimped pleated top ridge (the signature jiaozi edge)
    ctx.save();
    const pleats = 7;
    for (let i = 0; i <= pleats; i++) {
      const u = i / pleats, x = -62 + u * 124, y = -6 - Math.sin(u * Math.PI) * 14;
      body(ctx, (c) => c.ellipse(x, y, 12, 15, (u - 0.5) * 0.6, 0, TAU), i % 2 ? '#f2dcae' : '#f8ead0', { sb: [0, -15, 0, 10] });
    }
    ctx.restore();
    // steamy sheen
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(-18, 20, 22, 3.5, 4.3); ctx.stroke();
    // face
    const bl = st.blink != null ? st.blink : C.blink(t, st.seed || 0);
    const fy = 16;
    if (mood === 'laugh' || mood === 'joy' || st.happy) { happyEye(ctx, -16, fy, 6); happyEye(ctx, 16, fy, 6); }
    else { eye(ctx, -16, fy, 6, bl, st.look || [0, 0.1]); eye(ctx, 16, fy, 6, bl, st.look || [0, 0.1]); }
    cheek(ctx, -28, fy + 10, 8); cheek(ctx, 28, fy + 10, 8);
    mouth(ctx, 0, fy + 16, mood, t, st.talk);
    if (mood === 'sad' && !st.noTears) { for (const sx of [-1, 1]) { const k = ((t * 0.9 + (sx > 0 ? 0.5 : 0)) % 1); ctx.globalAlpha = 1 - k; fillEll(ctx, sx * 22, fy + 10 + k * 24, 3.2, 4.5, '#9fd4f2'); ctx.globalAlpha = 1; } }
    ctx.restore();
  };

  /* ================= 番茄 tomato ================= */
  C.tomato = (ctx, st) => {
    const s = st.s || 1, t = st.t || 0, mood = st.mood || 'happy';
    ctx.save(); ctx.translate(st.x, st.y + Math.sin(t * 2.5 + (st.seed || 0)) * 2); ctx.scale(s * (st.f || 1), s);
    const squash = 1 + (st.squash || 0) * 0.2;
    if (!st.noShadow) fillEll(ctx, 0, 36, 30, 7, 'rgba(80,30,20,0.18)');
    body(ctx, (c) => c.ellipse(0, 10, 34 * squash, 32 / squash, 0, 0, TAU), '#e8503a', { sb: [-20, -20, 20, 34], dark: 'rgba(140,30,20,0.3)' });
    fillEll(ctx, -12, -2, 10, 8, 'rgba(255,180,150,0.5)');
    // green calyx + stem
    ctx.fillStyle = '#5ca04a'; for (let i = 0; i < 5; i++) { const a = (i / 5) * TAU - 1.5; ctx.save(); ctx.translate(0, -18); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-6, -10); ctx.lineTo(0, -16); ctx.lineTo(6, -10); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = '#6d4a2a'; ctx.fillRect(-3, -34, 6, 14);
    const bl = st.blink != null ? st.blink : C.blink(t, (st.seed || 0) + 1);
    const fy = 12;
    if (st.happy || mood === 'laugh') { happyEye(ctx, -11, fy, 5.5); happyEye(ctx, 11, fy, 5.5); } else { eye(ctx, -11, fy, 5.5, bl, st.look); eye(ctx, 11, fy, 5.5, bl, st.look); }
    cheek(ctx, -20, fy + 8, 7, 0.45); cheek(ctx, 20, fy + 8, 7, 0.45);
    mouth(ctx, 0, fy + 14, mood, t, st.talk);
    ctx.restore();
  };

  /* ================= 玉米 corn ================= */
  C.corn = (ctx, st) => {
    const s = st.s || 1, t = st.t || 0, mood = st.mood || 'happy';
    ctx.save(); ctx.translate(st.x, st.y + Math.sin(t * 2.2 + (st.seed || 0)) * 2); ctx.scale(s * (st.f || 1), s);
    if (!st.noShadow) fillEll(ctx, 0, 54, 26, 7, 'rgba(90,70,20,0.18)');
    // husk leaves behind
    ctx.fillStyle = '#8fbf5a'; for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 20, 36); ctx.rotate(sx * 0.5 + Math.sin(t * 2) * 0.05); body(ctx, (c) => c.ellipse(0, 0, 14, 40, 0, 0, TAU), '#8fbf5a', { sb: [0, -40, 0, 40] }); ctx.restore(); }
    // cob
    body(ctx, (c) => { c.moveTo(-26, -34); c.bezierCurveTo(-30, 30, 30, 30, 26, -34); c.bezierCurveTo(14, -48, -14, -48, -26, -34); }, '#f7d24a', { sb: [-16, -40, 16, 40], dark: 'rgba(170,120,20,0.3)' });
    // kernels grid
    ctx.save(); body(ctx, (c) => { c.moveTo(-26, -34); c.bezierCurveTo(-30, 30, 30, 30, 26, -34); c.bezierCurveTo(14, -48, -14, -48, -26, -34); }, '#f7d24a', { shade: false });
    ctx.clip(); ctx.strokeStyle = 'rgba(190,140,20,0.4)'; ctx.lineWidth = 1.5;
    for (let yy = -40; yy < 36; yy += 11) { ctx.beginPath(); ctx.moveTo(-30, yy); ctx.lineTo(30, yy); ctx.stroke(); }
    for (let xx = -24; xx <= 24; xx += 12) { ctx.beginPath(); ctx.moveTo(xx, -46); ctx.lineTo(xx, 32); ctx.stroke(); }
    for (let yy = -36; yy < 32; yy += 11) for (let xx = -20; xx <= 20; xx += 12) fillCirc(ctx, xx + ((yy / 11) % 2 ? 6 : 0), yy, 2.2, 'rgba(255,240,170,0.7)');
    ctx.restore();
    const bl = st.blink != null ? st.blink : C.blink(t, (st.seed || 0) + 2); const fy = -4;
    if (st.happy || mood === 'laugh') { happyEye(ctx, -9, fy, 5); happyEye(ctx, 9, fy, 5); } else { eye(ctx, -9, fy, 5, bl, st.look); eye(ctx, 9, fy, 5, bl, st.look); }
    cheek(ctx, -17, fy + 8, 6, 0.45); cheek(ctx, 17, fy + 8, 6, 0.45);
    mouth(ctx, 0, fy + 13, mood, t, st.talk);
    ctx.restore();
  };

  /* ================= 小青菜 bok choy ================= */
  C.bokchoy = (ctx, st) => {
    const s = st.s || 1, t = st.t || 0, mood = st.mood || 'happy';
    ctx.save(); ctx.translate(st.x, st.y + Math.sin(t * 2.6 + (st.seed || 0)) * 2); ctx.scale(s * (st.f || 1), s);
    if (!st.noShadow) fillEll(ctx, 0, 44, 28, 7, 'rgba(30,70,20,0.18)');
    // leafy green tops
    for (const [lx, a, h] of [[-16, -0.4, 42], [0, 0, 50], [16, 0.4, 42]]) {
      ctx.save(); ctx.translate(lx, -6); ctx.rotate(a + Math.sin(t * 2 + lx) * 0.05);
      body(ctx, (c) => c.ellipse(0, -h / 2, 16, h / 2, 0, 0, TAU), '#4e9c3f', { sb: [0, -h, 0, 0] });
      ctx.strokeStyle = 'rgba(230,250,210,0.6)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -h); ctx.stroke();
      ctx.restore();
    }
    // white stalk base
    body(ctx, (c) => { c.moveTo(-22, 40); c.bezierCurveTo(-26, -4, 26, -4, 22, 40); c.closePath(); }, '#eef5e2', { sb: [-14, -10, 14, 40], dark: 'rgba(90,120,60,0.25)' });
    const bl = st.blink != null ? st.blink : C.blink(t, (st.seed || 0) + 3); const fy = 16;
    if (st.happy || mood === 'laugh') { happyEye(ctx, -9, fy, 5); happyEye(ctx, 9, fy, 5); } else { eye(ctx, -9, fy, 5, bl, st.look); eye(ctx, 9, fy, 5, bl, st.look); }
    cheek(ctx, -16, fy + 7, 6, 0.4); cheek(ctx, 16, fy + 7, 6, 0.4);
    mouth(ctx, 0, fy + 12, mood, t, st.talk);
    ctx.restore();
  };

  /* ================= 虾 shrimp ================= */
  C.shrimp = (ctx, st) => {
    const s = st.s || 1, t = st.t || 0, mood = st.mood || 'happy';
    ctx.save(); ctx.translate(st.x, st.y + Math.sin(t * 3 + (st.seed || 0)) * 3); ctx.scale(s * (st.f || 1), s);
    if (!st.noShadow) fillEll(ctx, 0, 36, 30, 6, 'rgba(120,50,30,0.16)');
    const curl = (st.curl || 0) + Math.sin(t * 2.5) * 0.04;
    // curled body segments
    ctx.save(); ctx.rotate(curl);
    for (let i = 0; i < 5; i++) { const a = -0.3 + i * 0.5; const x = Math.cos(a) * 30 - 14, y = Math.sin(a) * 30; body(ctx, (c) => c.ellipse(x, y, 16 - i * 1.5, 14 - i, a, 0, TAU), '#f58a5a', { sb: [0, -14, 0, 14], dark: 'rgba(180,60,30,0.3)' }); }
    // tail fan
    ctx.fillStyle = '#f07a4a'; ctx.save(); ctx.translate(Math.cos(1.9) * 30 - 14, Math.sin(1.9) * 30); ctx.rotate(2.2); for (const a of [-0.4, 0, 0.4]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - 1.57) * 20, Math.sin(a - 1.57) * 20); ctx.lineTo(Math.cos(a - 1.57) * 14 + 4, Math.sin(a - 1.57) * 14); ctx.fill(); } ctx.restore();
    ctx.restore();
    // head (front segment, biggest) with eyes + feelers
    const hx = -24, hy = -4;
    body(ctx, (c) => c.ellipse(hx, hy, 20, 17, -0.2, 0, TAU), '#f79468', { sb: [0, -17, 0, 17] });
    ctx.strokeStyle = '#e8663a'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx - 10, hy - 8); ctx.quadraticCurveTo(hx - 30, hy - 30, hx - 36 + Math.sin(t * 3) * 4, hy - 34); ctx.moveTo(hx - 6, hy - 10); ctx.quadraticCurveTo(hx - 24, hy - 34, hx - 28 + Math.sin(t * 3 + 1) * 4, hy - 40); ctx.stroke();
    const bl = st.blink != null ? st.blink : C.blink(t, (st.seed || 0) + 4);
    if (st.happy || mood === 'laugh') { happyEye(ctx, hx - 6, hy - 2, 4.5); happyEye(ctx, hx + 8, hy - 2, 4.5); } else { eye(ctx, hx - 6, hy - 2, 4.5, bl, st.look); eye(ctx, hx + 8, hy - 2, 4.5, bl, st.look); }
    cheek(ctx, hx - 10, hy + 6, 5, 0.4); mouth(ctx, hx + 2, hy + 8, mood, t, st.talk);
    ctx.restore();
  };

  /* ================= 蛋 egg (sunny-side friend) ================= */
  C.egg = (ctx, st) => {
    const s = st.s || 1, t = st.t || 0, mood = st.mood || 'happy';
    ctx.save(); ctx.translate(st.x, st.y + Math.sin(t * 2.4 + (st.seed || 0)) * 2); ctx.scale(s * (st.f || 1), s);
    if (!st.noShadow) fillEll(ctx, 0, 30, 40, 7, 'rgba(120,90,20,0.16)');
    // white (irregular blob)
    body(ctx, (c) => { const pts = SB.blobPts(0, 8, 44, 30, 9, 0.14, SB.rng(7 + (st.seed || 0))); SB.smooth(c, pts); }, '#fdfaf0', { sb: [-30, -20, 30, 30], dark: 'rgba(200,180,120,0.2)' });
    // yolk
    body(ctx, (c) => c.arc(0, 6, 20, 0, TAU), '#f7b63a', { sb: [-12, -14, 12, 18], dark: 'rgba(200,120,20,0.3)' });
    fillCirc(ctx, -7, -2, 6, 'rgba(255,240,180,0.8)');
    const bl = st.blink != null ? st.blink : C.blink(t, (st.seed || 0) + 5); const fy = 6;
    if (st.happy || mood === 'laugh') { happyEye(ctx, -8, fy, 4.5); happyEye(ctx, 8, fy, 4.5); } else { eye(ctx, -8, fy, 4.5, bl, st.look); eye(ctx, 8, fy, 4.5, bl, st.look); }
    cheek(ctx, -15, fy + 7, 5.5, 0.4); cheek(ctx, 15, fy + 7, 5.5, 0.4);
    mouth(ctx, 0, fy + 12, mood, t, st.talk);
    ctx.restore();
  };

  /* ================= 豌豆三兄弟 three peas in a pod ================= */
  C.peas = (ctx, st) => {
    const s = st.s || 1, t = st.t || 0;
    ctx.save(); ctx.translate(st.x, st.y); ctx.scale(s, s); ctx.rotate((st.rot || 0) + Math.sin(t * 2) * 0.05);
    body(ctx, (c) => { c.moveTo(-46, 0); c.bezierCurveTo(-30, 22, 30, 22, 46, 0); c.bezierCurveTo(30, 10, -30, 10, -46, 0); }, '#6fae45', { sb: [0, -8, 0, 16] });
    for (let i = 0; i < 3; i++) { const x = -24 + i * 24, pop = st.pop ? Math.sin(Math.min(1, (st.pop - i * 0.2)) * Math.PI) * 10 : 0; body(ctx, (c) => c.arc(x, -4 - pop, 15, 0, TAU), '#8fcf5a', { sb: [0, -15, 0, 10] }); const bl = C.blink(t, i + 6); eye(ctx, x - 4, -6 - pop, 3, bl); eye(ctx, x + 4, -6 - pop, 3, bl); cheek(ctx, x, -1 - pop, 4, 0.4); }
    ctx.restore();
  };

  /* ================= 汤锅 the cooking pot (kindly) ================= */
  C.pot = (ctx, st) => {
    const s = st.s || 1, t = st.t || 0, boil = st.boil || 0;
    ctx.save(); ctx.translate(st.x, st.y); ctx.scale(s, s);
    fillEll(ctx, 0, 76, 100, 14, 'rgba(40,30,20,0.2)');
    // body
    body(ctx, (c) => { c.moveTo(-96, -34); c.lineTo(-86, 56); c.quadraticCurveTo(0, 78, 86, 56); c.lineTo(96, -34); c.closePath(); }, '#9aa3ad', { sb: [-60, -34, 60, 60], dark: 'rgba(40,50,60,0.4)' });
    // metal sheen
    ctx.save(); body(ctx, (c) => { c.moveTo(-96, -34); c.lineTo(-86, 56); c.quadraticCurveTo(0, 78, 86, 56); c.lineTo(96, -34); c.closePath(); }, '#9aa3ad', { shade: false }); ctx.clip();
    const g = ctx.createLinearGradient(-96, 0, 96, 0); g.addColorStop(0, 'rgba(255,255,255,0.3)'); g.addColorStop(0.3, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.25)'); g.addColorStop(1, 'rgba(40,50,60,0.25)'); ctx.fillStyle = g; ctx.fillRect(-96, -34, 192, 120); ctx.restore();
    // rim + broth
    body(ctx, (c) => c.ellipse(0, -34, 98, 20, 0, 0, TAU), '#b7bec6', { sb: [0, -20, 0, 20] });
    body(ctx, (c) => c.ellipse(0, -34, 86, 15, 0, 0, TAU), '#e8a24a', { sb: [0, -15, 0, 15], dark: 'rgba(150,80,20,0.4)' });
    // bubbles
    if (boil > 0.1) for (let i = 0; i < 6; i++) { const bx = -70 + (i * 24 + t * 40) % 150, by = -34 + Math.sin(t * 4 + i) * 4; fillCirc(ctx, bx, by, 2 + Math.abs(Math.sin(t * 5 + i)) * 4 * boil, 'rgba(255,240,200,0.7)'); }
    // handles
    for (const sx of [-1, 1]) { ctx.strokeStyle = '#7f8893'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(sx * 96, 0, 16, sx > 0 ? -1 : 2.2, sx > 0 ? 1 : 4); ctx.stroke(); }
    // face on the pot belly
    const fy = 20; const bl = st.blink != null ? st.blink : C.blink(t, 10);
    if (st.happy) { happyEye(ctx, -22, fy, 7); happyEye(ctx, 22, fy, 7); } else { eye(ctx, -22, fy, 7, bl, st.look); eye(ctx, 22, fy, 7, bl, st.look); }
    cheek(ctx, -36, fy + 12, 10, 0.4); cheek(ctx, 36, fy + 12, 10, 0.4);
    mouth(ctx, 0, fy + 18, st.mood || 'happy', t, st.talk);
    ctx.restore();
  };

  /* ================= 蒸笼 bamboo steamer ================= */
  C.steamer = (ctx, st) => {
    const s = st.s || 1, t = st.t || 0;
    ctx.save(); ctx.translate(st.x, st.y); ctx.scale(s, s);
    fillEll(ctx, 0, 60, 90, 12, 'rgba(60,40,20,0.2)');
    for (let i = 0; i < 2; i++) { const yy = 20 - i * 34; body(ctx, (c) => { c.moveTo(-84, yy); c.lineTo(-84, yy + 30); c.quadraticCurveTo(0, yy + 44, 84, yy + 30); c.lineTo(84, yy); c.quadraticCurveTo(0, yy + 14, -84, yy); c.closePath(); }, '#d9ad6e', { sb: [-50, yy, 50, yy + 30], dark: 'rgba(120,80,30,0.3)' });
      ctx.strokeStyle = 'rgba(120,80,30,0.4)'; ctx.lineWidth = 2; for (let k = -80; k < 80; k += 10) { ctx.beginPath(); ctx.moveTo(k, yy + 2); ctx.lineTo(k, yy + 28); ctx.stroke(); } }
    // woven lid
    body(ctx, (c) => c.ellipse(0, -16, 88, 24, 0, 0, TAU), '#c9a05e', { sb: [0, -24, 0, 24] });
    ctx.strokeStyle = 'rgba(120,80,30,0.45)'; ctx.lineWidth = 2; for (let rr = 14; rr < 88; rr += 14) { ctx.beginPath(); ctx.ellipse(0, -16, rr, rr * 0.27, 0, 0, TAU); ctx.stroke(); }
    ctx.restore();
  };

  /* ---- steam puff drawn as a particle elsewhere; shared chopstick prop ---- */
  C.chopsticks = (ctx, x, y, rot, s = 1) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.lineCap = 'round';
    for (const o of [-7, 7]) { ctx.strokeStyle = '#c0693a'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(o, 0); ctx.lineTo(o * 0.3, -120); ctx.stroke(); ctx.strokeStyle = '#8a3f22'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(o * 0.3, -120); ctx.lineTo(o * 0.3, -140); ctx.stroke(); }
    ctx.restore();
  };
})();
