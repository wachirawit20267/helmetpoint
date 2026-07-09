"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useApp } from "@/contexts/AppContext";

export default function DevicePage() {
  const { helmetStatus, helmetData, connectHelmet, disconnectHelmet, restartHelmet, deleteHelmet, t } = useApp();
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectMethod, setConnectMethod] = useState<"select" | "bluetooth" | "qrcode" | "manual">("select");
  const [serialCode, setSerialCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [btDevices, setBtDevices] = useState<string[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  // Trigger simulated Bluetooth search
  const startBluetoothSearch = () => {
    setIsScanning(true);
    setBtDevices([]);
    setTimeout(() => {
      setBtDevices(["SmartHelmet v1.0 (HP-2026)", "SmartHelmet v1.0 (HP-8839)", "Unknown Device (BLE)"]);
      setIsScanning(false);
    }, 1500);
  };

  // Trigger simulated QR Scanner
  const startQRScanner = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setConnectingId("HP-2026");
      handleConnect("HP-2026");
    }, 2000);
  };

  const handleConnect = async (id: string) => {
    setConnectingId(id);
    await connectHelmet(id);
    setConnectingId(null);
    setShowConnectModal(false);
    setConnectMethod("select");
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-xl mx-auto pb-10">
        
        {/* Connection Status Header */}
        <div className="rounded-[2rem] bg-white p-8 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg text-center space-y-6 transition-all duration-300">
          
          {helmetStatus === "off" || !helmetData.helmetId ? (
            /* Empty State: No Device Connected */
            <div className="py-8 space-y-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 mx-auto text-4xl shadow-inner border border-slate-100 dark:border-slate-800 animate-pulse">
                🪖
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  ไม่มีอุปกรณ์ (No Device)
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium max-w-xs mx-auto">
                  ยังไม่ได้เชื่อมต่อหมวกกันน็อกอัจฉริยะ กรุณาคลิกปุ่มด้านล่างเพื่อสแกนและจับคู่อุปกรณ์
                </p>
              </div>

              {/* Pulsing Add Device Button */}
              <button
                onClick={() => {
                  setShowConnectModal(true);
                  setConnectMethod("select");
                }}
                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white text-3xl font-black shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-300 relative group"
              >
                <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-25 group-hover:opacity-0 transition-opacity"></span>
                ➕
              </button>
            </div>
          ) : (
            /* Connected State: Displays detailed telemetry */
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🪖</span>
                  <div className="text-left">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                      {helmetData.helmetId}
                    </h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                      🟢 Connected
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 font-semibold font-mono">
                  Sync: Live
                </div>
              </div>

              {/* Details table grid */}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("helmetId")}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white mt-1 block font-mono">{helmetData.helmetId}</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("firmware")}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white mt-1 block font-mono">{helmetData.firmware}</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("battery")}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white mt-1 block font-mono">🔋 {helmetData.battery}%</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("signal")}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white mt-1 block font-mono">📶 {helmetData.signal}</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Bluetooth / WiFi</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white mt-1 block font-mono">Connected</span>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{t("lastSync")}</span>
                  <span className="text-sm font-black text-slate-800 dark:text-white mt-1 block font-mono">2 sec ago</span>
                </div>
              </div>

              {/* Action Control Buttons */}
              <div className="pt-4 grid grid-cols-3 gap-3">
                <button
                  onClick={disconnectHelmet}
                  className="py-3 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all"
                >
                  🔌 {t("disconnectBtn")}
                </button>

                <button
                  onClick={restartHelmet}
                  className="py-3 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all"
                >
                  🔄 {t("restartBtn")}
                </button>

                <button
                  onClick={deleteHelmet}
                  className="py-3 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-bold text-xs rounded-2xl transition-all"
                >
                  🗑️ {t("deleteBtn")}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Device Connect Modal popup */}
        {showConnectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-md rounded-[2.5rem] bg-white dark:bg-slate-900 p-8 shadow-2xl space-y-6 animate-scale-up border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
              
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">เชื่อมต่อหมวกนิรภัย</h3>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 hover:scale-105 active:scale-95 transition"
                >
                  ✕
                </button>
              </div>

              {connectMethod === "select" && (
                /* Select connection protocol */
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setConnectMethod("bluetooth");
                      startBluetoothSearch();
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-500/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <div>
                        <h4 className="font-bold text-sm">ค้นหาผ่าน Bluetooth</h4>
                        <p className="text-[10px] text-slate-400">ค้นหาอุปกรณ์ Smart Helmet ใกล้เคียง</p>
                      </div>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </button>

                  <button
                    onClick={() => {
                      setConnectMethod("qrcode");
                      startQRScanner();
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-500/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📷</span>
                      <div>
                        <h4 className="font-bold text-sm">สแกน QR Code</h4>
                        <p className="text-[10px] text-slate-400">สแกนรหัสจากตัวหมวกเพื่อจับคู่ทันที</p>
                      </div>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </button>

                  <button
                    onClick={() => setConnectMethod("manual")}
                    className="w-full text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-500/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✏️</span>
                      <div>
                        <h4 className="font-bold text-sm">กรอกรหัสอุปกรณ์ด้วยตนเอง</h4>
                        <p className="text-[10px] text-slate-400">กรอกรหัส Helmet ID ที่ติดอยู่บนกล่อง</p>
                      </div>
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform">➔</span>
                  </button>
                </div>
              )}

              {connectMethod === "bluetooth" && (
                /* Bluetooth search simulation */
                <div className="space-y-4 text-center">
                  {isScanning ? (
                    <div className="py-6 space-y-4">
                      <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs text-slate-400 font-bold">กำลังค้นหาอุปกรณ์ Bluetooth...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 text-left font-bold mb-2">อุปกรณ์ที่พบ:</p>
                      {btDevices.map((device) => (
                        <button
                          key={device}
                          onClick={() => handleConnect("HP-2026")}
                          disabled={connectingId !== null}
                          className="w-full p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-orange-500 hover:text-white border border-slate-100 dark:border-slate-800 font-mono text-xs font-bold transition-all"
                        >
                          {connectingId === "HP-2026" ? "Connecting..." : `🔗 ${device}`}
                        </button>
                      ))}
                      <button
                        onClick={startBluetoothSearch}
                        className="mt-4 text-xs font-bold text-orange-500 hover:underline"
                      >
                        🔄 สแกนหาอีกครั้ง
                      </button>
                    </div>
                  )}
                </div>
              )}

              {connectMethod === "qrcode" && (
                /* QR code scanner simulation */
                <div className="space-y-4 text-center py-6">
                  <div className="relative h-44 w-44 mx-auto rounded-3xl overflow-hidden bg-slate-900 border-2 border-orange-500 flex items-center justify-center text-white">
                    {/* Simulated laser scan bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-bounce shadow-md"></div>
                    <span className="text-4xl">📷</span>
                  </div>
                  <p className="text-xs text-slate-400 font-bold">
                    {isScanning ? "กำลังเปิดกล้องและอ่านค่า QR Code..." : "สแกนรหัสสำเร็จ! กำลังจับคู่..."}
                  </p>
                </div>
              )}

              {connectMethod === "manual" && (
                /* Manual text input code */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      กรอกรหัส Helmet ID
                    </label>
                    <input
                      type="text"
                      value={serialCode}
                      onChange={(e) => setSerialCode(e.target.value)}
                      placeholder="เช่น HP-2026"
                      className="w-full rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-3 px-4 font-mono font-bold text-center outline-none ring-2 ring-transparent transition focus:border-orange-500 focus:ring-orange-500/20"
                    />
                  </div>

                  <button
                    onClick={() => handleConnect(serialCode || "HP-2026")}
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-[1.01]"
                  >
                    เชื่อมต่ออุปกรณ์
                  </button>
                </div>
              )}

              {/* Back to selector */}
              {connectMethod !== "select" && (
                <button
                  onClick={() => setConnectMethod("select")}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 pt-2"
                >
                  ⬅ กลับไปที่ตัวเลือกการเชื่อมต่อ
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}