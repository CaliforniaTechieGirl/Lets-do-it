/**
 * Design tokens for Let's Do It
 * Editorial sans-serif — Plus Jakarta Sans, off-white bg, deep indigo accent
 */

export const T = {
  // Typography
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  fontSerif: "'Playfair Display', Georgia, serif",

  // Colors
  bg:         "#fafaf8",       // off-white page background
  surface:    "#ffffff",       // card surfaces
  surfaceAlt: "#f5f5f3",       // muted card / done state
  border:     "#e8e8e4",       // default border
  borderMid:  "#d0d0ca",       // stronger border / hover
  accent:     "#2d3a8c",       // deep indigo — primary accent
  accentLight:"#eef0fb",       // accent tint for backgrounds
  accentMid:  "#c7cdf0",       // accent tint for borders
  text:       "#1a1a18",       // primary text
  textMid:    "#4a4a46",       // secondary text
  textMuted:  "#9a9a94",       // tertiary / placeholder
  success:    "#1a6b3c",
  successBg:  "#edfaf3",
  successBorder:"#b3e6cc",
  warning:    "#7a4f00",
  warningBg:  "#fef9ec",
  warningBorder:"#f0d89a",
  danger:     "#8c1a1a",
  dangerBg:   "#fdf0f0",
  dangerBorder:"#f0b3b3",

  // Spacing
  radius:     "6px",
  radiusMd:   "10px",
  radiusLg:   "14px",

  // Reaction colors
  reactions: {
    "🔥": { bg: "#fff4ed", text: "#c2410c", border: "#fed7aa" },
    "👍": { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
    "🤔": { bg: "#fefce8", text: "#854d0e", border: "#fef08a" },
    "👎": { bg: "#f9fafb", text: "#6b7280", border: "#e5e7eb" },
  },
};

export const TAG_COLORS = {
  Outdoor:   { bg: "#edfaf3", text: "#1a6b3c", border: "#b3e6cc" },
  Free:      { bg: "#fef9ec", text: "#7a4f00", border: "#f0d89a" },
  Science:   { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  Nighttime: { bg: "#f5f0ff", text: "#5b21b6", border: "#ddd6fe" },
  Indoor:    { bg: "#f5f5f3", text: "#4a4a46", border: "#e8e8e4" },
  Music:     { bg: "#fdf0f8", text: "#9d174d", border: "#f9a8d4" },
  Adventure: { bg: "#edfaf3", text: "#1a6b3c", border: "#b3e6cc" },
  Classical: { bg: "#eef0fb", text: "#2d3a8c", border: "#c7cdf0" },
  Water:     { bg: "#ecfeff", text: "#155e75", border: "#a5f3fc" },
  Active:    { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  Hiking:    { bg: "#edfaf3", text: "#1a6b3c", border: "#b3e6cc" },
  Art:       { bg: "#fdf0f8", text: "#9d174d", border: "#f9a8d4" },
  Splurge:   { bg: "#fdf0f0", text: "#8c1a1a", border: "#f0b3b3" },
  Suggestion:{ bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
};

// SVG tab icons (inline, no external deps)
export const ICONS = {
  list: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="4" y1="12" x2="9" y2="12"/></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="2"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="5" y1="1" x2="5" y2="5"/><line x1="11" y1="1" x2="11" y2="5"/></svg>`,
  map: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2C5.8 2 4 3.8 4 6c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z"/><circle cx="8" cy="6" r="1.5"/></svg>`,
  suggest: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 1l1.8 3.6L14 5.6l-3 2.9.7 4.1L8 10.5l-3.7 2.1.7-4.1-3-2.9 4.2-.6z"/></svg>`,
  add: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="11"/><line x1="5" y1="8" x2="11" y2="8"/></svg>`,
  archive: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1" y="3" width="14" height="3" rx="1"/><path d="M2 6v7a1 1 0 001 1h10a1 1 0 001-1V6"/><path d="M6 9h4"/></svg>`,
};

// Shared button base style
export function btn(overrides = {}) {
  return {
    fontFamily: T.fontFamily,
    fontSize: 12,
    fontWeight: 500,
    padding: "6px 12px",
    borderRadius: T.radius,
    border: `1px solid ${T.border}`,
    background: T.surface,
    color: T.textMid,
    cursor: "pointer",
    letterSpacing: "0.01em",
    ...overrides,
  };
}

// ── Category icons ────────────────────────────────────────────────────────────
// Single-color SVG icons matched to idea tags/content
// Used in IdeaCard header instead of emoji

export const CATEGORY_ICONS = {
  Music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  Classical: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  Hiking: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l4-8 4 5 3-4 4 7"/></svg>`,
  Outdoor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l4-8 4 5 3-4 4 7"/></svg>`,
  Science: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M9 3v8l-4 9h14l-4-9V3"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
  Water: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6 9 4 13 4 16a8 8 0 0016 0c0-3-2-7-8-14z"/></svg>`,
  Active: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v6l-3 3m3-3l3 3"/><path d="M9 11H7m10 0h-2"/></svg>`,
  Adventure: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/></svg>`,
  Art: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a4 4 0 010 8 4 4 0 000 8"/><path d="M3 12h18"/></svg>`,
  Nighttime: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
  Indoor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  Free: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  Splurge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
  default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

export function getIdeaIcon(tags = []) {
  const priority = ["Music","Classical","Science","Water","Hiking","Outdoor","Active","Adventure","Art","Nighttime","Indoor","Free","Splurge"];
  for (const p of priority) {
    if (tags.includes(p)) return CATEGORY_ICONS[p];
  }
  return CATEGORY_ICONS.default;
}
