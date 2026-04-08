import { useState } from "react";
import { T, TAG_COLORS, btn } from "../theme.js";
import { makeICS, mapsUrl } from "../utils.js";

const REACTIONS = ["🔥", "👍", "🤔", "👎"];
const REACTION_LABELS = { "🔥": "Yes!", "👍": "Interested", "🤔": "Maybe", "👎": "Not for me" };

function TagPill({ tag }) {
  const c = TAG_COLORS[tag] || { bg: T.surfaceAlt, text: T.textMid, border: T.border };
  return (
    <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: 20, background: c.bg, color: c.text, border: `1px solid ${c.border}`, textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {tag}
    </span>
  );
}

function InfoBlock({ label, value, span }) {
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "9px 12px", gridColumn: span === 2 ? "1 / -1" : undefined }}>
      <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, margin: "0 0 3px", fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 12, color: T.textMid, margin: 0, lineHeight: 1.5 }}>{value}</p>
    </div>
  );
}

function ReactionBar({ ideaId, userName, reactions, onReact }) {
  const ideaReactions = reactions[ideaId] || {};
  const myReaction = ideaReactions[userName];

  // Count each reaction
  const counts = {};
  Object.values(ideaReactions).forEach(r => { counts[r] = (counts[r] || 0) + 1; });

  // Who reacted with what (for tooltip-style display)
  const byReaction = {};
  Object.entries(ideaReactions).forEach(([name, r]) => {
    byReaction[r] = byReaction[r] || [];
    byReaction[r].push(name);
  });

  return (
    <div>
      <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, margin: "0 0 8px", fontWeight: 600 }}>
        Reactions
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {REACTIONS.map(r => {
          const c = T.reactions[r];
          const active = myReaction === r;
          const count = counts[r] || 0;
          const names = byReaction[r] || [];
          return (
            <button
              key={r}
              onClick={() => onReact(ideaId, active ? null : r)}
              title={`${REACTION_LABELS[r]}${names.length ? ` · ${names.join(", ")}` : ""}`}
              style={{
                ...btn(),
                display: "flex", alignItems: "center", gap: 5,
                background: active ? c.bg : T.surface,
                border: `1px solid ${active ? c.border : T.border}`,
                color: active ? c.text : T.textMuted,
                padding: "5px 10px",
                fontWeight: active ? 600 : 400,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 15 }}>{r}</span>
              {count > 0 && (
                <span style={{ fontSize: 11, fontWeight: 600 }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>
      {Object.keys(byReaction).length > 0 && (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {Object.entries(byReaction).map(([r, names]) => (
            <span key={r} style={{ fontSize: 11, color: T.textMuted }}>
              {r} {names.join(", ")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function IdeaCard({ idea, isOpen, onToggle, onDone, userName, reactions, onReact, onArchive, isSuggestion, onAddSuggestion }) {
  const ideaReactions = reactions[idea.id] || {};
  const reactionCounts = {};
  Object.values(ideaReactions).forEach(r => { reactionCounts[r] = (reactionCounts[r] || 0) + 1; });
  const topReactions = Object.entries(reactionCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <div style={{
      background: isSuggestion ? "#f0f6ff" : idea.done ? T.surfaceAlt : T.surface,
      border: `1px solid ${isOpen ? T.accent : isSuggestion ? T.accentMid : T.border}`,
      borderRadius: T.radiusLg,
      overflow: "hidden",
      opacity: idea.done ? 0.6 : 1,
      boxShadow: isOpen ? `0 2px 16px rgba(45,58,140,0.08)` : "0 1px 3px rgba(0,0,0,0.04)",
      transition: "border-color 0.15s, box-shadow 0.15s",
    }}>
      {isSuggestion && (
        <div style={{ background: T.accentLight, padding: "3px 16px", fontSize: 10, color: T.accent, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          AI Suggestion
        </div>
      )}

      {/* Header */}
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: T.fontFamily }}>
        <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{idea.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: idea.done ? T.textMuted : T.text, letterSpacing: "-0.01em" }}>
            {idea.done ? <s>{idea.title}</s> : idea.title}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {idea.when}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {topReactions.length > 0 && (
            <span style={{ fontSize: 12, color: T.textMuted, letterSpacing: "0.05em" }}>
              {topReactions.map(([r, c]) => `${r}${c > 1 ? c : ""}`).join(" ")}
            </span>
          )}
          <span style={{ background: T.warningBg, color: T.warning, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, border: `1px solid ${T.warningBorder}`, whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
            {idea.costBadge}
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={T.accent} strokeWidth="1.5" strokeLinecap="round" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}>
            <polyline points="2,4 6,8 10,4"/>
          </svg>
        </div>
      </button>

      {/* Body */}
      {isOpen && (
        <div style={{ padding: "0 18px 20px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingTop: 14, marginBottom: 14 }}>
            {idea.tags.map(t => <TagPill key={t} tag={t} />)}
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.75, color: T.textMid, margin: "0 0 14px" }}>{idea.description}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            <InfoBlock label="Where" value={idea.location} />
            <InfoBlock label="When" value={idea.when} />
            <InfoBlock label="Cost" value={idea.cost} span={2} />
          </div>

          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusMd, padding: "12px 14px", marginBottom: 14 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.accent, margin: "0 0 8px", fontWeight: 600 }}>Good to Know</p>
            <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
              {idea.notes.map((n, i) => <li key={i} style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7, marginBottom: 3 }}>{n}</li>)}
            </ul>
          </div>

          <div style={{ marginBottom: 16 }}>
            <ReactionBar ideaId={idea.id} userName={userName} reactions={reactions} onReact={onReact} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            <a href={idea.link} target="_blank" rel="noreferrer" style={{ ...btn(), background: T.accentLight, color: T.accent, border: `1px solid ${T.accentMid}`, textDecoration: "none" }}>
              View Website ↗
            </a>
            <a href={mapsUrl(idea)} target="_blank" rel="noreferrer" style={{ ...btn(), background: T.successBg, color: T.success, border: `1px solid ${T.successBorder}`, textDecoration: "none" }}>
              Open in Maps
            </a>
            <button onClick={() => makeICS(idea)} style={{ ...btn(), background: T.accentLight, color: T.accent, border: `1px solid ${T.accentMid}` }}>
              Add to Calendar
            </button>
            {isSuggestion ? (
              <button onClick={() => onAddSuggestion(idea)} style={{ ...btn(), background: T.accentLight, color: T.accent, border: `1px solid ${T.accentMid}` }}>
                + Add to List
              </button>
            ) : (
              <>
                <button onClick={() => onDone(idea.id)} style={{ ...btn(), background: idea.done ? T.successBg : T.surface, color: idea.done ? T.success : T.textMid, border: `1px solid ${idea.done ? T.successBorder : T.border}` }}>
                  {idea.done ? "✓ Done" : "Mark as Done"}
                </button>
                {idea.eventDate && (
                  <button onClick={() => onArchive(idea.id)} style={{ ...btn(), color: T.textMuted }}>
                    Archive
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
