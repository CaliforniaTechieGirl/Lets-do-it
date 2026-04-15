import { T, TAG_COLORS, btn, getIdeaIcon } from "../theme.js";
import { makeICS, mapsUrl } from "../utils.js";

const REACTIONS = ["🔥", "👍", "🤔", "👎"];
const REACTION_LABELS = { "🔥": "Yes!", "👍": "Interested", "🤔": "Maybe", "👎": "Not for me" };

function TagPill({ tag }) {
  const c = TAG_COLORS[tag] || { bg: T.surfaceMid, text: T.textMid };
  return (
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 10px", borderRadius: T.radiusFull, background: c.bg, color: c.text, textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {tag}
    </span>
  );
}

function InfoBlock({ label, value, span }) {
  return (
    <div style={{ background: T.bg, borderRadius: T.radius, padding: "10px 14px", gridColumn: span === 2 ? "1 / -1" : undefined }}>
      <p style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, margin: "0 0 3px", fontWeight: 700 }}>{label}</p>
      <p style={{ fontSize: 12, color: T.textMid, margin: 0, lineHeight: 1.5 }}>{value}</p>
    </div>
  );
}

function ReactionBar({ ideaId, userName, reactions, onReact }) {
  const ideaReactions = reactions[ideaId] || {};
  const myReaction = ideaReactions[userName];
  const counts = {};
  Object.values(ideaReactions).forEach(r => { counts[r] = (counts[r] || 0) + 1; });
  const byReaction = {};
  Object.entries(ideaReactions).forEach(([name, r]) => { byReaction[r] = byReaction[r] || []; byReaction[r].push(name); });

  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, margin: "0 0 8px", fontWeight: 700 }}>React</p>
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
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: T.radiusFull, border: "none", cursor: "pointer", fontFamily: T.fontFamily, background: active ? c.bg : T.bg, transition: "all 0.15s" }}
            >
              <span style={{ fontSize: 15 }}>{r}</span>
              {count > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: active ? c.text : T.textMuted }}>{count}</span>}
            </button>
          );
        })}
      </div>
      {Object.keys(byReaction).length > 0 && (
        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(byReaction).map(([r, names]) => (
            <span key={r} style={{ fontSize: 11, color: T.textMuted }}>{r} {names.join(", ")}</span>
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
      background: idea.done ? T.surfaceLow : T.surface,
      borderRadius: T.radiusLg,
      overflow: "hidden",
      opacity: idea.done ? 0.6 : 1,
      boxShadow: isOpen ? T.shadowFloat : T.shadowCard,
      transition: "box-shadow 0.2s",
    }}>
      {isSuggestion && (
        <div style={{ background: T.secondaryContainer, padding: "4px 18px", fontSize: 9, color: T.secondary, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Suggestion
        </div>
      )}

      {/* Card header */}
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", fontFamily: T.fontFamily }}>
        {/* Icon */}
        <div style={{ width: 40, height: 40, borderRadius: T.radius, background: T.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span dangerouslySetInnerHTML={{ __html: getIdeaIcon(idea.tags) }} style={{ width: 20, height: 20, color: T.primary, display: "flex", alignItems: "center", justifyContent: "center" }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: idea.done ? T.textMuted : T.text, letterSpacing: "-0.01em", lineHeight: 1.3 }}>
            {idea.done ? <s>{idea.title}</s> : idea.title}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 400 }}>
            {idea.when}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {topReactions.length > 0 && (
            <span style={{ fontSize: 12, letterSpacing: "0.05em" }}>
              {topReactions.map(([r, c]) => `${r}${c > 1 ? c : ""}`).join(" ")}
            </span>
          )}
          <span style={{ background: T.secondaryContainer, color: T.secondary, fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: T.radiusFull, whiteSpace: "nowrap", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            {idea.costBadge}
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={T.textMuted} strokeWidth="1.5" strokeLinecap="round" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}>
            <polyline points="2,4 6,8 10,4"/>
          </svg>
        </div>
      </button>

      {/* Expanded body */}
      {isOpen && (
        <div style={{ padding: "4px 18px 20px" }}>
          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
            {idea.tags.map(t => <TagPill key={t} tag={t} />)}
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.75, color: T.textMid, margin: "0 0 14px", fontWeight: 400 }}>{idea.description}</p>

          {/* Info blocks — tonal background, no borders */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
            <InfoBlock label="Where" value={idea.location} />
            <InfoBlock label="When" value={idea.when} />
            <InfoBlock label="Cost" value={idea.cost} span={2} />
          </div>

          {/* Good to Know */}
          <div style={{ background: T.primaryContainer, borderRadius: T.radiusMd, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.primary, margin: "0 0 8px", fontWeight: 700 }}>Good to Know</p>
            <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
              {idea.notes.map((n, i) => <li key={i} style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7, marginBottom: 3 }}>{n}</li>)}
            </ul>
          </div>

          {/* Reactions */}
          <ReactionBar ideaId={idea.id} userName={userName} reactions={reactions} onReact={onReact} />

          {/* Actions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <a href={idea.link} target="_blank" rel="noreferrer" style={{ ...btn("primary"), textDecoration: "none", fontSize: 12 }}>
              View Website
            </a>
            <a href={mapsUrl(idea)} target="_blank" rel="noreferrer" style={{ ...btn("muted"), textDecoration: "none", color: T.tertiary, fontSize: 12 }}>
              Open in Maps
            </a>
            <button onClick={() => makeICS(idea)} style={{ ...btn("muted"), fontSize: 12 }}>
              Add to Calendar
            </button>
            {isSuggestion ? (
              <button onClick={() => onAddSuggestion(idea)} style={{ ...btn("secondary"), fontSize: 12 }}>
                + Add to List
              </button>
            ) : (
              <>
                <button onClick={() => onDone(idea.id)} style={{ ...btn(idea.done ? "tertiary" : "muted"), fontSize: 12, color: idea.done ? T.tertiary : T.textMid }}>
                  {idea.done ? "✓ Done" : "Mark as Done"}
                </button>
                {idea.eventDate && (
                  <button onClick={() => onArchive(idea.id)} style={{ ...btn("muted"), fontSize: 12, color: T.textMuted }}>
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
