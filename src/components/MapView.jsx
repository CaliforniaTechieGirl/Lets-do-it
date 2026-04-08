import { useState } from "react";
import { mapsUrl } from "../utils.js";

export default function MapView({ ideas, onSelect }) {
  const [sel, setSel] = useState(null);

  const minLat = Math.min(...ideas.map((i) => i.lat)) - 0.06;
  const maxLat = Math.max(...ideas.map((i) => i.lat)) + 0.06;
  const minLng = Math.min(...ideas.map((i) => i.lng)) - 0.06;
  const maxLng = Math.max(...ideas.map((i) => i.lng)) + 0.06;

  const pos = (idea) => ({
    x: ((idea.lng - minLng) / (maxLng - minLng)) * 100,
    y: 100 - ((idea.lat - minLat) / (maxLat - minLat)) * 100,
  });

  const selIdea = ideas.find((i) => i.id === sel);

  return (
    <div>
      {/* Map canvas */}
      <div style={{
        position: "relative", width: "100%", paddingBottom: "60%",
        background: "linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 100%)",
        border: "1px solid #bae6fd", borderRadius: 14, overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 8, left: 12, fontSize: 10, color: "#64748b", fontStyle: "italic" }}>
          Bay Area — tap a pin to see details
        </div>

        {/* Grid lines */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          {[25, 50, 75].map((p) => (
            <g key={p}>
              <line x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#bae6fd" strokeWidth="1" strokeDasharray="3 3" />
            </g>
          ))}
        </svg>

        {/* Pins */}
        {ideas.map((idea) => {
          const { x, y } = pos(idea);
          const isSel = sel === idea.id;
          return (
            <button
              key={idea.id}
              onClick={() => setSel(isSel ? null : idea.id)}
              title={idea.title}
              style={{
                position: "absolute",
                left: `${x}%`, top: `${y}%`,
                transform: "translate(-50%,-50%)",
                width: 32, height: 32, borderRadius: "50%",
                border: `2px solid ${isSel ? "#7c3aed" : "#a5b4fc"}`,
                background: isSel ? "#7c3aed" : "#fff",
                fontSize: 15, cursor: "pointer",
                boxShadow: isSel ? "0 0 0 3px rgba(124,58,237,0.2)" : "0 1px 4px rgba(0,0,0,0.15)",
                zIndex: isSel ? 10 : 2, transition: "all 0.15s",
              }}
            >
              {idea.emoji}
            </button>
          );
        })}
      </div>

      {/* Selected card */}
      {selIdea && (
        <div style={{ marginTop: 12, padding: 14, background: "#fff", border: "1.5px solid #c4b5fd", borderRadius: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24 }}>{selIdea.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{selIdea.title}</div>
              <div style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 8px" }}>📍 {selIdea.location}</div>
              <div style={{ display: "flex", gap: 7 }}>
                <a href={mapsUrl(selIdea)} target="_blank" rel="noreferrer" style={{ fontFamily: "Georgia, serif", fontSize: 11, padding: "5px 11px", borderRadius: 7, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", textDecoration: "none", fontWeight: 600 }}>
                  Open in Maps ↗
                </a>
                <button onClick={() => { setSel(null); onSelect(selIdea); }} style={{ fontFamily: "Georgia, serif", fontSize: 11, padding: "5px 11px", borderRadius: 7, background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe", cursor: "pointer", fontWeight: 600 }}>
                  See Details
                </button>
              </div>
            </div>
            <button onClick={() => setSel(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}

      {/* Legend grid */}
      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {ideas.map((idea) => (
          <button key={idea.id} onClick={() => setSel(sel === idea.id ? null : idea.id)} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "7px 9px",
            background: sel === idea.id ? "#f5f3ff" : "#fafafa",
            border: `1px solid ${sel === idea.id ? "#c4b5fd" : "#f3f4f6"}`,
            borderRadius: 7, cursor: "pointer", textAlign: "left",
            fontFamily: "Georgia, serif",
          }}>
            <span style={{ fontSize: 14 }}>{idea.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {idea.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
