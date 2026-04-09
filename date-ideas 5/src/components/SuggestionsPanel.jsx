import { useState } from "react";
import { T } from "../theme.js";
import IdeaCard from "./IdeaCard.jsx";

export default function SuggestionsPanel({ ideas, suggestions, setSuggestions, onAdd, userName, reactions, onReact }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [mode, setMode] = useState("auto");       // "auto" | "custom"
  const [prompt, setPrompt] = useState("");

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideas,
          customPrompt: mode === "custom" && prompt.trim() ? prompt.trim() : null,
        }),
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
      <div style={{ display: "flex", gap: 0, marginBottom: 20, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, overflow: "hidden" }}>
        {[
          { id: "auto",   label: "Suggest for me" },
          { id: "custom", label: "Custom search" },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{ flex: 1, fontFamily: T.fontFamily, fontSize: 13, padding: "10px 0", background: mode === m.id ? T.accent : T.surface, color: mode === m.id ? "#fff" : T.textMid, border: "none", fontWeight: mode === m.id ? 600 : 400, cursor: "pointer", letterSpacing: "0.01em", transition: "all 0.15s" }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Auto mode */}
      {mode === "auto" && (
        <div style={{ marginBottom: 20, padding: "14px 16px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusMd }}>
          <p style={{ fontSize: 13, color: T.textMid, margin: 0, lineHeight: 1.7 }}>
            Let's Do It will look at your current list and suggest 3 new ideas that match your interests and style.
          </p>
        </div>
      )}

      {/* Custom mode */}
      {mode === "custom" && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, fontWeight: 600, marginBottom: 8 }}>
            Describe what you're looking for
          </label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && e.metaKey) fetchSuggestions(); }}
            placeholder={`Try something like:\n"A romantic date idea for this Friday night in San Francisco with live music, budget under $200"\n\nor\n\n"Something active outdoors we can do on a Sunday morning near Palo Alto"`}
            rows={5}
            style={{ width: "100%", padding: "11px 14px", fontSize: 13, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, fontFamily: T.fontFamily, outline: "none", background: T.surface, color: T.text, lineHeight: 1.6, resize: "vertical" }}
          />
          <p style={{ fontSize: 11, color: T.textMuted, marginTop: 6, fontStyle: "italic" }}>
            Be as specific as you like — date, location, budget, occasion, group size, vibe.
          </p>
        </div>
      )}

      {/* Submit */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <button
          onClick={fetchSuggestions}
          disabled={!canSubmit}
          style={{ fontFamily: T.fontFamily, fontSize: 13, padding: "10px 32px", borderRadius: T.radiusMd, border: "none", background: canSubmit ? T.accent : T.accentMid, color: "#fff", fontWeight: 600, cursor: canSubmit ? "pointer" : "not-allowed", letterSpacing: "0.01em", transition: "background 0.15s" }}
        >
          {loading ? "Finding ideas…" : "Find Ideas"}
        </button>
        {error && <p style={{ color: T.danger, fontSize: 12, marginTop: 10 }}>{error}</p>}
      </div>

      {/* Results */}
      {suggestions.length > 0 && (
        <>
          <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, fontWeight: 600, marginBottom: 12 }}>
            {suggestions.length} suggestion{suggestions.length !== 1 ? "s" : ""}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {suggestions.map(s => (
              <IdeaCard
                key={s.id}
                idea={s}
                isOpen={expanded === s.id}
                onToggle={() => setExpanded(expanded === s.id ? null : s.id)}
                onDone={() => {}}
                userName={userName}
                reactions={reactions}
                onReact={onReact}
                onArchive={() => {}}
                isSuggestion={true}
                onAddSuggestion={onAdd}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
