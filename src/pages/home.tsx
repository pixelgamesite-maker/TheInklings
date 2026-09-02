import { useEffect, useState, useRef } from "react";
import {
  FONT_LINK, serif, mono, sans,
  charcoal, charcoalDeep, washTeal, washViolet, bone, mustard,
  SectionWrap, Eyebrow, InkRingFrame, InkTick, Hairline,
} from "../components/theme";
import WhitelistApplication from "../components/WhitelistApplication";

const X_URL = "https://x.com/TheInklingsINK";

const SPECIMENS = [
  "/inkling-1.jpg", "/inkling-2.jpg", "/inkling-3.jpg", "/inkling-4.jpg", "/inkling-5.jpg",
  // Add more paths here as more art is revealed
];

const TRAITS = ["Heads", "Eyes & voids", "Marks & scribbles", "Auras", "Shirts", "Drips", "Backdrops", "Rare cosmic features"];

/* Real roadmap, straight from the project's own reference graphic. */
const ROADMAP = [
  {
    code: "01",
    title: "The Inklings",
    blurb: "2,222 hand-drawn misfits arrive on Ink. Holders become the first inhabitants of The Margins.",
    bullets: [
      "Holder-only art & collectible drops",
      "Ecosystem raffles + community rewards",
      "Voting on future art, lore & experiments",
      "Priority access to future Inklings releases",
      "Surprise rewards for active holders",
    ],
  },
  {
    code: "02",
    title: "The Margins",
    blurb: "The collection becomes more than PFPs. A holder-only section of the Inklings world opens.",
    bullets: [
      "Wallet-gated experiences",
      "Community quests",
      "Evolving lore",
      "Collaborative releases with other Ink communities",
      "Exclusive traits / collectibles earned through participation",
    ],
  },
  {
    code: "03",
    title: "$INKL",
    blurb: "Something has been leaking out of the margins — a planned ecosystem token built around the Inklings universe.",
    bullets: [
      "Intended to power experiences and collectibles",
      "Tied to participation across the ecosystem",
      "Powers future ecosystem mechanics",
    ],
    note: "Tokenomics, eligibility, and distribution details will be announced once finalized. No guaranteed allocation is being promised.",
  },
  {
    code: "04",
    title: "The Archive",
    blurb: "Every Inkling has a history. The Archive expands the collection through new art, hidden pieces, and community-created lore.",
    bullets: [
      "New art & hidden pieces",
      "Lore & stories discovered",
      "Community-created content",
      "Experiments that connect back to the original 2,222",
      "Some things will be discovered. Others will have to be earned.",
    ],
  },
  {
    code: "05",
    title: "Beyond The Margins",
    blurb: "We keep building with the people who stayed.",
    bullets: [
      "New collaborations",
      "New experiments",
      "New ways to use $INKL",
      "New things living on Ink",
      "The margins keep expanding",
    ],
  },
];

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
        .index-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px 32px;}
        @media (max-width:860px){
          .hero-grid{grid-template-columns:1fr;gap:40px;}
          .hero-portrait{order:-1;}
        }
        @media (max-width:560px){
          .index-grid{grid-template-columns:1fr;}
        }
      `}</style>

      {/* ══════════ HEADER — nothing but the X icon ══════════ */}
      <a href={X_URL} target="_blank" rel="noopener noreferrer" title="Follow on X" style={{
        position: "fixed", top: "20px", right: "24px", zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "34px", height: "34px", color: "rgba(255,255,255,0.6)", transition: "color 0.2s",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      </a>

      {/* ══════════ HERO ══════════ */}
      <div id="home" style={{ position: "relative", padding: "64px 28px 96px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ position: "absolute", top: "10%", left: "-8%", width: "480px", height: "480px", borderRadius: "50%", background: `radial-gradient(circle,${washViolet}55 0%,transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "-6%", width: "380px", height: "380px", borderRadius: "50%", background: `radial-gradient(circle,${washTeal}44 0%,transparent 70%)`, pointerEvents: "none" }} />

        <div className="hero-grid" style={{ position: "relative" }}>
          <div style={{ animation: ready ? "fadeUp 0.7s ease 0.05s both" : "none", opacity: ready ? undefined : 0 }}>
            <Eyebrow tag="VOL. 01" text="A field guide to the Inkverse" />
            <h1 style={{ fontFamily: serif, fontSize: "clamp(2.4rem,6vw,3.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 22px", lineHeight: 1.08, letterSpacing: "-0.01em" }}>
              2,222 wanderers,<br />drawn from the same <span style={{ fontStyle: "italic", color: bone }}>dark ink.</span>
            </h1>
            <p style={{ fontFamily: sans, fontSize: "1.02rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "460px", margin: "0 0 32px" }}>
              Inklings is a hand-inked, cosmic-headed collection on Ink — hollow eyes, scribbled auras, and small windows into deep space, stitched into 2,222 individual studies.
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
              2,222 SUPPLY · 0.001 ETH · INK · OPENSEA
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
            Hand-inked, hollow-eyed, and quietly cosmic — a 2,222 supply character collection built from scribbled linework, ink drips, and windows into deep space.
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

      {/* ══════════ INK LIST — the most important section on the site ══════════ */}
      <SectionWrap bg={charcoalDeep} pad="110px 0" maxWidth={640}>
        <div id="inklist" style={{ position: "relative", top: "-90px" }} />
        <Eyebrow tag="FIG. 03" text="Access" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2rem,6vw,2.8rem)", fontWeight: 600, color: "#fff", margin: "0 0 14px" }}>Join the Ink List</h2>
        <p style={{ fontFamily: sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: "480px" }}>
          The Ink List is the only mint access phase. Complete the four steps below, submit your wallet, and wait for selection. Selected wallets mint on OpenSea.
        </p>
        <WhitelistApplication />
      </SectionWrap>

      {/* ══════════ MINT ══════════ */}
      <SectionWrap bg={charcoal} maxWidth={640}>
        <div id="mint" style={{ position: "relative", top: "-70px" }} />
        <Eyebrow tag="FIG. 04" text="The Mint" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>One phase. One mint.</h2>
        <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.45)", margin: "0 0 28px" }}>The Ink List is the mint.</p>
        <div style={{ marginBottom: "28px" }}>
          {[["Supply", "2,222"], ["Price", "0.001 ETH"], ["Chain", "Ink"], ["Launchpad", "OpenSea"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${bone}18` }}>
              <span style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `${bone}77` }}>{l}</span>
              <span style={{ fontFamily: serif, fontSize: "1.05rem", fontWeight: 600, color: "#fff" }}>{v}</span>
            </div>
          ))}
        </div>
        <a href="https://opensea.io/collection/theinklingsink/overview" target="_blank" rel="noopener noreferrer" style={{
          width: "100%", fontFamily: mono, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
          color: charcoalDeep, background: bone, borderRadius: "4px", padding: "15px",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        }}>
          <img src="/OpenSea-Emblem.png" alt="" style={{ width: "18px", height: "18px", borderRadius: "4px" }} />
          View on OpenSea
        </a>
      </SectionWrap>

      {/* ══════════ TOKEN — a short teaser; full mechanics live in the roadmap ══════════ */}
      <SectionWrap bg={charcoal} maxWidth={640}>
        <Eyebrow tag="FIG. 05" text="Token" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(2.6rem,9vw,4.2rem)", fontWeight: 700, color: mustard, margin: "0 0 18px", letterSpacing: "0.01em" }}>$INKL</h2>
        <p style={{ fontFamily: sans, fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: "520px" }}>
          Something has been leaking out of the margins — a planned ecosystem token built around the Inklings universe. Full mechanics are laid out in the roadmap below.
        </p>
      </SectionWrap>

      {/* ══════════ ROADMAP ══════════ */}
      <SectionWrap bg={washViolet} maxWidth={640}>
        <Eyebrow tag="FIG. 06" text="The Plan" />
        <h2 style={{ fontFamily: serif, fontSize: "clamp(1.8rem,5vw,2.6rem)", fontWeight: 600, color: "#fff", margin: "0 0 8px" }}>The Inklings Roadmap</h2>
        <p style={{ fontFamily: sans, fontStyle: "italic", fontSize: "0.95rem", color: "rgba(255,255,255,0.5)", margin: "0 0 40px" }}>
          The margins are just the beginning.
        </p>

        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "13px", top: "6px", bottom: "6px", width: "1px", background: `${bone}33` }} />
          {ROADMAP.map((r, i) => (
            <div key={r.code} style={{ display: "flex", gap: "22px", paddingBottom: i < ROADMAP.length - 1 ? "38px" : "0", position: "relative" }}>
              <div style={{
                width: "27px", height: "27px", borderRadius: "50%", flexShrink: 0, zIndex: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${bone}`, background: washViolet,
              }}>
                <span style={{ fontFamily: mono, fontSize: "0.62rem", color: bone }}>{r.code}</span>
              </div>
              <div style={{ flex: 1, paddingTop: "3px" }}>
                <p style={{ margin: "0 0 3px", fontFamily: mono, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${bone}88` }}>Phase {r.code}</p>
                <p style={{ margin: 0, fontFamily: serif, fontSize: "1.15rem", fontWeight: 600, color: "#fff" }}>{r.title}</p>
                <p style={{ margin: "6px 0 14px", fontFamily: sans, fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: "480px" }}>{r.blurb}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                  {r.bullets.map(b => (
                    <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ marginTop: "2px" }}><InkTick size={11} opacity={0.7} /></div>
                      <span style={{ fontFamily: sans, fontSize: "0.85rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.5 }}>{b}</span>
                    </div>
                  ))}
                </div>
                {r.note && (
                  <p style={{
                    marginTop: "16px", padding: "12px 14px", border: `1px solid ${bone}22`, borderRadius: "4px",
                    fontFamily: mono, fontSize: "0.68rem", color: `${bone}88`, lineHeight: 1.6,
                  }}>
                    {r.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "44px" }}>
          <div style={{ flex: 1, height: "1px", background: `${bone}22` }} />
          <p style={{ fontFamily: mono, fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: `${bone}99`, textAlign: "center", margin: 0, whiteSpace: "nowrap" }}>
            2,222 Inklings · one margin · and we're only at the first page
          </p>
          <div style={{ flex: 1, height: "1px", background: `${bone}22` }} />
        </div>
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
            2,222 hand-inked wanderers on Ink, powered by $INKL.
          </p>
        </div>
        <div>
          <p style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${bone}55`, margin: "0 0 12px" }}>Site</p>
          {[["Ink List", "#inklist"], ["Mint", "#mint"], ["X", X_URL]].map(([l, h]) => (
            <a key={l} href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ display: "block", fontFamily: sans, fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", marginBottom: "8px" }}>{l}</a>
          ))}
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
