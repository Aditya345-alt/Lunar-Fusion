import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  alphaTarget: number;
  alphaSpeed: number;
  vx: number;
  vy: number;
}

interface ShootingStar {
  x: number;
  y: number;
  len: number;
  angle: number;
  speed: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Nebula {
  x: number;
  y: number;
  rx: number;
  ry: number;
  hue: number;
  alpha: number;
  alphaTarget: number;
  alphaSpeed: number;
  rotation: number;
  rotationSpeed: number;
}

export default function Wallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Stars ──────────────────────────────────────────────────────────────
    const NUM_STARS = 320;
    const stars: Star[] = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() < 0.08 ? Math.random() * 1.6 + 0.8 : Math.random() * 0.8 + 0.2,
      alpha: Math.random(),
      alphaTarget: Math.random(),
      alphaSpeed: 0.002 + Math.random() * 0.006,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
    }));

    // ── Nebulae ─────────────────────────────────────────────────────────────
    const nebulae: Nebula[] = [
      { x: W * 0.15, y: H * 0.25, rx: 280, ry: 180, hue: 240, alpha: 0,    alphaTarget: 0.055, alphaSpeed: 0.0003, rotation: 0,   rotationSpeed: 0.00008 },
      { x: W * 0.80, y: H * 0.65, rx: 320, ry: 200, hue: 270, alpha: 0,    alphaTarget: 0.045, alphaSpeed: 0.0002, rotation: 0.5, rotationSpeed: -0.00006 },
      { x: W * 0.50, y: H * 0.80, rx: 240, ry: 160, hue: 220, alpha: 0,    alphaTarget: 0.035, alphaSpeed: 0.0003, rotation: 1.2, rotationSpeed: 0.00005 },
      { x: W * 0.70, y: H * 0.10, rx: 200, ry: 130, hue: 255, alpha: 0,    alphaTarget: 0.04,  alphaSpeed: 0.0002, rotation: 2.0, rotationSpeed: -0.00007 },
    ];

    // ── Shooting stars ──────────────────────────────────────────────────────
    const shooters: ShootingStar[] = [];
    let nextShooter = 3000 + Math.random() * 5000;
    let elapsed = 0;
    let lastTime = performance.now();

    const spawnShooter = () => {
      const angle = (Math.PI / 6) + Math.random() * (Math.PI / 6);
      shooters.push({
        x: Math.random() * W * 0.7,
        y: Math.random() * H * 0.4,
        len: 80 + Math.random() * 120,
        angle,
        speed: 6 + Math.random() * 6,
        alpha: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    };

    // ── Draw ────────────────────────────────────────────────────────────────
    const draw = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      elapsed += dt;

      ctx.clearRect(0, 0, W, H);

      // Deep space background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0,   "#04060f");
      bg.addColorStop(0.5, "#06080f");
      bg.addColorStop(1,   "#08060e");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebulae
      nebulae.forEach(n => {
        n.alpha += (n.alphaTarget - n.alpha) * n.alphaSpeed * dt;
        n.rotation += n.rotationSpeed * dt;

        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.rotate(n.rotation);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(n.rx, n.ry));
        grad.addColorStop(0,   `hsla(${n.hue},70%,45%,${n.alpha})`);
        grad.addColorStop(0.4, `hsla(${n.hue},60%,35%,${n.alpha * 0.5})`);
        grad.addColorStop(1,   `hsla(${n.hue},50%,25%,0)`);
        ctx.scale(n.rx / Math.max(n.rx, n.ry), n.ry / Math.max(n.rx, n.ry));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(n.rx, n.ry), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Stars
      stars.forEach(s => {
        // Twinkle
        s.alpha += (s.alphaTarget - s.alpha) * s.alphaSpeed * dt;
        if (Math.abs(s.alpha - s.alphaTarget) < 0.01) {
          s.alphaTarget = 0.1 + Math.random() * 0.9;
        }
        // Drift
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = W;
        if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H;
        if (s.y > H) s.y = 0;

        // Glow for larger stars
        if (s.r > 1.0) {
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          glow.addColorStop(0, `rgba(180,200,255,${s.alpha * 0.4})`);
          glow.addColorStop(1, "rgba(180,200,255,0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,220,255,${s.alpha})`;
        ctx.fill();
      });

      // Shooting stars
      elapsed += 0;
      nextShooter -= dt;
      if (nextShooter <= 0) {
        spawnShooter();
        nextShooter = 4000 + Math.random() * 8000;
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        s.life += dt / 16.67;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha = Math.max(0, 1 - s.life / s.maxLife);

        const tx = s.x - Math.cos(s.angle) * s.len * s.alpha;
        const ty = s.y - Math.sin(s.angle) * s.len * s.alpha;
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0, `rgba(200,215,255,0)`);
        grad.addColorStop(1, `rgba(210,225,255,${s.alpha * 0.9})`);

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Head dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,240,255,${s.alpha})`;
        ctx.fill();

        if (s.life >= s.maxLife) shooters.splice(i, 1);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
