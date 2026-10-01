/* 团团找朋友 · scenes B: tomato (red), corn (counting), bok choy (green) */
(function () {
  'use strict';
  const SB = window.SB, P = SB.P, C = SB.C, A = SB.A;
  const DEF = SB.DEF;
  const TAU = Math.PI * 2;
  const BY = 660;

  /* ================= 3 · 番茄 (red, juicy) ================= */
  DEF[3] = {
    name: 'tomato',
    bg(ctx, r) {
      SB.kitchen(ctx, r, { window: false });
      P.board(ctx, r, 820, BY + 70, 820, 240);
      // a wicker veg basket on the right
      ctx.save(); ctx.translate(1360, BY + 20);
      SB.body(ctx, (c) => { c.moveTo(-110, -10); c.lineTo(-96, 90); c.quadraticCurveTo(0, 108, 96, 90); c.lineTo(110, -10); c.closePath(); }, '#c99253', { sb: [-60, -10, 60, 90] });
      ctx.strokeStyle = 'rgba(120,80,40,0.4)'; ctx.lineWidth = 3; for (let k = -100; k < 100; k += 16) { ctx.beginPath(); ctx.moveTo(k, -6); ctx.lineTo(k * 0.9, 92); ctx.stroke(); }
      ctx.restore();
      for (let i = 0; i < 36; i++) SB.fillCirc(ctx, 500 + r() * 700, BY + 110 + r() * 80, 1 + r() * 2.3, 'rgba(255,252,245,0.55)');
    },
    init(S) {
      S.d = { x: 420, f: 1, bleat: 0, hop: 0, hv: 0, mood: 'happy', say: 0 };
      S.tom = { x: 900, y: BY, squash: 0, bleat: 0, roll: 0, mood: 'happy', say: 0, met: 0 };
      S.splash = 0;
    },
    enter(S) { S.tom.met = 0; },
    update(S, dt) {
      const d = S.d, tm = S.tom;
      d.bleat = Math.max(0, d.bleat - dt * 1.3); d.say = Math.max(0, d.say - dt);
      if (d.hv || d.hop > 0) { d.hv -= 1500 * dt; d.hop += d.hv * dt; if (d.hop <= 0) { d.hop = 0; d.hv = 0; } }
      tm.squash = Math.max(0, tm.squash - dt * 3); tm.bleat = Math.max(0, tm.bleat - dt * 1.4); tm.say = Math.max(0, tm.say - dt);
      if (!tm.met && S.t > 1.2) { tm.met = 1; tm.bleat = 1; A.pop(1); S.fx.say(tm.x, tm.y - 90, '我是红番茄！', { s: 26, c: '#e8503a' }); }
    },
    draw(ctx, S) {
      const t = S.t, d = S.d, tm = S.tom;
      C.tomato(ctx, { x: tm.x, y: tm.y, s: 1.15, t, squash: tm.squash, mood: tm.say > 0 ? 'wow' : tm.mood, happy: tm.bleat > 0, look: [-0.4, 0] });
      C.dumpling(ctx, { x: d.x, y: BY, s: 1.1, f: 1, t, hop: d.hop, bleat: d.bleat, mood: d.say > 0 ? 'wow' : 'happy', look: [0.6, 0] });
    },
    text: { x: 90, y: 128, size: 32, w: 600, lines: [{ t: '团团咕噜噜滚呀滚，遇见了圆圆的番茄。' }, { t: '“我是番茄，红红的，酸酸甜甜！”' }, { t: '“跟我做朋友吧！”团团高兴地说。' }] },
    hover(S, x, y) { return SB.hitEll(x, y, S.d.x, BY - 10, 90, 70) || SB.hitEll(x, y, S.tom.x, S.tom.y + 6, 60, 60); },
    tap(S, x, y) {
      const d = S.d, tm = S.tom;
      if (SB.hitEll(x, y, tm.x, tm.y + 6, 60, 60)) { tm.squash = 1; tm.bleat = 1; A.pop(1.1); A.splash(0.4); S.fx.pop(tm.x, tm.y - 70, '红色！', { s: 36, c: '#e8503a' }); S.fx.burst('drop', tm.x, tm.y, 6, { speed: 120, up: 80, g: 400, cols: ['#f0604a', '#ffb0a0'], life: 0.8 }); S.tap('tomato'); return true; }
      if (SB.hitEll(x, y, d.x, BY - 10, 90, 70)) { d.bleat = 1; d.hv = 420; A.giggle(); S.fx.say(d.x, BY - 120, '你好，番茄！', { s: 24 }); S.tap('dumpling'); return true; }
      return false;
    },
    hints(S) { return [[S.tom.x, S.tom.y, 'tomato'], [S.d.x, BY - 10, 'dumpling']]; },
  };

  /* ================= 4 · 玉米 (counting kernels) ================= */
  DEF[4] = {
    name: 'corn',
    bg(ctx, r) {
      SB.kitchen(ctx, r, { window: false });
      P.woodTable(ctx, r, 400, '#d49a5f');
      P.board(ctx, r, 820, BY + 80, 820, 230);
      for (let i = 0; i < 30; i++) SB.fillCirc(ctx, 500 + r() * 700, BY + 120 + r() * 70, 1 + r() * 2, 'rgba(255,252,245,0.5)');
    },
    init(S) {
      S.d = { x: 460, f: 1, bleat: 0, hop: 0, hv: 0, say: 0 };
      S.corn = { x: 980, y: BY - 10, bleat: 0, say: 0, met: 0 };
      S.tom = { x: 300, y: BY + 40 }; // tomato tagging along now
      S.kernels = [[900, 560], [960, 548], [1020, 560]].map(([x, y], i) => ({ x, y, pop: 0, i })); S.counted = new Set(); S.countedAll = 0;
    },
    enter(S) { S.corn.met = 0; },
    update(S, dt) {
      const d = S.d, cn = S.corn;
      d.bleat = Math.max(0, d.bleat - dt * 1.3); d.say = Math.max(0, d.say - dt); if (d.hv || d.hop > 0) { d.hv -= 1500 * dt; d.hop += d.hv * dt; if (d.hop <= 0) { d.hop = 0; d.hv = 0; } }
      cn.bleat = Math.max(0, cn.bleat - dt * 1.4); cn.say = Math.max(0, cn.say - dt);
      for (const k of S.kernels) k.pop = Math.max(0, k.pop - dt * 2);
      if (!cn.met && S.t > 1.2) { cn.met = 1; cn.bleat = 1; A.pop(1.2); S.fx.say(cn.x, cn.y - 110, '我是黄玉米！', { s: 26, c: '#f2b53e' }); }
    },
    draw(ctx, S) {
      const t = S.t, d = S.d, cn = S.corn;
      C.tomato(ctx, { x: S.tom.x, y: S.tom.y, s: 0.85, t, happy: true, seed: 1, look: [0.6, 0] });
      C.corn(ctx, { x: cn.x, y: cn.y, s: 1.15, t, bleat: cn.bleat, mood: cn.say > 0 ? 'wow' : 'happy', happy: cn.bleat > 0, look: [-0.4, 0] });
      // three loose kernels to count
      for (const k of S.kernels) { const s = 1 + k.pop * 0.4; ctx.save(); ctx.translate(k.x, k.y); ctx.scale(s, s); SB.body(ctx, (c) => c.ellipse(0, 0, 10, 12, 0, 0, TAU), '#f7d24a', { sb: [0, -12, 0, 12] }); SB.fillCirc(ctx, -3, -3, 3, 'rgba(255,250,200,0.8)'); ctx.restore(); }
      C.dumpling(ctx, { x: d.x, y: BY, s: 1.1, f: 1, t, hop: d.hop, bleat: d.bleat, mood: d.say > 0 ? 'wow' : 'happy', look: [0.6, 0] });
    },
    text: { x: 90, y: 128, size: 32, w: 600, lines: [{ t: '黄黄的玉米也来啦！“我有好多甜玉米粒。”' }, { t: '团团数一数：一粒、两粒、三粒……' }, { t: '“哇，数也数不完！”大家笑了起来。' }] },
    hover(S, x, y) { return SB.hitEll(x, y, S.d.x, BY - 10, 90, 70) || SB.hitEll(x, y, S.corn.x, S.corn.y, 50, 60) || S.kernels.some((k) => SB.hitCirc(x, y, k.x, k.y, 24)); },
    tap(S, x, y) {
      const d = S.d, cn = S.corn;
      for (const k of S.kernels) if (SB.hitCirc(x, y, k.x, k.y, 24)) {
        k.pop = 1; const n = k.i + 1; A.note(k.i + 4, 0.5, 0.1); S.fx.pop(k.x, k.y - 36, String(n), { s: 44, c: '#f2b53e', life: 1 }); S.counted.add(n); S.tap('kernel');
        if (S.counted.size === 3 && !S.countedAll) { S.countedAll = 1; setTimeout(() => { cn.say = 1; A.giggle(); S.fx.say(cn.x, cn.y - 110, '一、二、三，\n三粒玉米！', { s: 24, life: 2.6 }); }, 450); }
        return true;
      }
      if (SB.hitEll(x, y, cn.x, cn.y, 50, 60)) { cn.bleat = 1; A.pop(1.2); S.fx.pop(cn.x, cn.y - 90, '黄色！', { s: 34, c: '#f2b53e' }); S.tap('corn'); return true; }
      if (SB.hitEll(x, y, d.x, BY - 10, 90, 70)) { d.bleat = 1; d.hv = 420; A.giggle(); S.fx.say(d.x, BY - 120, '好多玉米粒！', { s: 24 }); S.tap('dumpling'); return true; }
      return false;
    },
    hints(S) { return [[S.kernels[1].x, S.kernels[1].y, 'kernel'], [S.corn.x, S.corn.y, 'corn']]; },
  };

  /* ================= 5 · 小青菜 (green) ================= */
  DEF[5] = {
    name: 'bokchoy',
    bg(ctx, r) {
      SB.kitchen(ctx, r, { window: true });
      P.board(ctx, r, 820, BY + 80, 840, 240);
      // water droplets — the greens are freshly washed
      for (let i = 0; i < 30; i++) { const x = 500 + r() * 760, y = BY + 110 + r() * 70; SB.fillEll(ctx, x, y, 2.5, 3.5, 'rgba(150,210,240,0.5)'); }
    },
    init(S) {
      S.d = { x: 440, f: 1, bleat: 0, hop: 0, hv: 0, say: 0 };
      S.bok = { x: 980, y: BY - 6, bleat: 0, say: 0, met: 0, rustle: 0 };
      S.tom = { x: 300, y: BY + 36 }; S.corn = { x: 180, y: BY + 20 };
      S.drops = 0;
    },
    enter(S) { S.bok.met = 0; },
    update(S, dt) {
      const d = S.d, bk = S.bok;
      d.bleat = Math.max(0, d.bleat - dt * 1.3); d.say = Math.max(0, d.say - dt); if (d.hv || d.hop > 0) { d.hv -= 1500 * dt; d.hop += d.hv * dt; if (d.hop <= 0) { d.hop = 0; d.hv = 0; } }
      bk.bleat = Math.max(0, bk.bleat - dt * 1.4); bk.say = Math.max(0, bk.say - dt); bk.rustle = Math.max(0, bk.rustle - dt * 2);
      if (!bk.met && S.t > 1.2) { bk.met = 1; bk.bleat = 1; A.pop(0.9); S.fx.say(bk.x, bk.y - 120, '我是绿青菜！', { s: 26, c: '#4e9c3f' }); }
    },
    draw(ctx, S) {
      const t = S.t, d = S.d, bk = S.bok;
      C.corn(ctx, { x: S.corn.x, y: S.corn.y, s: 0.78, t, happy: true, seed: 2, look: [0.6, 0] });
      C.tomato(ctx, { x: S.tom.x, y: S.tom.y, s: 0.82, t, happy: true, seed: 1, look: [0.6, 0] });
      C.bokchoy(ctx, { x: bk.x, y: bk.y, s: 1.2, t, bleat: bk.bleat, mood: bk.say > 0 ? 'wow' : 'happy', happy: bk.bleat > 0, look: [-0.4, 0] });
      C.dumpling(ctx, { x: d.x, y: BY, s: 1.1, f: 1, t, hop: d.hop, bleat: d.bleat, mood: d.say > 0 ? 'wow' : 'happy', look: [0.6, 0] });
    },
    text: { x: 90, y: 128, size: 32, w: 600, lines: [{ t: '绿油油的小青菜，摇着嫩叶子跑过来。' }, { t: '“我绿绿的，脆脆的，还很有营养哦！”' }, { t: '团团的朋友，越来越多啦。' }] },
    hover(S, x, y) { return SB.hitEll(x, y, S.d.x, BY - 10, 90, 70) || SB.hitEll(x, y, S.bok.x, S.bok.y - 10, 56, 70); },
    tap(S, x, y) {
      const d = S.d, bk = S.bok;
      if (SB.hitEll(x, y, bk.x, bk.y - 10, 56, 70)) { bk.bleat = 1; bk.rustle = 1; A.pop(0.9); A.chirp(2, 1.4); S.fx.pop(bk.x, bk.y - 100, '绿色！', { s: 34, c: '#4e9c3f' }); S.fx.burst('leaf', bk.x, bk.y - 40, 6, { speed: 120, up: 40, g: 120, cols: ['#5fb050', '#8fcf6a'], life: 1.4 }); S.tap('bok'); return true; }
      if (SB.hitEll(x, y, d.x, BY - 10, 90, 70)) { d.bleat = 1; d.hv = 420; A.giggle(); S.fx.say(d.x, BY - 120, '朋友越来越多！', { s: 22 }); S.tap('dumpling'); return true; }
      return false;
    },
    hints(S) { return [[S.bok.x, S.bok.y - 10, 'bok'], [S.d.x, BY - 10, 'dumpling']]; },
  };
})();
