import { useState, useEffect } from "react";

// ── Design tokens (matches the dashboard) ──────────────────
const C = {
  bg: "#FBF8F4",
  surface: "#FFFFFF",
  ink: "#2A2118",
  muted: "#9B9389",
  border: "#EFE7DD",
  accent: "#FF8C42",
  accentDeep: "#E8722A",
  accentTint: "#FFF1E6",
  green: "#3DAA6D",
};

const API = "https://bitefy-backend.onrender.com";

// 🔧 Your live customer-facing domain. Change here if it ever moves.
const SITE = "https://bitefy.in";

function QROrders({ onBack }) {
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/restaurants/my_restaurant/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setRestaurant(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const slug = restaurant?.slug || "";
  const orderUrl = `${SITE}/order/${slug}`;
  // zero-dependency QR image (encodes the order URL)
  const qrSrc = (size) =>
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=0&data=${encodeURIComponent(orderUrl)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(orderUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  // ── print a full standee ──────────────────────────────────
  const printStandee = () => {
    const name = restaurant?.name || "Our Restaurant";
    const html = `
      <html><head><title>${name} — Scan to Order</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; font-family: 'Segoe UI', Arial, sans-serif; }
        body { display:flex; justify-content:center; padding:24px; background:#fff; }
        .standee { width: 460px; border:1px solid #eee; border-radius:28px; overflow:hidden;
          box-shadow:0 20px 50px rgba(0,0,0,0.10); }
        .top { background:linear-gradient(135deg,#FF8C42,#E8722A); color:#fff; text-align:center; padding:26px 20px 22px; }
        .brand { font-size:30px; font-weight:800; letter-spacing:-0.5px; }
        .tag { font-size:12px; letter-spacing:3px; font-weight:700; opacity:.95; margin-top:4px; }
        .body { padding:26px 26px 22px; text-align:center; }
        .eyebrow { font-size:12px; letter-spacing:2px; text-transform:uppercase; color:#9B9389; font-weight:700; }
        .rname { font-size:26px; font-weight:800; color:#2A2118; margin:4px 0 18px; letter-spacing:-0.5px; }
        .scan { font-size:15px; font-weight:800; letter-spacing:3px; color:#E8722A; margin-bottom:16px; }
        .qrwrap { position:relative; width:250px; height:250px; margin:0 auto; padding:14px;
          background:#fff; border-radius:18px; }
        .qrwrap img { width:100%; height:100%; display:block; }
        .br { position:absolute; width:28px; height:28px; border:4px solid #FF8C42; }
        .tl { top:0; left:0; border-right:none; border-bottom:none; border-radius:10px 0 0 0; }
        .tr { top:0; right:0; border-left:none; border-bottom:none; border-radius:0 10px 0 0; }
        .bl { bottom:0; left:0; border-right:none; border-top:none; border-radius:0 0 0 10px; }
        .brr{ bottom:0; right:0; border-left:none; border-top:none; border-radius:0 0 10px 0; }
        .steps { display:flex; justify-content:space-between; gap:8px; margin:22px 4px 6px; }
        .step { flex:1; }
        .stepIcon { font-size:26px; }
        .stepTxt { font-size:11px; color:#6b6560; font-weight:600; margin-top:5px; line-height:1.3; }
        .badge { display:inline-block; margin-top:16px; background:#FFF1E6; color:#E8722A;
          font-size:12px; font-weight:800; padding:8px 16px; border-radius:999px; }
        .foot { background:#FBF8F4; border-top:1px solid #EFE7DD; padding:14px; text-align:center; }
        .url { font-size:12px; color:#2A2118; font-weight:700; word-break:break-all; }
        .powered { font-size:10px; color:#9B9389; margin-top:4px; letter-spacing:1px; }
      </style></head><body>
        <div class="standee">
          <div class="top">
            <div class="brand">🍔 Bitefy</div>
            <div class="tag">SCAN • ORDER • ENJOY</div>
          </div>
          <div class="body">
            <div class="eyebrow">Welcome to</div>
            <div class="rname">${name}</div>
            <div class="scan">SCAN TO ORDER</div>
            <div class="qrwrap">
              <span class="br tl"></span><span class="br tr"></span>
              <span class="br bl"></span><span class="br brr"></span>
              <img src="${qrSrc(800)}" alt="QR" />
            </div>
            <div class="steps">
              <div class="step"><div class="stepIcon">📷</div><div class="stepTxt">Scan the code</div></div>
              <div class="step"><div class="stepIcon">🍽️</div><div class="stepTxt">Pick your food</div></div>
              <div class="step"><div class="stepIcon">📱</div><div class="stepTxt">Pay &amp; track</div></div>
            </div>
            <div class="badge">📱 No app needed</div>
          </div>
          <div class="foot">
            <div class="url">${orderUrl}</div>
            <div class="powered">POWERED BY BITEFY</div>
          </div>
        </div>
        <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); }</script>
      </body></html>`;
    const w = window.open("", "_blank");
    if (!w) {
      alert("Please allow pop-ups to print the QR standee.");
      return;
    }
    w.document.write(html);
    w.document.close();
  };

  // ── styles ────────────────────────────────────────────────
  const page = {
    width: "100%", minHeight: "100%", background: C.bg, borderRadius: "10px",
    padding: "28px 32px 40px", boxSizing: "border-box",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink, overflowY: "auto",
  };
  const eyebrow = { textTransform: "uppercase", letterSpacing: "0.09em", fontSize: "11px", fontWeight: 700, color: C.muted, margin: 0 };
  const ghostBtn = { background: "transparent", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "10px 16px", fontWeight: 700, fontSize: "14px", color: C.ink, cursor: "pointer" };
  const primaryBtn = { background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`, color: "white", border: "none", padding: "13px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "15px", boxShadow: "0 6px 16px rgba(255,140,66,0.28)" };
  const bracket = (pos) => {
    const base = { position: "absolute", width: "26px", height: "26px", border: `4px solid ${C.accent}` };
    if (pos === "tl") return { ...base, top: 0, left: 0, borderRight: "none", borderBottom: "none", borderRadius: "10px 0 0 0" };
    if (pos === "tr") return { ...base, top: 0, right: 0, borderLeft: "none", borderBottom: "none", borderRadius: "0 10px 0 0" };
    if (pos === "bl") return { ...base, bottom: 0, left: 0, borderRight: "none", borderTop: "none", borderRadius: "0 0 0 10px" };
    return { ...base, bottom: 0, right: 0, borderLeft: "none", borderTop: "none", borderRadius: "0 0 10px 0" };
  };

  if (isLoading)
    return <div style={page}><p style={{ color: C.muted }}>Loading…</p></div>;

  return (
    <div style={page}>
      {/* header + back */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
        <button style={ghostBtn} onClick={onBack}>← Back</button>
        <div>
          <p style={eyebrow}>Customer</p>
          <h1 style={{ margin: "2px 0 0", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            QR Ordering
          </h1>
        </div>
      </div>

      <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* ── the standee preview ── */}
        <div style={{ width: "380px", maxWidth: "100%", borderRadius: "26px", overflow: "hidden", boxShadow: "0 20px 50px rgba(42,33,24,0.14)", border: `1px solid ${C.border}` }}>
          {/* top band */}
          <div style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentDeep})`, color: "#fff", textAlign: "center", padding: "24px 20px 20px" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>🍔 Bitefy</div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", fontWeight: 700, opacity: 0.95, marginTop: "4px" }}>
              SCAN • ORDER • ENJOY
            </div>
          </div>

          {/* body */}
          <div style={{ background: "#fff", padding: "24px 24px 20px", textAlign: "center" }}>
            <div style={{ ...eyebrow, fontSize: "11px" }}>Welcome to</div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: C.ink, margin: "4px 0 16px", letterSpacing: "-0.5px" }}>
              {restaurant?.name || "Our Restaurant"}
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "3px", color: C.accentDeep, marginBottom: "14px" }}>
              SCAN TO ORDER
            </div>

            {/* QR with corner brackets */}
            <div style={{ position: "relative", width: "220px", height: "220px", margin: "0 auto", padding: "12px", background: "#fff" }}>
              <span style={bracket("tl")} />
              <span style={bracket("tr")} />
              <span style={bracket("bl")} />
              <span style={bracket("br")} />
              {slug ? (
                <img src={qrSrc(400)} alt="Order QR" style={{ width: "100%", height: "100%", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: "13px", textAlign: "center", padding: "20px" }}>
                  Set your restaurant slug in Settings to generate the QR
                </div>
              )}
            </div>

            {/* steps */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", margin: "20px 4px 4px" }}>
              {[["📷", "Scan the code"], ["🍽️", "Pick your food"], ["📱", "Pay & track"]].map(([icon, txt]) => (
                <div key={txt} style={{ flex: 1 }}>
                  <div style={{ fontSize: "24px" }}>{icon}</div>
                  <div style={{ fontSize: "11px", color: "#6b6560", fontWeight: 600, marginTop: "5px", lineHeight: 1.3 }}>{txt}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "inline-block", marginTop: "14px", background: C.accentTint, color: C.accentDeep, fontSize: "12px", fontWeight: 800, padding: "8px 16px", borderRadius: "999px" }}>
              📱 No app needed
            </div>
          </div>

          {/* footer */}
          <div style={{ background: C.bg, borderTop: `1px solid ${C.border}`, padding: "13px", textAlign: "center" }}>
            <div style={{ fontSize: "12px", color: C.ink, fontWeight: 700, wordBreak: "break-all" }}>{orderUrl}</div>
            <div style={{ fontSize: "10px", color: C.muted, marginTop: "3px", letterSpacing: "1px" }}>POWERED BY BITEFY</div>
          </div>
        </div>

        {/* ── actions ── */}
        <div style={{ flex: 1, minWidth: "260px" }}>
          <p style={{ ...eyebrow, marginBottom: "10px" }}>Share your menu</p>
          <p style={{ fontSize: "14px", color: C.muted, lineHeight: 1.6, marginTop: 0 }}>
            Print this standee and place it on your tables or counter. Customers scan it,
            see your menu, and order straight from their phone — no app to download.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px", marginTop: "18px" }}>
            <button style={primaryBtn} onClick={printStandee} disabled={!slug}>
              <i className="fa-solid fa-print" style={{ marginRight: "8px" }}></i>
              Print QR Standee
            </button>

            <button style={ghostBtn} onClick={copyLink} disabled={!slug}>
              <i className={`fa-solid ${copied ? "fa-check" : "fa-link"}`} style={{ marginRight: "8px" }}></i>
              {copied ? "Link copied!" : "Copy order link"}
            </button>

            <a
              href={slug ? qrSrc(1000) : undefined}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...ghostBtn, textAlign: "center", textDecoration: "none", display: "block", opacity: slug ? 1 : 0.5, pointerEvents: slug ? "auto" : "none" }}
            >
              <i className="fa-solid fa-image" style={{ marginRight: "8px" }}></i>
              Download QR image
            </a>
          </div>

          <p style={{ fontSize: "12px", color: C.muted, marginTop: "18px", lineHeight: 1.6 }}>
            Tip: print a few and place one on every table. You can also add it to your
            entrance or billing counter.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QROrders;
