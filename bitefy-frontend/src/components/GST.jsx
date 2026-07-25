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
  green: "#3DAA6D",
  red: "#D9534F",
};

const API = "https://bitefy-backend.onrender.com";

// ── number → Indian words (for the "amount in words" line) ──
function numberToWords(amount) {
  const num = Math.floor(amount);
  const paise = Math.round((amount - num) * 100);
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const twoDigits = (n) => (n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : ""));
  const threeDigits = (n) => {
    const h = Math.floor(n / 100);
    const rest = n % 100;
    let s = "";
    if (h) s += ones[h] + " Hundred";
    if (rest) s += (h ? " " : "") + twoDigits(rest);
    return s;
  };
  if (num === 0 && paise === 0) return "Zero Rupees Only";
  let words = "";
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = num % 1000;
  if (crore) words += threeDigits(crore) + " Crore ";
  if (lakh) words += twoDigits(lakh) + " Lakh ";
  if (thousand) words += twoDigits(thousand) + " Thousand ";
  if (hundred) words += threeDigits(hundred);
  words = words.trim() + " Rupees";
  if (paise) words += " and " + twoDigits(paise) + " Paise";
  return words + " Only";
}

function GST({ onBack }) {
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // ── café GST config (persisted to backend) ───────────────
  const [gstin, setGstin] = useState("");
  const [legalName, setLegalName] = useState("");
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [gstPercent, setGstPercent] = useState("");

  // ── current invoice being built (not persisted) ──────────
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [buyerName, setBuyerName] = useState("");
  const [buyerGstin, setBuyerGstin] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [supplyType, setSupplyType] = useState("intra"); // intra = CGST+SGST, inter = IGST
  const [lineItems, setLineItems] = useState([
    { desc: "", hsn: "", qty: 1, rate: "" },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`${API}/api/restaurants/my_restaurant/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setRestaurant(data);
        setGstin(data.gstin || "");
        setLegalName(data.gst_legal_name || data.name || "");
        setAddress(data.gst_address || "");
        setStateName(data.gst_state || "");
        setGstPercent(data.gst_percent || "");
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const saveConfig = () => {
    const token = localStorage.getItem("access_token");
    setIsSaving(true);
    fetch(`${API}/api/restaurants/${restaurant.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        gstin,
        gst_legal_name: legalName,
        gst_address: address,
        gst_state: stateName,
        gst_percent: gstPercent || null,
      }),
    })
      .then((r) => r.json())
      .then(() => {
        setIsSaving(false);
        alert("GST details saved.");
      })
      .catch(() => {
        setIsSaving(false);
        alert("Couldn't save GST details.");
      });
  };

  // ── line-item helpers ─────────────────────────────────────
  const updateItem = (i, field, value) => {
    setLineItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, [field]: value } : it)),
    );
  };
  const addItem = () =>
    setLineItems((prev) => [...prev, { desc: "", hsn: "", qty: 1, rate: "" }]);
  const removeItem = (i) =>
    setLineItems((prev) => prev.filter((_, idx) => idx !== i));

  // ── live totals ───────────────────────────────────────────
  const rate = parseFloat(gstPercent) || 0;
  const taxable = lineItems.reduce(
    (sum, it) => sum + (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0),
    0,
  );
  const taxAmount = (taxable * rate) / 100;
  const cgst = taxAmount / 2;
  const sgst = taxAmount / 2;
  const grandTotal = taxable + taxAmount;

  const stateCode = gstin.slice(0, 2); // first 2 chars of a GSTIN are the state code

  // ── build + print the invoice ─────────────────────────────
  const generateInvoice = () => {
    if (!gstin || gstin.length !== 15) {
      alert("Please enter a valid 15-character GSTIN in the GST details above first.");
      return;
    }
    if (!invoiceNo.trim()) {
      alert("Please enter an invoice number.");
      return;
    }
    if (taxable <= 0) {
      alert("Please add at least one line item with a quantity and rate.");
      return;
    }

    const rows = lineItems
      .filter((it) => it.desc && parseFloat(it.rate) > 0)
      .map((it, i) => {
        const amt = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
        return `
          <tr>
            <td style="text-align:center">${i + 1}</td>
            <td>${it.desc}</td>
            <td style="text-align:center">${it.hsn || "-"}</td>
            <td style="text-align:center">${it.qty}</td>
            <td style="text-align:right">${(parseFloat(it.rate) || 0).toFixed(2)}</td>
            <td style="text-align:right">${amt.toFixed(2)}</td>
          </tr>`;
      })
      .join("");

    const taxRows =
      supplyType === "intra"
        ? `
          <tr><td>CGST @ ${(rate / 2).toFixed(2)}%</td><td style="text-align:right">₹${cgst.toFixed(2)}</td></tr>
          <tr><td>SGST @ ${(rate / 2).toFixed(2)}%</td><td style="text-align:right">₹${sgst.toFixed(2)}</td></tr>`
        : `<tr><td>IGST @ ${rate.toFixed(2)}%</td><td style="text-align:right">₹${taxAmount.toFixed(2)}</td></tr>`;

    const html = `
      <html><head><title>Tax Invoice ${invoiceNo}</title>
      <style>
        * { font-family: Arial, sans-serif; color: #1a1a1a; box-sizing: border-box; }
        body { padding: 32px; max-width: 800px; margin: 0 auto; }
        .title { text-align:center; font-size: 20px; font-weight: bold; letter-spacing: 1px; margin-bottom: 4px; }
        .sub { text-align:center; font-size: 12px; color:#666; margin-bottom: 20px; }
        .box { border: 1px solid #333; }
        .row { display:flex; }
        .cell { flex:1; padding: 10px 12px; border-right: 1px solid #333; }
        .cell:last-child { border-right: none; }
        .brow { border-bottom: 1px solid #333; }
        .lbl { font-size: 10px; text-transform: uppercase; color:#777; letter-spacing:.5px; margin-bottom:3px; }
        .val { font-size: 13px; font-weight: 600; }
        .small { font-size: 12px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-top: 0; }
        th { background:#f2f2f2; font-size: 11px; text-transform:uppercase; padding: 8px; border: 1px solid #333; }
        td { font-size: 12px; padding: 7px 8px; border: 1px solid #333; }
        .totals { width: 55%; margin-left:auto; margin-top: -1px; }
        .totals td { border:1px solid #333; }
        .grand { font-weight: bold; font-size: 14px; background:#f2f2f2; }
        .words { margin-top: 14px; font-size: 12px; }
        .sign { margin-top: 50px; text-align:right; font-size: 12px; }
        @media print { body { padding: 0; } }
      </style></head><body>
        <div class="title">TAX INVOICE</div>
        <div class="sub">Original for Recipient</div>

        <div class="box">
          <div class="row brow">
            <div class="cell">
              <div class="val" style="font-size:15px">${legalName || restaurant?.name || ""}</div>
              <div class="small">${address || ""}</div>
              <div class="small">${stateName ? "State: " + stateName + " (" + stateCode + ")" : ""}</div>
              <div class="small"><b>GSTIN:</b> ${gstin}</div>
            </div>
          </div>
          <div class="row brow">
            <div class="cell"><div class="lbl">Invoice No</div><div class="val">${invoiceNo}</div></div>
            <div class="cell"><div class="lbl">Invoice Date</div><div class="val">${invoiceDate}</div></div>
            <div class="cell"><div class="lbl">Supply Type</div><div class="val">${supplyType === "intra" ? "Intra-State" : "Inter-State"}</div></div>
          </div>
          <div class="row">
            <div class="cell">
              <div class="lbl">Bill To</div>
              <div class="val">${buyerName || "-"}</div>
              <div class="small">${buyerAddress || ""}</div>
              <div class="small">${buyerGstin ? "<b>GSTIN:</b> " + buyerGstin : ""}</div>
            </div>
          </div>
        </div>

        <table>
          <thead><tr>
            <th style="width:6%">#</th><th>Description</th><th style="width:14%">HSN/SAC</th>
            <th style="width:8%">Qty</th><th style="width:16%">Rate (₹)</th><th style="width:18%">Amount (₹)</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>

        <table class="totals">
          <tr><td>Taxable Value</td><td style="text-align:right">₹${taxable.toFixed(2)}</td></tr>
          ${taxRows}
          <tr class="grand"><td>Total</td><td style="text-align:right">₹${grandTotal.toFixed(2)}</td></tr>
        </table>

        <div class="words"><b>Amount in words:</b> ${numberToWords(grandTotal)}</div>

        <div class="sign">
          For <b>${legalName || restaurant?.name || ""}</b><br/><br/><br/>
          Authorised Signatory
        </div>

        <script>window.onload = function(){ window.print(); }</script>
      </body></html>`;

    const w = window.open("", "_blank");
    if (!w) {
      alert("Please allow pop-ups to generate the invoice.");
      return;
    }
    w.document.write(html);
    w.document.close();
  };

  // ── styles ────────────────────────────────────────────────
  const page = {
    width: "100%",
    minHeight: "100%",
    background: C.bg,
    borderRadius: "10px",
    padding: "28px 32px 40px",
    boxSizing: "border-box",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: C.ink,
    overflowY: "auto",
  };
  const eyebrow = { textTransform: "uppercase", letterSpacing: "0.09em", fontSize: "11px", fontWeight: 700, color: C.muted, margin: 0 };
  const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "24px 26px", maxWidth: "760px", marginBottom: "22px" };
  const group = { marginBottom: "18px" };
  const label = { display: "block", fontSize: "13px", fontWeight: 700, color: C.ink, marginBottom: "7px" };
  const input = { width: "100%", padding: "11px 13px", border: `1px solid ${C.border}`, borderRadius: "10px", fontSize: "14px", boxSizing: "border-box", background: C.bg, color: C.ink, outline: "none" };
  const helper = { fontSize: "12px", color: C.muted, marginTop: "6px" };
  const primaryBtn = { background: `linear-gradient(135deg, ${C.accent}, #FF6F3C)`, color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: 700, fontSize: "15px", boxShadow: "0 6px 16px rgba(255,140,66,0.28)" };
  const ghostBtn = { background: "transparent", border: `1px solid ${C.border}`, borderRadius: "10px", padding: "10px 16px", fontWeight: 700, fontSize: "14px", color: C.ink, cursor: "pointer" };

  if (isLoading)
    return (
      <div style={page}>
        <p style={{ color: C.muted }}>Loading…</p>
      </div>
    );

  return (
    <div style={page}>
      <style>{`.bf-input:focus { border-color: ${C.accent} !important; background:#fff !important; }`}</style>

      {/* header + back */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
        <button style={ghostBtn} onClick={onBack}>← Back</button>
        <div>
          <p style={eyebrow}>Tax</p>
          <h1 style={{ margin: "2px 0 0", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.02em" }}>
            GST Invoicing
          </h1>
        </div>
      </div>

      {/* ── GST details (saved) ── */}
      <div style={card}>
        <p style={{ ...eyebrow, marginBottom: "16px" }}>Your GST details</p>

        <div style={group}>
          <label style={label}>GSTIN</label>
          <input className="bf-input" style={input} value={gstin} maxLength={15}
            onChange={(e) => setGstin(e.target.value.toUpperCase())} placeholder="e.g., 22AAAAA0000A1Z5" />
          <p style={helper}>
            Your 15-character GST number.
            {gstin && gstin.length !== 15 && <span style={{ color: C.red }}> Must be exactly 15 characters.</span>}
            {gstin.length === 15 && <span style={{ color: C.green }}> ✓ Looks valid (State code {stateCode})</span>}
          </p>
        </div>

        <div style={group}>
          <label style={label}>Registered Business Name</label>
          <input className="bf-input" style={input} value={legalName}
            onChange={(e) => setLegalName(e.target.value)} placeholder="Legal name as per GST registration" />
        </div>

        <div style={group}>
          <label style={label}>Business Address</label>
          <input className="bf-input" style={input} value={address}
            onChange={(e) => setAddress(e.target.value)} placeholder="Registered address" />
        </div>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ ...group, flex: 1, minWidth: "180px" }}>
            <label style={label}>State</label>
            <input className="bf-input" style={input} value={stateName}
              onChange={(e) => setStateName(e.target.value)} placeholder="e.g., Chhattisgarh" />
          </div>
          <div style={{ ...group, flex: 1, minWidth: "180px" }}>
            <label style={label}>GST Rate (%)</label>
            <input className="bf-input" style={input} type="number" value={gstPercent}
              onChange={(e) => setGstPercent(e.target.value)} placeholder="e.g., 5" />
            <p style={helper}>Confirm your applicable rate with your accountant.</p>
          </div>
        </div>

        <button style={{ ...primaryBtn, opacity: isSaving ? 0.6 : 1 }} onClick={saveConfig} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save GST details"}
        </button>
      </div>

      {/* ── build an invoice ── */}
      <div style={card}>
        <p style={{ ...eyebrow, marginBottom: "16px" }}>Create an invoice</p>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ ...group, flex: 1, minWidth: "180px" }}>
            <label style={label}>Invoice Number</label>
            <input className="bf-input" style={input} value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)} placeholder="e.g., INV-001" />
            <p style={helper}>Use your own sequential numbering.</p>
          </div>
          <div style={{ ...group, flex: 1, minWidth: "180px" }}>
            <label style={label}>Invoice Date</label>
            <input className="bf-input" style={input} type="date" value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)} />
          </div>
        </div>

        <div style={group}>
          <label style={label}>Bill To (Buyer Name)</label>
          <input className="bf-input" style={input} value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)} placeholder="e.g., IIT Bhilai" />
        </div>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ ...group, flex: 1, minWidth: "180px" }}>
            <label style={label}>Buyer GSTIN (optional)</label>
            <input className="bf-input" style={input} value={buyerGstin} maxLength={15}
              onChange={(e) => setBuyerGstin(e.target.value.toUpperCase())} placeholder="If the institute is GST-registered" />
          </div>
          <div style={{ ...group, flex: 1, minWidth: "180px" }}>
            <label style={label}>Supply Type</label>
            <select className="bf-input" style={input} value={supplyType} onChange={(e) => setSupplyType(e.target.value)}>
              <option value="intra">Intra-State (CGST + SGST)</option>
              <option value="inter">Inter-State (IGST)</option>
            </select>
            <p style={helper}>Same state as buyer → intra-state.</p>
          </div>
        </div>

        <div style={group}>
          <label style={label}>Buyer Address (optional)</label>
          <input className="bf-input" style={input} value={buyerAddress}
            onChange={(e) => setBuyerAddress(e.target.value)} placeholder="Institute address" />
        </div>

        {/* line items */}
        <label style={label}>Items</label>
        {lineItems.map((it, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <input className="bf-input" style={{ ...input, flex: 3, minWidth: "140px" }} value={it.desc}
              onChange={(e) => updateItem(i, "desc", e.target.value)} placeholder="Description" />
            <input className="bf-input" style={{ ...input, flex: 1, minWidth: "80px" }} value={it.hsn}
              onChange={(e) => updateItem(i, "hsn", e.target.value)} placeholder="HSN/SAC" />
            <input className="bf-input" style={{ ...input, width: "70px" }} type="number" value={it.qty}
              onChange={(e) => updateItem(i, "qty", e.target.value)} placeholder="Qty" />
            <input className="bf-input" style={{ ...input, width: "90px" }} type="number" value={it.rate}
              onChange={(e) => updateItem(i, "rate", e.target.value)} placeholder="Rate" />
            {lineItems.length > 1 && (
              <button style={{ ...ghostBtn, color: C.red, borderColor: C.red, padding: "10px 12px" }} onClick={() => removeItem(i)}>✕</button>
            )}
          </div>
        ))}
        <button style={{ ...ghostBtn, marginBottom: "18px" }} onClick={addItem}>+ Add item</button>

        {/* live totals */}
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "16px 18px", marginBottom: "18px" }}>
          <Row label="Taxable Value" value={taxable} />
          {supplyType === "intra" ? (
            <>
              <Row label={`CGST @ ${(rate / 2).toFixed(2)}%`} value={cgst} />
              <Row label={`SGST @ ${(rate / 2).toFixed(2)}%`} value={sgst} />
            </>
          ) : (
            <Row label={`IGST @ ${rate.toFixed(2)}%`} value={taxAmount} />
          )}
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: "8px", paddingTop: "8px" }}>
            <Row label="Total" value={grandTotal} bold />
          </div>
        </div>

        <button style={primaryBtn} onClick={generateInvoice}>Generate Invoice (Print / Save PDF)</button>
      </div>

      <p style={{ fontSize: "12px", color: C.muted, maxWidth: "760px", lineHeight: 1.6 }}>
        Note: This generates a standard GST tax invoice. Please have your accountant confirm the
        first invoice before sharing it officially — tax formats and rates vary by business.
      </p>
    </div>
  );
}

// small total row
function Row({ label, value, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: bold ? "16px" : "14px", fontWeight: bold ? 800 : 500, color: bold ? "#E8722A" : "#2A2118" }}>
      <span>{label}</span>
      <span>₹{(value || 0).toFixed(2)}</span>
    </div>
  );
}

export default GST;
