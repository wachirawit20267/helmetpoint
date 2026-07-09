"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useApp, UserProfile } from "@/contexts/AppContext";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user, setUser, updateProfilePhoto, t } = useApp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [career, setCareer] = useState("Student");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setBirthday(user.birthday || "");
      setCareer(user.career || "Student");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  // Handle profile image selection and convert to base64
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPhotoURL(base64);
      try {
        await updateProfilePhoto(base64);
      } catch (err) {
        // If Firebase not connected yet, just keep locally
        const updated = { ...user, photoURL: base64 } as UserProfile;
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");

    if (!auth.currentUser) {
      setSuccessMsg("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    const updatedFields = {
      firstName,
      lastName,
      birthday,
      career,
      email,
      phone,
      photoURL,
    };

    try {
      // Save to Firestore — onSnapshot in AppContext will auto-update user state
      await updateDoc(doc(db, "users", auth.currentUser.uid), updatedFields);
      setSuccessMsg(t("saveSuccess"));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setSuccessMsg("เกิดข้อผิดพลาด: " + (err.message || "ไม่สามารถบันทึกได้"));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-xl mx-auto pb-10">

        {/* Profile Avatar + Photo Upload */}
        <div className="rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 dark:border-slate-800 pb-7 mb-6">

            {/* Avatar / Photo */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden ring-4 ring-orange-500/30 shadow-xl">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-tr from-orange-500 to-orange-400 text-3xl font-black text-white">
                    {firstName.charAt(0) || "?"}
                  </div>
                )}
              </div>

              {/* Camera upload button overlay */}
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-slate-900 dark:bg-white border-2 border-white dark:border-slate-900 flex items-center justify-center cursor-pointer text-white dark:text-slate-900 text-sm hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white hover:border-orange-500 transition-all duration-300 shadow-md"
                title="เปลี่ยนรูปโปรไฟล์"
              >
                📷
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                {firstName} {lastName}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold capitalize">
                {career}
              </p>
              <p className="text-xs text-orange-500 font-bold mt-2">
                กดไอคอน 📷 เพื่อเปลี่ยนรูปโปรไฟล์
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {/* First & Last Name side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {t("firstName")}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 px-4 text-sm font-semibold outline-none ring-2 ring-transparent transition focus:border-orange-500 focus:ring-orange-500/20 text-slate-800 dark:text-white placeholder-slate-400"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {t("lastName")}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 px-4 text-sm font-semibold outline-none ring-2 ring-transparent transition focus:border-orange-500 focus:ring-orange-500/20 text-slate-800 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Birthday */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {t("birthday")}
              </label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 px-4 text-sm font-semibold outline-none ring-2 ring-transparent transition focus:border-orange-500 focus:ring-orange-500/20 text-slate-800 dark:text-white"
              />
            </div>

            {/* Career */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {t("career")}
              </label>
              <select
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 px-4 text-sm font-semibold outline-none ring-2 ring-transparent transition focus:border-orange-500 focus:ring-orange-500/20 text-slate-800 dark:text-white cursor-pointer"
              >
                <option value="Student">{t("careerStudent")}</option>
                <option value="University Student">{t("careerUniStudent")}</option>
                <option value="Teacher">{t("careerTeacher")}</option>
                <option value="Other">{t("careerOther")}</option>
              </select>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 px-4 text-sm font-semibold outline-none ring-2 ring-transparent transition focus:border-orange-500 focus:ring-orange-500/20 text-slate-800 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {t("phone")}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 px-4 text-sm font-semibold outline-none ring-2 ring-transparent transition focus:border-orange-500 focus:ring-orange-500/20 text-slate-800 dark:text-white placeholder-slate-400"
              />
            </div>

            {successMsg && (
              <div className="rounded-full bg-emerald-500 text-white py-3.5 text-center font-bold text-sm shadow-md animate-fade-in-up">
                ✅ {successMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-orange-500 hover:bg-orange-600 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {t("saveChanges")}
            </button>
          </form>
        </div>

      </div>
    </AppLayout>
  );
}
