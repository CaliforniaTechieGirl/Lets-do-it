import { T, btn } from "../theme.js";

export default function ArchiveView({ ideas, onUnarchive }) {
  if (ideas.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 20px", color: T.textMuted, fontSize: 13, lineHeight: 1.7 }}>
        No archived ideas yet.<br />
        Use Archive on dated events once they've passed.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {ideas.map(idea => (
        <div key={idea.id} style={{ padding: "12px 16px", background: T.surface, borderRadius: T.radiusMd, display: "flex", alignItems: "center", gap: 12, opacity: 0.6, boxShadow: T.shadowCard }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.textMid }}><s>{idea.title}</s></div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{idea.when}</div>
          </div>
          <button onClick={() => onUnarchive(idea.id)} style={{ ...btn("muted"), fontSize: 11 }}>Restore</button>
        </div>
      ))}
    </div>
  );
}
