import { useState } from "react";
import IdeaCard from "./IdeaCard.jsx";

export default function SuggestionsPanel({ ideas, suggestions, setSuggestions, onAdd, userName, likes, onLike }) {
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
      const withIds = parsed.map((s, i) => ({
        ...s,
        id: `sug-${Date.now()}-${i}`,
        isSuggestion: true,
      }));
      setSuggestions(withIds);
    } catch (e) {
      setError("Couldn't load suggestions — check your connection and try again.");
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24, padding: "0 8px" }}>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 16, lineHeight: 1.6 }}>
          Based on your current list, Claude will suggest 3 new date ideas tailored to your interests around the Bay Area.
        </p>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          style={{
            fontFamily: "Georgia, serif", fontSize: 14, padding: "10px 28px",
            borderRadius: 10, cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600, border: "none",
            background: loading ? "#a78bfa" : "#7c3aed",
            color: "#fff", opacity: loading ? 0.8 : 1,
            transition: "background 0.2s",
          }}
        >
          {loading ? "✨ Finding ideas..." : "✨ Suggest New Ideas"}
        </button>
        {error && (
          <p style={{ color: "#dc2626", fontSize: 13, marginTop: 10 }}>{error}</p>
        )}
      </div>

      {suggestions.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {suggestions.map((s) => (
            <IdeaCard
              key={s.id}
              idea={s}
              isOpen={false}
              onToggle={() => {}}
              onDone={() => {}}
              userName={userName}
              likes={likes}
              onLike={onLike}
              onArchive={() => {}}
              isSuggestion={true}
              onAddSuggestion={onAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}
