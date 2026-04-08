import { TAG_COLORS } from "../data.js";
import { makeICS, mapsUrl } from "../utils.js";

function TagPill({ tag }) {
  const c = TAG_COLORS[tag] || { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, letterSpacing: "0.05em",
      padding: "2px 8px", borderRadius: 20,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      textTransform: "uppercase",
    }}>
      {tag}
    </span>
  );
}

function InfoBlock({ label, value, span }) {
  return (
    <div style={{
      background: "#f9fafb", border: "1px solid #f3f4f6",
      borderRadius: 8, padding: "9px 12px",
      gridColumn: span === 2 ? "1 / -1" : undefined,
    }}>
      <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", margin: "0 0 3px", fontWeight: 700 }}>{label}</p>
      <p style={{ fontSize: 12, color: "#374151", margin: 0, lineHeight: 1.5 }}>{value}</p>
    </div>
  );
}

function Btn({ onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "Georgia, serif", fontSize: 11, padding: "6px 12px",
      borderRadius: 7, cursor: "pointer", fontWeight: 600,
      border: "1px solid #e5e7eb", background: "#f9fafb", color: "#374151",
      ...style,
    }}>
      {children}
    </button>
  );
}

export default function IdeaCard({
  idea, isOpen, onToggle,
  onDone, userName, likes, onLike,
  onArchive, isSuggestion, onAddSuggestion,
}) {
  const myLike = (likes[idea.id] || []).includes(userName);
  const likers = likes[idea.id] || [];

  return (
    <div style={{
      background: isSuggestion ? "#f0f9ff" : idea.done ? "#f9fafb" : "#fff",
      border: `1.5px solid ${isOpen ? "#7c3aed" : isSuggestion ? "#bae6fd" : "#e5e7eb"}`,
      borderRadius: 14, overflow: "hidden",
      opacity: idea.done ? 0.65 : 1,
      boxShadow: isOpen ? "0 4px 18px rgba(124,58,237,0.1)" : "0 1px 3px rgba(0,0,0,0.05)",
    }}>
      {isSuggestion && (
        <div style={{ background: "#e0f2fe", padding: "3px 14px", fontSize: 10, color: "#0369a1", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          ✨ AI Suggestion
        </div>
      )}

      {/* Header row */}
      <button onClick={onToggle} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 12,
        padding: "16px 18px", background: "transparent", border: "none",
        cursor: "pointer", textAlign: "left", fontFamily: "Georgia, serif",
      }}>
        <span style={{ fontSize: 24, flexShrink: 0 }}>{idea.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: idea.done ? "#9ca3af" : "#111827" }}>
            {idea.done ? <s>{idea.title}</s> : idea.title}
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {idea.when}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {likers.length > 0 && (
            <span style={{ fontSize: 11, color: "#ec4899", fontWeight: 700 }}>❤️{likers.length}</span>
          )}
          <span style={{ background: "#fef9c3", color: "#a16207", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, border: "1px solid #fef08a", whiteSpace: "nowrap" }}>
            {idea.costBadge}
          </span>
          <span style={{ color: "#7c3aed", fontSize: 13 }}>{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded body */}
      {isOpen && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingTop: 12, marginBottom: 12 }}>
            {idea.tags.map((t) => <TagPill key={t} tag={t} />)}
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.7, color: "#374151", margin: "0 0 12px" }}>
            {idea.description}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <InfoBlock label="📍 Where" value={idea.location} />
            <InfoBlock label="🕖 When" value={idea.when} />
            <InfoBlock label="💸 Cost" value={idea.cost} span={2} />
          </div>

          <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7c3aed", margin: "0 0 6px", fontWeight: 700 }}>
              Good to Know
            </p>
            <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
              {idea.notes.map((n, i) => (
                <li key={i} style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.6, marginBottom: 3 }}>{n}</li>
              ))}
            </ul>
          </div>

          {likers.length > 0 && (
            <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>
              ❤️ Liked by: {likers.join(", ")}
            </p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            <a href={idea.link} target="_blank" rel="noreferrer" style={{ fontFamily: "Georgia, serif", fontSize: 11, padding: "6px 12px", borderRadius: 7, background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe", textDecoration: "none", fontWeight: 600 }}>
              View Website ↗
            </a>
            <a href={mapsUrl(idea)} target="_blank" rel="noreferrer" style={{ fontFamily: "Georgia, serif", fontSize: 11, padding: "6px 12px", borderRadius: 7, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", textDecoration: "none", fontWeight: 600 }}>
              📍 Map
            </a>
            <Btn onClick={() => makeICS(idea)} style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }}>
              📅 Add to Calendar
            </Btn>
            <Btn
              onClick={() => onLike(idea.id)}
              style={myLike ? { background: "#fdf2f8", color: "#ec4899", border: "1px solid #fbcfe8" } : {}}
            >
              {myLike ? "❤️ Liked!" : "🤍 Like"}
            </Btn>
            {isSuggestion ? (
              <Btn onClick={() => onAddSuggestion(idea)} style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd" }}>
                ➕ Add to List
              </Btn>
            ) : (
              <>
                <Btn
                  onClick={() => onDone(idea.id)}
                  style={idea.done ? { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" } : {}}
                >
                  {idea.done ? "✓ Done!" : "Mark as Done"}
                </Btn>
                {idea.eventDate && (
                  <Btn onClick={() => onArchive(idea.id)} style={{ color: "#9ca3af" }}>
                    Archive
                  </Btn>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
