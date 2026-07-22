import React, { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────
   CONCEPT: Concentric expanding gold circle rings
   — radar / sonar pulse emanating from the screen centre.
   Multiple independently-phased rings expand, then fade.
───────────────────────────────────────────────────────── */

const RING_SETS = 7;          // number of independent ring groups
const RINGS_PER_SET = 5;      // rings inside each group
const RING_GAP = 48;          // px gap between rings in a set
const MAX_RADIUS_FACTOR = 1.1;// ring stops growing at this * max dimension
const EXPAND_SPEED = 0.45;    // px increase in radius per frame
const PHASE_OFFSET = 1.0 / RING_SETS; // stagger fraction

function makeSet(index) {
    return {
        phase: index * PHASE_OFFSET, // 0..1, where in the cycle this set is
    };
}

export default function BackgroundAnimation({ theme }) {
    const canvasRef = useRef(null);
    const isDarkRef = useRef(theme !== 'light');

    useEffect(() => { isDarkRef.current = theme !== 'light'; }, [theme]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        let W = 0, H = 0;
        let raf;
        let tick_count = 0;

        // Sets of rings — each has a phase offset so they stagger
        const sets = Array.from({ length: RING_SETS }, (_, i) => makeSet(i));

        function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        resize();
        window.addEventListener('resize', resize);

        function tick() {
            tick_count++;
            ctx.clearRect(0, 0, W, H);

            const isDark = isDarkRef.current;
            const cx = W / 2;
            const cy = H / 2;
            const maxR = Math.max(W, H) * MAX_RADIUS_FACTOR;

            // Background radial glow at center
            const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.55);
            if (isDark) {
                bgGrad.addColorStop(0, 'rgba(120, 80, 0, 0.09)');
                bgGrad.addColorStop(0.4, 'rgba(60, 40, 0, 0.05)');
                bgGrad.addColorStop(1, 'transparent');
            } else {
                bgGrad.addColorStop(0, 'rgba(180, 120, 0, 0.07)');
                bgGrad.addColorStop(0.4, 'rgba(120, 80, 0, 0.04)');
                bgGrad.addColorStop(1, 'transparent');
            }
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            sets.forEach((set) => {
                // Advance phase each frame
                set.phase = (set.phase + EXPAND_SPEED / maxR) % 1;

                for (let r = 0; r < RINGS_PER_SET; r++) {
                    // Each inner ring is offset within the set
                    const ringPhase = (set.phase + (r / RINGS_PER_SET) * (RING_GAP / maxR)) % 1;
                    const radius = ringPhase * maxR;

                    // Rings fade in near the center and fade out near the edge
                    let alpha;
                    if (ringPhase < 0.06) {
                        alpha = ringPhase / 0.06; // fade in
                    } else if (ringPhase > 0.75) {
                        alpha = 1 - (ringPhase - 0.75) / 0.25; // fade out
                    } else {
                        alpha = 1;
                    }

                    // Outer rings get progressively thinner and more transparent
                    const depthAlpha = 1 - ringPhase * 0.7;
                    const finalAlpha = alpha * depthAlpha;
                    if (finalAlpha <= 0.005) continue;

                    const lineWidth = Math.max(0.4, (1 - ringPhase * 0.8) * 1.6);

                    // Gold color — slightly different for dark vs light
                    if (isDark) {
                        ctx.strokeStyle = `rgba(234, 179, 8, ${finalAlpha * 0.55})`;
                    } else {
                        ctx.strokeStyle = `rgba(160, 100, 0, ${finalAlpha * 0.35})`;
                    }

                    ctx.lineWidth = lineWidth;
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                    ctx.stroke();
                }
            });

            // Subtle center dot glow
            const dotGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
            if (isDark) {
                dotGrad.addColorStop(0, 'rgba(234, 179, 8, 0.18)');
                dotGrad.addColorStop(0.5, 'rgba(234, 179, 8, 0.05)');
                dotGrad.addColorStop(1, 'transparent');
            } else {
                dotGrad.addColorStop(0, 'rgba(160, 100, 0, 0.12)');
                dotGrad.addColorStop(0.5, 'rgba(160, 100, 0, 0.04)');
                dotGrad.addColorStop(1, 'transparent');
            }
            ctx.fillStyle = dotGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, 80, 0, Math.PI * 2);
            ctx.fill();

            raf = requestAnimationFrame(tick);
        }

        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
            aria-hidden="true"
        />
    );
}
