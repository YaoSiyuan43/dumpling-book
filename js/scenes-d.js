/* 团团找朋友 · scenes D: cooking (steam), reunion ending */
(function () {
  'use strict';
  const SB = window.SB, P = SB.P, C = SB.C, A = SB.A;
  const DEF = SB.DEF;
  const TAU = Math.PI * 2;

  /* ================= 9 · 下锅 / 蒸笼 (steam, the dumpling family) ================= */
  DEF[9] = {
    name: 'cook',
    bg(ctx, r) {
      SB.kitchen(ctx, r, { window: true });
      // a warm stovetop glow at the base
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(820, 820, 40, 820, 820, 420); g.addColorStop(0, 'rgba(255,180,90,0.35)'); g.addColorStop(1, 'rgba(255,180,90,0)'); ctx.fillStyle = g; ctx.fillRect(400, 560, 840, 400); ctx.restore();
    },
    init(S) {
      S.steamer = { x: 820, y: 740, bounce: 0 };
      S.steam = []; S.steamT = 0; S.heat = 0.4;
      // five little dumplings peeking from the steamer, happy
      S.buns = [[720, 650], [820, 636], [920, 650], [768, 672], [872, 672]].map(([x, y], i) => ({ x, y, i, pop: 0, bleat: 0 }));
      S.counted = new Set(); S.countedAll = 0;
    },
    update(S, dt) {
      S.steamT += dt; S.heat = 0.5 + Math.sin(S.t * 2) * 0.2;
      if (S.steamT > 0.14) { S.steamT = 0; S.steam.push({ x: 700 + Math.random() * 240, y: 640, vy: -40 - Math.random() * 30, life: 0, s: 0.6 + Math.random() * 0.6, sway: Math.random() * 6 }); }
      for (const p of S.steam) { p.life += dt; p.y += p.vy * dt; p.x += Math.sin(p.life * 2 + p.sway) * 10 * dt; } S.steam = S.steam.filter((p) => p.life < 3);
      S.steamer.bounce = Math.max(0, S.steamer.bounce - dt * 3);
      for (const b of S.buns) { b.pop = Math.max(0, b.pop - dt * 2); b.bleat = Math.max(0, b.bleat - dt * 1.4); }
    },
    draw(ctx, S) {
      const t = S.t;
      C.steamer(ctx, { x: S.steamer.x, y: S.steamer.y - S.steamer.bounce, s: 1.05, t });
      // dumpling family peeking over the rim
      for (const b of S.buns) { const s = (0.5 + b.pop * 0.15); ctx.save(); ctx.translate(0, -S.steamer.bounce); C.dumpling(ctx, { x: b.x, y: b.y, s, t, mood: 'laugh', happy: true, noShadow: true, seed: b.i }); ctx.restore(); }
      // steam puffs on top
      for (const p of S.steam) { const k = p.life / 3; ctx.save(); ctx.globalAlpha = (1 - k) * 0.5; const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 26 * p.s * (1 + k)); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(p.x - 40, p.y - 40, 80, 80); ctx.restore(); }
    },
    drawTop(ctx, S) {
      if (!S.countedAll) { ctx.save(); ctx.globalAlpha = 0.8 * (0.6 + 0.4 * Math.sin(S.t * 4)); SB.outlineText(ctx, '数数蒸笼里有几只饺子 →', 820, 470, 24, '#b8623a', '#fffaf0', 7, 800, 'center'); ctx.restore(); }
    },
    text: { x: 90, y: 128, size: 32, w: 580, col: '#5a3826', lines: [{ t: '“咕嘟咕嘟”，热气腾腾的蒸笼里，' }, { t: '团团和朋友，变成了胖乎乎的饺子一家。' }, { t: '一只、两只……五只，个个香喷喷！' }] },
    hover(S, x, y) { return S.buns.some((b) => SB.hitCirc(x, y, b.x, b.y, 40)) || SB.hitEll(x, y, S.steamer.x, S.steamer.y, 90, 50); },
    tap(S, x, y) {
      for (const b of S.buns) if (SB.hitCirc(x, y, b.x, b.y, 40)) {
        b.pop = 1; b.bleat = 1; const n = b.i + 1; A.pop(1 + b.i * 0.12); A.note(b.i + 3, 0.5, 0.09); S.fx.pop(b.x, b.y - 40, String(n), { s: 40, c: '#e8774e', life: 1 }); S.counted.add(n); S.tap('bun');
        if (S.counted.size === 5 && !S.countedAll) { S.countedAll = 1; setTimeout(() => { A.giggle(); S.fx.say(S.steamer.x, 520, '一共五只饺子！', { s: 26, life: 2.6 }); }, 450); }
        return true;
      }
      if (SB.hitEll(x, y, S.steamer.x, S.steamer.y, 90, 50)) { S.steamer.bounce = 10; A.thud(); for (const b of S.buns) b.pop = 1; S.fx.burst('spark', S.steamer.x, 640, 8, { cols: ['#fff', '#ffe27a'], speed: 150 }); S.tap('steamer'); return true; }
      return false;
    },
    hints(S) { return [[S.buns[1].x, S.buns[1].y, 'bun'], [S.buns[3].x, S.buns[3].y, 'bun']]; },
  };

  /* ================= 10 · 团圆饭 (reunion dinner — LAST page, left half) ================= */
  DEF[10] = {
    name: 'reunion',
    bg(ctx, r) {
      // right half: warm endpaper
      ctx.save(); ctx.beginPath(); ctx.rect(800, 0, 800, 960); ctx.clip();
      SB.tex(ctx, (c) => c.rect(800, 0, 800, 960), '#f3dcc2', { r, box: [800, 0, 800, 960], dens: 600, len: 24, lw: 2, a: 0.2 });
      let row = 0; for (let y = 60; y < 1000; y += 120, row++) for (let x = 800 + (row % 2 ? 60 : 0) + 30; x < 1660; x += 120) { const k = (Math.floor(x / 120) + row) % 2; ctx.save(); ctx.globalAlpha = 0.85; if (k === 0) C.dumpling(ctx, { x, y, s: 0.2, t: 0, noShadow: true, mood: 'laugh' }); else { ctx.fillStyle = '#e8774e'; ctx.beginPath(); SB.heart(ctx, x, y, 12); ctx.fill(); } ctx.restore(); }
      ctx.restore();
      // left half: a cosy evening dinner table
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 800, 960); ctx.clip();
      P.tileWall(ctx, r, 420, '#e7d2bf');
      // warm lamp glow
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(380, 160, 20, 380, 400, 460); g.addColorStop(0, 'rgba(255,220,150,0.5)'); g.addColorStop(1, 'rgba(255,220,150,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 800, 760); ctx.restore();
      // hanging lamp
      ctx.strokeStyle = '#8a6a4a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(380, 0); ctx.lineTo(380, 90); ctx.stroke();
      SB.body(ctx, (c) => { c.moveTo(330, 90); c.lineTo(430, 90); c.lineTo(410, 150); c.lineTo(350, 150); c.closePath(); }, '#e59b3c', { sb: [0, 90, 0, 150] });
      SB.fillEll(ctx, 380, 150, 30, 8, 'rgba(255,230,160,0.9)');
      P.woodTable(ctx, r, 560, '#b87842');
      // a big round plate
      P.bowl(ctx, r, 400, 740, 150, '#f3f0e8');
      ctx.restore();
      ctx.fillStyle = 'rgba(60,40,20,0.14)'; ctx.fillRect(774, 0, 26, 960);
    },
    init(S) {
      S.family = [[320, 690], [400, 672], [480, 690], [360, 712], [440, 712]].map(([x, y], i) => ({ x, y, i, bleat: 0 }));
      S.chop = { use: 0 }; S.hearts = 0; S.sparkle = 0; S.night = 0;
    },
    update(S, dt) {
      S.night += dt; S.hearts = Math.max(0, S.hearts - dt); S.sparkle = Math.max(0, S.sparkle - dt);
      S.chop.use = Math.max(0, S.chop.use - dt * 1.5);
      for (const f of S.family) f.bleat = Math.max(0, f.bleat - dt * 1.4);
      if (S.hearts > 0 && Math.random() < 0.3) S.fx.add({ type: 'heart', x: 400 + (Math.random() - 0.5) * 180, y: 640, vy: -50, life: 1.6, s: 1, c: '#f58fa6' });
    },
    draw(ctx, S) {
      const t = S.t;
      // the dumpling family on the plate, all smiling together
      for (const f of S.family) C.dumpling(ctx, { x: f.x, y: f.y, s: 0.6, t, mood: f.bleat > 0 ? 'joy' : 'laugh', happy: true, noShadow: true, seed: f.i, wave: f.bleat > 0 ? 1 : 0.15 });
      // chopsticks lifting one, gently
      ctx.save(); ctx.globalAlpha = 0.9; C.chopsticks(ctx, 560, 760 - S.chop.use * 20, -0.5 + S.chop.use * 0.1, 1); ctx.restore();
      if (S.sparkle > 0) S.fx.add({ type: 'star', x: 300 + Math.random() * 220, y: 600 + Math.random() * 60, life: 0.8, s: 1, c: '#ffe27a', rot: Math.random() * 6 });
    },
    drawTop(ctx, S) {
      ctx.save(); const bob = Math.sin(S.t * 2) * 3;
      SB.outlineText(ctx, '团 圆 饭', 400, 108 + bob, 46, '#ffe9a6', 'rgba(120,60,20,0.85)', 10, 900, 'center');
      SB.outlineText(ctx, '· 全 文 完 ·', 400, 162 + bob, 22, '#9a5a2a', 'rgba(255,240,210,0.8)', 6, 700, 'center');
      ctx.restore();
    },
    text: { x: 400, y: 858, size: 27, align: 'center', w: 700, col: '#5a3320', halo: 'rgba(255,240,220,0.95)', lines: [{ t: '桌上热气腾腾，一家人围坐在一起。' }, { t: '团团终于明白——' }, { t: '最好吃的味道，是和朋友在一起呀！' }] },
    hover(S, x, y) { return S.family.some((f) => SB.hitCirc(x, y, f.x, f.y, 34)) || SB.hitEll(x, y, 400, 700, 170, 90); },
    tap(S, x, y) {
      for (const f of S.family) if (SB.hitCirc(x, y, f.x, f.y, 34)) { f.bleat = 1; A.giggle(); A.pop(1 + f.i * 0.1); S.hearts = 1.4; S.fx.say(f.x, f.y - 60, ['谢谢你！', '我们是一家！', '真开心～', '好朋友！', '永远在一起！'][f.i], { s: 20 }); S.tap('fam'); return true; }
      if (SB.hitEll(x, y, 400, 700, 170, 90)) { S.chop.use = 1; S.sparkle = 1.2; S.hearts = 1.2; A.giggle(); A.tada(); S.fx.burst('star', 400, 640, 10, { cols: ['#ffe27a', '#fff', '#ffc4d4'], speed: 150, life: 1.3 }); S.tap('plate'); return true; }
      return false;
    },
    hints(S) { return [[S.family[1].x, S.family[1].y, 'fam'], [400, 700, 'plate']]; },
  };
})();
