import { useState, useEffect } from "react";
import { DEFAULT_IDEAS, KEYS } from "./data.js";
import { T, ICONS } from "./theme.js";
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
          <h1 style={{ fontSize: 28, fontWeight: 600, color: T.text, letterSpacing: "-0.02em", margin: "0 0 6px" }}>Let's Do It</h1>
          <p style={{ fontSize: 14, color: T.textMid, marginBottom: 28, lineHeight: 1.6, fontStyle: "italic" }}>A collaborative list of fun things to do</p>
          <p style={{ fontSize: 13, color: T.textMid, marginBottom: 14 }}>Enter your name so collaborators can see who reacted to what.</p>
          <input
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && confirmName()}
            placeholder="Your first name…"
            autoFocus
            style={{ width: "100%", padding: "11px 14px", fontSize: 14, border: `1.5px solid ${T.border}`, borderRadius: T.radiusMd, fontFamily: T.fontFamily, marginBottom: 10, outline: "none", background: T.surface, color: T.text }}
          />
          <button onClick={confirmName} style={{ width: "100%", padding: "11px 0", background: T.accent, color: "#fff", border: "none", borderRadius: T.radiusMd, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: T.fontFamily, letterSpacing: "0.01em" }}>
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
      <div style={{ textAlign: "center", padding: "32px 20px 18px", borderBottom: `1px solid ${T.border}`, background: T.surface }}>
        <h1 style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)", fontWeight: 600, margin: 0, color: T.text, letterSpacing: "-0.03em" }}>
          Let's Do It
        </h1>
        <p style={{ marginTop: 5, color: T.textMid, fontSize: 14, fontStyle: "italic", fontWeight: 400 }}>
          A collaborative list of fun things to do
        </p>
        <p style={{ marginTop: 5, color: T.textMuted, fontSize: 12 }}>
          {doneCount} of {activeIdeas.length} done · Hi, {userName}!
        </p>
        {saveStatus && (
          <p style={{ marginTop: 4, fontSize: 11, color: saveStatus === "error" ? T.danger : T.success }}>
            {saveStatus === "saving" ? "Saving…" : saveStatus === "saved" ? "Saved" : "Couldn't save"}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", overflowX: "auto", background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "0 8px" }}>
        {TABS.map(t => {
          const label = t.id === "archive" && archiveCount > 0 ? `Archive (${archiveCount})` : t.label;
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ fontFamily: T.fontFamily, display: "flex", alignItems: "center", gap: 6, padding: "12px 14px", background: "none", border: "none", borderBottom: `2px solid ${active ? T.accent : "transparent"}`, color: active ? T.accent : T.textMuted, fontWeight: active ? 600 : 400, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap", letterSpacing: "0.01em", transition: "all 0.15s" }}>
              <span dangerouslySetInnerHTML={{ __html: t.icon }} style={{ display: "flex", alignItems: "center", opacity: active ? 1 : 0.6 }} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 56px" }}>

        {tab === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeIdeas.map(idea => (
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
            ))}
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
