import * as React from 'react';
import styled from 'styled-components';

/** Curved conduit + packet animation; styled-components used so layout works without Tailwind. */
const HeroCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  opacity: 0;

  @media (prefers-reduced-motion: reduce) {
    display: none !important;
  }
`;

export function HeroBackground() {
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(0);
  const runningRef = React.useRef(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasEl = canvas;
    const ctx2d = ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const LINE_COUNT = 28;
    const LINE_COLOR = 'rgba(37, 99, 235, 0.09)';
    const LINE_WIDTH = 1.2;
    const PACKET_COUNT = 80;
    const PACKET_MIN_SPEED = 0.3;
    const PACKET_MAX_SPEED = 1.8;
    const PACKET_LEN_MIN = 12;
    const PACKET_LEN_MAX = 36;
    const TOP_SPREAD = 0.18;
    const BOTTOM_SPREAD = 0.75;
    const CURVE_INTENSITY = 4.8;

    let W = 0;
    let H = 0;
    let lines = [];
    let packets = [];

    function buildLines() {
      lines = [];
      const cx = W / 2;
      const topHalf = (W * TOP_SPREAD) / 2;
      const botHalf = (W * BOTTOM_SPREAD) / 2;
      const steps = 120;

      for (let i = 0; i < LINE_COUNT; i++) {
        const t = LINE_COUNT <= 1 ? 0.5 : i / (LINE_COUNT - 1);
        const st = t * 2 - 1;
        const topX = cx + st * topHalf;
        const botX = cx + st * botHalf;
        const pts = [];
        for (let s = 0; s <= steps; s++) {
          const frac = s / steps;
          let x = topX + (botX - topX) * frac;
          const bowOut =
            Math.pow(frac, 2.2) * st * (botHalf - topHalf) * CURVE_INTENSITY;
          x += bowOut;
          x = Math.max(0, Math.min(W, x));
          const y = frac * H;
          pts.push({ x, y });
        }
        lines.push(pts);
      }
    }

    function getPointOnLine(lineIdx, progress) {
      const pts = lines[lineIdx];
      if (!pts?.length) return { x: 0, y: 0 };
      const idx = (1 - progress) * (pts.length - 1);
      const i0 = Math.floor(idx);
      const i1 = Math.min(i0 + 1, pts.length - 1);
      const f = idx - i0;
      return {
        x: pts[i0]?.x + (pts[i1]?.x - pts[i0]?.x) * f,
        y: pts[i0]?.y + (pts[i1]?.y - pts[i0]?.y) * f
      };
    }

    function spawnPacket() {
      return {
        lineIdx: Math.floor(Math.random() * LINE_COUNT),
        progress: 0,
        speed:
          PACKET_MIN_SPEED +
          Math.random() * (PACKET_MAX_SPEED - PACKET_MIN_SPEED),
        len: PACKET_LEN_MIN + Math.random() * (PACKET_LEN_MAX - PACKET_LEN_MIN),
        width: 1.5 + Math.random() * 1.5,
        opacity: 0.15 + Math.random() * 0.25,
        alive: true
      };
    }

    function initPackets() {
      packets = [];
      for (let i = 0; i < PACKET_COUNT; i++) {
        const p = spawnPacket();
        p.progress = Math.random();
        packets.push(p);
      }
    }

    function resize() {
      const parent = canvasEl.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvasEl.width = W * dpr;
      canvasEl.height = H * dpr;
      canvasEl.style.width = `${W}px`;
      canvasEl.style.height = `${H}px`;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildLines();
    }

    function draw() {
      ctx2d.clearRect(0, 0, W, H);

      for (const pts of lines) {
        ctx2d.beginPath();
        ctx2d.moveTo(pts[0]?.x, pts[0]?.y);
        for (let i = 1; i < pts.length; i++) {
          ctx2d.lineTo(pts[i]?.x, pts[i]?.y);
        }
        ctx2d.strokeStyle = LINE_COLOR;
        ctx2d.lineWidth = LINE_WIDTH;
        ctx2d.stroke();
      }

      for (const p of packets) {
        const head = getPointOnLine(p.lineIdx, p.progress);
        const tailOffset = p.len / H;
        const tailProgress = Math.max(0, p.progress - tailOffset);
        const tail = getPointOnLine(p.lineIdx, tailProgress);

        let fade = 1;
        if (p.progress < 0.08) fade = p.progress / 0.08;
        if (p.progress > 0.88) fade = (1 - p.progress) / 0.12;
        fade = Math.max(0, Math.min(1, fade));

        ctx2d.beginPath();
        ctx2d.moveTo(tail.x, tail.y);
        ctx2d.lineTo(head.x, head.y);
        ctx2d.strokeStyle = `rgba(37, 99, 235, ${p.opacity * fade})`;
        ctx2d.lineWidth = p.width;
        ctx2d.lineCap = 'butt';
        ctx2d.stroke();
      }
    }

    function tick() {
      if (!runningRef.current) return;

      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        const accel = 1 + p.progress * 2;
        p.progress += (p.speed * accel) / H;
        if (p.progress > 1) {
          packets[i] = spawnPacket();
        }
      }

      draw();
      rafRef.current = requestAnimationFrame(tick);
    }

    resize();
    initPackets();

    canvasEl.style.opacity = '0';
    canvasEl.style.transition = 'opacity 2s ease-out';
    const fadeTimer = window.setTimeout(() => {
      canvasEl.style.opacity = '0.55';
    }, 300);

    rafRef.current = requestAnimationFrame(tick);

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initPackets();
      }, 150);
    };
    window.addEventListener('resize', onResize);

    const heroRoot = canvasEl.closest('[data-hero-v2-root]');
    let observer;
    if (heroRoot && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          runningRef.current = entries[0]?.isIntersecting ?? true;
          if (runningRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(tick);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(heroRoot);
    }

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      observer?.disconnect();
      cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
    };
  }, []);

  return <HeroCanvas ref={canvasRef} aria-hidden />;
}
