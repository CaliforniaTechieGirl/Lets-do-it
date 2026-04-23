/**
 * Design tokens — Precision Editorial
 * Primary #0e3ebb · Secondary #a92876 · Tertiary #015461 · Neutral #e8e8e8 · Surface #ffffff
 */

export const T = {
  fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",

  // Surface hierarchy — tonal layering, no borders
  bg:             "#f0f0f0",
  surface:        "#ffffff",
  surfaceLow:     "#f4f4f4",
  surfaceMid:     "#e8e8e8",
  surfaceHighest: "#e2e2e2",

  // Brand
  primary:          "#0e3ebb",
  primaryContainer: "#dce1ff",
  primaryDim:       "#b7c4ff",
  onPrimary:        "#ffffff",

  secondary:          "#a92876",
  secondaryContainer: "#ffd8e7",
  onSecondary:        "#ffffff",

  tertiary:          "#015461",
  tertiaryContainer: "#a9edff",
  onTertiary:        "#ffffff",

  // Text
  text:      "#1a1c1c",
  textMid:   "#444654",
  textMuted: "#747685",

  // Ghost border (inputs only)
  outlineVariant: "#c4c5d6",

  // Semantic
  success:       "#1a6b3c",
  successBg:     "#edfaf3",
  successBorder: "#b3e6cc",
  warning:       "#7a4f00",
  warningBg:     "#fef9ec",
  warningBorder: "#f0d89a",
  danger:        "#ba1a1a",
  dangerBg:      "#ffdad6",
  dangerBorder:  "#f0b3b3",

  // Radius
  radius:     "8px",
  radiusMd:   "12px",
  radiusLg:   "16px",
  radiusFull: "9999px",

  // Shadows
  shadowCard:  "0 2px 24px -2px rgba(26,28,28,0.07)",
  shadowFloat: "0 8px 48px -4px rgba(26,28,28,0.12)",

  // Reactions
  reactions: {
    "🔥": { bg: "#fff4ed", text: "#c2410c" },
    "👍": { bg: "#dce1ff", text: "#0e3ebb" },
    "🤔": { bg: "#fef9ec", text: "#7a4f00" },
    "👎": { bg: "#e8e8e8", text: "#747685" },
  },
};

export const TAG_COLORS = {
  Outdoor:   { bg: "#edfaf3", text: "#015461" },
  Free:      { bg: "#fef9ec", text: "#7a4f00" },
  Science:   { bg: "#dce1ff", text: "#0e3ebb" },
  Nighttime: { bg: "#f3e8ff", text: "#5b21b6" },
  Indoor:    { bg: "#e8e8e8", text: "#444654" },
  Music:     { bg: "#ffd8e7", text: "#a92876" },
  Adventure: { bg: "#a9edff", text: "#015461" },
  Classical: { bg: "#dce1ff", text: "#0e3ebb" },
  Water:     { bg: "#a9edff", text: "#015461" },
  Active:    { bg: "#fff4ed", text: "#c2410c" },
  Hiking:    { bg: "#edfaf3", text: "#015461" },
  Art:       { bg: "#ffd8e7", text: "#a92876" },
  Splurge:   { bg: "#ffd8e7", text: "#a92876" },
  Suggestion:{ bg: "#dce1ff", text: "#0e3ebb" },
};

export const ICONS = {
  list:     `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="4"/><line x1="4" y1="8" x2="12" y2="8"/><line x1="4" y1="12" x2="9" y2="12"/></svg>`,
  calendar: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="3" width="12" height="11" rx="2"/><line x1="2" y1="7" x2="14" y2="7"/><line x1="5" y1="1" x2="5" y2="5"/><line x1="11" y1="1" x2="11" y2="5"/></svg>`,
  map:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2C5.8 2 4 3.8 4 6c0 3 4 8 4 8s4-5 4-8c0-2.2-1.8-4-4-4z"/><circle cx="8" cy="6" r="1.5"/></svg>`,
  suggest:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M8 1l1.8 3.6L14 5.6l-3 2.9.7 4.1L8 10.5l-3.7 2.1.7-4.1-3-2.9 4.2-.6z"/></svg>`,
  add:      `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="11"/><line x1="5" y1="8" x2="11" y2="8"/></svg>`,
  archive:  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1" y="3" width="14" height="3" rx="1"/><path d="M2 6v7a1 1 0 001 1h10a1 1 0 001-1V6"/><path d="M6 9h4"/></svg>`,
};

export const CATEGORY_ICONS = {
  Music:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  Classical:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  Hiking:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l4-8 4 5 3-4 4 7"/></svg>`,
  Outdoor:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l4-8 4 5 3-4 4 7"/></svg>`,
  Science:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M9 3v8l-4 9h14l-4-9V3"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
  Water:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6 9 4 13 4 16a8 8 0 0016 0c0-3-2-7-8-14z"/></svg>`,
  Active:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v6l-3 3m3-3l3 3"/><path d="M9 11H7m10 0h-2"/></svg>`,
  Adventure:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"/></svg>`,
  Art:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a4 4 0 010 8 4 4 0 000 8"/><path d="M3 12h18"/></svg>`,
  Nighttime:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
  Indoor:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
  Free:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`,
  Splurge:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
  default:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
};

export function getIdeaIcon(tags = []) {
  const priority = ["Music","Classical","Science","Water","Hiking","Outdoor","Active","Adventure","Art","Nighttime","Indoor","Free","Splurge"];
  for (const p of priority) { if (tags.includes(p)) return CATEGORY_ICONS[p]; }
  return CATEGORY_ICONS.default;
}

export function btn(variant = "default") {
  const base = { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: 12, fontWeight: 600, padding: "7px 16px", borderRadius: "9999px", border: "none", cursor: "pointer", letterSpacing: "0.01em", transition: "opacity 0.15s" };
  if (variant === "primary")   return { ...base, background: "#0e3ebb", color: "#ffffff" };
  if (variant === "secondary") return { ...base, background: "#a92876", color: "#ffffff" };
  if (variant === "tertiary")  return { ...base, background: "#a9edff", color: "#015461" };
  if (variant === "ghost")     return { ...base, background: "transparent", color: "#0e3ebb", fontWeight: 600 };
  if (variant === "muted")     return { ...base, background: "#e8e8e8", color: "#444654" };
  return { ...base, background: "#e8e8e8", color: "#444654" };
}
