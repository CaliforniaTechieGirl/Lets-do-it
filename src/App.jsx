import { useState, useEffect } from "react";
import { DEFAULT_IDEAS, KEYS } from "./data.js";
import { storageGet, storageSet } from "./storage.js";
import IdeaCard from "./components/IdeaCard.jsx";
import CalendarView from "./components/CalendarView.jsx";
import MapView from "./components/MapView.jsx";
import SuggestionsPanel from "./components/SuggestionsPanel.jsx";
import ArchiveView from "./components/ArchiveView.jsx";
import AddByUrl from "./components/AddByUrl.jsx";

const TABS = [
  { id: "list",        label: "📋 List" },
  { id: "calendar",   label: "📅 Calendar" },
  { id: "map",        label: "📍 Map" },
  { id: "suggestions",label: "✨ Suggest" },
  { id: "archive",    label: "🗄 Archive" },
  { id: "add",        label: "➕ Add Idea" },
];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("list");
  const [expanded, setExpanded] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // "saving" | "saved" | "error"

  // Persisted state
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [doneIds, setDoneIds] = useState(new Set());
  const [archivedIds, setArchivedIds] = useState(new Set());
  const [likes, setLikes] = useState({});       // { [ideaId]: string[] }
  const [extraIdeas, setExtraIdeas] = useState([]); // ideas added from suggestions

  // Transient state
  const [suggestions, setSuggestions] = useState([]);

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [done, arch, lks, user, extra] = await Promise.allSettled([
          storageGet(KEYS.DONE),
          storageGet(KEYS.ARCHIVE),
          storageGet(KEYS.LIKES, true),   // shared
          storageGet(KEYS.USER),
          storageGet(KEYS.EXTRA),
        ]);
        if (done.value?.value)  setDoneIds(new Set(JSON.parse(done.value.value)));
        if (arch.value?.value)  setArchivedIds(new Set(JSON.parse(arch.value.value)));
        if (lks.value?.value)   setLikes(JSON.parse(lks.value.value));
        if (user.value?.value)  setUserName(user.value.value);
        if (extra.value?.value) setExtraIdeas(JSON.parse(extra.value.value));
      } catch (e) {
        console.warn("Storage load error:", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  // ── Save helper ─────────────────────────────────────────────────────────────
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

  // ── Actions ─────────────────────────────────────────────────────────────────
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

  const toggleLike = async (id) => {
    if (!userName) return;
    const current = likes[id] || [];
    const next = current.includes(userName)
      ? current.filter((n) => n !== userName)
      : [...current, userName];
    const nextLikes = { ...likes, [id]: next };
    setLikes(nextLikes);
    save(KEYS.LIKES, nextLikes, true); // shared across users
  };

  const archiveIdea = async (id) => {
    const next = new Set(archivedIds);
    next.add(id);
    setArchivedIds(next);
    save(KEYS.ARCHIVE, [...next]);
  };

  const unarchiveIdea = async (id) => {
    const next = new Set(archivedIds);
    next.delete(id);
    setArchivedIds(next);
    save(KEYS.ARCHIVE, [...next]);
  };

  const addSuggestion = async (idea) => {
    const added = { ...idea, id: Date.now(), isSuggestion: false };
    const next = [...extraIdeas, added];
    setExtraIdeas(next);
    setSuggestions((prev) => prev.filter((s) => s.id !== idea.id));
    save(KEYS.EXTRA, next);
  };

  const handleSelectIdea = (idea) => {
    setExpanded(idea.id);
    setTab("list");
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const allIdeas = [...DEFAULT_IDEAS, ...extraIdeas];
  const activeIdeas = allIdeas.filter((i) => !archivedIds.has(i.id));
  const archivedIdeas = allIdeas.filter((i) => archivedIds.has(i.id));
  const doneCount = activeIdeas.filter((i) => doneIds.has(i.id)).length;
  const archiveCount = archivedIds.size;

  // ── Name gate ───────────────────────────────────────────────────────────────
  if (!loading && !userName) {
    return (
      <div style={{
        minHeight: "100vh", background: "#fff",
        fontFamily: "Georgia, serif",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
        <div style={{ maxWidth: 360, textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✨</div>
          <h2 style={{ fontSize: 26, fontWeight: 400, color: "#111827", marginBottom: 8 }}>Date Ideas</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Enter your name so friends can see who liked what.
          </p>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && confirmName()}
            placeholder="Your first name…"
            autoFocus
            style={{
              width: "100%", padding: "10px 14px", fontSize: 15,
              border: "1.5px solid #e5e7eb", borderRadius: 10,
              fontFamily: "Georgia, serif", marginBottom: 12, outline: "none",
            }}
          />
          <button
            onClick={confirmName}
            style={{
              width: "100%", padding: "11px 0", background: "#7c3aed",
              color: "#fff", border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 600, cursor: "pointer",
              fontFamily: "Georgia, serif",
            }}
          >
            Let's go →
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ fontFamily: "Georgia, serif", padding: 40, textAlign: "center", color: "#9ca3af" }}>
        Loading…
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "Georgia, serif", color: "#1a1a2e" }}>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "30px 20px 16px" }}>
        <h1 style={{ fontSize: "clamp(1.9rem, 5vw, 2.8rem)", fontWeight: 400, margin: 0, color: "#111827", letterSpacing: "-0.02em" }}>
          Let's Do It 🎉
        </h1>
        <p style={{ marginTop: 6, color: "#6b7280", fontSize: 14, fontStyle: "italic" }}>
          A collaborative list of fun things to do
        </p>
        <p style={{ marginTop: 4, color: "#9ca3af", fontSize: 12 }}>
          {doneCount} of {activeIdeas.length} done · hi, {userName}!
        </p>
        {saveStatus && (
          <p style={{ marginTop: 4, fontSize: 11, color: saveStatus === "error" ? "#dc2626" : "#16a34a" }}>
            {saveStatus === "saving" ? "💾 Saving…" : saveStatus === "saved" ? "✓ Saved" : "⚠ Couldn't save"}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid #f3f4f6", padding: "0 12px" }}>
        {TABS.map((t) => {
          const label = t.id === "archive" && archiveCount > 0 ? `🗄 Archive (${archiveCount})` : t.label;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                fontFamily: "Georgia, serif", padding: "9px 14px",
                background: "none", border: "none",
                borderBottom: `2px solid ${tab === t.id ? "#7c3aed" : "transparent"}`,
                color: tab === t.id ? "#7c3aed" : "#6b7280",
                fontWeight: tab === t.id ? 700 : 400,
                cursor: "pointer", fontSize: 13, whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px 48px" }}>

        {tab === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activeIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={{ ...idea, done: doneIds.has(idea.id) }}
                isOpen={expanded === idea.id}
                onToggle={() => setExpanded(expanded === idea.id ? null : idea.id)}
                onDone={toggleDone}
                userName={userName}
                likes={likes}
                onLike={toggleLike}
                onArchive={archiveIdea}
                isSuggestion={false}
                onAddSuggestion={() => {}}
              />
            ))}
            <div style={{ textAlign: "center", padding: 20, border: "1px dashed #d1d5db", borderRadius: 16, color: "#9ca3af", fontSize: 13, fontStyle: "italic", marginTop: 4 }}>
              Got something fun in mind? Hit ➕ Add Idea above ✨
            </div>
          </div>
        )}

        {tab === "calendar" && (
          <CalendarView ideas={activeIdeas} onSelect={handleSelectIdea} />
        )}

        {tab === "map" && (
          <MapView ideas={activeIdeas} onSelect={handleSelectIdea} />
        )}

        {tab === "suggestions" && (
          <SuggestionsPanel
            ideas={activeIdeas}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            onAdd={addSuggestion}
            userName={userName}
            likes={likes}
            onLike={toggleLike}
          />
        )}

        {tab === "archive" && (
          <ArchiveView ideas={archivedIdeas} onUnarchive={unarchiveIdea} />
        )}

        {tab === "add" && (
          <AddByUrl
            onAdd={(idea) => {
              const added = { ...idea, id: Date.now() };
              const next = [...extraIdeas, added];
              setExtraIdeas(next);
              save(KEYS.EXTRA, next);
              setTab("list");
              setExpanded(added.id);
            }}
          />
        )}

      </div>
    </div>
  );
}
