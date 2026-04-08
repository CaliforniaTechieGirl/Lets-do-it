import { useEffect, useRef, useState } from "react";
import { mapsUrl } from "../utils.js";

export default function MapView({ ideas, onSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [sel, setSel] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(!!window.google?.maps);

  // Load Google Maps script once
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

  // Init map once script is loaded
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.45, lng: -122.18 },
      zoom: 10,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
  }, [mapsLoaded]);

  // Add markers whenever ideas change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = ideas.map((idea) => {
      const marker = new window.google.maps.Marker({
        position: { lat: idea.lat, lng: idea.lng },
        map: mapInstanceRef.current,
        title: idea.title,
        label: { text: idea.emoji, fontSize: "18px", fontFamily: "serif" },
      });
      marker.addListener("click", () => {
        setSel(idea.id);
        mapInstanceRef.current.panTo({ lat: idea.lat, lng: idea.lng });
      });
      return marker;
    });
  }, [mapsLoaded, ideas]);

  const selIdea = ideas.find((i) => i.id === sel);

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ padding: 24, background: "#fef9c3", border: "1px solid #fef08a", borderRadius: 12, fontSize: 13, color: "#a16207", lineHeight: 1.6 }}>
        To enable the map, add <strong>VITE_GOOGLE_MAPS_API_KEY</strong> to your Vercel environment variables and redeploy.
      </div>
    );
  }

  return (
    <div>
      <div
        ref={mapRef}
        style={{ width: "100%", height: 380, borderRadius: 14, overflow: "hidden", border: "1px solid #e5e7eb", marginBottom: 12 }}
      />

      {selIdea && (
        <div style={{ padding: 14, background: "#fff", border: "1.5px solid #c4b5fd", borderRadius: 12, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ fontSize: 24 }}>{selIdea.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{selIdea.title}</div>
              <div style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 8px" }}>📍 {selIdea.location}</div>
              <div style={{ display: "flex", gap: 7 }}>
                <a href={mapsUrl(selIdea)} target="_blank" rel="noreferrer" style={{ fontFamily: "Georgia, serif", fontSize: 11, padding: "5px 11px", borderRadius: 7, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", textDecoration: "none", fontWeight: 600 }}>
                  Open in Maps ↗
                </a>
                <button onClick={() => { setSel(null); onSelect(selIdea); }} style={{ fontFamily: "Georgia, serif", fontSize: 11, padding: "5px 11px", borderRadius: 7, background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe", cursor: "pointer", fontWeight: 600 }}>
                  See Details
                </button>
                <button onClick={() => setSel(null)} style={{ fontFamily: "Georgia, serif", fontSize: 11, padding: "5px 11px", borderRadius: 7, background: "#f9fafb", color: "#9ca3af", border: "1px solid #e5e7eb", cursor: "pointer", fontWeight: 600 }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {ideas.map((idea) => (
          <button key={idea.id} onClick={() => {
            setSel(sel === idea.id ? null : idea.id);
            if (mapInstanceRef.current) mapInstanceRef.current.panTo({ lat: idea.lat, lng: idea.lng });
          }} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "7px 9px",
            background: sel === idea.id ? "#f5f3ff" : "#fafafa",
            border: `1px solid ${sel === idea.id ? "#c4b5fd" : "#f3f4f6"}`,
            borderRadius: 7, cursor: "pointer", textAlign: "left",
            fontFamily: "Georgia, serif",
          }}>
            <span style={{ fontSize: 14 }}>{idea.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {idea.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
