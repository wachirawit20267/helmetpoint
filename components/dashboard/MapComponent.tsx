"use client";

import { useEffect, useRef, useState } from "react";

interface MapComponentProps {
  gps: { lat: number; lng: number };
  isActive: boolean;
}

export default function MapComponent({ gps, isActive }: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const pathCoordinatesRef = useRef<[number, number][]>([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet CDN script & styles dynamically on mount
  useEffect(() => {
    // Check if already loaded
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Append CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Append JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Clean up assets
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !isActive) return;

    const L = (window as any).L;
    if (!L) return;

    // Reset path when starting
    pathCoordinatesRef.current = [[gps.lat, gps.lng]];

    // Create Map instance
    const map = L.map("leaflet-map-container", {
      zoomControl: true,
      attributionControl: false,
    }).setView([gps.lat, gps.lng], 15);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Create Custom Icon (Orange Marker)
    const customIcon = L.divIcon({
      className: "custom-div-icon",
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute h-6 w-6 rounded-full bg-orange-500/30 animate-ping"></div>
          <div class="h-4 w-4 rounded-full border-2 border-white bg-orange-500 shadow-md"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // Create Marker
    const marker = L.marker([gps.lat, gps.lng], { icon: customIcon }).addTo(map);
    
    // Create Route Line (Polyline)
    const polyline = L.polyline(pathCoordinatesRef.current, {
      color: "#EA580C", // safety orange
      weight: 4,
      opacity: 0.8,
      lineJoin: "round",
    }).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;
    polylineRef.current = polyline;

    // Fix map rendering issue in tabs / hidden items
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, isActive]);

  // Update position on GPS telemetry change
  useEffect(() => {
    if (!mapRef.current || !gps) return;
    const L = (window as any).L;
    if (!L) return;

    const newLatLng = [gps.lat, gps.lng] as [number, number];
    
    // Smoothly pan map to new position
    mapRef.current.panTo(newLatLng);

    // Move Marker
    if (markerRef.current) {
      markerRef.current.setLatLng(newLatLng);
    }

    // Add coordinate to track history
    const lastCoords = pathCoordinatesRef.current[pathCoordinatesRef.current.length - 1];
    if (!lastCoords || lastCoords[0] !== gps.lat || lastCoords[1] !== gps.lng) {
      pathCoordinatesRef.current.push(newLatLng);
      if (polylineRef.current) {
        polylineRef.current.setLatLngs(pathCoordinatesRef.current);
      }
    }
  }, [gps]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
      {!leafletLoaded ? (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-400">
          กำลังเปิดแผนที่ (Loading GPS Map...)
        </div>
      ) : (
        <div id="leaflet-map-container" className="h-full w-full z-10" />
      )}
    </div>
  );
}
