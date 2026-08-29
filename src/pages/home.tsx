import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
);

/* ── Fonts: Fraunces (inky editorial serif) + Inter (clean utility sans) ── */
const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap";

const serif = "'Fraunces', Georgia, serif";
const sans  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const ink      = "#9d90d9";   // primary accent — dusty periwinkle ink-wash
const inkLight = "#bfb3ec";
const inkTeal  = "#5f8a86";   // secondary ambient tint, used sparingly

const INKLINGS = [
  "/inkling-1.jpg","/inkling-2.jpg","/inkling-3.jpg","/inkling-4.jpg","/inkling-5.jpg",
  // Add more paths here as more art is revealed, e.g. "/inkling-6.jpg"
];

const CLASS_INKLINGS = [
  "/inkling-1.jpg", "/inkling-2.jpg", "/inkling-3.jpg", "/inkling-4.jpg", "/inkling-5.jpg",
];

const CLASSES = [
  { name:"Sketches",    desc:"Clean lines, quiet presence, easy to love." },
  { name:"Bled Ink",    desc:"Heavier linework, bolder marks, sharper attitude." },
  { name:"Voidborn",    desc:"Chaotic scribbles, unstable auras, loud energy." },
  { name:"Cosmics",     desc:"Heads opened into stars, moons, and planets. Harder to find." },
  { name:"First Drafts",desc:"The rarest Inklings. The artist's hand still visible." },
];

const TRAITS = ["Heads","Eyes & Voids","Marks & Scribbles","Auras","Shirts","Drips","Backdrops","Rare cosmic features"];

const SYSTEMS = [
  { name:"The Studio",   desc:"Customize and evolve your Inkling." },
  { name:"The Gallery",  desc:"Exhibitions, contests, leaderboards, and rewards." },
  { name:"The Circle",   desc:"Holder gatherings, raffles, missions, and rituals." },
  { name:"The Ink Well", desc:"Spend $INK on redraws, remixes, and mystery reveals." },
];

const ROADMAP = [
  { phase:"Phase I",   title:"Ink List Opens",     desc:"Applications, collabs, and early access review begin." },
  { phase:"Phase II",  title:"Mint Opens",          desc:"Selected Ink List wallets mint on OpenSea." },
  { phase:"Phase III", title:"The Reveal",          desc:"Inklings reveal with marks, classes, and rarity." },
  { phase:"Phase IV",  title:"$INK Details",        desc:"Tokenomics, supply, and claim mechanics are shared." },
  { phase:"Phase V",   title:"The Systems Begin",   desc:"The Studio, Gallery, Circle, and Ink Well start opening." },
];

const FAQS = [
  { q:"What is Inklings?",            a:"A 10,000 supply NFT collection of hand-inked, cosmic-headed characters on Ethereum." },
  { q:"What is the mint price?",      a:"0.001 ETH." },
  { q:"Where is mint?",               a:"OpenSea." },
  { q:"What is The Ink List?",        a:"The only mint access phase." },
  { q:"Is there public mint?",        a:"If there are any Inklings left from The Ink List, yes." },
  { q:"What is $INK?",                a:"The token planned to power future Inklings systems after mint." },
  { q:"When will $INK details drop?", a:"After mint." },
  { q:"Is this financial advice?",    a:"No. Inklings is a digital collectible. DYOR." },
];

function isValidEvm(a: string) { return /^0x[0-9a-fA-F]{40}$/.test(a.trim()); }
function isValidUrl(u: string) {
  try { 
    const url = new URL(u.trim());
    return url.protocol === "https:" || url.protocol === "http:"; 
  } catch { return false; }
}

const X_URL = "https://x.com/theinklingsxyz";                                    // TODO: set your real X handle
const PINNED_TWEET_URL = "https://x.com/theinklingsxyz/status/0000000000000000000"; // TODO: set your real pinned tweet link

/* ── Scroll-reveal hook ── */
function useScrollReveal(threshold = 0.12) {
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

/* ── Ink Blot — the signature mark, standing in for bullets, dividers, and stamps ── */
function InkBlot({ size = 10, color = ink, opacity = 1 }: { size?:number; color?:string; opacity?:number }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 10 15" style={{ flexShrink:0, opacity, display:"block" }} fill="none">
      <circle cx="5" cy="5" r="4.3" fill={color} />
      <ellipse cx="5" cy="11" rx="0.9" ry="2" fill={color} opacity="0.65" />
      <circle cx="5" cy="14" r="0.7" fill={color} opacity="0.4" />
    </svg>
  );
}

/* ── Section label ── */
function Label({ text }: { text: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
      <InkBlot size={9} color={ink} />
      <span style={{ fontFamily:sans, fontSize:"0.6rem", letterSpacing:"0.28em", textTransform:"uppercase", color:ink, whiteSpace:"nowrap" }}>
        {text}
      </span>
      <div style={{ height:"1px", flex:1, background:`linear-gradient(90deg,${ink}44,transparent)` }} />
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return <div style={{ height:"1px", background:`linear-gradient(90deg,transparent,${ink}33,transparent)`, margin:"0" }} />;
}

/* ── Flip Card ── */
function FlipCard({ index, icon, title, subtitle, done, locked, children, onFlip }: {
  index:number; icon:string; title:string; subtitle:string;
  done:boolean; locked:boolean; children?:React.ReactNode; onFlip?:()=>void;
}) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { if (done) setFlipped(true); }, [done]);

  function handleClick() {
    if (locked || flipped) return;
    setFlipped(true); onFlip?.();
  }

  const bg = `linear-gradient(160deg,#161520 0%,#0a0a10 100%)`;
  const borderCol = done ? `${ink}55` : locked ? "rgba(255,255,255,0.04)" : `${ink}33`;

  return (
    <div onClick={handleClick} style={{ perspective:"1000px", cursor: locked?"not-allowed": flipped?"default":"pointer", animation:`cardIn 0.5s ease ${0.08*index}s both` }}>
      <div style={{ position:"relative", transformStyle:"preserve-3d", transition:"transform 0.6s cubic-bezier(0.23,1,0.32,1)", transform: flipped?"rotateY(180deg)":"rotateY(0)" }}>

        {/* FRONT */}
        <div style={{
          backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
          position: flipped?"absolute":"relative", inset:0,
          background:bg, border:`1px solid ${borderCol}`, borderRadius:"12px",
          padding:"18px 14px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          gap:"8px", minHeight:"120px", opacity: locked?0.4:1,
          boxShadow: locked?"none":`0 0 20px ${ink}11`,
        }}>
          <span style={{ fontSize:"1.4rem" }}>{locked ? "—" : icon}</span>
          <p style={{ margin:0, fontFamily:serif, fontSize:"0.9rem", fontWeight:600, color: locked?"rgba(255,255,255,0.2)":"#fff", textAlign:"center", letterSpacing:"0.04em" }}>{title}</p>
          {!locked && <p style={{ margin:0, fontFamily:sans, fontSize:"0.62rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Tap to open</p>}
        </div>

        {/* BACK */}
        <div style={{
          backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
          transform:"rotateY(180deg)",
          position: flipped?"relative":"absolute", inset:0,
          background: done?"linear-gradient(160deg,#12161c 0%,#080a0c 100%)":bg,
          border:`1px solid ${done?`${ink}55`:`${ink}22`}`, borderRadius:"12px",
          padding:"14px 12px", minHeight:"120px",
          boxShadow: done?`0 0 20px ${ink}18`:"none",
        }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"10px" }}>
            <div>
              <p style={{ margin:0, fontFamily:serif, fontSize:"0.85rem", fontWeight:600, color:"#fff" }}>{title}</p>
              <p style={{ margin:"1px 0 0", fontFamily:sans, fontSize:"0.6rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", textTransform:"uppercase" }}>{subtitle}</p>
            </div>
            {done && (
              <div style={{ width:"18px", height:"18px", borderRadius:"50%", background:ink, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.2 5.8L8 1" stroke="#0a0810" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Inkling gallery — NO COUNTER ── */
function InklingGallery() {
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { timer.current = setTimeout(next, 3200); return () => clearTimeout(timer.current); }, [cur]);

  function next() { fade((cur+1) % INKLINGS.length); }
  function fade(i: number) {
    if (i === cur) return;
    clearTimeout(timer.current);
    setFading(true);
    setTimeout(() => { setCur(i); setFading(false); }, 280);
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"16px" }}>
      <div style={{ width:"100%", maxWidth:"340px", aspectRatio:"1/1", borderRadius:"16px", overflow:"hidden", border:`1px solid ${ink}22`, background:"#0a0a0e" }}>
        <img src={INKLINGS[cur]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", opacity: fading?0:1, transition:"opacity 0.28s ease" }} />
      </div>
      <div style={{ display:"flex", gap:"6px" }}>
        {INKLINGS.map((_,i) => (
          <button key={i} onClick={()=>fade(i)} style={{ width: i===cur?"20px":"5px", height:"5px", borderRadius:"3px", background: i===cur?ink:"rgba(255,255,255,0.15)", border:"none", padding:0, cursor:"pointer", transition:"all 0.3s ease" }} />
        ))}
      </div>
    </div>
  );
}

/* ── FAQ item ── */
function FaqItem({ q, a }: { q:string; a:string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:`1px solid ${ink}22` }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ width:"100%", background:"none", border:"none", cursor:"pointer", padding:"16px 0", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"12px" }}>
        <span style={{ fontFamily:serif, fontSize:"1rem", fontWeight:600, color:open?"#fff":"rgba(255,255,255,0.75)", textAlign:"left", letterSpacing:"0.01em" }}>{q}</span>
        <span style={{ color:ink, fontSize:"1.1rem", flexShrink:0, transition:"transform 0.25s", transform: open?"rotate(45deg)":"rotate(0)" }}>+</span>
      </button>
      {open && (
        <p style={{ fontFamily:sans, fontSize:"0.88rem", color:"rgba(255,255,255,0.45)", padding:"0 0 16px", margin:0, lineHeight:1.65 }}>{a}</p>
      )}
    </div>
  );
}

/* ── Input style ── */
const inp: React.CSSProperties = {
  width:"100%", background:"rgba(0,0,0,0.5)",
  border:`1px solid ${ink}22`, borderRadius:"6px",
  padding:"9px 11px", fontSize:"0.8rem", color:"#fff",
  fontFamily:sans, outline:"none", transition:"border 0.2s", boxSizing:"border-box",
};

/* ── Scroll-reveal section wrapper ── */
function RevealSection({ children, bg = "#08080b", extra, delay = 0 }: {
  children: React.ReactNode; bg?: string; extra?: React.CSSProperties; delay?: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref} style={{
      background: bg, padding:"80px 0", position:"relative", ...extra,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 24px" }}>
        {children}
      </div>
    </section>
  );
}

/* ── Particles — cosmic ink dust, drifting in the two accent hues ── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x:number; y:number; size:number; speedX:number; speedY:number; opacity:number; teal:boolean }[] = [];

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        teal: Math.random() < 0.22,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.teal ? `rgba(95,138,134,${p.opacity})` : `rgba(157,144,217,${p.opacity})`;
        ctx!.fill();
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0
    }} />
  );
}

/* ════════════════════════════════════ MAIN ═══════════════════════════════════ */

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [twitter,   setTwitter]   = useState("");
  const [wallet,    setWallet]    = useState("");
  const [quoteUrl,  setQuoteUrl]  = useState("");
  const [tasks,     setTasks]     = useState<Record<string,boolean>>({});
  const [sending,   setSending]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [err,       setErr]       = useState("");
  const [ready,     setReady]     = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  /* ── Load from localStorage on mount ── */
  useEffect(() => {
    const l = document.createElement("link"); l.rel="stylesheet"; l.href=FONT_LINK;
    document.head.appendChild(l);
    try { 
      const s = localStorage.getItem("ink_v1"); 
      if(s){
        const p = JSON.parse(s);
        setTasks(p.tasks ?? {});
        setWallet(p.wallet ?? "");
        setTwitter(p.twitter ?? "");
        setQuoteUrl(p.quoteUrl ?? "");
      }
      const submitted = localStorage.getItem("ink_submitted");
      if (submitted === "true") setAlreadySubmitted(true);
    } catch {}
    setTimeout(()=>setReady(true),80);
  },[]);

  /* ── Persist to localStorage ── */
  useEffect(()=>{ 
    if(ready) localStorage.setItem("ink_v1", JSON.stringify({tasks, wallet, twitter, quoteUrl})); 
  },[tasks, wallet, twitter, quoteUrl, ready]);

  /* ── Task confirmation states ── */
  const [twitterConfirmed, setTwitterConfirmed] = useState(false);
  const [quoteConfirmed, setQuoteConfirmed] = useState(false);
  const [walletConfirmed, setWalletConfirmed] = useState(false);

  const c1 = twitterConfirmed && twitter.trim().length > 1;
  const c2 = !!tasks["like"];
  const c3 = quoteConfirmed && isValidUrl(quoteUrl);
  const c4 = walletConfirmed && isValidEvm(wallet);
  const allDone = c1 && c2 && c3 && c4;

  async function submit() {
    if (!allDone) { setErr("Complete all missions first."); return; }
    if (alreadySubmitted) { setErr("You have already submitted an application."); return; }
    
    setErr(""); 
    setSending(true);
    
    const { error: e } = await supabase
      .from("inklings")
      .insert([{ 
        wallet: wallet.trim(), 
        twitter: twitter.trim(), 
        quote_url: quoteUrl.trim() 
      }]);
    
    setSending(false);
    
    if (e) {
      setErr("Something went wrong. Try again.");
    } else {
      setSuccess(true);
      localStorage.setItem("ink_submitted", "true");
      setAlreadySubmitted(true);
    }
  }

  function closeModal(){ 
    setModalOpen(false); 
    if (!alreadySubmitted) {
      setSuccess(false); 
      setErr(""); 
    }
  }

  function focusInp(e: React.FocusEvent<HTMLInputElement>){e.target.style.borderColor=`${ink}66`;}
  function blurInp(e: React.FocusEvent<HTMLInputElement>){e.target.style.borderColor=`${ink}22`;}

  return (
    <div style={{ background:"#08080b", minHeight:"100vh", fontFamily:sans, color:"#fff", overflowX:"hidden" }}>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.96) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes stamp { 0%{transform:scale(0) rotate(-15deg);opacity:0} 70%{transform:scale(1.12) rotate(3deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes pulseGlow { 0%{box-shadow:0 0 0 0 ${ink}44, 0 10px 36px ${ink}36} 50%{box-shadow:0 0 20px 4px ${ink}33, 0 10px 36px ${ink}36} 100%{box-shadow:0 0 0 0 ${ink}44, 0 10px 36px ${ink}36} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        *{box-sizing:border-box;}
        ::placeholder{color:rgba(255,255,255,0.2);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${ink}33;border-radius:4px;}
        html{scroll-behavior:smooth;}
        a{color:inherit;text-decoration:none;}
      `}</style>

      {/* ══════════ HEADER ══════════ */}
      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        padding:"0 28px",
        height:"62px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(8,8,11,0.82)",
        backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)",
        borderBottom:"1px solid rgba(255,255,255,0.06)",
      }}>
        <a href="#home" style={{ display:"flex", alignItems:"center", gap:"10px", textDecoration:"none" }}>
          <img src="/inklings-logo.jpg" style={{ width:"30px", height:"30px", borderRadius:"6px", objectFit:"cover" }} alt="" />
          <span style={{ fontFamily:serif, fontSize:"1.05rem", fontWeight:700, color:"#fff", letterSpacing:"0.1em" }}>INKLINGS</span>
        </a>

        <nav style={{ display:"flex", alignItems:"center", gap:"4px" }}>
          {([["Ink List","#inklist"],["Mint","#mint"]] as [string,string][]).map(([l,h])=>(
            <a key={l} href={h} style={{
              fontFamily:sans, fontSize:"0.64rem", fontWeight:500, letterSpacing:"0.18em",
              textTransform:"uppercase", color:"rgba(255,255,255,0.48)",
              padding:"8px 14px", borderRadius:"6px", transition:"all 0.2s",
            }}
              onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color="#fff";(e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.06)";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.48)";(e.currentTarget as HTMLAnchorElement).style.background="transparent";}}
            >{l}</a>
          ))}
          <div style={{ width:"1px", height:"16px", background:"rgba(255,255,255,0.1)", margin:"0 8px" }} />
          <a href={X_URL} target="_blank" rel="noopener noreferrer"
            title="Follow on X"
            style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"34px", height:"34px", borderRadius:"6px", color:"rgba(255,255,255,0.48)", border:"1px solid rgba(255,255,255,0.1)", transition:"all 0.2s", flexShrink:0 }}
            onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.color="#fff";el.style.borderColor=`${ink}55`;el.style.background="rgba(255,255,255,0.04)";}}
            onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.color="rgba(255,255,255,0.48)";el.style.borderColor="rgba(255,255,255,0.1)";el.style.background="transparent";}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
          </a>
        </nav>
      </header>

      {/* ══════════ HERO ══════════ */}
      <div id="home" style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"110px 24px 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <Particles />
        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>
        <div style={{ position:"absolute", top:"38%", left:"50%", transform:"translate(-50%,-50%)", width:"600px", height:"600px", borderRadius:"50%", background:`radial-gradient(circle,${ink}09 0%,transparent 68%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"65%", left:"25%", width:"280px", height:"280px", borderRadius:"50%", background:`radial-gradient(circle,${inkTeal}22 0%,transparent 70%)`, pointerEvents:"none" }} />

        <div style={{ animation: ready?"fadeUp 0.7s ease 0.05s both":"none", opacity: ready?undefined:0, marginBottom:"22px" }}>
          <span style={{ fontFamily:sans, fontSize:"0.6rem", letterSpacing:"0.26em", textTransform:"uppercase", color:ink, border:`1px solid ${ink}44`, borderRadius:"999px", padding:"5px 16px", display:"inline-block" }}>
            10,000 ON ETH
          </span>
        </div>

        <h1 style={{
          fontFamily:serif, fontSize:"clamp(4rem,18vw,8rem)", fontWeight:600, fontStyle:"italic",
          color:"#fff", margin:"0 0 4px", letterSpacing:"0.01em", lineHeight:0.9,
          animation: ready?"fadeUp 0.7s ease 0.12s both":"none", opacity: ready?undefined:0,
        }}>
          Inklings
        </h1>
        <div style={{ width:"60px", height:"1px", background:`linear-gradient(90deg,transparent,${ink},transparent)`, margin:"20px auto" }} />

        <p style={{
          fontFamily:serif, fontSize:"clamp(1rem,3vw,1.2rem)", fontStyle:"italic", color:"rgba(255,255,255,0.5)",
          margin:"0 0 40px", maxWidth:"420px", lineHeight:1.6,
          animation: ready?"fadeUp 0.7s ease 0.2s both":"none", opacity: ready?undefined:0,
        }}>
          10,000 ink-born wanderers, drifting between memory and cosmos.
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:"10px", width:"100%", maxWidth:"300px",
          animation: ready?"fadeUp 0.7s ease 0.28s both":"none", opacity: ready?undefined:0 }}>
          <button onClick={()=>setModalOpen(true)} style={{
            fontFamily:sans, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase",
            color:"#08080b", background:ink, border:"none", borderRadius:"8px",
            padding:"17px 36px", cursor:"pointer", transition:"all 0.2s ease",
            boxShadow:`0 10px 36px ${ink}36`,
            animation: "pulseGlow 2.5s ease-in-out infinite",
            position: "relative",
            overflow: "hidden",
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=inkLight;(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLButtonElement).style.boxShadow=`0 16px 40px ${ink}44`;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=ink;(e.currentTarget as HTMLButtonElement).style.transform="";(e.currentTarget as HTMLButtonElement).style.boxShadow=`0 10px 36px ${ink}36`;}}
          >
            <span style={{ position:"relative", zIndex:2 }}>JOIN THE INK LIST</span>
            <span style={{
              position:"absolute", inset:0,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`,
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
              zIndex:1,
            }} />
          </button>
          <a href="#mint" style={{
            fontFamily:sans, fontSize:"0.72rem", fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.52)", background:"transparent",
            border:"1px solid rgba(255,255,255,0.12)", borderRadius:"8px",
            padding:"17px 36px", display:"block", textAlign:"center", transition:"all 0.2s ease",
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.borderColor=`${ink}44`;(e.currentTarget as HTMLAnchorElement).style.color="#fff";(e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.03)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,0.12)";(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.52)";(e.currentTarget as HTMLAnchorElement).style.background="transparent";}}>
            VIEW MINT
          </a>
        </div>

        <div style={{
          marginTop:"52px", display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          border:`1px solid ${ink}1e`, borderRadius:"10px", overflow:"hidden",
          background:"rgba(255,255,255,0.015)", backdropFilter:"blur(8px)",
          animation: ready?"fadeUp 0.7s ease 0.36s both":"none", opacity: ready?undefined:0,
        }}>
          {[["10,000","Supply"],["0.001 ETH","Mint Price"],["Ethereum","Chain"],["OpenSea","Launchpad"]].map(([val,lbl],i)=>(
            <div key={i} style={{ padding:"18px 16px", borderLeft: i>0?`1px solid ${ink}16`:"none", textAlign:"center" }}>
              <p style={{ margin:0, fontFamily:serif, fontSize:"1.05rem", fontWeight:700, color:"#fff", letterSpacing:"0.02em" }}>{val}</p>
              <p style={{ margin:"3px 0 0", fontFamily:sans, fontSize:"0.52rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", fontWeight:500 }}>{lbl}</p>
            </div>
          ))}
        </div>

        <div style={{ position:"absolute", bottom:"36px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", opacity:0.35 }}>
          <span style={{ fontFamily:sans, fontSize:"0.48rem", letterSpacing:"0.3em", textTransform:"uppercase", color:ink }}>Scroll</span>
          <div style={{ width:"1px", height:"28px", background:`linear-gradient(180deg,${ink},transparent)` }} />
        </div>
        </div>
      </div>

      <Divider />

      <RevealSection>
        <Label text="The Collection" />
        <h2 style={{ fontFamily:serif, fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:700, color:"#fff", margin:"0 0 16px", letterSpacing:"0.02em" }}>Meet The Inklings</h2>
        <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1rem", color:"rgba(255,255,255,0.45)", margin:"0 0 40px", lineHeight:1.7 }}>
          Hand-inked. Hollow-eyed. Quietly cosmic.<br/>
          Inklings is a 10,000 supply character collection built from scribbled linework, ink drips, and windows into deep space.
        </p>
        <InklingGallery />
      </RevealSection>

      <Divider />

      <RevealSection bg="#0a0a0f">
        <Label text="The Marks" />
        <h2 style={{ fontFamily:serif, fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:700, color:"#fff", margin:"0 0 16px" }}>Built From Ink</h2>
        <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1rem", color:"rgba(255,255,255,0.45)", margin:"0 0 32px", lineHeight:1.7 }}>
          Every Inkling is drawn from a mix of heads, eyes, auras, shirts, and rare cosmic details.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
          {TRAITS.map(t=>(
            <div key={t} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px", border:`1px solid ${ink}18`, borderRadius:"8px", background:"rgba(255,255,255,0.02)" }}>
              <InkBlot size={7} color={ink} />
              <span style={{ fontFamily:sans, fontSize:"0.82rem", color:"rgba(255,255,255,0.6)" }}>{t}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.9rem", color:"rgba(255,255,255,0.5)", margin:"24px 0 0", lineHeight:1.6 }}>
          Some marks are quiet. Some are loud. Some open straight into the stars.<br/>
          The goal is a distinct hand, not overcomplication.
        </p>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="The Studies" />
        <h2 style={{ fontFamily:serif, fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:700, color:"#fff", margin:"0 0 32px" }}>Every Inkling Has A Mark</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
          {CLASSES.map((c,i)=>(
            <div key={c.name} style={{ padding:"20px 0", borderBottom:`1px solid ${ink}18`, display:"flex", justifyContent:"space-between", alignItems:"center", gap:"16px" }}>
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontFamily:serif, fontSize:"1.1rem", fontWeight:600, color:"#fff" }}>{c.name}</p>
                <p style={{ margin:"4px 0 0", fontFamily:serif, fontStyle:"italic", fontSize:"0.9rem", color:"rgba(255,255,255,0.4)", lineHeight:1.5 }}>{c.desc}</p>
              </div>
              <div style={{ position:"relative", flexShrink:0 }}>
                <div style={{
                  width:"72px", height:"72px", borderRadius:"12px", overflow:"hidden",
                  border:`1px solid ${ink}22`, background:"#0a0a0e",
                  transform: "scaleX(-1)",
                }}>
                  <img src={CLASS_INKLINGS[i]} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                </div>
                <div style={{ position:"absolute", inset:0, borderRadius:"12px", boxShadow: `inset 0 0 20px ${ink}15`, pointerEvents:"none" }} />
              </div>
              <InkBlot size={8} color={`${ink}88`} />
            </div>
          ))}
        </div>
      </RevealSection>

      <Divider />

      <section id="inklist" style={{ background:`linear-gradient(180deg,#08080b 0%,#0d0b16 50%,#08080b 100%)`, padding:"100px 0" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
          <Label text="Access" />
          <h2 style={{ fontFamily:serif, fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:700, color:"#fff", margin:"0 0 20px" }}>Join The Ink List</h2>
          <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1rem", color:"rgba(255,255,255,0.45)", margin:"0 0 16px", lineHeight:1.8, maxWidth:"480px", marginLeft:"auto", marginRight:"auto" }}>
            The Ink List is the only mint access phase.<br/>
            Apply through the site, complete the rites, submit your wallet, and wait for selection.<br/>
            Selected wallets mint on OpenSea.
          </p>
          <button onClick={()=>setModalOpen(true)} style={{
            marginTop:"24px",
            fontFamily:sans, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase",
            color:"#08080b", background:ink, border:"none", borderRadius:"6px",
            padding:"16px 40px", cursor:"pointer", transition:"background 0.2s, transform 0.15s",
            boxShadow:`0 8px 32px ${ink}33`,
            animation: "pulseGlow 2.5s ease-in-out infinite",
            position: "relative",
            overflow: "hidden",
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background=inkLight;(e.currentTarget as HTMLButtonElement).style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background=ink;(e.currentTarget as HTMLButtonElement).style.transform="";}}
          >
            <span style={{ position:"relative", zIndex:2 }}>CLAIM YOUR SPOT</span>
            <span style={{
              position:"absolute", inset:0,
              background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)`,
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
              zIndex:1,
            }} />
          </button>
        </div>
      </section>

      <Divider />

      <RevealSection>
        <div id="mint" />
        <Label text="The Mint" />
        <h2 style={{ fontFamily:serif, fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:700, color:"#fff", margin:"0 0 16px" }}>One Phase. One Mint.</h2>
        <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1rem", color:"rgba(255,255,255,0.45)", margin:"0 0 32px", lineHeight:1.7 }}>
          The Ink List is the mint.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", border:`1px solid ${ink}22`, borderRadius:"10px", overflow:"hidden", marginBottom:"28px" }}>
          {[["10,000","Supply"],["0.001 ETH","Price"],["Ethereum","Chain"],["OpenSea","Launchpad"]].map(([v,l],i)=>(
            <div key={i} style={{ padding:"20px 18px", background:"rgba(255,255,255,0.02)", borderBottom: i<2?`1px solid ${ink}18`:"none", borderRight: i%2===0?`1px solid ${ink}18`:"none" }}>
              <p style={{ margin:0, fontFamily:serif, fontSize:"1.3rem", fontWeight:600, color:"#fff" }}>{v}</p>
              <p style={{ margin:"3px 0 0", fontFamily:sans, fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)" }}>{l}</p>
            </div>
          ))}
        </div>
        <a href="https://opensea.io/collection/inklings" target="_blank" rel="noopener noreferrer" style={{
          width:"100%", fontFamily:sans, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase",
          color:"#08080b", background:ink, border:`1px solid ${ink}`,
          borderRadius:"6px", padding:"16px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
          textDecoration:"none", transition:"all 0.2s ease", boxShadow:`0 8px 32px ${ink}33`,
        }}
          onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background=inkLight;(e.currentTarget as HTMLAnchorElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLAnchorElement).style.boxShadow=`0 12px 40px ${ink}44`;}}
          onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background=ink;(e.currentTarget as HTMLAnchorElement).style.transform="";(e.currentTarget as HTMLAnchorElement).style.boxShadow=`0 8px 32px ${ink}33`;}}
        >
          <img src="/OpenSea-Emblem.png" alt="OpenSea" style={{ width:"20px", height:"20px", borderRadius:"4px", objectFit:"cover" }} />
          <span>OpenSea</span>
        </a>
        <p style={{ fontFamily:sans, fontSize:"0.7rem", color:`${ink}66`, textAlign:"center", margin:"12px 0 0", letterSpacing:"0.1em" }}>
          View on OpenSea
        </p>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="Reserve" />
        <h2 style={{ fontFamily:serif, fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:700, color:"#fff", margin:"0 0 16px" }}>The Ink Archive</h2>
        <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1rem", color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>
          A small allocation kept for collabs, rewards, partnerships, future activations, and community support.<br/>
          This is not a public mint phase.
        </p>
      </RevealSection>

      <Divider />

      <RevealSection bg="#0a0a0f">
        <Label text="Token" />
        <h2 style={{ fontFamily:serif, fontSize:"clamp(2.5rem,10vw,5rem)", fontWeight:700, fontStyle:"italic", color:"#fff", margin:"0 0 16px", letterSpacing:"0.02em" }}>$INK</h2>
        <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"1rem", color:"rgba(255,255,255,0.45)", lineHeight:1.8 }}>
          $INK is the current running beneath the Inklings world.<br/>
          It is planned to power future holder systems, redraws, remixes, raffles, burns, events, and community rewards.<br/>
          Full token details will be shared after mint.
        </p>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="Systems" />
        <h2 style={{ fontFamily:serif, fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:700, color:"#fff", margin:"0 0 32px" }}>The Systems</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
          {SYSTEMS.map((s)=>(
            <div key={s.name} style={{ padding:"22px 0", borderBottom:`1px solid ${ink}18`, display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"16px" }}>
              <div>
                <p style={{ margin:0, fontFamily:serif, fontSize:"1.1rem", fontWeight:600, color:"#fff" }}>{s.name}</p>
                <p style={{ margin:"4px 0 0", fontFamily:serif, fontStyle:"italic", fontSize:"0.9rem", color:"rgba(255,255,255,0.4)", lineHeight:1.5 }}>{s.desc}</p>
              </div>
              <InkBlot size={8} color={`${ink}77`} />
            </div>
          ))}
        </div>
      </RevealSection>

      <Divider />

      <RevealSection bg="#0a0a0f">
        <Label text="The Plan" />
        <h2 style={{ fontFamily:serif, fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:700, color:"#fff", margin:"0 0 36px" }}>What Comes After Mint</h2>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:"16px", top:0, bottom:0, width:"1px", background:`linear-gradient(180deg,${ink}44,${ink}11)` }} />
          <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
            {ROADMAP.map((r,i)=>(
              <div key={r.phase} style={{ display:"flex", gap:"24px", paddingBottom: i<ROADMAP.length-1?"28px":"0", paddingLeft:"40px", position:"relative" }}>
                <div style={{ position:"absolute", left:"10px", top:"4px", width:"13px", height:"13px", borderRadius:"50%", border:`1px solid ${ink}`, background:"#08080b", flexShrink:0 }} />
                <div>
                  <p style={{ margin:0, fontFamily:sans, fontSize:"0.58rem", letterSpacing:"0.2em", textTransform:"uppercase", color:ink, marginBottom:"4px" }}>{r.phase}</p>
                  <p style={{ margin:0, fontFamily:serif, fontSize:"1rem", fontWeight:600, color:"#fff" }}>{r.title}</p>
                  <p style={{ margin:"4px 0 0", fontFamily:serif, fontStyle:"italic", fontSize:"0.88rem", color:"rgba(255,255,255,0.38)", lineHeight:1.55 }}>{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <Divider />

      <RevealSection>
        <Label text="FAQ" />
        <h2 style={{ fontFamily:serif, fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:700, color:"#fff", margin:"0 0 32px" }}>Questions</h2>
        <div>
          {FAQS.map(f=><FaqItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </RevealSection>

      <Divider />

      <footer style={{ padding:"60px 24px 40px", textAlign:"center" }}>
        <img src="/inklings-logo.jpg" style={{ width:"44px", height:"44px", borderRadius:"8px", objectFit:"cover", marginBottom:"16px" }} alt="" />
        <h3 style={{ fontFamily:serif, fontSize:"1.4rem", fontWeight:700, fontStyle:"italic", color:"#fff", margin:"0 0 6px", letterSpacing:"0.04em" }}>Inklings</h3>
        <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.88rem", color:"rgba(255,255,255,0.3)", margin:"0 0 24px", lineHeight:1.7 }}>
          Hand-inked wanderers, adrift between memory and cosmos.<br/>
          10,000 Inklings on Ethereum. Powered by $INK.
        </p>
        <div style={{ display:"flex", gap:"24px", justifyContent:"center", marginBottom:"36px" }}>
          {[["X",X_URL],["OpenSea","https://opensea.io/collection/inklings"],["Ink List","#inklist"],["Mint","#mint"]].map(([l,h])=>(
            <a key={l} href={h} style={{ fontFamily:sans, fontSize:"0.68rem", letterSpacing:"0.14em", textTransform:"uppercase", color:`${ink}88`, transition:"color 0.2s" }}
              onMouseEnter={e=>(e.currentTarget.style.color="#fff")} onMouseLeave={e=>(e.currentTarget.style.color=`${ink}88`)}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ width:"40px", height:"1px", background:`linear-gradient(90deg,transparent,${ink}44,transparent)`, margin:"0 auto 18px" }} />
        <p style={{ fontFamily:sans, fontSize:"0.55rem", letterSpacing:"0.28em", textTransform:"uppercase", color:`${ink}44` }}>
          THE INKVERSE OPENS SOON
        </p>
      </footer>

      {/* ══════════ INK LIST MODAL ══════════ */}
      {modalOpen && (
        <div onClick={e=>{if(e.target===e.currentTarget)closeModal();}} style={{
          position:"fixed", inset:0, zIndex:200,
          background:"rgba(0,0,0,0.88)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)",
          display:"flex", alignItems:"center", justifyContent:"center", padding:"16px",
        }}>
          <div style={{
            width:"100%", maxWidth:"460px", maxHeight:"94vh", overflowY:"auto",
            background:"#0d0c14", border:`1px solid ${ink}22`, borderRadius:"16px",
            padding:"28px 22px 24px", animation:"modalIn 0.3s ease both", position:"relative",
            boxShadow:`0 40px 80px rgba(0,0,0,0.9), 0 0 60px ${ink}08`,
          }}>
            <button onClick={closeModal} style={{ position:"absolute", top:"14px", right:"16px", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.22)", fontSize:"1.1rem", lineHeight:1 }}>✕</button>

            {alreadySubmitted ? (
              <div style={{ textAlign:"center", padding:"36px 0" }}>
                <div style={{ width:"54px", height:"54px", borderRadius:"50%", background:`${ink}33`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9L8 15L20 2" stroke={ink} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p style={{ fontFamily:sans, fontSize:"0.58rem", letterSpacing:"0.24em", textTransform:"uppercase", color:ink, margin:"0 0 6px" }}>Already Applied</p>
                <h2 style={{ fontFamily:serif, fontSize:"1.5rem", fontWeight:700, color:"#fff", margin:"0 0 10px" }}>Application Received.</h2>
                <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.9rem", color:"rgba(255,255,255,0.38)", margin:0, lineHeight:1.6 }}>
                  Your spot has been saved. Selected wallets will be added before mint.
                </p>
                <button onClick={closeModal} style={{ marginTop:"24px", fontFamily:sans, fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#08080b", background:ink, border:"none", borderRadius:"6px", padding:"12px 28px", cursor:"pointer" }}>
                  BACK TO HOME
                </button>
              </div>
            ) : success ? (
              <div style={{ textAlign:"center", padding:"36px 0" }}>
                <div style={{ width:"54px", height:"54px", borderRadius:"50%", background:ink, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", animation:"stamp 0.5s cubic-bezier(0.23,1,0.32,1) both", boxShadow:`0 8px 24px ${ink}44` }}>
                  <svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="M2 9L8 15L20 2" stroke="#0a0810" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p style={{ fontFamily:sans, fontSize:"0.58rem", letterSpacing:"0.24em", textTransform:"uppercase", color:ink, margin:"0 0 6px" }}>Application Sent</p>
                <h2 style={{ fontFamily:serif, fontSize:"1.5rem", fontWeight:700, color:"#fff", margin:"0 0 10px" }}>You Are Under Review.</h2>
                <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.9rem", color:"rgba(255,255,255,0.38)", margin:0, lineHeight:1.6 }}>
                  Selected wallets will be added before mint.
                </p>
                <button onClick={closeModal} style={{ marginTop:"24px", fontFamily:sans, fontSize:"0.68rem", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", color:"#08080b", background:ink, border:"none", borderRadius:"6px", padding:"12px 28px", cursor:"pointer" }}>
                  BACK TO HOME
                </button>
              </div>
            ) : (
              <>
                <div style={{ marginBottom:"22px" }}>
                  <p style={{ fontFamily:sans, fontSize:"0.55rem", letterSpacing:"0.26em", textTransform:"uppercase", color:ink, margin:"0 0 4px" }}>Ink List Application</p>
                  <h2 style={{ fontFamily:serif, fontSize:"1.5rem", fontWeight:700, color:"#fff", margin:"0 0 4px", letterSpacing:"0.02em" }}>Claim Your Spot</h2>
                  <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.82rem", color:"rgba(255,255,255,0.35)", margin:"0 0 14px", lineHeight:1.5 }}>
                    Complete the missions and submit your wallet for Ink List review.
                  </p>
                  <div style={{ height:"2px", background:`${ink}18`, borderRadius:"2px", overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:"2px", background:`linear-gradient(90deg,${ink},${inkLight})`, width:`${([c1,c2,c3,c4].filter(Boolean).length/4)*100}%`, transition:"width 0.4s ease" }} />
                  </div>
                  <p style={{ fontFamily:sans, fontSize:"0.62rem", color:`${ink}66`, margin:"6px 0 0", letterSpacing:"0.08em" }}>
                    {[c1,c2,c3,c4].filter(Boolean).length} of 4 missions complete
                  </p>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>

                  {/* Card 1 — X Handle */}
                  <FlipCard index={0} icon="𝕏" title="Who Are You?" subtitle="Mission 01 / 04" done={c1} locked={false}>
                    <p style={{ margin:"0 0 7px", fontFamily:sans, fontSize:"0.62rem", color:`${ink}88`, letterSpacing:"0.1em", textTransform:"uppercase" }}>Your X handle</p>
                    <input 
                      type="text" 
                      placeholder="@yourhandle" 
                      value={twitter} 
                      onChange={e=>setTwitter(e.target.value)} 
                      onKeyDown={e=>{ if(e.key==="Enter") setTwitterConfirmed(true); }}
                      onClick={e=>e.stopPropagation()} 
                      style={inp} 
                      onFocus={focusInp} 
                      onBlur={blurInp} 
                    />
                    {!c1 && twitter.trim().length > 1 && (
                      <button 
                        onClick={e=>{ e.stopPropagation(); setTwitterConfirmed(true); }}
                        style={{
                          marginTop:"8px", width:"100%", background:`${ink}22`, color:ink,
                          border:`1px solid ${ink}44`, borderRadius:"4px", padding:"6px",
                          fontFamily:sans, fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.1em",
                          textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
                        }}
                        onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=ink; (e.currentTarget as HTMLButtonElement).style.color="#08080b"; }}
                        onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background=`${ink}22`; (e.currentTarget as HTMLButtonElement).style.color=ink; }}
                      >
                        Confirm
                      </button>
                    )}
                    {c1 && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:ink, margin:"5px 0 0" }}>Identity confirmed</p>}
                  </FlipCard>

                  {/* Card 2 — Like & Tag 2 friends */}
                  <FlipCard index={1} icon="↺" title="Like & Tag 2 Frens" subtitle="Mission 02 / 04" done={c2} locked={!c1}
                    onFlip={()=>{ window.open(PINNED_TWEET_URL,"_blank"); setTimeout(()=>setTasks(p=>({...p,like:true})),800); }}>
                    <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.78rem", color:"rgba(255,255,255,0.5)", margin:0, lineHeight:1.5 }}>
                      {c2 ? "Like & comment confirmed." : 'Like the pinned post and tag 2 friends in the comments on X.'}
                    </p>
                    {c2 && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:ink, margin:"8px 0 0" }}>Missions done</p>}
                  </FlipCard>

                  {/* Card 3 — Quote Pinned Tweet (opens X first, then shows link input) */}
                  <FlipCard index={2} icon="↗" title="Quote Pinned Tweet" subtitle="Mission 03 / 04" done={c3} locked={!c2}
                    onFlip={()=>{ window.open(PINNED_TWEET_URL,"_blank"); }}>
                    {!c3 ? (
                      <>
                        <p style={{ fontFamily:serif, fontStyle:"italic", fontSize:"0.78rem", color:"rgba(255,255,255,0.5)", margin:0, lineHeight:1.5 }}>
                          Quote the pinned tweet on X with "INKLINGS" and tag 2 friends. Then paste your quote link below.
                        </p>
                        <p style={{ margin:"8px 0 0", fontFamily:sans, fontSize:"0.62rem", color:`${ink}88`, letterSpacing:"0.1em", textTransform:"uppercase" }}>Quote tweet link</p>
                        <input 
                          type="url" 
                          placeholder="https://x.com/yourhandle/status/..." 
                          value={quoteUrl} 
                          onChange={e=>setQuoteUrl(e.target.value)} 
                          onKeyDown={e=>{ if(e.key==="Enter" && isValidUrl(quoteUrl)) setQuoteConfirmed(true); }}
                          onClick={e=>e.stopPropagation()} 
                          style={inp} 
                          onFocus={focusInp} 
                          onBlur={blurInp} 
                        />
                        {quoteUrl && !isValidUrl(quoteUrl) && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:"#e05050", margin:"4px 0 0" }}>Needs valid http:// or https:// link</p>}
                        {isValidUrl(quoteUrl) && (
                          <button 
                            onClick={e=>{ e.stopPropagation(); setQuoteConfirmed(true); }}
                            style={{
                              marginTop:"8px", width:"100%", background:`${ink}22`, color:ink,
                              border:`1px solid ${ink}44`, borderRadius:"4px", padding:"6px",
                              fontFamily:sans, fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.1em",
                              textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
                            }}
                            onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=ink; (e.currentTarget as HTMLButtonElement).style.color="#08080b"; }}
                            onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background=`${ink}22`; (e.currentTarget as HTMLButtonElement).style.color=ink; }}
                          >
                            Verify Link
                          </button>
                        )}
                      </>
                    ) : (
                      <p style={{ fontFamily:sans, fontSize:"0.6rem", color:ink, margin:0 }}>Quote verified</p>
                    )}
                  </FlipCard>

                  {/* Card 4 — Wallet */}
                  <FlipCard index={3} icon="◈" title="Claim Wallet" subtitle="Mission 04 / 04" done={c4} locked={!c3}>
                    <p style={{ margin:"0 0 7px", fontFamily:sans, fontSize:"0.62rem", color:`${ink}88`, letterSpacing:"0.1em", textTransform:"uppercase" }}>EVM address</p>
                    <input 
                      type="text" 
                      placeholder="0x..." 
                      value={wallet} 
                      onChange={e=>setWallet(e.target.value)} 
                      onKeyDown={e=>{ if(e.key==="Enter" && isValidEvm(wallet)) setWalletConfirmed(true); }}
                      onClick={e=>e.stopPropagation()} 
                      style={inp} 
                      onFocus={focusInp} 
                      onBlur={blurInp} 
                    />
                    {wallet && !isValidEvm(wallet) && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:"#e05050", margin:"4px 0 0" }}>Invalid address</p>}
                    {!c4 && isValidEvm(wallet) && (
                      <button 
                        onClick={e=>{ e.stopPropagation(); setWalletConfirmed(true); }}
                        style={{
                          marginTop:"8px", width:"100%", background:`${ink}22`, color:ink,
                          border:`1px solid ${ink}44`, borderRadius:"4px", padding:"6px",
                          fontFamily:sans, fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.1em",
                          textTransform:"uppercase", cursor:"pointer", transition:"all 0.2s",
                        }}
                        onMouseEnter={e=>{ (e.currentTarget as HTMLButtonElement).style.background=ink; (e.currentTarget as HTMLButtonElement).style.color="#08080b"; }}
                        onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background=`${ink}22`; (e.currentTarget as HTMLButtonElement).style.color=ink; }}
                      >
                        Confirm Wallet
                      </button>
                    )}
                    {c4 && <p style={{ fontFamily:sans, fontSize:"0.6rem", color:ink, margin:"4px 0 0" }}>Wallet confirmed</p>}
                    <p style={{ fontFamily:sans, fontSize:"0.58rem", color:"rgba(255,255,255,0.2)", margin:"6px 0 0", lineHeight:1.4 }}>Never share private keys or seed phrases.</p>
                  </FlipCard>

                </div>

                {err && <p style={{ fontFamily:sans, fontSize:"0.78rem", color:"#e05050", margin:"0 0 10px", fontWeight:500 }}>{err}</p>}

                <button onClick={submit} disabled={sending || !allDone} style={{
                  width:"100%",
                  background: allDone ? ink : "rgba(255,255,255,0.04)",
                  color: allDone ? "#08080b" : "rgba(255,255,255,0.18)",
                  border: `1px solid ${allDone ? ink : "rgba(255,255,255,0.06)"}`,
                  borderRadius:"6px", padding:"15px",
                  fontFamily:sans, fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase",
                  cursor: allDone && !sending ? "pointer" : "not-allowed",
                  transition:"all 0.3s ease",
                  boxShadow: allDone ? `0 8px 24px ${ink}33` : "none",
                }}
                  onMouseEnter={e=>{ if(allDone)(e.currentTarget as HTMLButtonElement).style.background=inkLight; }}
                  onMouseLeave={e=>{ if(allDone)(e.currentTarget as HTMLButtonElement).style.background=ink; }}
                  onMouseDown={e=>allDone && ((e.currentTarget as HTMLButtonElement).style.transform="scale(0.98)")}
                  onMouseUp={e=>((e.currentTarget as HTMLButtonElement).style.transform="")}
                >
                  {sending ? "Saving..." : allDone ? "JOIN THE INK LIST" : "Complete all missions to unlock"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
