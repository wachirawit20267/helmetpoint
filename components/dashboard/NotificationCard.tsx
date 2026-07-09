const notifications = [
  {
    title: "เชื่อมต่อหมวกสำเร็จ",
    time: "2 นาทีที่แล้ว",
  },
  {
    title: "GPS พร้อมใช้งาน",
    time: "5 นาทีที่แล้ว",
  },
  {
    title: "Safety Score เพิ่มขึ้น",
    time: "10 นาทีที่แล้ว",
  },
];

export default function NotificationCard() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Notifications
      </h2>

      <div className="mt-6 space-y-4">
        {notifications.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800"
          >
            <h3 className="font-semibold">
              {item.title}
            </h3>

            <p className="text-sm text-slate-500">
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}