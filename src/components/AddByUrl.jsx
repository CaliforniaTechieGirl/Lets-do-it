import { useState } from "react";

const FIELD_LABELS = {
  title: "Title",
  emoji: "Emoji",
  location: "Location",
  when: "When",
  cost: "Cost",
  costBadge: "Cost badge (short)",
  description: "Description",
  link: "Website link",
};

export default function AddByUrl({ onAdd }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState(null);   // parsed idea awaiting confirmation
  const [saving, setSaving] = useState(false);

  const parse = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setDraft(null);

    try {
      const res = await fetch("/api/parse-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const idea = await res.json();
      setDraft(idea);
    } catch (e) {
      setError(e.message || "Couldn't parse that URL. Try another link or fill in the details manually.");
    }
    setLoading(false);
  };

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const confirm = () => {
    if (!draft?.title) return;
    setSaving(true);
    onAdd(draft);   // parent handles id + storage + navigation
  };

  const reset = () => {
    setUrl("");
    setDraft(null);
    setError(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 400, color: "#111827", margin: "0 0 6px" }}>
          Add a new idea
        </h2>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
          Paste a link to an event, venue, or activity page. Claude will read it and fill in all the details for you. You can edit anything before saving.
        </p>
      </div>

      {/* URL input */}
      {!draft && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && parse()}
              placeholder="https://..."
              disabled={loading}
              style={{
                flex: 1, padding: "10px 14px", fontSize: 14,
                border: "1.5px solid #e5e7eb", borderRadius: 10,
                fontFamily: "Georgia, serif", outline: "none",
                background: loading ? "#f9fafb" : "#fff",
              }}
            />
            <button
              onClick={parse}
              disabled={loading || !url.trim()}
              style={{
                fontFamily: "Georgia, serif", fontSize: 13, padding: "10px 20px",
                borderRadius: 10, border: "none", cursor: loading || !url.trim() ? "not-allowed" : "pointer",
                background: loading || !url.trim() ? "#a78bfa" : "#7c3aed",
                color: "#fff", fontWeight: 600, whiteSpace: "nowrap",
                opacity: !url.trim() ? 0.6 : 1,
              }}
            >
              {loading ? "Reading…" : "Parse URL"}
            </button>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#b91c1c", marginBottom: 10 }}>
              {error}
            </div>
          )}

          <p style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
            Works best with event pages, venue websites, Eventbrite, ticketing pages, and activity booking sites.
          </p>
        </div>
      )}

      {/* Editable draft */}
      {draft && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
            <span style={{ fontSize: 20 }}>✓</span>
            <p style={{ margin: 0, fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
              Details filled in — review and edit below, then save.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            {/* Emoji + title side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8 }}>
              <Field label="Emoji" value={draft.emoji || ""} onChange={(v) => updateDraft("emoji", v)} />
              <Field label="Title" value={draft.title || ""} onChange={(v) => updateDraft("title", v)} />
            </div>

            <Field label="Location (full address)" value={draft.location || ""} onChange={(v) => updateDraft("location", v)} />
            <Field label="When" value={draft.when || ""} onChange={(v) => updateDraft("when", v)} />

            {/* Event date */}
            <div>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 700, marginBottom: 4 }}>
                Specific date (leave blank if recurring/flexible)
              </label>
              <input
                type="date"
                value={draft.eventDate || ""}
                onChange={(e) => updateDraft("eventDate", e.target.value || null)}
                style={{ padding: "8px 12px", fontSize: 13, border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "Georgia, serif", width: "100%", outline: "none" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Field label="Cost (full)" value={draft.cost || ""} onChange={(v) => updateDraft("cost", v)} />
              <Field label="Cost badge (short)" value={draft.costBadge || ""} onChange={(v) => updateDraft("costBadge", v)} placeholder="e.g. $50 for 2" />
            </div>

            <Field label="Description" value={draft.description || ""} onChange={(v) => updateDraft("description", v)} multiline />

            {/* Notes */}
            <div>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 700, marginBottom: 6 }}>
                Good to Know (one tip per line)
              </label>
              <textarea
                value={(draft.notes || []).join("\n")}
                onChange={(e) => updateDraft("notes", e.target.value.split("\n").filter(Boolean))}
                rows={4}
                style={{ width: "100%", padding: "8px 12px", fontSize: 13, border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "Georgia, serif", outline: "none", resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            {/* Tags */}
            <div>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 700, marginBottom: 6 }}>
                Tags
              </label>
              <TagPicker selected={draft.tags || []} onChange={(tags) => updateDraft("tags", tags)} />
            </div>

            <Field label="Website link" value={draft.link || ""} onChange={(v) => updateDraft("link", v)} placeholder="https://..." />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={confirm}
              disabled={saving || !draft.title}
              style={{
                fontFamily: "Georgia, serif", fontSize: 13, padding: "10px 24px",
                borderRadius: 10, border: "none",
                background: saving ? "#a78bfa" : "#7c3aed",
                color: "#fff", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Adding…" : "Add to List ✓"}
            </button>
            <button
              onClick={reset}
              style={{ fontFamily: "Georgia, serif", fontSize: 13, padding: "10px 20px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#6b7280", fontWeight: 600, cursor: "pointer" }}
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function Field({ label, value, onChange, multiline, placeholder }) {
  const style = {
    width: "100%", padding: "8px 12px", fontSize: 13,
    border: "1.5px solid #e5e7eb", borderRadius: 8,
    fontFamily: "Georgia, serif", outline: "none",
    resize: multiline ? "vertical" : "none",
    lineHeight: 1.6,
  };
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 700, marginBottom: 4 }}>
        {label}
      </label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={style} placeholder={placeholder} />
        : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={style} placeholder={placeholder} />
      }
    </div>
  );
}

const ALL_TAGS = ["Outdoor","Free","Science","Nighttime","Indoor","Music","Adventure","Classical","Water","Active","Hiking","Art","Splurge"];

const TAG_COLORS = {
  Outdoor:{bg:"#dcfce7",text:"#16a34a"},Free:{bg:"#fef9c3",text:"#a16207"},Science:{bg:"#dbeafe",text:"#1d4ed8"},
  Nighttime:{bg:"#f3e8ff",text:"#7e22ce"},Indoor:{bg:"#f1f5f9",text:"#475569"},Music:{bg:"#fce7f3",text:"#be185d"},
  Adventure:{bg:"#d1fae5",text:"#065f46"},Classical:{bg:"#ede9fe",text:"#6d28d9"},Water:{bg:"#cffafe",text:"#0e7490"},
  Active:{bg:"#fef3c7",text:"#b45309"},Hiking:{bg:"#d1fae5",text:"#065f46"},Art:{bg:"#fce7f3",text:"#be185d"},Splurge:{bg:"#fef2f2",text:"#b91c1c"},
};

function TagPicker({ selected, onChange }) {
  const toggle = (tag) => {
    onChange(selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag]);
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {ALL_TAGS.map((tag) => {
        const c = TAG_COLORS[tag] || { bg: "#f1f5f9", text: "#475569" };
        const on = selected.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            style={{
              fontFamily: "Georgia, serif", fontSize: 11, fontWeight: 600,
              padding: "3px 10px", borderRadius: 20, cursor: "pointer",
              background: on ? c.bg : "#f9fafb",
              color: on ? c.text : "#9ca3af",
              border: `1px solid ${on ? c.bg : "#e5e7eb"}`,
              letterSpacing: "0.05em", textTransform: "uppercase",
              transition: "all 0.1s",
            }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
