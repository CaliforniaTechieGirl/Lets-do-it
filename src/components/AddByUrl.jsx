import { useState } from "react";
import { T, TAG_COLORS, btn } from "../theme.js";

const ALL_TAGS = ["Outdoor","Free","Science","Nighttime","Indoor","Music","Adventure","Classical","Water","Active","Hiking","Art","Splurge"];

export default function AddByUrl({ onAdd }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState(null);

  const parse = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true); setError(null); setDraft(null);
    try {
      const res = await fetch("/api/parse-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: trimmed }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `Error ${res.status}`); }
      setDraft(await res.json());
    } catch (e) {
      setError(e.message || "Couldn't parse that URL. Try a different link.");
    }
    setLoading(false);
  };

  const update = (field, value) => setDraft(prev => ({ ...prev, [field]: value }));

  const inputStyle = { width: "100%", padding: "9px 12px", fontSize: 13, border: `1px solid ${T.border}`, borderRadius: T.radius, fontFamily: T.fontFamily, outline: "none", background: T.surface, color: T.text, lineHeight: 1.5 };
  const labelStyle = { display: "block", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, fontWeight: 600, marginBottom: 4 };

  return (
    <div>
      <h2 style={{ fontSize: 17, fontWeight: 600, color: T.text, margin: "0 0 6px", letterSpacing: "-0.01em" }}>Add a new idea</h2>
      <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.65, margin: "0 0 22px" }}>
        Paste a link to an event, venue, or activity page. Let's Do It will read it and fill in the details automatically.
      </p>

      {!draft && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && parse()} placeholder="https://…" disabled={loading} style={{ ...inputStyle, flex: 1 }} />
            <button onClick={parse} disabled={loading || !url.trim()} style={{ ...btn(), background: loading || !url.trim() ? T.accentMid : T.accent, color: "#fff", border: "none", padding: "9px 20px", opacity: !url.trim() ? 0.6 : 1, whiteSpace: "nowrap", fontWeight: 600 }}>
              {loading ? "Reading…" : "Parse URL"}
            </button>
          </div>
          {error && <div style={{ padding: "10px 14px", background: T.dangerBg, border: `1px solid ${T.dangerBorder}`, borderRadius: T.radius, fontSize: 13, color: T.danger, marginBottom: 10 }}>{error}</div>}
          <p style={{ fontSize: 12, color: T.textMuted, fontStyle: "italic" }}>Works best with event pages, Eventbrite, ticketing sites, and venue websites.</p>
        </div>
      )}

      {draft && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "10px 14px", background: T.successBg, border: `1px solid ${T.successBorder}`, borderRadius: T.radiusMd }}>
            <span style={{ fontSize: 16 }}>✓</span>
            <p style={{ margin: 0, fontSize: 13, color: T.success, fontWeight: 500 }}>Details filled in — review and edit, then save.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 22 }}>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8 }}>
              <div><label style={labelStyle}>Emoji</label><input value={draft.emoji||""} onChange={e=>update("emoji",e.target.value)} style={inputStyle}/></div>
              <div><label style={labelStyle}>Title</label><input value={draft.title||""} onChange={e=>update("title",e.target.value)} style={inputStyle}/></div>
            </div>
            <div><label style={labelStyle}>Location</label><input value={draft.location||""} onChange={e=>update("location",e.target.value)} style={inputStyle}/></div>
            <div><label style={labelStyle}>When</label><input value={draft.when||""} onChange={e=>update("when",e.target.value)} style={inputStyle}/></div>
            <div>
              <label style={labelStyle}>Specific date (leave blank if recurring)</label>
              <input type="date" value={draft.eventDate||""} onChange={e=>update("eventDate",e.target.value||null)} style={inputStyle}/>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><label style={labelStyle}>Cost</label><input value={draft.cost||""} onChange={e=>update("cost",e.target.value)} style={inputStyle}/></div>
              <div><label style={labelStyle}>Cost badge (short)</label><input value={draft.costBadge||""} onChange={e=>update("costBadge",e.target.value)} placeholder="e.g. $50 for 2" style={inputStyle}/></div>
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea value={draft.description||""} onChange={e=>update("description",e.target.value)} rows={3} style={{...inputStyle, resize:"vertical"}}/>
            </div>
            <div>
              <label style={labelStyle}>Good to Know (one tip per line)</label>
              <textarea value={(draft.notes||[]).join("\n")} onChange={e=>update("notes",e.target.value.split("\n").filter(Boolean))} rows={4} style={{...inputStyle, resize:"vertical"}}/>
            </div>
            <div>
              <label style={labelStyle}>Tags</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
                {ALL_TAGS.map(tag => {
                  const c = TAG_COLORS[tag] || { bg: T.surfaceAlt, text: T.textMid, border: T.border };
                  const on = (draft.tags||[]).includes(tag);
                  return (
                    <button key={tag} onClick={() => update("tags", on ? (draft.tags||[]).filter(t=>t!==tag) : [...(draft.tags||[]),tag])} style={{ ...btn(), fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", background: on ? c.bg : T.surface, color: on ? c.text : T.textMuted, border: `1px solid ${on ? c.border : T.border}`, padding: "3px 9px", borderRadius: 20 }}>
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
            <div><label style={labelStyle}>Website link</label><input type="url" value={draft.link||""} onChange={e=>update("link",e.target.value)} placeholder="https://…" style={inputStyle}/></div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { if(draft.title) onAdd(draft); }} disabled={!draft.title} style={{ ...btn(), background: T.accent, color: "#fff", border: "none", padding: "10px 24px", fontWeight: 600, opacity: !draft.title ? 0.6 : 1 }}>
              Add to List
            </button>
            <button onClick={() => { setDraft(null); setUrl(""); setError(null); }} style={{ ...btn(), padding: "10px 18px" }}>
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
