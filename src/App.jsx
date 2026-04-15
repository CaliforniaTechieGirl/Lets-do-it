import { useState, useEffect } from "react";
import { DEFAULT_IDEAS, KEYS } from "./data.js";
import { T, ICONS, btn } from "./theme.js";
import { storageGet, storageSet } from "./storage.js";
import IdeaCard from "./components/IdeaCard.jsx";
import CalendarView from "./components/CalendarView.jsx";
import MapView from "./components/MapView.jsx";
import SuggestionsPanel from "./components/SuggestionsPanel.jsx";
import ArchiveView from "./components/ArchiveView.jsx";
import AddByUrl from "./components/AddByUrl.jsx";

const TABS = [
  { id: "list",        label: "List",     icon: ICONS.list },
  { id: "calendar",   label: "Calendar", icon: ICONS.calendar },
  { id: "map",        label: "Map",      icon: ICONS.map },
  { id: "suggestions",label: "Suggest",  icon: ICONS.suggest },
  { id: "add",        label: "Add Idea", icon: ICONS.add },
  { id: "archive",    label: "Archive",  icon: ICONS.archive },
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("list");
  const [expanded, setExpanded] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [doneIds, setDoneIds] = useState(new Set());
  const [archivedIds, setArchivedIds] = useState(new Set());
  const [reactions, setReactions] = useState({});   // { [ideaId]: { [userName]: emoji } }
  const [extraIdeas, setExtraIdeas] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [sortBy, setSortBy] = useState("default"); // "default" | "loved" | "recent"

  useEffect(() => {
    async function load() {
      try {
        const [done, arch, reacts, user, extra] = await Promise.allSettled([
          storageGet(KEYS.DONE),
          storageGet(KEYS.ARCHIVE),
          storageGet(KEYS.REACTIONS, true),
          storageGet(KEYS.USER),
          storageGet(KEYS.EXTRA),
        ]);
        if (done.value?.value)   setDoneIds(new Set(JSON.parse(done.value.value)));
        if (arch.value?.value)   setArchivedIds(new Set(JSON.parse(arch.value.value)));
        if (reacts.value?.value) setReactions(JSON.parse(reacts.value.value));
        if (user.value?.value)   setUserName(user.value.value);
        if (extra.value?.value)  setExtraIdeas(JSON.parse(extra.value.value));
      } catch (e) { console.warn("Storage load error:", e); }
      setLoading(false);
    }
    load();
  }, []);

  const save = async (key, value, shared = false) => {
    setSaveStatus("saving");
    try {
      await storageSet(key, JSON.stringify(value), shared);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 1500);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const confirmName = async () => {
    const name = nameInput.trim();
    if (!name) return;
    setUserName(name);
    await storageSet(KEYS.USER, name);
  };

  const toggleDone = async (id) => {
    const next = new Set(doneIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setDoneIds(next);
    save(KEYS.DONE, [...next]);
  };

  const setReaction = async (ideaId, emoji) => {
    if (!userName) return;
    const ideaReactions = { ...(reactions[ideaId] || {}) };
    if (emoji === null) delete ideaReactions[userName];
    else ideaReactions[userName] = emoji;
    const next = { ...reactions, [ideaId]: ideaReactions };
    setReactions(next);
    save(KEYS.REACTIONS, next, true);
  };

  const archiveIdea = async (id) => {
    const next = new Set(archivedIds); next.add(id);
    setArchivedIds(next); save(KEYS.ARCHIVE, [...next]);
  };
  const unarchiveIdea = async (id) => {
    const next = new Set(archivedIds); next.delete(id);
    setArchivedIds(next); save(KEYS.ARCHIVE, [...next]);
  };

  const addSuggestion = async (idea) => {
    const added = { ...idea, id: Date.now(), isSuggestion: false };
    const next = [...extraIdeas, added];
    setExtraIdeas(next);
    setSuggestions(prev => prev.filter(s => s.id !== idea.id));
    save(KEYS.EXTRA, next);
  };

  const addByUrl = (idea) => {
    const added = { ...idea, id: Date.now() };
    const next = [...extraIdeas, added];
    setExtraIdeas(next);
    save(KEYS.EXTRA, next);
    setTab("list");
    setExpanded(added.id);
  };

  const handleSelectIdea = (idea) => {
    setExpanded(idea.id);
    setTab("list");
  };

  const allIdeas = [...DEFAULT_IDEAS, ...extraIdeas];
  const activeIdeas = allIdeas.filter(i => !archivedIds.has(i.id));
  const archivedIdeas = allIdeas.filter(i => archivedIds.has(i.id));
  const doneCount = activeIdeas.filter(i => doneIds.has(i.id)).length;
  const archiveCount = archivedIds.size;

  // ── Name gate ────────────────────────────────────────────────────────────────
  if (!loading && !userName) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.fontFamily, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ maxWidth: 360, width: "100%", textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: T.primary, letterSpacing: "-0.03em", textTransform: "uppercase", margin: "0 0 8px" }}>LET'S DO IT</h1>
          <p style={{ fontSize: 14, color: T.textMid, marginBottom: 32, lineHeight: 1.6 }}>A collaborative list of fun things to do</p>
          <p style={{ fontSize: 13, color: T.textMid, marginBottom: 14, textAlign: "left" }}>Enter your name so collaborators can see who reacted to what.</p>
          <input
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && confirmName()}
            placeholder="Your first name…"
            autoFocus
            style={{ width: "100%", padding: "12px 16px", fontSize: 14, border: "none", borderRadius: T.radius, fontFamily: T.fontFamily, marginBottom: 12, outline: "none", background: T.surfaceHighest, color: T.text, borderBottom: `2px solid ${T.outlineVariant}` }}
          />
          <button onClick={confirmName} style={{ ...btn("primary"), width: "100%", padding: "12px 0", fontSize: 14, borderRadius: T.radiusFull }}>
            Let's go
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div style={{ fontFamily: T.fontFamily, padding: 40, textAlign: "center", color: T.textMuted }}>Loading…</div>;
  }

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: T.fontFamily, color: T.text }}>

      {/* Header */}
      <div style={{ background: T.bg, padding: "28px 20px 8px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: T.tertiary, margin: "0 0 4px" }}>
            Collaborative Planning
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", fontWeight: 800, margin: 0, color: T.primary, letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1 }}>
              Let's Do It
            </h1>
            <p style={{ color: T.textMuted, fontSize: 12, margin: 0, fontWeight: 500 }}>
              Hi, {userName} · {doneCount}/{activeIdeas.length} done
            </p>
          </div>
          <p style={{ marginTop: 6, color: T.textMid, fontSize: 13, fontWeight: 400 }}>
            A collaborative list of fun things to do
          </p>
          {saveStatus && (
            <p style={{ marginTop: 4, fontSize: 11, color: saveStatus === "error" ? T.danger : T.tertiary, fontWeight: 500 }}>
              {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Couldn't save"}
            </p>
          )}
        </div>
      </div>

      {/* Tabs — pill-style active state */}
      <div style={{ background: T.bg, padding: "10px 12px 0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", overflowX: "auto", gap: 6, paddingBottom: 12, scrollbarWidth: "none" }}>
            {TABS.map(t => {
              const label = t.id === "archive" && archiveCount > 0 ? `Archive (${archiveCount})` : t.label;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    fontFamily: T.fontFamily,
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "7px 14px",
                    background: active ? T.primary : T.surface,
                    borderRadius: T.radiusFull,
                    border: "none",
                    color: active ? T.onPrimary : T.textMuted,
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    letterSpacing: "0.02em",
                    boxShadow: active ? T.shadowCard : "none",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: t.icon }} style={{ display: "flex", alignItems: "center" }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 16px 56px" }}>

        {tab === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {/* Sort toolbar */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <label style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, fontWeight: 700, whiteSpace: "nowrap" }}>
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ fontFamily: T.fontFamily, fontSize: 12, padding: "6px 12px", border: "none", borderRadius: T.radiusFull, background: T.surface, color: T.textMid, cursor: "pointer", outline: "none", fontWeight: 500, boxShadow: T.shadowCard }}
              >
                <option value="default">Default</option>
                <option value="loved">Most loved 🔥</option>
                <option value="recent">Recently added</option>
              </select>
            </div>

            {/* Sorted list */}
            {(() => {
              const REACTION_WEIGHT = { "🔥": 4, "👍": 2, "🤔": 1, "👎": -1 };

              const score = (idea) => {
                const ideaReactions = reactions[idea.id] || {};
                return Object.values(ideaReactions).reduce((sum, r) => sum + (REACTION_WEIGHT[r] || 0), 0);
              };

              const sorted = [...activeIdeas].sort((a, b) => {
                if (sortBy === "loved")  return score(b) - score(a);
                if (sortBy === "recent") return b.id - a.id;
                return 0; // default — preserve original order
              });

              return sorted.map(idea => (
                <IdeaCard
                  key={idea.id}
                  idea={{ ...idea, done: doneIds.has(idea.id) }}
                  isOpen={expanded === idea.id}
                  onToggle={() => setExpanded(expanded === idea.id ? null : idea.id)}
                  onDone={toggleDone}
                  userName={userName}
                  reactions={reactions}
                  onReact={setReaction}
                  onArchive={archiveIdea}
                  isSuggestion={false}
                  onAddSuggestion={() => {}}
                />
              ));
            })()}

            <div style={{ textAlign: "center", padding: 20, border: `1px dashed ${T.borderMid}`, borderRadius: T.radiusLg, color: T.textMuted, fontSize: 13, marginTop: 4 }}>
              Got something fun in mind? Use Add Idea above.
            </div>
          </div>
        )}

        {tab === "calendar" && <CalendarView ideas={activeIdeas} onSelect={handleSelectIdea} />}
        {tab === "map" && <MapView ideas={activeIdeas} onSelect={handleSelectIdea} />}

        {tab === "suggestions" && (
          <SuggestionsPanel ideas={activeIdeas} suggestions={suggestions} setSuggestions={setSuggestions} onAdd={addSuggestion} userName={userName} reactions={reactions} onReact={setReaction} />
        )}

        {tab === "add" && <AddByUrl onAdd={addByUrl} />}
        {tab === "archive" && <ArchiveView ideas={archivedIdeas} onUnarchive={unarchiveIdea} />}

      </div>
    </div>
  );
}
