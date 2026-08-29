import { useEffect, useState, useRef } from "react";
import {
  FONT_LINK, serif, mono, sans,
  charcoal, charcoalDeep, washTeal, washViolet, bone, mustard,
  SectionWrap, Eyebrow, InkRingFrame, InkTick, Hairline,
} from "../components/theme";
import WhitelistApplication from "../components/WhitelistApplication";

const X_URL = "https://x.com/theinklingsxyz"; // TODO: set your real X handle

const SPECIMENS = [
  "/inkling-1.jpg", "/inkling-2.jpg", "/inkling-3.jpg", "/inkling-4.jpg", "/inkling-5.jpg",
  // Add more paths here as more art is revealed
];

const CLASSES = [
  { code: "SP-01", name: "Sketches",     desc: "Clean lines, quiet presence, easy to love." },
  { code: "SP-02", name: "Bled Ink",     desc: "Heavier linework, bolder marks, sharper attitude." },
  { code: "SP-03", name: "Voidborn",     desc: "Chaotic scribbles, unstable auras, loud energy." },
  { code: "SP-04", name: "Cosmics",      desc: "Heads opened into stars, moons, and planets. Harder to find." },
  { code: "SP-05", name: "First Drafts", desc: "The rarest Inklings. The artist's hand still visible." },
];

const TRAITS = ["Heads", "Eyes & voids", "Marks & scribbles", "Auras", "Shirts", "Drips", "Backdrops", "Rare cosmic features"];

const SYSTEMS = [
  { name: "The Studio",   desc: "Customize and evolve your Inkling." },
  { name: "The Gallery",  desc: "Exhibitions, contests, leaderboards, and rewards." },
  { name: "The Circle",   desc: "Holder gatherings, raffles, missions, and rituals." },
  { name: "The Ink Well", desc: "Spend $INK on redraws, remixes, and mystery reveals." },
];

const ROADMAP = [
  { phase: "Phase I",   title: "Ink List Opens",   desc: "Applications, collabs, and early access review begin." },
  { phase: "Phase II",  title: "Mint Opens",        desc: "Selected Ink List wallets mint on OpenSea." },
  { phase: "Phase III", title: "The Reveal",        desc: "Inklings reveal with marks, classes, and rarity." },
  { phase: "Phase IV",  title: "$INK Details",      desc: "Tokenomics, supply, and claim mechanics are shared." },
  { phase: "Phase V",   title: "The Systems Begin", desc: "The Studio, Gallery, Circle, and Ink Well start opening." },
];

const FAQS = [
  { q: "What is Inklings?",            a: "A 10,000 supply NFT collection of hand-inked, cosmic-headed characters on Ethereum." },
  { q: "What is the mint price?",      a: "0.001 ETH." },
  { q: "Where is mint?",               a: "OpenSea." },
  { q: "What is The Ink List?",        a: "The only mint access phase." },
  { q: "Is there public mint?",        a: "If there are any Inklings left from The Ink List, yes." },
  { q: "What is $INK?",                a: "The token planned to power future Inklings systems after mint." },
  { q: "When will $INK details drop?", a: "After mint." },
  { q: "Is this financial advice?",    a: "No. Inklings is a digital collectible. DYOR." },
];

/* ── FAQ item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${bone}1c` }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "18px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <span style={{ fontFamily: serif, fontSize: "1.05rem", fontWeight: 600, color: open ? "#fff" : "rgba(255,255,255,0.72)", textAlign: "left" }}>{q}</span>
        <span style={{ color: bone, fontSize: "1.2rem", flexShrink: 0, transition: "transform 0.25s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      {open && <p style={{ fontFamily: sans, fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", padding: "0 0 18px", margin: 0, lineHeight: 1.65, maxWidth: "560px" }}>{a}</p>}
    </div>
  );
}

/* ── Specimen gallery — numbered index tabs instead of dots ── */
function SpecimenGallery() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { timer.current = setTimeout(() => go((cur + 1) % SPECIMENS.length), 3600); return () => clearTimeout(timer.current); }, [cur]);

  function go(i: number) {
    if (i === cur) return;
    clearTimeout(timer.current);
    setFading(true);
    setTimeout(() => { setCur(i); setFading(false); }, 260);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "22px" }}>
      <div style={{ opacity: fading ? 0 : 1, transition: "opacity 0.26s ease" }}>
        <InkRingFrame src={SPECIMENS[cur]} size={280} ringColor={bone} />
      </div>
      <p style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.1em", color: `${bone}99`, margin: 0 }}>
        SPECIMEN {String(cur + 1).padStart(3, "0")} — ink on paper
      </p>
      <div style={{ display: "flex", gap: "6px" }}>
        {SPECIMENS.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{
            width: "26px", height: "26px", borderRadius: "50%", border: `1px solid ${i === cur ? bone : `${bone}33`}`,
            background: i === cur ? bone : "transparent", color: i === cur ? charcoalDeep : `${bone}99`,
            fontFamily: mono, fontSize: "0.6rem", cursor: "pointer", transition: "all 0.25s ease",
          }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = FONT_LINK;
    document.head.appendChild(l);
    setTimeout(() => setReady(true), 80);
  }, []);

  return (
    <div style={{ background: charcoal, minHeight: "100vh", fontFamily: sans, color: "#fff", overflowX: "hidden" }}>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box;}
        ::placeholder{color:rgba(255,255,255,0.2);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${bone}33;border-radius:4px;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
        .hero-grid{display:grid;grid-template-columns:1.15fr 0.85fr;gap:56px;align-items:center;}
        .mark-row{display:flex;align-items:center;gap:20px;}
        .index-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px 32px;}
        @media (max-width:860px){
          .hero-grid{grid-template-columns:1fr;gap:40px;}
          .hero-portrait{order:-1;}
        }
        @media (max-width:560px){
          .mark-row{flex-wrap:wrap;}
          .index-grid{grid-template-columns:1fr;}
        }
      `}</style>

      {/* ══════════ MASTHEAD ══════════ */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, background: charcoal,
        borderBottom: `1px solid ${bone}16`, padding: "0 28px", height: "58px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <a href="#home" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/inklings-logo.jpg" alt="" style={{ width: "26px", height: "26px", borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontFamily: serif, fontSize: "1rem", fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>Inklings</span>
          <span style={{ fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.12em", color: `${bone}66`, marginLeft: "2px" }}>ED. 01</span>
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {([["Ink List", "#inklist"], ["Mint", "#mint"]] as [string, string][]).map(([l, h]) => (
            <a key={l} href={h} style={{ fontFamily: mono, fontSize: "0.64rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", padding: "8px 12px", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
              {l}
            </a>
          ))}
          <div style={{ width: "1px", height: "14px", background: "rgba(255,255,255,0.14)", margin: "0 8px" }} />
          <a href={X_URL} target="_blank" rel="noopener noreferrer" title="Follow on X"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", color: "rgba(255,255,255,0.55)", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </a>
        </nav>
      </header>

      {/* ══════════ HERO ══════════ */}
      <div id="home" style={{ position: "relative", padding: "72px 28px 96px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ position: "absolute", top: "10%", left: "-8%", width: "480px", height: "480px", borderRadius: "50%", background: `radial-gradient(circle,${washViolet}55 0%,transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "-6%", width: "380px", height: "380px", borderRadius: "50%", background: `radial-gradient(circle,${washTeal}44 0%,transparent 70%)`, pointerEvents: "none" }} />

        <div className="hero-grid" style={{ position: "relative" }}>
          <div style={{ animation: ready ? "fadeUp 0.7s ease 0.05s both" : "none", opacity: ready ? undefined : 0 }}>
            <Eyebrow tag="VOL. 01" text="A field guide to the Inkverse" />
            <h1 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,6vw,3.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 22px", lineHeight: 1.08, letterSpacing: "-0.01em" }}>
              Ten thousand wanderers,<br />drawn from the same <span style={{ fontStyle: "italic", color: bone }}>dark ink.</span>
            </h1>
            <p style={{ fontFamily: sans, fontSize: "1.02rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "460px", margin: "0 0 32px" }}>
              Inklings is a hand-inked, cosmic-headed collection on Ethereum — hollow eyes, scribbled auras, and small windows into deep space, stitched into 10,000 individual studies.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginBottom: "34px" }}>
              <a href="#inklist" style={{
                fontFamily: mono, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: charcoalDeep, background: bone, borderRadius: "4px", padding: "14px 26px", transition: "opacity 0.2s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Apply to the Ink List →
              </a>
              <a href="#mint" style={{
                fontFamily: mono, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)", border: `1px solid ${bone}33`, borderRadius: "4px", padding: "14px 26px", transition: "all 0.2s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = `${bone}66`; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = `${bone}33`; }}>
                Mint details
              </a>
            </div>
            <p style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.06em", color: `${bone}77` }}>
              10,000 SUPPLY · 0.001 ETH · ETHEREUM · OPENSEA
            </p>
          </div>

          <div className="hero-portrait" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", animation: ready ? "fadeUp 0.7s ease 0.18s both" : "none", opacity: ready ? undefined : 0 }}>
            <InkRingFrame src={SPECIMENS[0]} size={260} />
            <p style={{ fontFamily: mono, fontSize: "0.64rem", letterSpacing: "0.08em", color: `${bone}88`, textAlign: "center", margin: 0 }}>
              SPECIMEN 001 — VOIDBORN<br />ink on paper
            </p>
          </div>
        </div>
      </div>

      {/* ══════════ COLLECTION ══════════ */}
      <SectionWrap bg={washTeal}>
        <Eyebrow tag="FIG. 01" text="The Collection" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", marginBottom: "36px", maxWidth: "560px" }}>
          <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: 0 }}>Meet the Inklings</h2>
          <p style={{ fontFamily: sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: "10px 0 0" }}>
            Hand-inked, hollow-eyed, and quietly cosmic — a 10,000 supply character collection built from scribbled linework, ink drips, and windows into deep space.
          </p>
        </div>
        <SpecimenGallery />
      </SectionWrap>

      {/* ══════════ BUILT FROM INK ══════════ */}
      <SectionWrap bg={charcoal}>
        <Eyebrow tag="FIG. 02" text="Built from ink" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>The trait index</h2>
        <p style={{ fontFamily: sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: "560px" }}>
          Every Inkling is drawn from a mix of heads, eyes, auras, shirts, and rare cosmic details.
        </p>
        <div className="index-grid">
          {TRAITS.map((t, i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 0", borderBottom: `1px solid ${bone}16` }}>
              <span style={{ fontFamily: mono, fontSize: "0.68rem", color: `${bone}66` }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: sans, fontSize: "0.9rem", color: "rgba(255,255,255,0.68)" }}>{t}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)", margin: "28px 0 0", lineHeight: 1.6, maxWidth: "560px" }}>
          Some marks are quiet. Some are loud. Some open straight into the stars. The goal is a distinct hand, not overcomplication.
        </p>
      </SectionWrap>

      {/* ══════════ THE MARKS ══════════ */}
      <SectionWrap bg={washViolet}>
        <Eyebrow tag="FIG. 03" text="The Marks" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 32px" }}>Every Inkling carries a mark</h2>
        <div>
          {CLASSES.map((c, i) => (
            <div key={c.code} className="mark-row" style={{ padding: "20px 0", borderBottom: `1px solid ${bone}22` }}>
              <InkRingFrame src={SPECIMENS[i % SPECIMENS.length]} size={64} tilt={2} />
              <div style={{ flex: 1, minWidth: "180px" }}>
                <p style={{ margin: 0, fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.1em", color: `${bone}77` }}>{c.code}</p>
                <p style={{ margin: "3px 0 0", fontFamily: serif, fontSize: "1.1rem", fontWeight: 600, color: "#fff" }}>{c.name}</p>
                <p style={{ margin: "4px 0 0", fontFamily: sans, fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* ══════════ INK LIST — the most important section on the site ══════════ */}
      <SectionWrap bg={charcoalDeep} pad="110px 0" maxWidth={640}>
        <div id="inklist" style={{ position: "relative", top: "-90px" }} />
        <Eyebrow tag="FIG. 04" text="Access" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,6vw,2.8rem)", fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Join the Ink List</h2>
        <p style={{ fontFamily: sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: "480px" }}>
          The Ink List is the only mint access phase. Complete the four steps below, submit your wallet, and wait for selection. Selected wallets mint on OpenSea.
        </p>
        <WhitelistApplication />
      </SectionWrap>

      {/* ══════════ MINT ══════════ */}
      <SectionWrap bg={charcoal} maxWidth={640}>
        <div id="mint" style={{ position: "relative", top: "-70px" }} />
        <Eyebrow tag="FIG. 05" text="The Mint" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>One phase. One mint.</h2>
        <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", margin: "0 0 28px" }}>The Ink List is the mint.</p>
        <div style={{ marginBottom: "28px" }}>
          {[["Supply", "10,000"], ["Price", "0.001 ETH"], ["Chain", "Ethereum"], ["Launchpad", "OpenSea"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${bone}18` }}>
              <span style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `${bone}77` }}>{l}</span>
              <span style={{ fontFamily: serif, fontSize: "1.05rem", fontWeight: 600, color: "#fff" }}>{v}</span>
            </div>
          ))}
        </div>
        <a href="https://opensea.io/collection/inklings" target="_blank" rel="noopener noreferrer" style={{
          width: "100%", fontFamily: mono, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          color: charcoalDeep, background: bone, borderRadius: "4px", padding: "15px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        }}>
          <img src="/OpenSea-Emblem.png" alt="" style={{ width: "18px", height: "18px", borderRadius: "4px" }} />
          View on OpenSea
        </a>
      </SectionWrap>

      {/* ══════════ ARCHIVE ══════════ */}
      <SectionWrap bg={charcoal} maxWidth={640}>
        <Eyebrow tag="FIG. 06" text="Reserve" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>The Ink Archive</h2>
        <p style={{ fontFamily: sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "520px" }}>
          A small allocation kept for collabs, rewards, partnerships, future activations, and community support. This is not a public mint phase.
        </p>
      </SectionWrap>

      {/* ══════════ TOKEN ══════════ */}
      <SectionWrap bg={charcoal} maxWidth={640}>
        <Eyebrow tag="FIG. 07" text="Token" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2.6rem,9vw,4.2rem)", fontWeight: 700, color: mustard, margin: "0 0 18px", letterSpacing: "0.01em" }}>$INK</h2>
        <p style={{ fontFamily: sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "520px" }}>
          $INK is the current running beneath the Inklings world. It's planned to power future holder systems, redraws, remixes, raffles, burns, events, and community rewards. Full token details will be shared after mint.
        </p>
      </SectionWrap>

      {/* ══════════ SYSTEMS ══════════ */}
      <SectionWrap bg={washTeal} maxWidth={640}>
        <Eyebrow tag="FIG. 08" text="Systems" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 30px" }}>The systems</h2>
        <div>
          {SYSTEMS.map(s => (
            <div key={s.name} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "18px 0", borderBottom: `1px solid ${bone}22` }}>
              <InkTick />
              <div>
                <p style={{ margin: 0, fontFamily: serif, fontSize: "1.05rem", fontWeight: 600, color: "#fff" }}>{s.name}</p>
                <p style={{ margin: "4px 0 0", fontFamily: sans, fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* ══════════ ROADMAP ══════════ */}
      <SectionWrap bg={washViolet} maxWidth={640}>
        <Eyebrow tag="FIG. 09" text="The plan" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 36px" }}>What comes after mint</h2>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "5px", top: "6px", bottom: "6px", width: "1px", background: `${bone}33` }} />
          {ROADMAP.map((r, i) => (
            <div key={r.phase} style={{ display: "flex", gap: "24px", paddingBottom: i < ROADMAP.length - 1 ? "26px" : "0", paddingLeft: "26px", position: "relative" }}>
              <div style={{ position: "absolute", left: "0px", top: "5px", width: "11px", height: "11px", borderRadius: "50%", border: `1px solid ${bone}`, background: washViolet }} />
              <div>
                <p style={{ margin: "0 0 3px", fontFamily: mono, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: bone }}>{r.phase}</p>
                <p style={{ margin: 0, fontFamily: serif, fontSize: "1.02rem", fontWeight: 600, color: "#fff" }}>{r.title}</p>
                <p style={{ margin: "4px 0 0", fontFamily: sans, fontSize: "0.86rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrap>

      {/* ══════════ FAQ ══════════ */}
      <SectionWrap bg={charcoal} maxWidth={640}>
        <div id="faq" style={{ position: "relative", top: "-70px" }} />
        <Eyebrow tag="FIG. 10" text="Questions" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 28px" }}>Frequently asked</h2>
        <div>{FAQS.map(f => <FaqItem key={f.q} q={f.q} a={f.a} />)}</div>
      </SectionWrap>

      <Hairline />

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ padding: "56px 28px 40px", maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "32px" }}>
        <div style={{ maxWidth: "320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <img src="/inklings-logo.jpg" alt="" style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontFamily: serif, fontSize: "1.05rem", fontWeight: 600, color: "#fff" }}>Inklings</span>
          </div>
          <p style={{ fontFamily: sans, fontSize: "0.82rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, margin: 0 }}>
            Hand-inked wanderers, adrift between memory and cosmos. 10,000 Inklings on Ethereum, powered by $INK.
          </p>
        </div>
        <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${bone}55`, margin: "0 0 12px" }}>Site</p>
            {[["Ink List", "#inklist"], ["Mint", "#mint"], ["Questions", "#faq"]].map(([l, h]) => (
              <a key={l} href={h} style={{ display: "block", fontFamily: sans, fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginBottom: "8px" }}>{l}</a>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${bone}55`, margin: "0 0 12px" }}>Elsewhere</p>
            {[["X", X_URL], ["OpenSea", "https://opensea.io/collection/inklings"]].map(([l, h]) => (
              <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ display: "block", fontFamily: sans, fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginBottom: "8px" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
      <div style={{ textAlign: "center", padding: "0 0 32px" }}>
        <p style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: `${bone}33`, margin: 0 }}>
          Printed digitally · ink never dries
        </p>
      </div>
    </div>
  );
}
