import { useState } from "react";
import { T, getIdeaIcon } from "../theme.js";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function CalendarView({ ideas, onSelect }) {
  const now = new Date();
  const [yr, setYr] = useState(now.getFullYear());
  const [mo, setMo] = useState(now.getMonth());

  const prevMo = () => mo === 0 ? (setMo(11), setYr(y => y - 1)) : setMo(m => m - 1);
  const nextMo = () => mo === 11 ? (setMo(0), setYr(y => y + 1)) : setMo(m => m + 1);

  const firstDay = new Date(yr, mo, 1).getDay();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();

  const byDay = {};
  ideas.filter(i => i.eventDate).forEach(idea => {
    const d = new Date(idea.eventDate + "T12:00:00");
    if (d.getFullYear() === yr && d.getMonth() === mo) {
      const k = d.getDate();
      byDay[k] = byDay[k] || [];
      byDay[k].push(idea);
    }
  });

  const undated = ideas.filter(i => !i.eventDate);
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const isToday = d => d === now.getDate() && mo === now.getMonth() && yr === now.getFullYear();

  const navBtn = (onClick, label) => (
    <button onClick={onClick} style={{ fontFamily: T.fontFamily, width: 32, height: 32, borderRadius: T.radius, border: `1px solid ${T.border}`, background: T.surface, cursor: "pointer", color: T.textMid, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        {navBtn(prevMo, "‹")}
        <span style={{ fontWeight: 600, fontSize: 14, color: T.text, letterSpacing: "-0.01em" }}>{MONTHS[mo]} {yr}</span>
        {navBtn(nextMo, "›")}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: T.textMuted, padding: "3px 0", letterSpacing: "0.05em" }}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((day, i) => (
          <div key={i} style={{ minHeight: 58, background: day ? (isToday(day) ? T.accentLight : T.bg) : "transparent", border: day ? `1px solid ${isToday(day) ? T.accentMid : T.border}` : "none", borderRadius: T.radius, padding: "3px 2px" }}>
            {day && (
              <>
                <div style={{ fontSize: 10, fontWeight: isToday(day) ? 600 : 400, color: isToday(day) ? T.accent : T.textMuted, textAlign: "center", marginBottom: 2 }}>{day}</div>
                {(byDay[day] || []).map(idea => (
                  <button key={idea.id} onClick={() => onSelect(idea)} style={{ display: "block", width: "100%", textAlign: "left", fontSize: 9, padding: "2px 3px", borderRadius: 3, background: T.accentLight, color: T.accent, border: "none", cursor: "pointer", marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600, fontFamily: T.fontFamily }}>
                    {idea.title}
                  </button>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      {undated.length > 0 && (
        <>
          <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, fontWeight: 600, margin: "24px 0 10px" }}>Anytime</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {undated.map(idea => (
              <button key={idea.id} onClick={() => onSelect(idea)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, cursor: "pointer", textAlign: "left", fontFamily: T.fontFamily }}>
                <span dangerouslySetInnerHTML={{ __html: getIdeaIcon(idea.tags) }} style={{ width: 22, height: 22, flexShrink: 0, color: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{idea.title}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{idea.when}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
