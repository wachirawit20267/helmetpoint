type DeviceItemProps = {
  icon: string;
  label: string;
  value: string;
  color?: string;
};

function DeviceItem({
  icon,
  label,
  value,
  color = "text-green-500",
}: DeviceItemProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>

        <div>
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-white">
            {value}
          </h3>
        </div>
      </div>

      <div className={`h-3 w-3 rounded-full bg-current ${color}`} />
    </div>
  );
}

export default function DeviceStatus() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-slate-900">
      <h2 className="mb-6 text-2xl font-bold">
        Device Status
      </h2>

      <div className="space-y-4">
        <DeviceItem
          icon="🪖"
          label="Helmet"
          value="Connected"
        />

        <DeviceItem
          icon="🔋"
          label="Battery"
          value="87%"
          color="text-orange-500"
        />

        <DeviceItem
          icon="📍"
          label="GPS"
          value="Active"
          color="text-blue-500"
        />

        <DeviceItem
          icon="📡"
          label="Wi-Fi"
          value="Connected"
        />

        <DeviceItem
          icon="🌡"
          label="Temperature"
          value="31°C"
        />

        <DeviceItem
          icon="🕒"
          label="Last Update"
          value="2 sec ago"
        />
      </div>
    </div>
  );
}