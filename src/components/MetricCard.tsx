import { MetricData } from "../types/dashboard";

export function MetricCard({
  title,
  voltage,
  current,
  power,
  status,
  icon: Icon,
}: MetricData) {
  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-zinc-700 dark:text-zinc-300">
          {title}
        </h3>
        <Icon className="w-5 h-5 text-zinc-400" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-zinc-500">Voltaje</span>
          <span className="text-lg font-semibold tracking-tight">
            {voltage.toFixed(2)} V
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-zinc-500">Corriente</span>
          <span className="text-lg font-semibold tracking-tight">
            {current.toFixed(2)} A
          </span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-sm font-medium">Potencia</span>
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {power.toFixed(2)} W
          </span>
        </div>
        {status && (
          <div className="text-xs text-right text-zinc-400 mt-1">
            Status:{" "}
            <span className="text-zinc-600 dark:text-zinc-200">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
}
