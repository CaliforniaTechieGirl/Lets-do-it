import { useState } from "react";
import { T, btn } from "../theme.js";
import IdeaCard from "./IdeaCard.jsx";

export default function SuggestionsPanel({ ideas, suggestions, setSuggestions, onAdd, userName, reactions, onReact }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [mode, setMode] = useState("auto");
  const [prompt, setPrompt] = useState("");

  const fetchSuggestions = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideas, customPrompt: mode === "custom" && prompt.trim() ? prompt.trim() : null }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const parsed = await res.json();
      setSuggestions(parsed.map((s, i) => ({ ...s, id: `sug-${Date.now()}-${i}`, isSuggestion: true })));
      setExpanded(null);
    } catch (e) {
      setError("Couldn't load suggestions — please try again.");
    }
    setLoading(false);
  };

  const canSubmit = !loading && (mode === "auto" || prompt.trim().length > 0);

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[{ id: "auto", label: "Suggest for me" }, { id: "custom", label: "Custom search" }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{ ...btn(mode === m.id ? "primary" : "muted"), fontSize: 12 }}>
            {m.label}
          </button>
        ))}
      </div>

      {mode === "auto" && (
        <div style={{ marginBottom: 20, padding: "14px 18px", background: T.surface, borderRadius: T.radiusMd, boxShadow: T.shadowCard }}>
          <p style={{ fontSize: 13, color: T.textMid, margin: 0, lineHeight: 1.7 }}>
            Let's Do It will look at your current list and suggest 3 new ideas that match your interests and style.
          </p>
        </div>
      )}

      {mode === "custom" && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, fontWeight: 700, marginBottom: 8 }}>
            Describe what you're looking for
          </label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && e.metaKey) fetchSuggestions(); }}
            placeholder={`Try something like:\n"A romantic date idea for this Friday night in San Francisco with live music, budget under $200"`}
            rows={4}
            style={{ width: "100%", padding: "12px 16px", fontSize: 13, border: "none", borderRadius: T.radiusMd, fontFamily: T.fontFamily, outline: "none", background: T.surfaceHighest, color: T.text, lineHeight: 1.6, resize: "vertical" }}
          />
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>Be as specific as you like — date, location, budget, occasion, vibe.</p>
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <button onClick={fetchSuggestions} disabled={!canSubmit} style={{ ...btn("primary"), fontSize: 13, padding: "10px 28px", opacity: canSubmit ? 1 : 0.5 }}>
          {loading ? "Finding ideas…" : "Find Ideas"}
        </button>
        {error && <p style={{ color: T.danger, fontSize: 12, marginTop: 10 }}>{error}</p>}
      </div>

      {suggestions.length > 0 && (
        <>
          <p style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, fontWeight: 700, marginBottom: 12 }}>
            {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {suggestions.map(s => (
              <IdeaCard key={s.id} idea={s} isOpen={expanded === s.id} onToggle={() => setExpanded(expanded === s.id ? null : s.id)} onDone={() => {}} userName={userName} reactions={reactions} onReact={onReact} onArchive={() => {}} isSuggestion={true} onAddSuggestion={onAdd} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
