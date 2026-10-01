/* 团团找朋友 · scenes A: cover, title, board */
(function () {
  'use strict';
  const SB = window.SB, P = SB.P, C = SB.C, A = SB.A;
  const DEF = (SB.DEF = SB.DEF || []);
  const TAU = Math.PI * 2;

  // shared warm kitchen backdrop used by several spreads
  SB.kitchen = (ctx, r, o = {}) => {
    const x0 = o.x0 || 0, x1 = o.x1 || 1600;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, 0, x1 - x0, 960); ctx.clip();
    P.tileWall(ctx, r, 420, o.wall || '#eef4f2');
    P.woodTable(ctx, r, 400);
    if (o.window !== false) P.window(ctx, r, 300, 180, 300, 220);
    P.lightShaft(ctx, 360, 70, 180, 520);
    ctx.restore();
  };

  /* ================= 0 · COVER ================= */
  DEF[0] = {
    name: 'cover',
    bg(ctx, r) {
      ctx.save(); ctx.beginPath(); ctx.rect(800, 0, 800, 960); ctx.clip();
      P.tileWall(ctx, r, 430, '#f0e2cf');
      P.woodTable(ctx, r, 410, '#cf9158');
      P.lightShaft(ctx, 1200, 60, 220, 560);
      ctx.restore();
      ctx.fillStyle = 'rgba(60,40,20,0.16)'; ctx.fillRect(800, 0, 26, 960);
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(826, 0, 3, 960);
    },
    init(S) { S.ch = [0, 0, 0, 0].map(() => ({ y: 0, v: 0, r: 0 })); S.d = { bleat: 0, hop: 0, hv: 0, wave: 0 }; S.friends = { k: 0 }; },
    update(S, dt) {
      for (const c of S.ch) { c.v += (-c.y * 180 - c.v * 9) * dt; c.y += c.v * dt; c.r *= Math.pow(0.02, dt); }
      const d = S.d; d.wave = Math.max(0, d.wave - dt); if (d.hv || d.hop > 0) { d.hv -= 1500 * dt; d.hop += d.hv * dt; if (d.hop <= 0) { d.hop = 0; d.hv = 0; } }
      S.friends.k = Math.max(0, S.friends.k - dt);
    },
    draw(ctx, S) {
      const t = S.t;
      // title 团团找朋友
      const chars = '团团找朋友'; const cols = ['#e8774e', '#e8503a', '#f2b53e', '#6fb35a', '#5d95d6'];
      for (let i = 0; i < 5; i++) {
        const c = S.ch[i] || { y: 0, r: 0 }; const x = 1200 + (i - 2) * 126, y = 196 + Math.sin(t * 2 + i * 0.8) * 5 + c.y;
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.5 + i) * 0.04 + c.r);
        ctx.font = `900 112px ${SB.FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
        ctx.lineWidth = 24; ctx.strokeStyle = '#fffaf0'; ctx.strokeText(chars[i], 0, 0);
        ctx.fillStyle = 'rgba(80,50,40,0.25)'; ctx.fillText(chars[i], 4, 6);
        ctx.fillStyle = cols[i]; ctx.fillText(chars[i], 0, 0);
        ctx.restore();
      }
      SB.outlineText(ctx, '一只小饺子的厨房冒险', 1200, 312, 34, '#b8623a', '#fffaf0', 9, 700, 'center');
      // the hero dumpling, waving, with friends peeking
      const show = S.friends.k > 0;
      C.tomato(ctx, { x: 1010, y: 760, s: 0.8, t, happy: show, seed: 1 });
      C.corn(ctx, { x: 1410, y: 740, s: 0.72, t, happy: show, seed: 2 });
      C.bokchoy(ctx, { x: 1480, y: 820, s: 0.7, t, happy: show, seed: 3 });
      C.dumpling(ctx, { x: 1215, y: 720, s: 1.3, t, hop: S.d.hop, wave: S.d.wave || 0.3, mood: S.d.bleat > 0 ? 'laugh' : 'happy', look: [0, 0] });
      S.d.bleat = Math.max(0, S.d.bleat - 0.016);
      SB.outlineText(ctx, '文·图  花椒绘本工作室', 1500, 925, 22, '#fff', 'rgba(90,50,20,0.5)', 5, 700, 'right');
    },
    hover: (S, x, y) => SB.hitEll(x, y, 1215, 720, 110, 90) || SB.hitEll(x, y, 1010, 760, 70, 70) || SB.hitEll(x, y, 1410, 740, 70, 80) || (y > 130 && y < 270 && x > 890 && x < 1520),
    tap(S, x, y) {
      if (y > 130 && y < 270 && x > 890 && x < 1520) { const i = SB.clamp(Math.round((x - 1200) / 126) + 2, 0, 4); if (S.ch[i]) { S.ch[i].v = -680; S.ch[i].r = (Math.random() - 0.5) * 0.5; } A.note(i + 2, 0.6, 0.14); S.tap('title'); return true; }
      if (SB.hitEll(x, y, 1215, 720, 110, 90)) { S.d.bleat = 1; S.d.hv = 500; S.d.wave = 1; A.giggle(); A.pop(1.2); S.friends.k = 2; S.fx.say(1290, 620, '你好呀！', { s: 32 }); S.fx.burst('heart', 1215, 650, 6, { speed: 120, up: 70, cols: ['#f58fa6', '#ffd1dd'], life: 1.1 }); S.tap('dumpling'); return true; }
      if (SB.hitEll(x, y, 1010, 760, 70, 70)) { S.friends.k = 2; A.pop(1); S.fx.burst('spark', 1010, 710, 6, { cols: ['#e8503a', '#fff'], speed: 120 }); return true; }
      if (SB.hitEll(x, y, 1410, 740, 70, 80)) { S.friends.k = 2; A.pop(1.3); S.fx.burst('spark', 1410, 690, 6, { cols: ['#f2b53e', '#fff'], speed: 120 }); return true; }
      return false;
    },
    hints: () => [[1215, 700, 'dumpling'], [1200, 196, 'title']],
  };

  /* ================= 1 · TITLE PAGE ================= */
  DEF[1] = {
    name: 'title',
    bg(ctx, r) {
      // left endpaper: a soft checker of little food dots
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 800, 960); ctx.clip();
      SB.tex(ctx, (c) => c.rect(0, 0, 800, 960), '#f6e3cf', { r, box: [0, 0, 800, 960], dens: 600, len: 24, lw: 2, a: 0.2 });
      let row = 0;
      for (let y = 60; y < 1000; y += 120, row++) for (let x = (row % 2 ? 60 : 0) + 30; x < 860; x += 120) {
        const k = (Math.floor(x / 120) + row) % 3; ctx.save(); ctx.globalAlpha = 0.9;
        if (k === 0) C.dumpling(ctx, { x, y, s: 0.22, t: 0, noShadow: true });
        else if (k === 1) C.tomato(ctx, { x, y, s: 0.28, t: 0, noShadow: true });
        else C.corn(ctx, { x, y, s: 0.24, t: 0, noShadow: true });
        ctx.restore();
      }
      ctx.restore();
      SB.kitchen(ctx, r, { x0: 800, x1: 1600, window: false });
      ctx.save(); ctx.beginPath(); ctx.arc(1200, 540, 220, 0, TAU); ctx.clip();
      SB.kitchen(ctx, r, { x0: 980, x1: 1420, window: false });
      ctx.restore();
      ctx.strokeStyle = '#e0b06a'; ctx.lineWidth = 6; ctx.setLineDash([2, 12]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(1200, 540, 236, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
      SB.outlineText(ctx, '团团找朋友', 1200, 170, 72, '#e8774e', '#fffaf0', 13, 900, 'center');
    },
    init(S) { S.wake = 0; },
    update(S, dt) { S.wake = Math.max(0, S.wake - dt * 0.4); },
    draw(ctx, S) {
      const t = S.t;
      P.board(ctx, SB.rng(31), 1200, 600, 300, 170);
      C.dumpling(ctx, { x: 1200, y: 560, s: 0.95, t, mood: S.wake > 0.1 ? 'laugh' : 'happy', happy: S.wake > 0.1, wave: S.wake > 0.1 ? 1 : 0.2 });
    },
    text: { x: 1200, y: 850, size: 30, align: 'center', w: 640, col: '#9a6a42', lines: [{ t: '献给愿意分享、也愿意交朋友的小朋友' }] },
    hover: (S, x, y) => SB.hitCirc(x, y, 1200, 580, 150),
    tap(S, x, y) { if (SB.hitCirc(x, y, 1200, 580, 150)) { S.wake = 1.6; A.giggle(); A.pop(1.2); S.fx.burst('spark', 1200, 520, 10, { speed: 150, cols: ['#ffe27a', '#fff', '#ffc4d4'] }); S.tap('v'); return true; } return false; },
    hints: () => [[1200, 560, 'v']],
  };

  /* ================= 2 · 砧板上 · the lonely plain dumpling ================= */
  const G2 = { by: 640 };
  DEF[2] = {
    name: 'board',
    bg(ctx, r) {
      SB.kitchen(ctx, r);
      P.board(ctx, r, 820, G2.by + 60, 760, 230);
      // a little pile of flour + a rolling pin at the side
      ctx.save(); ctx.translate(1330, G2.by + 40); ctx.rotate(-0.15);
      SB.body(ctx, (c) => SB.roundRect(c, -90, -16, 180, 32, 16), '#e7c58f', { sb: [0, -16, 0, 16] });
      SB.body(ctx, (c) => SB.roundRect(c, -120, -7, 34, 14, 7), '#c89a5a', {}); SB.body(ctx, (c) => SB.roundRect(c, 86, -7, 34, 14, 7), '#c89a5a', {});
      ctx.restore();
      for (let i = 0; i < 40; i++) SB.fillCirc(ctx, 1200 + r() * 240, G2.by + 120 + r() * 90, 1 + r() * 2.5, 'rgba(255,252,245,0.6)');
    },
    init(S) {
      S.d = { x: 560, f: 1, run: 0, ph: 0, bleat: 0, hop: 0, hv: 0, mood: 'sad', say: 0, taps: 0, roll: 0 };
      S.flour = []; S.flourT = 0;
      S.wrapper = { peek: 0 }; // an empty wrapper nearby that "has no filling" like him
      S.dots = [[470, 740, '#f2b53e'], [1180, 760, '#e8503a'], [980, 800, '#6fb35a']].map(([x, y, c], i) => ({ x, y, c, pop: 0, i }));
    },
    update(S, dt) {
      const d = S.d, t = S.t;
      d.bleat = Math.max(0, d.bleat - dt * 1.3); d.say = Math.max(0, d.say - dt);
      if (d.hv || d.hop > 0) { d.hv -= 1500 * dt; d.hop += d.hv * dt; if (d.hop <= 0) { d.hop = 0; d.hv = 0; } }
      if (d.roll !== 0) { d.x += d.roll * dt; d.ph += dt * 10; d.roll *= Math.pow(0.02, dt); if (Math.abs(d.roll) < 8) d.roll = 0; d.x = SB.clamp(d.x, 300, 1300); }
      for (const dd of S.dots) dd.pop = Math.max(0, dd.pop - dt * 2);
      S.flourT += dt;
    },
    draw(ctx, S) {
      const t = S.t, d = S.d;
      // scattered veggie dots on the board (future friends, tiny)
      for (const dd of S.dots) { const s = 1 + dd.pop * 0.3; ctx.save(); ctx.translate(dd.x, dd.y); ctx.scale(s, s); SB.fillCirc(ctx, 0, 0, 10, dd.c); SB.fillCirc(ctx, -3, -3, 3.5, 'rgba(255,255,255,0.5)'); ctx.restore(); }
      // the hero dumpling
      C.dumpling(ctx, { x: d.x, y: G2.by, s: 1.15, f: d.f, t, run: d.run, legPh: d.ph, hop: d.hop, mood: d.say > 0 ? 'wow' : d.mood, look: [0.2, -0.1], tilt: d.roll ? Math.sin(t * 20) * 0.05 : 0 });
    },
    text: { x: 90, y: 128, size: 34, w: 620, lines: [{ t: '厨房的砧板上，住着一只小饺子，叫团团。' }, { t: '别的饺子肚子里都有香香的馅儿，' }, { t: '只有团团，肚子里空空的。“我好孤单呀。”' }] },
    hover(S, x, y) { const d = S.d; return SB.hitEll(x, y, d.x, G2.by - 10, 90, 70) || S.dots.some((dd) => SB.hitCirc(x, y, dd.x, dd.y, 26)); },
    tap(S, x, y) {
      const d = S.d;
      if (SB.hitEll(x, y, d.x, G2.by - 10, 90, 70)) {
        d.taps++; d.bleat = 1; A.pop(0.9); S.tap('dumpling');
        if (d.taps % 2 === 0) { d.roll = d.x < 800 ? 420 : -420; A.boing(true); S.fx.say(d.x, G2.by - 120, '咕噜噜～', { s: 26 }); }
        else { d.hv = 420; d.say = 2; A.sniff(); S.fx.say(d.x, G2.by - 120, '我的肚子\n空空的……', { s: 26, life: 2 }); }
        return true;
      }
      for (const dd of S.dots) if (SB.hitCirc(x, y, dd.x, dd.y, 26)) { dd.pop = 1; A.pop(1 + dd.i * 0.15); A.note(dd.i + 3, 0.5, 0.08); S.fx.burst('spark', dd.x, dd.y, 5, { cols: [dd.c, '#fff'], speed: 100 }); S.tap('dot'); return true; }
      return false;
    },
    hints(S) { return [[S.d.x, G2.by - 10, 'dumpling'], [S.dots[0].x, S.dots[0].y, 'dot']]; },
  };
})();
