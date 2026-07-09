"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  addDoc 
} from "firebase/firestore";
import { loginUser as firebaseLogin, registerUser as firebaseRegister, logoutUser as firebaseLogout } from "@/services/auth";

export const translations = {
  th: {
    dashboard: "หน้าแรก",
    device: "เชื่อมต่อหมวก",
    history: "ประวัติการเดินทาง",
    ranking: "อันดับผู้ขับขี่",
    profile: "ข้อมูลส่วนตัว",
    settings: "ตั้งค่าระบบ",
    logout: "ออกจากระบบ",
    helmetStatus: "สถานะหมวก",
    connected: "เชื่อมต่อแล้ว",
    connecting: "กำลังเชื่อมต่อ",
    disconnected: "ยังไม่ได้เชื่อมต่อ",
    powerOff: "ปิดเครื่อง",
    noDevice: "ไม่มีอุปกรณ์",
    addDevice: "เพิ่มอุปกรณ์",
    helmetId: "รหัสหมวก (Helmet ID)",
    firmware: "เฟิร์มแวร์",
    battery: "แบตเตอรี่",
    signal: "สัญญาณ",
    lastSync: "ซิงค์ล่าสุด",
    disconnectBtn: "ยกเลิกการเชื่อมต่อ",
    restartBtn: "รีสตาร์ท",
    deleteBtn: "ลบอุปกรณ์",
    score: "คะแนนความปลอดภัย",
    distance: "ระยะทางสะสม",
    summaryToday: "สรุปวันนี้",
    ridingTime: "เวลาขับขี่",
    wearCount: "จำนวนครั้งใส่หมวก",
    rank: "อันดับที่",
    avgSpeed: "ความเร็วเฉลี่ย",
    searchDate: "ค้นหาวันที่...",
    filterToday: "วันนี้",
    filterWeek: "สัปดาห์นี้",
    filterMonth: "เดือนนี้",
    filterYear: "ปีนี้",
    filterAll: "ทั้งหมด",
    saveSuccess: "บันทึกสำเร็จ",
    changePassword: "เปลี่ยนรหัสผ่าน",
    currentPassword: "รหัสผ่านปัจจุบัน",
    newPassword: "รหัสผ่านใหม่",
    confirmNewPassword: "ยืนยันรหัสผ่านใหม่",
    saveChanges: "บันทึกการเปลี่ยนแปลง",
    careerStudent: "นักเรียน",
    careerUniStudent: "นักศึกษา",
    careerTeacher: "ครู",
    careerOther: "อื่นๆ",
    firstName: "ชื่อ",
    lastName: "นามสกุล",
    birthday: "วันเกิด",
    career: "อาชีพ",
    phone: "เบอร์โทรศัพท์",
    email: "อีเมล",
    theme: "ธีม",
    themeLight: "☀️ Light",
    themeDark: "🌙 Dark",
    language: "ภาษา",
    langTh: "ไทย",
    langEn: "English",
    agreeTerms: "ยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว",
    welcomeBack: "ยินดีต้อนรับกลับ",
    loginTitle: "เข้าสู่ระบบ",
    registerTitle: "สมัครสมาชิก",
    noAccount: "ยังไม่มีบัญชีใช่ไหม? สมัครสมาชิก/Register",
    hasAccount: "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ (Login)",
    helmetConnectedNotify: "🟢 Helmet Connected",
    helmetDisconnectedNotify: "🔴 Helmet Disconnected",
    lowBatteryNotify: "🔋 Battery ต่ำกว่า 20%",
    crashDetectedNotify: "⚠ ตรวจพบการล้ม",
  },
  en: {
    dashboard: "Home",
    device: "Device",
    history: "History",
    ranking: "Ranking",
    profile: "Profile",
    settings: "Setting",
    logout: "Logout",
    helmetStatus: "Helmet Status",
    connected: "Connected",
    connecting: "Connecting",
    disconnected: "Disconnected",
    powerOff: "Power Off",
    noDevice: "No Device",
    addDevice: "Add Device",
    helmetId: "Helmet ID",
    firmware: "Firmware",
    battery: "Battery",
    signal: "Signal",
    lastSync: "Last Sync",
    disconnectBtn: "Disconnect",
    restartBtn: "Restart",
    deleteBtn: "Delete",
    score: "Safety Score",
    distance: "Distance",
    summaryToday: "Today's Summary",
    ridingTime: "Riding Time",
    wearCount: "Wear Count",
    rank: "Rank",
    avgSpeed: "Avg Speed",
    searchDate: "Search date...",
    filterToday: "Today",
    filterWeek: "This Week",
    filterMonth: "This Month",
    filterYear: "This Year",
    filterAll: "All",
    saveSuccess: "Saved successfully",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    saveChanges: "Save Changes",
    careerStudent: "Student",
    careerUniStudent: "University Student",
    careerTeacher: "Teacher",
    careerOther: "Others",
    firstName: "First Name",
    lastName: "Last Name",
    birthday: "Birthday",
    career: "Career",
    phone: "Phone",
    email: "Email",
    theme: "Theme",
    themeLight: "☀️ Light",
    themeDark: "🌙 Dark",
    language: "Language",
    langTh: "ไทย",
    langEn: "English",
    agreeTerms: "Accept Terms and Privacy Policy",
    welcomeBack: "Welcome Back",
    loginTitle: "Login",
    registerTitle: "Register",
    noAccount: "Don't have an account? Register",
    hasAccount: "Already have an account? Login",
    helmetConnectedNotify: "🟢 Helmet Connected",
    helmetDisconnectedNotify: "🔴 Helmet Disconnected",
    lowBatteryNotify: "🔋 Battery below 20%",
    crashDetectedNotify: "⚠ Crash Detected",
  },
};

export type LanguageType = "th" | "en";
export type ThemeType = "light" | "dark";
export type HelmetStatusType = "connected" | "connecting" | "disconnected" | "off";

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthday: string;
  career: string;
  helmetId?: string;
  photoURL?: string;
  points?: number;
  safetyScore?: number;
}

export interface HelmetData {
  helmetId: string;
  firmware: string;
  battery: number;
  signal: string;
  gps: { lat: number; lng: number };
  distance: number;
  speed: number;
  crashDetect: boolean;
  helmetWear: boolean;
  time: string;
}

export interface TripRecord {
  id: string;
  date: string;
  time: string;
  distance: number;
  score: number;
  avgSpeed: number;
  status: "completed" | "alert" | "crash";
}

export interface NotificationItem {
  id: string;
  text: string;
  type: "info" | "warning" | "error" | "success";
  time: string;
}

interface AppContextProps {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  helmetStatus: HelmetStatusType;
  setHelmetStatus: (status: HelmetStatusType) => void;
  helmetData: HelmetData;
  setHelmetData: React.Dispatch<React.SetStateAction<HelmetData>>;
  notifications: NotificationItem[];
  addNotification: (text: string, type?: NotificationItem["type"]) => void;
  clearNotifications: () => void;
  history: TripRecord[];
  setHistory: React.Dispatch<React.SetStateAction<TripRecord[]>>;
  login: (email: string, password: string) => Promise<void>;
  register: (profile: UserProfile & { password?: string }) => Promise<void>;
  logout: () => Promise<void>;
  connectHelmet: (id?: string) => Promise<void>;
  disconnectHelmet: () => void;
  restartHelmet: () => Promise<void>;
  deleteHelmet: () => void;
  triggerCrash: () => void;
  updateProfilePhoto: (base64Image: string) => Promise<void>;
  t: (key: keyof typeof translations["th"]) => string;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Config state
  const [language, setLanguageState] = useState<LanguageType>("th");
  const [theme, setThemeState] = useState<ThemeType>("light");

  // User & Telemetry States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [helmetStatus, setHelmetStatus] = useState<HelmetStatusType>("disconnected");
  const [helmetData, setHelmetData] = useState<HelmetData>({
    helmetId: "",
    firmware: "",
    battery: 0,
    signal: "",
    gps: { lat: 13.7563, lng: 100.5018 },
    distance: 0,
    speed: 0,
    crashDetect: false,
    helmetWear: false,
    time: "",
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // History State
  const [history, setHistory] = useState<TripRecord[]>([]);

  // Ref to hold latest safetyScore without stale closure
  const safetyScoreRef = useRef<number>(100);
  const safeStreak = useRef<number>(0); // counts consecutive safe riding intervals

  // Helper translations
  const t = (key: keyof typeof translations["th"]): string => {
    return translations[language][key] || translations["th"][key] || String(key);
  };

  // Add notification helper
  const addNotification = (text: string, type: NotificationItem["type"] = "info") => {
    const newNotif: NotificationItem = {
      id: Math.random().toString(),
      text,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 19)]);
  };

  // Keep ref in sync with user profile
  useEffect(() => {
    if (user?.safetyScore !== undefined) {
      safetyScoreRef.current = user.safetyScore;
    }
  }, [user?.safetyScore]);

  // Stable refs for Firestore listeners (so we can clean them up when auth state changes)
  const unsubProfileRef = useRef<(() => void) | null>(null);
  const unsubTripsRef = useRef<(() => void) | null>(null);

  // On mount session management & default configs — runs ONCE only
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as LanguageType;
    if (savedLang) setLanguageState(savedLang);

    const savedTheme = localStorage.getItem("theme") as ThemeType;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    // Auth Session listener — stable, mounted only once
    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      // Always clean up previous Firestore listeners first
      if (unsubProfileRef.current) { unsubProfileRef.current(); unsubProfileRef.current = null; }
      if (unsubTripsRef.current)   { unsubTripsRef.current();   unsubTripsRef.current = null;   }

      if (fbUser) {
        // Listen to Firestore profile
        const userDocRef = doc(db, "users", fbUser.uid);
        unsubProfileRef.current = onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUser(data);
            // Auto-reconnect helmet if the user's profile has a helmetId
            setHelmetStatus((prev) => {
              if (data.helmetId && (prev === "disconnected" || prev === "off")) {
                setHelmetData((pd) => ({ ...pd, helmetId: data.helmetId! }));
                return "connected";
              }
              return prev;
            });
          }
        });

        // Listen to Trip History (real data only)
        const tripsQuery = query(
          collection(db, "users", fbUser.uid, "trips"),
          orderBy("date", "desc")
        );
        unsubTripsRef.current = onSnapshot(tripsQuery, (snap) => {
          const trips: TripRecord[] = [];
          snap.forEach((docSnap) => {
            trips.push({ id: docSnap.id, ...docSnap.data() } as TripRecord);
          });
          setHistory(trips);
        });
      } else {
        // Logged out — clear all state
        setUser(null);
        setHelmetStatus("off");
        setHistory([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubProfileRef.current) unsubProfileRef.current();
      if (unsubTripsRef.current)   unsubTripsRef.current();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← mount ONCE only — no dependency on helmetStatus

  // Telemetry document listener when a helmet connects
  useEffect(() => {
    if (helmetStatus === "connected" && helmetData.helmetId) {
      const helmetDocRef = doc(db, "helmets", helmetData.helmetId);
      
      const unsubHelmet = onSnapshot(helmetDocRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setHelmetData(prev => {
            const nextData = {
              ...prev,
              battery: data.battery ?? prev.battery,
              gps: data.gps ?? prev.gps,
              distance: data.distance ?? prev.distance,
              speed: data.speed ?? prev.speed,
              crashDetect: data.crashDetect ?? prev.crashDetect,
              helmetWear: data.helmetWear ?? prev.helmetWear,
              time: new Date().toLocaleTimeString()
            };

            // Trigger alerts based on telemetry change
            if (prev.battery >= 20 && nextData.battery < 20) {
              addNotification(t("lowBatteryNotify"), "warning");
            }
            if (!prev.crashDetect && nextData.crashDetect) {
              addNotification(t("crashDetectedNotify"), "error");
            }
            return nextData;
          });
        } else {
          // Initialize fresh record for a newly registered helmet (all zeros — no demo data)
          setDoc(helmetDocRef, {
            battery: 0,
            gps: { lat: 13.7563, lng: 100.5018 },
            distance: 0,
            speed: 0,
            crashDetect: false,
            helmetWear: false,
            updatedAt: new Date().toISOString()
          });
        }
      });

      return () => unsubHelmet();
    }
  }, [helmetStatus, helmetData.helmetId]);

  // ─── Safety Score & Points Engine (interval every 5s) ────────────────
  useEffect(() => {
    if (helmetStatus !== "connected" || !auth.currentUser) return;

    const scoreTimer = setInterval(async () => {
      let score = safetyScoreRef.current;
      const speed = helmetData.speed;
      const worn = helmetData.helmetWear;
      const crashed = helmetData.crashDetect;

      // ── ระบบสมัครใจ: ไม่หักคะแนนเมื่อไม่ใส่หมวกหรืออุบัติเหตุ ────────────────
      if (crashed) {
        addNotification("💥 ตรวจพบอุบัติเหตุ! ระวังด้วยนะครับ", "error");
      }
      if (!worn && speed > 0) {
        addNotification("🪖 แนะนำให้สวมหมวกกันน็อกเพื่อความปลอดภัย", "warning");
      }
      
      // ── ระบบควบคุมความเร็ว: หักคะแนนแต่ไม่เยอะ ────────────────────
      if (speed > 80) {
        score = Math.max(0, score - 1); // หักคะแนนความเร็วเกินกำหนดเล็กน้อย (-1 คะแนน)
        addNotification("🏎️ ความเร็วเกิน 80 กม./ชม. หัก -1 คะแนน", "warning");
      }

      // ── โบนัสสะสมสำหรับพฤติกรรมปลอดภัย ──────────────────────────
      if (worn && speed > 0 && speed <= 80 && !crashed) {
        // +2 คะแนนเมื่อสวมหมวกและขับขี่
        score = Math.min(100, score + 2);
        safeStreak.current += 1;

        // +5 โบนัสเมื่อขับในช่วงความเร็วปลอดภัย 20-60 กม./ชม.
        if (speed >= 20 && speed <= 60) {
          score = Math.min(100, score + 1);
        }

        // โบนัส streak ทุก 60 วินาที (12 รอบ × 5 วินาที)
        if (safeStreak.current % 12 === 0) {
          score = Math.min(100, score + 5);
          addNotification("🌟 ขับขี่ปลอดภัยต่อเนื่อง! ได้รับโบนัส +5 คะแนน", "success");
        }
      } else if (!worn || crashed || speed > 80) {
        // ไม่สวมหมวก/เกิดอุบัติ/เร็วเกิน → แค่ reset streak ไม่หักคะแนน
        safeStreak.current = 0;
      }

      // คะแนนไม่ต่ำกว่า 0
      score = Math.max(0, score);
      safetyScoreRef.current = score;

      // ── คำนวณแต้มสะสม (Rank Points) ───────────────────────────────
      // Base 100 + ระยะทาง×10 + โบนัสจากคะแนนความปลอดภัย
      const currentPoints = Math.round(
        100 + (helmetData.distance * 10) + Math.floor(score / 10)
      );

      // ── บันทึกลง Firestore ─────────────────────────────────────────
      try {
        const userDocRef = doc(db, "users", auth.currentUser!.uid);
        const writeOp = updateDoc(userDocRef, {
          safetyScore: score,
          points: currentPoints,
          distance: helmetData.distance,
        });
        await Promise.race([
          writeOp,
          new Promise((_, r) => setTimeout(() => r("timeout"), 2000)),
        ]);
      } catch (e) {
        console.warn("Score update delayed:", e);
      }
    }, 5000);

    return () => clearInterval(scoreTimer);
  }, [helmetStatus, helmetData.speed, helmetData.helmetWear, helmetData.crashDetect, helmetData.distance]);

  const clearNotifications = () => setNotifications([]);

  // ── Real Auth Operations ─────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    await firebaseLogin(email, password);
  };

  const register = async (profile: UserProfile & { password?: string }) => {
    await firebaseRegister(profile);
  };

  const logout = async () => {
    await firebaseLogout();
    setUser(null);
    setHelmetStatus("off");
    setHistory([]);
  };

  // Helmet Bindings
  const connectHelmet = async (id?: string) => {
    if (!auth.currentUser) return;
    setHelmetStatus("connecting");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const targetId = id || "HP-2026";
    
    // Bind to profile
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, { helmetId: targetId });
    
    setHelmetStatus("connected");
    setHelmetData((prev) => ({
      ...prev,
      helmetId: targetId,
    }));
    addNotification("🟢 Helmet Connected", "success");
  };

  const disconnectHelmet = async () => {
    if (!auth.currentUser) return;
    setHelmetStatus("disconnected");
    
    // Unbind from profile
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, { helmetId: "" });
    
    setHelmetData((prev) => ({ ...prev, helmetId: "", speed: 0, helmetWear: false }));
    addNotification("🔴 Helmet Disconnected", "error");
  };

  const restartHelmet = async () => {
    setHelmetStatus("connecting");
    addNotification("🔄 กำลังเริ่มระบบใหม่...", "info");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setHelmetStatus("connected");
    addNotification("🟢 Helmet Connected", "success");
  };

  const deleteHelmet = async () => {
    await disconnectHelmet();
    setHelmetStatus("off");
  };

  const triggerCrash = async () => {
    if (!helmetData.helmetId) return;
    const helmetDocRef = doc(db, "helmets", helmetData.helmetId);
    await updateDoc(helmetDocRef, { crashDetect: true });
    
    // Reset crash in database after 8 seconds
    setTimeout(async () => {
      await updateDoc(helmetDocRef, { crashDetect: false });
    }, 8000);
  };

  // Upload profile photo as base64 string
  const updateProfilePhoto = async (base64Image: string) => {
    if (!auth.currentUser) return;
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, { photoURL: base64Image });
    addNotification("🖼️ อัปเดตรูปโปรไฟล์สำเร็จ", "success");
  };

  // Update theme helper
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Update language helper
  const setLanguage = (newLang: LanguageType) => {
    setLanguageState(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        language,
        setLanguage,
        theme,
        setTheme,
        helmetStatus,
        setHelmetStatus,
        helmetData,
        setHelmetData,
        notifications,
        addNotification,
        clearNotifications,
        history,
        setHistory,
        login,
        register,
        logout,
        connectHelmet,
        disconnectHelmet,
        restartHelmet,
        deleteHelmet,
        triggerCrash,
        updateProfilePhoto,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
