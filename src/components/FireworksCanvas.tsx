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

interface FireworksCanvasProps {
  enabled?: boolean;
  soundEnabled?: boolean;
}

export default function FireworksCanvas({ enabled = true, soundEnabled = false }: FireworksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!enabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animationFrameId: number;
    let particles: Particle[] = [];
    let sparklers: Sparkler[] = [];

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Audio synthesizer for firework burst pops
    const playBurstSound = () => {
      if (!soundEnabled) return;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180 + Math.random() * 250, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch {
        // Safe fallback
      }
    };

    // Ultra Vibrant Festival Fireworks Colors
    const COLORS = [
      '#FF007F', // Electric Magenta
      '#00F0FF', // Neon Cyan
      '#32FF7E', // Vivid Lime
      '#FFD700', // Metallic Gold
      '#FF3838', // Ruby Red
      '#AA00FF', // Vivid Violet
      '#FF9F1A', // Tangerine
      '#18DCFF', // Sky Blue
      '#FFFFFF'  // Diamond White
    ];

    const createExplosion = (x: number, y: number) => {
      const particleCount = 90 + Math.floor(Math.random() * 50);
      const ringColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      playBurstSound();

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 8;
        const color = Math.random() > 0.25 ? ringColor : COLORS[Math.floor(Math.random() * COLORS.length)];
        
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1,
          fade: 0.008 + Math.random() * 0.012,
          size: 1.5 + Math.random() * 2.5,
          gravity: 0.05,
          drag: 0.975
        });
      }
    };

    let lastLaunch = 0;
    const launchInterval = 1800; // Launch vibrant burst every 1.8 seconds

    const handleCanvasClick = (e: MouseEvent) => {
      createExplosion(e.clientX, e.clientY);
      // Extra secondary mini burst
      setTimeout(() => {
        createExplosion(e.clientX + (Math.random() * 80 - 40), e.clientY + (Math.random() * 80 - 40));
      }, 150);
    };

    canvas.addEventListener('click', handleCanvasClick);

    const animate = (timestamp: number) => {
      ctx.fillStyle = 'rgba(10, 8, 18, 0.22)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastLaunch > launchInterval) {
        const x = 100 + Math.random() * (canvas.width - 200);
        const y = 80 + Math.random() * (canvas.height * 0.55);
        createExplosion(x, y);
        lastLaunch = timestamp;
      }

      if (Math.random() < 0.06) {
        sparklers.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          length: 8 + Math.random() * 20,
          ticks: 12 + Math.random() * 12
        });
      }

      sparklers = sparklers.filter((s) => {
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 1.5;
        const offset = s.length / 2;
        ctx.moveTo(s.x - offset, s.y);
        ctx.lineTo(s.x + offset, s.y);
        ctx.moveTo(s.x, s.y - offset);
        ctx.lineTo(s.x, s.y + offset);
        ctx.stroke();

        s.ticks--;
        return s.ticks > 0;
      });

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
        ctx.shadowBlur = 12;
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
  }, [enabled, soundEnabled]);

  return (
    <canvas
      ref={canvasRef}
      id="fireworks-canvas"
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#090613]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
