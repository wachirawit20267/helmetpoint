export default function Features() {

  const features = [

    {
      icon: "🪖",
      title: "ตรวจจับการสวมหมวก",
      desc: "ตรวจสอบการสวมหมวกแบบอัตโนมัติ"
    },

    {
      icon: "📍",
      title: "GPS Tracking",
      desc: "บันทึกระยะทางการเดินทาง"
    },

    {
      icon: "🏆",
      title: "สะสมคะแนน",
      desc: "ทุกกิโลเมตรมีคะแนนสะสม"
    },

    {
      icon: "📈",
      title: "Dashboard",
      desc: "ดูข้อมูลแบบเรียลไทม์"
    }

  ];

  return (

    <section
      id="features"
      className="max-w-7xl mx-auto py-24 px-6"
    >

      <h2 className="text-4xl font-bold text-center">
        คุณสมบัติเด่น
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

        {features.map((item) => (

          <div
            key={item.title}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition"
          >

            <div className="text-5xl">
              {item.icon}
            </div>

            <h3 className="font-bold text-xl mt-6">
              {item.title}
            </h3>

            <p className="text-gray-500 mt-3">
              {item.desc}
            </p>

          </div>

        ))}

      </div>

    </section>

  );
}