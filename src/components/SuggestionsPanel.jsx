import { useState } from "react";
import { T } from "../theme.js";
import IdeaCard from "./IdeaCard.jsx";

export default function SuggestionsPanel({ ideas, suggestions, setSuggestions, onAdd, userName, reactions, onReact }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideas }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const parsed = await res.json();
      setSuggestions(parsed.map((s, i) => ({ ...s, id: `sug-${Date.now()}-${i}`, isSuggestion: true })));
    } catch (e) {
      setError("Couldn't load suggestions — please try again.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 28, padding: "0 8px" }}>
        <p style={{ fontSize: 13, color: T.textMid, marginBottom: 18, lineHeight: 1.7 }}>
          Based on your current list, Claude will suggest 3 new ideas tailored to your interests.
        </p>
        <button onClick={fetchSuggestions} disabled={loading} style={{ fontFamily: T.fontFamily, fontSize: 13, padding: "10px 28px", borderRadius: T.radiusMd, border: "none", background: loading ? T.accentMid : T.accent, color: "#fff", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", letterSpacing: "0.01em" }}>
          {loading ? "Finding ideas…" : "Suggest New Ideas"}
        </button>
        {error && <p style={{ color: T.danger, fontSize: 12, marginTop: 10 }}>{error}</p>}
      </div>
      {suggestions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {suggestions.map(s => (
            <IdeaCard key={s.id} idea={s} isOpen={false} onToggle={() => {}} onDone={() => {}} userName={userName} reactions={reactions} onReact={onReact} onArchive={() => {}} isSuggestion={true} onAddSuggestion={onAdd} />
          ))}
        </div>
      )}
    </div>
  );
}
