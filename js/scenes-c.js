/* 团团找朋友 · scenes C: shrimp, egg, everyone-joins */
(function () {
  'use strict';
  const SB = window.SB, P = SB.P, C = SB.C, A = SB.A;
  const DEF = SB.DEF;
  const TAU = Math.PI * 2;
  const BY = 660;

  /* ================= 6 · 虾 (bouncy) ================= */
  DEF[6] = {
    name: 'shrimp',
    bg(ctx, r) {
      SB.kitchen(ctx, r, { window: false });
      P.board(ctx, r, 820, BY + 80, 860, 240);
      P.bowl(ctx, r, 1360, BY + 30, 90, '#eef3f7');
      for (let i = 0; i < 24; i++) SB.fillCirc(ctx, 520 + r() * 720, BY + 120 + r() * 60, 1 + r() * 2, 'rgba(255,252,245,0.5)');
    },
    init(S) {
      S.d = { x: 460, f: 1, bleat: 0, hop: 0, hv: 0, say: 0 };
      S.sh = { x: 980, y: BY - 10, hop: 0, hv: 0, bleat: 0, say: 0, met: 0 };
      S.friends = [{ fn: 'tomato', x: 300, y: BY + 36, seed: 1 }, { fn: 'corn', x: 180, y: BY + 20, seed: 2 }, { fn: 'bokchoy', x: 100, y: BY + 30, seed: 3 }];
    },
    enter(S) { S.sh.met = 0; },
    update(S, dt) {
      const d = S.d, sh = S.sh;
      d.bleat = Math.max(0, d.bleat - dt * 1.3); d.say = Math.max(0, d.say - dt); if (d.hv || d.hop > 0) { d.hv -= 1500 * dt; d.hop += d.hv * dt; if (d.hop <= 0) { d.hop = 0; d.hv = 0; } }
      sh.bleat = Math.max(0, sh.bleat - dt * 1.4); sh.say = Math.max(0, sh.say - dt); if (sh.hv || sh.hop > 0) { sh.hv -= 1400 * dt; sh.hop += sh.hv * dt; if (sh.hop <= 0) { sh.hop = 0; sh.hv = 0; } }
      if (!sh.met && S.t > 1.2) { sh.met = 1; sh.bleat = 1; sh.hv = 400; A.boing(true); S.fx.say(sh.x, sh.y - 110, '我是蹦蹦虾！', { s: 26, c: '#f58a5a' }); }
    },
    draw(ctx, S) {
      const t = S.t, d = S.d, sh = S.sh;
      for (const fr of S.friends) C[fr.fn](ctx, { x: fr.x, y: fr.y, s: 0.76, t, happy: true, seed: fr.seed, look: [0.6, 0] });
      C.shrimp(ctx, { x: sh.x, y: sh.y - sh.hop, s: 1.15, t, bleat: sh.bleat, mood: sh.say > 0 ? 'wow' : 'happy', happy: sh.bleat > 0, look: [-0.3, 0] });
      C.dumpling(ctx, { x: d.x, y: BY, s: 1.1, f: 1, t, hop: d.hop, bleat: d.bleat, mood: d.say > 0 ? 'wow' : 'happy', look: [0.6, 0] });
    },
    text: { x: 90, y: 128, size: 32, w: 600, lines: [{ t: '“蹦！蹦！”一只小虾跳进了队伍。' }, { t: '“我弯弯的，粉粉的，吃起来QQ弹弹！”' }, { t: '团团笑弯了眼：“你跳得真高呀！”' }] },
    hover(S, x, y) { return SB.hitEll(x, y, S.d.x, BY - 10, 90, 70) || SB.hitEll(x, y, S.sh.x, S.sh.y - S.sh.hop, 60, 60); },
    tap(S, x, y) {
      const d = S.d, sh = S.sh;
      if (SB.hitEll(x, y, sh.x, sh.y - sh.hop, 60, 60)) { sh.hv = 500; sh.bleat = 1; A.boing(true); S.fx.pop(sh.x, sh.y - 90, '蹦！', { s: 36, c: '#f58a5a' }); S.fx.burst('spark', sh.x, sh.y - 30, 6, { cols: ['#f58a5a', '#fff'], speed: 130 }); S.tap('shrimp'); return true; }
      if (SB.hitEll(x, y, d.x, BY - 10, 90, 70)) { d.bleat = 1; d.hv = 420; A.giggle(); S.fx.say(d.x, BY - 120, '你跳得真高！', { s: 24 }); S.tap('dumpling'); return true; }
      return false;
    },
    hints(S) { return [[S.sh.x, S.sh.y, 'shrimp'], [S.d.x, BY - 10, 'dumpling']]; },
  };

  /* ================= 7 · 蛋 (soft, golden) ================= */
  DEF[7] = {
    name: 'egg',
    bg(ctx, r) {
      SB.kitchen(ctx, r, { window: true });
      P.board(ctx, r, 820, BY + 80, 880, 240);
      for (let i = 0; i < 22; i++) SB.fillCirc(ctx, 520 + r() * 740, BY + 120 + r() * 60, 1 + r() * 2, 'rgba(255,252,245,0.5)');
    },
    init(S) {
      S.d = { x: 480, f: 1, bleat: 0, hop: 0, hv: 0, say: 0 };
      S.egg = { x: 980, y: BY + 6, wobble: 0, bleat: 0, say: 0, met: 0 };
      S.friends = [{ fn: 'tomato', x: 320, y: BY + 36, seed: 1 }, { fn: 'corn', x: 210, y: BY + 20, seed: 2 }, { fn: 'bokchoy', x: 120, y: BY + 30, seed: 3 }, { fn: 'shrimp', x: 60, y: BY + 20, seed: 4 }];
    },
    enter(S) { S.egg.met = 0; },
    update(S, dt) {
      const d = S.d, eg = S.egg;
      d.bleat = Math.max(0, d.bleat - dt * 1.3); d.say = Math.max(0, d.say - dt); if (d.hv || d.hop > 0) { d.hv -= 1500 * dt; d.hop += d.hv * dt; if (d.hop <= 0) { d.hop = 0; d.hv = 0; } }
      eg.bleat = Math.max(0, eg.bleat - dt * 1.4); eg.say = Math.max(0, eg.say - dt); eg.wobble = Math.max(0, eg.wobble - dt * 2);
      if (!eg.met && S.t > 1.2) { eg.met = 1; eg.bleat = 1; A.pop(0.8); S.fx.say(eg.x, eg.y - 90, '我是嫩嫩的蛋！', { s: 26, c: '#f7b63a' }); }
    },
    draw(ctx, S) {
      const t = S.t, d = S.d, eg = S.egg;
      for (const fr of S.friends) C[fr.fn](ctx, { x: fr.x, y: fr.y, s: 0.72, t, happy: true, seed: fr.seed, look: [0.6, 0] });
      ctx.save(); ctx.translate(eg.x, eg.y); ctx.rotate(Math.sin(t * 8) * 0.06 * eg.wobble); ctx.translate(-eg.x, -eg.y);
      C.egg(ctx, { x: eg.x, y: eg.y, s: 1.1, t, bleat: eg.bleat, mood: eg.say > 0 ? 'wow' : 'happy', happy: eg.bleat > 0, look: [-0.3, 0] });
      ctx.restore();
      C.dumpling(ctx, { x: d.x, y: BY, s: 1.1, f: 1, t, hop: d.hop, bleat: d.bleat, mood: d.say > 0 ? 'wow' : 'happy', look: [0.6, 0] });
    },
    text: { x: 90, y: 128, size: 32, w: 600, lines: [{ t: '最后，软软的蛋也摇摇晃晃地来了。' }, { t: '“我金黄金黄，香香软软，最会抱抱！”' }, { t: '现在，团团有五个好朋友啦！' }] },
    hover(S, x, y) { return SB.hitEll(x, y, S.d.x, BY - 10, 90, 70) || SB.hitEll(x, y, S.egg.x, S.egg.y, 60, 44); },
    tap(S, x, y) {
      const d = S.d, eg = S.egg;
      if (SB.hitEll(x, y, eg.x, eg.y, 60, 44)) { eg.wobble = 1; eg.bleat = 1; A.pop(0.8); S.fx.pop(eg.x, eg.y - 70, '黄色！', { s: 32, c: '#f7b63a' }); S.fx.burst('heart', eg.x, eg.y - 30, 4, { cols: ['#f7d24a', '#fff'], speed: 90, up: 50, life: 1 }); S.tap('egg'); return true; }
      if (SB.hitEll(x, y, d.x, BY - 10, 90, 70)) { d.bleat = 1; d.hv = 420; A.giggle(); S.fx.say(d.x, BY - 120, '五个好朋友！', { s: 24 }); S.tap('dumpling'); return true; }
      return false;
    },
    hints(S) { return [[S.egg.x, S.egg.y, 'egg'], [S.d.x, BY - 10, 'dumpling']]; },
  };

  /* ================= 8 · 一起跳进团团 (the togetherness turn) ================= */
  DEF[8] = {
    name: 'together',
    bg(ctx, r) {
      SB.kitchen(ctx, r, { window: true });
      P.board(ctx, r, 820, BY + 90, 900, 250);
      for (let i = 0; i < 26; i++) SB.fillCirc(ctx, 460 + r() * 820, BY + 130 + r() * 60, 1 + r() * 2.4, 'rgba(255,252,245,0.55)');
    },
    init(S) {
      // five friends queued to hop into the open dumpling; a tap sends each in; a progress fill
      S.d = { x: 820, y: BY, open: 1, fill: 0, bleat: 0, say: 0, mood: 'happy' };
      S.queue = [
        { fn: 'tomato', x: 360, seed: 1, in: 0, t0: 0 }, { fn: 'corn', x: 250, seed: 2, in: 0 },
        { fn: 'bokchoy', x: 150, seed: 3, in: 0 }, { fn: 'shrimp', x: 60, seed: 4, in: 0 }, { fn: 'egg', x: -20, seed: 5, in: 0 },
      ];
      S.jumping = null; S.done = 0;
    },
    enter(S) { for (const q of S.queue) q.in = 0; S.d.fill = 0; S.done = 0; S.jumping = null; },
    update(S, dt) {
      const d = S.d; d.bleat = Math.max(0, d.bleat - dt * 1.3); d.say = Math.max(0, d.say - dt);
      const jn = S.jumping;
      if (jn) {
        jn.p += dt * 1.8;
        const u = SB.ease.inOut(Math.min(1, jn.p));
        jn.cx = SB.lerp(jn.fromx, d.x, u); jn.cy = BY - Math.sin(Math.min(1, jn.p) * Math.PI) * 160 + (BY - BY) * u;
        if (jn.p >= 1) { jn.q.in = 1; d.fill = S.queue.filter((q) => q.in).length / S.queue.length; d.bleat = 1; A.pop(1 + Math.random() * 0.3); S.fx.burst('spark', d.x, d.y - 20, 7, { cols: ['#ffe27a', '#fff', '#ffc4d4'], speed: 130 }); S.jumping = null; }
      }
      if (!S.jumping && !S.done && S.queue.every((q) => q.in)) { S.done = 1; d.say = 2.6; A.giggle(); A.bell && A.bell(); setTimeout(() => { S.fx.say(d.x, d.y - 150, '我的肚子\n装满了朋友！', { s: 28, life: 2.8 }); }, 300); }
    },
    draw(ctx, S) {
      const t = S.t, d = S.d, jn = S.jumping;
      // waiting friends
      let qi = 0;
      for (const q of S.queue) { if (q.in || (jn && jn.q === q)) continue; C[q.fn](ctx, { x: q.x, y: BY + 30, s: 0.8, t, happy: true, seed: q.seed, look: [0.8, 0] }); qi++; }
      // the dumpling, getting plumper as it fills
      C.dumpling(ctx, { x: d.x, y: d.y, s: 1.25 + d.fill * 0.12, t, mood: d.say > 0 ? 'joy' : 'happy', happy: true, armsUp: d.fill, wave: S.done ? 1 : 0.3, look: [0, 0.1] });
      // a friend mid-jump
      if (jn) { ctx.save(); C[jn.q.fn](ctx, { x: jn.cx, y: jn.cy, s: 0.72, t, happy: true, seed: jn.q.seed, noShadow: true }); ctx.restore(); }
      // progress hearts above
      for (let i = 0; i < S.queue.length; i++) { const on = S.queue[i].in; ctx.globalAlpha = on ? 1 : 0.25; ctx.fillStyle = on ? '#f58fa6' : '#c9b9a9'; ctx.beginPath(); SB.heart(ctx, d.x - 100 + i * 50, d.y - 190, 11); ctx.fill(); ctx.globalAlpha = 1; }
    },
    drawTop(ctx, S) {
      if (!S.done) { ctx.save(); ctx.globalAlpha = 0.85 * (0.6 + 0.4 * Math.sin(S.t * 4)); SB.outlineText(ctx, '点点小伙伴，让它们跳进团团 →', 820, 300, 26, '#b8623a', '#fffaf0', 7, 800, 'center'); ctx.restore(); }
    },
    text: { x: 90, y: 128, size: 32, w: 580, lines: [{ t: '“咦？要不，你们都住进我的肚子里吧！”' }, { t: '番茄、玉米、青菜、虾和蛋，一个个跳进来。' }, { t: '团团圆鼓鼓的，心里也暖暖的。' }] },
    hover(S, x, y) { return SB.hitEll(x, y, S.d.x, S.d.y - 10, 100, 80) || S.queue.some((q) => !q.in && SB.hitEll(x, y, q.x, BY + 30, 48, 56)); },
    tap(S, x, y) {
      const d = S.d;
      for (const q of S.queue) if (!q.in && !(S.jumping && S.jumping.q === q) && SB.hitEll(x, y, q.x, BY + 30, 48, 56)) { if (S.jumping) return true; S.jumping = { q, p: 0, fromx: q.x, cx: q.x, cy: BY + 30 }; A.boing(true); S.tap('friend'); return true; }
      if (SB.hitEll(x, y, d.x, d.y - 10, 100, 80)) { d.bleat = 1; A.giggle(); S.fx.burst('heart', d.x, d.y - 60, 5, { cols: ['#f58fa6', '#ffd1dd'], speed: 110, up: 70, life: 1.1 }); S.tap('dumpling'); return true; }
      return false;
    },
    hints(S) { const q = S.queue.find((q) => !q.in); return q ? [[q.x, BY + 30, 'friend']] : [[S.d.x, S.d.y - 10, 'dumpling']]; },
  };
})();
