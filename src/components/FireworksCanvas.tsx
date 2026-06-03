/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  fade: number;
  size: number;
  gravity: number;
  drag: number;
}

interface Sparkler {
  x: number;
  y: number;
  color: string;
  length: number;
  ticks: number;
}

export default function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let sparklers: Sparkler[] = [];

    // Resize handler
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Luxury Firework Color Palettes (Gold, Amber, Deep Red, Coral, Golden White)
    const COLORS = [
      'rgba(212, 175, 55, 1)',  // Metallic Gold
      'rgba(243, 156, 18, 1)',  // Warm Amber
      'rgba(231, 76, 60, 1)',   // Red
      'rgba(241, 196, 15, 1)',  // Glowing Yellow
      'rgba(230, 126, 34, 1)',  // Orange
      'rgba(255, 235, 204, 1)'  // Dazzling Firewhite
    ];

    const createExplosion = (x: number, y: number) => {
      const particleCount = 80 + Math.floor(Math.random() * 40);
      const baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 6;
        const color = Math.random() > 0.3 ? baseColor : COLORS[Math.floor(Math.random() * COLORS.length)];
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          fade: 0.009 + Math.random() * 0.015,
          size: 1 + Math.random() * 2,
          gravity: 0.06,
          drag: 0.98
        });
      }
    };

    // Auto launcher
    let lastLaunch = 0;
    const launchInterval = 3000; // interval in ms for auto launch

    // Mouse click trigger
    const handleCanvasClick = (e: MouseEvent) => {
      createExplosion(e.clientX, e.clientY);
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Animation Loop
    const animate = (timestamp: number) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; // trails effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Auto trigger randomly
      if (timestamp - lastLaunch > launchInterval) {
        const x = 100 + Math.random() * (canvas.width - 200);
        const y = 80 + Math.random() * (canvas.height / 2);
        createExplosion(x, y);
        lastLaunch = timestamp;
      }

      // Random lightning sparkles
      if (Math.random() < 0.04) {
        sparklers.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          length: 5 + Math.random() * 15,
          ticks: 10 + Math.random() * 10
        });
      }

      // Update and draw sparkles
      sparklers = sparklers.filter((s) => {
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1;
        const offset = s.length / 2;
        ctx.moveTo(s.x - offset, s.y);
        ctx.lineTo(s.x + offset, s.y);
        ctx.moveTo(s.x, s.y - offset);
        ctx.lineTo(s.x, s.y + offset);
        ctx.stroke();

        s.ticks--;
        return s.ticks > 0;
      });

      // Update and draw particles
      particles = particles.filter((p) => {
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.fade;

        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();

        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('click', handleCanvasClick);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="fireworks-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-neutral-950"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
