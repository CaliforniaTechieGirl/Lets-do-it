import { useState } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function CalendarView({ ideas, onSelect }) {
  const now = new Date();
  const [yr, setYr] = useState(now.getFullYear());
  const [mo, setMo] = useState(now.getMonth());

  const prevMo = () => mo === 0 ? (setMo(11), setYr((y) => y - 1)) : setMo((m) => m - 1);
  const nextMo = () => mo === 11 ? (setMo(0), setYr((y) => y + 1)) : setMo((m) => m + 1);

  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();

  const byDay = {};
  ideas
    .filter((i) => i.eventDate)
    .forEach((idea) => {
      const d = new Date(idea.eventDate + "T12:00:00");
      if (d.getFullYear() === yr && d.getMonth() === mo) {
        const k = d.getDate();
        byDay[k] = byDay[k] || [];
        byDay[k].push(idea);
      }
    });

  const undated = ideas.filter((i) => !i.eventDate);
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const isToday = (d) => d === now.getDate() && mo === now.getMonth() && yr === now.getFullYear();

  const navBtn = (onClick, label) => (
    <button onClick={onClick} style={{ fontFamily: "Georgia, serif", padding: "5px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", fontSize: 16 }}>
      {label}
    </button>
  );

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        {navBtn(prevMo, "‹")}
        <span style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{MONTHS[mo]} {yr}</span>
        {navBtn(nextMo, "›")}
      </div>

      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 3 }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#9ca3af", padding: "3px 0" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((day, i) => (
          <div key={i} style={{
            minHeight: 60,
            background: day ? (isToday(day) ? "#faf5ff" : "#fafafa") : "transparent",
            border: day ? `1px solid ${isToday(day) ? "#c4b5fd" : "#f3f4f6"}` : "none",
            borderRadius: 6, padding: "3px 2px",
          }}>
            {day && (
              <>
                <div style={{ fontSize: 10, fontWeight: isToday(day) ? 700 : 400, color: isToday(day) ? "#7c3aed" : "#9ca3af", marginBottom: 2, textAlign: "center" }}>
                  {day}
                </div>
                {(byDay[day] || []).map((idea) => (
                  <button key={idea.id} onClick={() => onSelect(idea)} style={{
                    display: "block", width: "100%", textAlign: "left",
                    fontSize: 9, padding: "1px 3px", borderRadius: 3,
                    background: "#ede9fe", color: "#6d28d9", border: "none",
                    cursor: "pointer", marginBottom: 1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    fontWeight: 600, fontFamily: "Georgia, serif",
                  }}>
                    {idea.emoji} {idea.title}
                  </button>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Anytime section */}
      {undated.length > 0 && (
        <>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", fontWeight: 700, margin: "24px 0 10px" }}>
            Anytime
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {undated.map((idea) => (
              <button key={idea.id} onClick={() => onSelect(idea)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", background: "#fafafa",
                border: "1px solid #f3f4f6", borderRadius: 8,
                cursor: "pointer", textAlign: "left", fontFamily: "Georgia, serif",
              }}>
                <span style={{ fontSize: 18 }}>{idea.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{idea.title}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>{idea.when}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
