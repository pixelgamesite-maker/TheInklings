import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   THEME — shared tokens + primitives for The Inklings
   A field-guide / specimen-catalog system: ink-ring frames around
   portraits, mono catalog tags, and three ink-wash tones lifted directly
   from the artwork's own paper colors.
   ═══════════════════════════════════════════════════════════════════════ */

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap";

export const serif = "'Fraunces', Georgia, serif";
export const mono  = "'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace";
export const sans  = "'Inter', 'Helvetica Neue', Arial, sans-serif";

/* Base is a warm charcoal, not flat black. Two ink-wash tones are lifted
   straight from the artwork's own backgrounds and used sparingly — never
   as a rotating rainbow, only where a section is literally showcasing a
   specimen. Bone is the recurring parchment cream from every character's
   shirt; mustard is spent exactly once, on the token. */
export const charcoal      = "#17141d";
export const charcoalDeep  = "#100e15";
export const washTeal      = "#3d5456";
export const washViolet    = "#352a4e";
export const bone          = "#e9dfc9";
export const mustard       = "#c9932f";
export const danger        = "#e2665c";

/* ── Scroll reveal — the one ambient motion pattern used site-wide ── */
export function useScrollReveal(threshold = 0.14) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ── Section wrapper: full-bleed background, wide editorial inner column ── */
export function SectionWrap({ children, bg = charcoal, delay = 0, maxWidth = 1100, pad = "96px 0" }: {
  children: React.ReactNode; bg?: string; delay?: number; maxWidth?: number; pad?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref} style={{
      background: bg, padding: pad, position: "relative",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(26px)",
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
    }}>
      <div style={{ maxWidth: `${maxWidth}px`, margin: "0 auto", padding: "0 28px" }}>
        {children}
      </div>
    </section>
  );
}

/* ── Eyebrow — a figure tag + label, doubling as a field-guide index.
   The "FIG. NN" tag is real reading-order information, not decoration. ── */
export function Eyebrow({ tag, text, color = bone }: { tag?: string; text: string; color?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
      {tag && (
        <span style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.06em", color, opacity: 0.42 }}>
          {tag}
        </span>
      )}
      <span style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color }}>
        {text}
      </span>
      <div style={{ flex: 1, height: "1px", background: `${color}22` }} />
    </div>
  );
}

/* ── Ink Ring — the signature device. A slightly irregular, hand-drawn
   circle frames every portrait, with a small drip trailing off the edge —
   the same vocabulary as the splatters and rings already in the art. ── */
export function InkRingFrame({ src, size = 240, tilt = -4, ringColor = bone }: {
  src: string; size?: number; tilt?: number; ringColor?: string;
}) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: size * 0.07, borderRadius: "50%",
        overflow: "hidden", background: "#0a090c",
      }}>
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: `rotate(${tilt}deg)` }}>
        <path
          d="M50 3.5 C 75 3.5 96 23 96.5 49 C 97 76 76 96.5 50 96.5 C 24 96.5 3 76 3.5 49.5 C 4 23 25 4 50 3.5 Z"
          fill="none" stroke={ringColor} strokeWidth="1" opacity="0.85"
        />
        <ellipse cx="14" cy="90" rx="0.9" ry="2.6" fill={ringColor} opacity="0.4" />
        <circle cx="13.4" cy="95.6" r="0.7" fill={ringColor} opacity="0.28" />
      </svg>
    </div>
  );
}

/* ── Ink Tick — a single pen stroke, standing in for a bullet ── */
export function InkTick({ color = bone, size = 13, opacity = 0.85 }: { color?: string; size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <path d="M3 11 L11 3" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity={opacity} />
    </svg>
  );
}

/* ── Hairline — a simple full-bleed rule, used only at header/footer ── */
export function Hairline({ color = bone }: { color?: string }) {
  return <div style={{ height: "1px", background: `${color}1c` }} />;
}
