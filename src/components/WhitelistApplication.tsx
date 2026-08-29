import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { serif, mono, sans, charcoalDeep, bone, mustard, washViolet, danger } from "./theme";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
);

// TODO: set your real pinned tweet link before launch
const PINNED_TWEET_URL = "https://x.com/theinklingsxyz/status/0000000000000000000";

function isValidEvm(a: string) { return /^0x[0-9a-fA-F]{40}$/.test(a.trim()); }
function isValidUrl(u: string) {
  try {
    const url = new URL(u.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch { return false; }
}

const inp: React.CSSProperties = {
  width: "100%", background: "rgba(0,0,0,0.35)",
  border: `1px solid ${bone}26`, borderRadius: "5px",
  padding: "10px 12px", fontSize: "0.85rem", color: "#fff",
  fontFamily: sans, outline: "none", transition: "border 0.2s", boxSizing: "border-box",
};

function focusInp(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = `${bone}66`; }
function blurInp(e: React.FocusEvent<HTMLInputElement>) { e.target.style.borderColor = `${bone}26`; }

/* ── Step badge — small ink-ring circle showing number, check, or dash ── */
function StepBadge({ n, state }: { n: number; state: "locked" | "active" | "done" }) {
  return (
    <div style={{
      width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      border: `1px solid ${state === "locked" ? "rgba(255,255,255,0.14)" : bone}`,
      background: state === "done" ? bone : "transparent",
      transition: "all 0.25s ease",
    }}>
      {state === "done" ? (
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.3 8.5L11 1" stroke={charcoalDeep} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <span style={{ fontFamily: mono, fontSize: "0.72rem", color: state === "locked" ? "rgba(255,255,255,0.25)" : bone }}>
          {state === "locked" ? "–" : String(n).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

/* ── Step row — header always visible, body only while active ── */
function StepRow({ n, title, meta, state, children }: {
  n: number; title: string; meta: string; state: "locked" | "active" | "done"; children?: React.ReactNode;
}) {
  return (
    <div style={{ padding: "16px 0", borderBottom: `1px solid ${bone}16`, opacity: state === "locked" ? 0.4 : 1, transition: "opacity 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <StepBadge n={n} state={state} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontFamily: serif, fontSize: "1rem", fontWeight: 600, color: "#fff" }}>{title}</p>
          <p style={{ margin: "1px 0 0", fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `${bone}77` }}>{meta}</p>
        </div>
      </div>
      {state === "active" && (
        <div style={{ marginTop: "14px", marginLeft: "44px" }}>{children}</div>
      )}
    </div>
  );
}

export default function WhitelistApplication() {
  const [twitter, setTwitter] = useState("");
  const [wallet, setWallet] = useState("");
  const [quoteUrl, setQuoteUrl] = useState("");
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");
  const [ready, setReady] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [twitterConfirmed, setTwitterConfirmed] = useState(false);
  const [quoteConfirmed, setQuoteConfirmed] = useState(false);
  const [walletConfirmed, setWalletConfirmed] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("inklist_application_v1");
      if (s) {
        const p = JSON.parse(s);
        setTasks(p.tasks ?? {});
        setWallet(p.wallet ?? "");
        setTwitter(p.twitter ?? "");
        setQuoteUrl(p.quoteUrl ?? "");
      }
      if (localStorage.getItem("inklist_submitted") === "true") setAlreadySubmitted(true);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("inklist_application_v1", JSON.stringify({ tasks, wallet, twitter, quoteUrl }));
  }, [tasks, wallet, twitter, quoteUrl, ready]);

  const c1 = twitterConfirmed && twitter.trim().length > 1;
  const c2 = !!tasks["like"];
  const c3 = quoteConfirmed && isValidUrl(quoteUrl);
  const c4 = walletConfirmed && isValidEvm(wallet);
  const allDone = c1 && c2 && c3 && c4;
  const doneCount = [c1, c2, c3, c4].filter(Boolean).length;

  function stateFor(done: boolean, unlocked: boolean): "locked" | "active" | "done" {
    if (done) return "done";
    if (!unlocked) return "locked";
    return "active";
  }

  async function submit() {
    if (!allDone) { setErr("Complete all four steps first."); return; }
    if (alreadySubmitted) { setErr("You have already submitted an application."); return; }
    setErr("");
    setSending(true);
    const { error: e } = await supabase
      .from("inklings")
      .insert([{ wallet: wallet.trim(), twitter: twitter.trim(), quote_url: quoteUrl.trim() }]);
    setSending(false);
    if (e) {
      setErr("Something went wrong. Try again.");
    } else {
      setSuccess(true);
      localStorage.setItem("inklist_submitted", "true");
      setAlreadySubmitted(true);
    }
  }

  const cardStyle: React.CSSProperties = {
    position: "relative", background: charcoalDeep, border: `1px solid ${bone}20`,
    borderRadius: "4px", padding: "34px 28px 30px", overflow: "hidden",
  };

  const topStripe = (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg,${washViolet},${mustard})` }} />
  );

  const folderTab = (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      background: charcoalDeep, border: `1px solid ${bone}20`, borderBottom: "none",
      borderRadius: "4px 4px 0 0", padding: "7px 16px", marginLeft: "24px",
      position: "relative", top: "1px",
    }}>
      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: allDone ? bone : `${bone}55` }} />
      <span style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${bone}99` }}>
        Case File · Ink List
      </span>
    </div>
  );

  if (alreadySubmitted && !success) {
    return (
      <div>
        {folderTab}
        <div style={cardStyle}>
          {topStripe}
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontFamily: mono, fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: bone, margin: "0 0 10px" }}>Status — Received</p>
            <h3 style={{ fontFamily: serif, fontSize: "1.5rem", fontWeight: 600, color: "#fff", margin: "0 0 10px" }}>Your file is on record.</h3>
            <p style={{ fontFamily: sans, fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6, maxWidth: "360px", marginLeft: "auto", marginRight: "auto" }}>
              Your application has already been submitted. Selected wallets will be added before mint.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        {folderTab}
        <div style={cardStyle}>
          {topStripe}
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px", border: `1px solid ${bone}55`, borderRadius: "999px",
              padding: "6px 16px", marginBottom: "16px", transform: "rotate(-2deg)",
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: bone }} />
              <span style={{ fontFamily: mono, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: bone }}>Filed for review</span>
            </div>
            <h3 style={{ fontFamily: serif, fontSize: "1.5rem", fontWeight: 600, color: "#fff", margin: "0 0 10px" }}>You're under review.</h3>
            <p style={{ fontFamily: sans, fontSize: "0.88rem", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.6, maxWidth: "360px", marginLeft: "auto", marginRight: "auto" }}>
              Selected wallets will be added before mint. No further action needed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {folderTab}
      <div style={cardStyle}>
        {topStripe}

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "16px", marginBottom: "8px" }}>
          <div>
            <h3 style={{ fontFamily: serif, fontSize: "1.4rem", fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>Claim your spot</h3>
            <p style={{ fontFamily: sans, fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", margin: 0 }}>Four steps. Selected wallets mint on OpenSea.</p>
          </div>
          <p style={{ fontFamily: mono, fontSize: "0.62rem", letterSpacing: "0.08em", color: `${bone}88`, whiteSpace: "nowrap", margin: 0 }}>{doneCount} / 4</p>
        </div>

        <div style={{ display: "flex", gap: "4px", margin: "14px 0 22px" }}>
          {[c1, c2, c3, c4].map((d, i) => (
            <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: d ? bone : `${bone}1c`, transition: "background 0.3s ease" }} />
          ))}
        </div>

        <StepRow n={1} title="Who are you?" meta="Identity" state={stateFor(c1, true)}>
          <p style={{ margin: "0 0 8px", fontFamily: mono, fontSize: "0.6rem", color: `${bone}88`, letterSpacing: "0.08em", textTransform: "uppercase" }}>Your X handle</p>
          <input
            type="text" placeholder="@yourhandle" value={twitter}
            onChange={e => setTwitter(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") setTwitterConfirmed(true); }}
            style={inp} onFocus={focusInp} onBlur={blurInp}
          />
          {twitter.trim().length > 1 && (
            <button onClick={() => setTwitterConfirmed(true)} style={btnStyle}>Confirm</button>
          )}
        </StepRow>

        <StepRow n={2} title="Like & tag two frens" meta="Social proof" state={stateFor(c2, c1)}>
          <p style={{ fontFamily: sans, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: "0 0 10px", lineHeight: 1.5 }}>
            Like the pinned post and tag two friends in the comments on X.
          </p>
          <button
            onClick={() => { window.open(PINNED_TWEET_URL, "_blank"); setTimeout(() => setTasks(p => ({ ...p, like: true })), 800); }}
            style={btnStyle}
          >
            Open pinned post
          </button>
        </StepRow>

        <StepRow n={3} title="Quote the pinned tweet" meta="Verification" state={stateFor(c3, c2)}>
          <p style={{ fontFamily: sans, fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: "0 0 10px", lineHeight: 1.5 }}>
            Quote the pinned tweet with "INKLINGS" and tag two friends, then paste the link below.
          </p>
          <button onClick={() => window.open(PINNED_TWEET_URL, "_blank")} style={{ ...btnStyle, marginBottom: "10px" }}>
            Open pinned post
          </button>
          <p style={{ margin: "0 0 6px", fontFamily: mono, fontSize: "0.6rem", color: `${bone}88`, letterSpacing: "0.08em", textTransform: "uppercase" }}>Quote tweet link</p>
          <input
            type="url" placeholder="https://x.com/yourhandle/status/..." value={quoteUrl}
            onChange={e => setQuoteUrl(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && isValidUrl(quoteUrl)) setQuoteConfirmed(true); }}
            style={inp} onFocus={focusInp} onBlur={blurInp}
          />
          {quoteUrl && !isValidUrl(quoteUrl) && <p style={{ fontFamily: sans, fontSize: "0.72rem", color: danger, margin: "5px 0 0" }}>Needs a valid http:// or https:// link.</p>}
          {isValidUrl(quoteUrl) && <button onClick={() => setQuoteConfirmed(true)} style={btnStyle}>Verify link</button>}
        </StepRow>

        <StepRow n={4} title="Claim your wallet" meta="Payout address" state={stateFor(c4, c3)}>
          <p style={{ margin: "0 0 6px", fontFamily: mono, fontSize: "0.6rem", color: `${bone}88`, letterSpacing: "0.08em", textTransform: "uppercase" }}>EVM address</p>
          <input
            type="text" placeholder="0x..." value={wallet}
            onChange={e => setWallet(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && isValidEvm(wallet)) setWalletConfirmed(true); }}
            style={inp} onFocus={focusInp} onBlur={blurInp}
          />
          {wallet && !isValidEvm(wallet) && <p style={{ fontFamily: sans, fontSize: "0.72rem", color: danger, margin: "5px 0 0" }}>That doesn't look like a valid address.</p>}
          {isValidEvm(wallet) && <button onClick={() => setWalletConfirmed(true)} style={btnStyle}>Confirm wallet</button>}
          <p style={{ fontFamily: sans, fontSize: "0.68rem", color: "rgba(255,255,255,0.22)", margin: "10px 0 0", lineHeight: 1.4 }}>Never share private keys or seed phrases.</p>
        </StepRow>

        {err && <p style={{ fontFamily: sans, fontSize: "0.82rem", color: danger, margin: "16px 0 0" }}>{err}</p>}

        <button
          onClick={submit} disabled={sending || !allDone}
          style={{
            width: "100%", marginTop: "22px",
            background: allDone ? bone : "rgba(255,255,255,0.04)",
            color: allDone ? charcoalDeep : "rgba(255,255,255,0.2)",
            border: `1px solid ${allDone ? bone : "rgba(255,255,255,0.08)"}`,
            borderRadius: "5px", padding: "15px",
            fontFamily: mono, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
            cursor: allDone && !sending ? "pointer" : "not-allowed",
            transition: "background 0.2s ease",
          }}
        >
          {sending ? "Filing…" : allDone ? "Submit application" : `Complete ${4 - doneCount} more step${4 - doneCount === 1 ? "" : "s"}`}
        </button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "transparent", color: bone, border: `1px solid ${bone}55`, borderRadius: "4px",
  padding: "8px 14px", fontFamily: mono, fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em",
  textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s ease",
};
