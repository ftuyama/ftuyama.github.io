import gsap from 'gsap';

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  active: number;
  closest: Point[];
  circle: Circle;
}

class Circle {
  pos: Point;
  radius: number;
  active = 0;

  constructor(pos: Point, radius: number) {
    this.pos = pos;
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = `rgba(85,170,238,${this.active})`;
    ctx.fill();
  }
}

export function initAnimatedHeader(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (connection?.saveData) return;

  const header = document.getElementById('large-header');
  const canvas = document.getElementById('demo-canvas') as HTMLCanvasElement | null;
  if (!header || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  const pointsPerAxis = width < 768 ? 8 : 16;
  const mouse = { x: width / 2, y: height / 2 };
  let animating = document.documentElement.scrollTop <= height;
  let rafId = 0;

  header.style.height = `${height}px`;
  canvas.width = width;
  canvas.height = height;

  const points: Point[] = [];
  for (let x = 0; x < width; x += width / pointsPerAxis) {
    for (let y = 0; y < height; y += height / pointsPerAxis) {
      const px = x + Math.random() * (width / pointsPerAxis);
      const py = y + Math.random() * (height / pointsPerAxis);
      points.push({
        x: px,
        y: py,
        originX: px,
        originY: py,
        active: 0,
        closest: [],
        circle: null!,
      });
    }
  }

  for (const p of points) {
    const closest: Point[] = [];
    for (const other of points) {
      if (p === other) continue;
      if (closest.length < 5) {
        closest.push(other);
      } else {
        const dist = getDistance(p, other);
        for (let i = 0; i < 5; i++) {
          if (dist < getDistance(p, closest[i])) {
            closest[i] = other;
            break;
          }
        }
      }
    }
    p.closest = closest;
  }

  for (const p of points) {
    p.circle = new Circle(p, 2 + Math.random() * 2);
  }

  for (const p of points) {
    shiftPoint(p);
  }
  animate();
  addListeners();

  function shiftPoint(p: Point): void {
    gsap.to(p, {
      duration: 1 + Math.random(),
      x: p.originX - 50 + Math.random() * 100,
      y: p.originY - 50 + Math.random() * 100,
      ease: 'circ.inOut',
      onComplete: () => shiftPoint(p),
    });
  }

  function animate(): void {
    if (!animating || document.hidden) {
      rafId = 0;
      return;
    }

    if (animating) {
      ctx!.clearRect(0, 0, width, height);
      for (const p of points) {
        const dist = getDistance(mouse, p);
        if (dist < 600) {
          p.active = 0.4;
          p.circle.active = 0.7;
        } else if (dist < 10000) {
          p.active = 0.15;
          p.circle.active = 0.4;
        } else if (dist < 25000) {
          p.active = 0.04;
          p.circle.active = 0.15;
        } else {
          p.active = 0;
          p.circle.active = 0;
        }
        drawLines(p);
        p.circle.draw(ctx!);
      }
    }
    rafId = requestAnimationFrame(animate);
  }

  function drawLines(p: Point): void {
    if (!p.active) return;
    for (const close of p.closest) {
      ctx!.beginPath();
      ctx!.moveTo(p.x, p.y);
      ctx!.lineTo(close.x, close.y);
      ctx!.strokeStyle = `rgba(85,170,238,${p.active * 0.6})`;
      ctx!.stroke();
    }
  }

  function addListeners(): void {
    if (!('ontouchstart' in window)) {
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
      });
    }
    window.addEventListener(
      'scroll',
      () => {
        animating = document.documentElement.scrollTop <= height;
        if (animating && rafId === 0) {
          animate();
        }
      },
      { passive: true },
    );
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && animating && rafId === 0) {
        animate();
      }
    });
    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      header!.style.height = `${height}px`;
      canvas!.width = width;
      canvas!.height = height;
    });
  }

  function getDistance(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ): number {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  }
}
