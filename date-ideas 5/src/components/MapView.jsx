import { useEffect, useRef, useState } from "react";
import { T } from "../theme.js";
import { mapsUrl } from "../utils.js";

export default function MapView({ ideas, onSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [sel, setSel] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(!!window.google?.maps);

  useEffect(() => {
    if (window.google?.maps) { setMapsLoaded(true); return; }
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) return;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
    script.async = true;
    script.onload = () => setMapsLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.45, lng: -122.18 },
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
      ],
    });
  }, [mapsLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = ideas.map((idea, idx) => {
      // Numbered pin using a custom SVG marker
      const num = idx + 1;
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
          <path d="M16 0C7.16 0 0 7.16 0 16c0 10 16 24 16 24S32 26 32 16C32 7.16 24.84 0 16 0z" fill="${T.accent}"/>
          <circle cx="16" cy="16" r="11" fill="white"/>
          <text x="16" y="21" text-anchor="middle" font-family="Plus Jakarta Sans, system-ui, sans-serif" font-size="${num > 9 ? 10 : 12}" font-weight="600" fill="${T.accent}">${num}</text>
        </svg>`;
      const marker = new window.google.maps.Marker({
        position: { lat: idea.lat, lng: idea.lng },
        map: mapInstanceRef.current,
        title: idea.title,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
          scaledSize: new window.google.maps.Size(32, 40),
          anchor: new window.google.maps.Point(16, 40),
        },
      });
      marker.addListener("click", () => {
        setSel(idea.id);
        mapInstanceRef.current.panTo({ lat: idea.lat, lng: idea.lng });
      });
      return marker;
    });
  }, [mapsLoaded, ideas]);

  const selIdea = ideas.find(i => i.id === sel);

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ padding: 20, background: T.warningBg, border: `1px solid ${T.warningBorder}`, borderRadius: T.radiusMd, fontSize: 13, color: T.warning, lineHeight: 1.6 }}>
        To enable the map, add <strong>VITE_GOOGLE_MAPS_API_KEY</strong> to your Vercel environment variables and redeploy.
      </div>
    );
  }

  return (
    <div>
      {/* Map */}
      <div ref={mapRef} style={{ width: "100%", height: 380, borderRadius: T.radiusLg, overflow: "hidden", border: `1px solid ${T.border}`, marginBottom: 14 }} />

      {/* Selected idea card */}
      {selIdea && (() => {
        const num = ideas.findIndex(i => i.id === selIdea.id) + 1;
        return (
          <div style={{ padding: 14, background: T.surface, border: `1.5px solid ${T.accentMid}`, borderRadius: T.radiusMd, marginBottom: 14 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: T.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                {num}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: T.text }}>{selIdea.title}</div>
                <div style={{ fontSize: 11, color: T.textMuted, margin: "3px 0 10px" }}>{selIdea.location}</div>
                <div style={{ display: "flex", gap: 7 }}>
                  <a href={mapsUrl(selIdea)} target="_blank" rel="noreferrer" style={{ fontFamily: T.fontFamily, fontSize: 11, padding: "5px 11px", borderRadius: T.radius, background: T.successBg, color: T.success, border: `1px solid ${T.successBorder}`, textDecoration: "none", fontWeight: 500 }}>
                    Open in Maps ↗
                  </a>
                  <button onClick={() => { setSel(null); onSelect(selIdea); }} style={{ fontFamily: T.fontFamily, fontSize: 11, padding: "5px 11px", borderRadius: T.radius, background: T.accentLight, color: T.accent, border: `1px solid ${T.accentMid}`, cursor: "pointer", fontWeight: 500 }}>
                    See Details
                  </button>
                  <button onClick={() => setSel(null)} style={{ fontFamily: T.fontFamily, fontSize: 11, padding: "5px 11px", borderRadius: T.radius, background: T.bg, color: T.textMuted, border: `1px solid ${T.border}`, cursor: "pointer", fontWeight: 500 }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Numbered legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {ideas.map((idea, idx) => (
          <button
            key={idea.id}
            onClick={() => {
              setSel(sel === idea.id ? null : idea.id);
              if (mapInstanceRef.current) mapInstanceRef.current.panTo({ lat: idea.lat, lng: idea.lng });
            }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: sel === idea.id ? T.accentLight : T.surface, border: `1px solid ${sel === idea.id ? T.accentMid : T.border}`, borderRadius: T.radius, cursor: "pointer", textAlign: "left", fontFamily: T.fontFamily, transition: "all 0.1s" }}
          >
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: sel === idea.id ? T.accent : T.accentLight, color: sel === idea.id ? "#fff" : T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              {idx + 1}
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, color: T.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {idea.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
