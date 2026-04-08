export default function ArchiveView({ ideas, onUnarchive }) {
  if (ideas.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "48px 20px", color: "#9ca3af", fontStyle: "italic", fontSize: 14 }}>
        No archived ideas yet.<br />
        Use the Archive button on dated events once they've passed.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {ideas.map((idea) => (
        <div key={idea.id} style={{
          padding: "12px 16px", background: "#fafafa",
          border: "1px solid #f3f4f6", borderRadius: 12,
          display: "flex", alignItems: "center", gap: 12, opacity: 0.7,
        }}>
          <span style={{ fontSize: 22 }}>{idea.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
              <s>{idea.title}</s>
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{idea.when}</div>
          </div>
          <button onClick={() => onUnarchive(idea.id)} style={{
            fontFamily: "Georgia, serif", fontSize: 11, padding: "5px 10px",
            borderRadius: 7, border: "1px solid #e5e7eb",
            background: "#f9fafb", color: "#6b7280", cursor: "pointer", fontWeight: 600,
          }}>
            Restore
          </button>
        </div>
      ))}
    </div>
  );
}
