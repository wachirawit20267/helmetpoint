const trips = [
  {
    date: "08/07/2026",
    distance: "12.5 km",
    score: "96",
  },
  {
    date: "07/07/2026",
    distance: "8.3 km",
    score: "93",
  },
  {
    date: "06/07/2026",
    distance: "15.8 km",
    score: "98",
  },
];

export default function RecentTrips() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        Recent Trips
      </h2>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left">วันที่</th>
              <th className="py-3 text-left">ระยะทาง</th>
              <th className="py-3 text-left">Safety Score</th>
            </tr>
          </thead>

          <tbody>
            {trips.map((trip) => (
              <tr key={trip.date} className="border-b">
                <td className="py-4">{trip.date}</td>
                <td>{trip.distance}</td>
                <td className="font-bold text-orange-500">
                  {trip.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}