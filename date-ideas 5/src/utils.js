export function makeICS(idea) {
  const pad = (n) => String(n).padStart(2, "0");
  let dtStart, dtEnd, allDay = false;

  if (idea.eventDate) {
    // Default event time to 7:30 PM, 2 hours duration
    const d = new Date(idea.eventDate + "T19:30:00");
    const fmt = (dt) =>
      `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
    dtStart = fmt(d);
    dtEnd = fmt(new Date(d.getTime() + 2 * 3600 * 1000));
  } else {
    const t = new Date();
    const s = `${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}`;
    dtStart = dtEnd = s;
    allDay = true;
  }

  const desc = idea.description.slice(0, 200).replace(/\n/g, " ");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Date Ideas//EN",
    "BEGIN:VEVENT",
    `UID:date-idea-${idea.id}@dateideas`,
    `SUMMARY:${idea.title}`,
    `DESCRIPTION:${desc} | ${idea.link}`,
    `LOCATION:${idea.location}`,
    allDay ? `DTSTART;VALUE=DATE:${dtStart}` : `DTSTART:${dtStart}`,
    allDay ? `DTEND;VALUE=DATE:${dtEnd}` : `DTEND:${dtEnd}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${idea.title.replace(/[^a-z0-9]/gi, "-")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function mapsUrl(idea) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(idea.location)}`;
}
