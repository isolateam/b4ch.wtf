(function () {
  const bootEl = document.getElementById('boot-lines');
  const profileEl = document.getElementById('profile');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!bootEl || !profileEl) {
    return;
  }

  const lines = [
    { text: '', ok: false },
  ];

  if (reduceMotion) {
    bootEl.style.display = 'none';
    profileEl.classList.add('visible');
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let rendered = '';

  function typeStep() {
    if (lineIndex >= lines.length) {
      bootEl.style.display = 'none';
      profileEl.classList.add('visible');
      return;
    }

    const current = lines[lineIndex];

    if (charIndex <= current.text.length) {
      const partial = current.text.slice(0, charIndex);
      const cls = current.ok ? 'ok' : '';
      bootEl.innerHTML = rendered + `<span class="${cls}">${partial}</span><span class="cursor"></span>`;
      charIndex++;
      setTimeout(typeStep, 30);
    } else {
      const cls = current.ok ? 'ok' : '';
      rendered += `<span class="${cls}">${current.text}</span>\n`;
      lineIndex++;
      charIndex = 0;
      setTimeout(typeStep, 220);
    }
  }

  typeStep();
})();

(function () {
  const el = document.getElementById('uptime');
  const start = Date.now();
  function pad(n) { return n.toString().padStart(2, '0'); }
  function tick() {
    const s = Math.floor((Date.now() - start) / 1000);
    const hh = pad(Math.floor(s / 3600));
    const mm = pad(Math.floor((s % 3600) / 60));
    const ss = pad(s % 60);
    el.textContent = `uptime ${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
})();

(function () {
  const canvas = document.getElementById('bg-grid');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width, height, dpr, offset = 0;
  const spacing = 46;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(0, 225, 255, 0.05)';
    ctx.lineWidth = 1;

    for (let x = -spacing + (offset % spacing); x < width + spacing; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = -spacing + (offset % spacing); y < height + spacing; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!reduceMotion) {
      offset += 0;
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();