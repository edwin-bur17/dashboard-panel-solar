"use client";
import { useState, useEffect } from "react";
import { Sun, BatteryCharging, Lightbulb, Activity } from "lucide-react";
import { MetricCard } from "@/src/components/MetricCard";

import { MetricData } from "@/src/types/dashboard";

export default function DashboardPage() {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const metrics: MetricData[] = [
    {
      title: "Panel Solar",
      voltage: 5.2,
      current: 1.1,
      power: 5.72,
      icon: Sun,
    },
    {
      title: "Batería Litio",
      voltage: 3.7,
      current: -0.5,
      power: 1.85,
      status: "Cargando",
      icon: BatteryCharging,
    },
    {
      title: "Carga LEDs",
      voltage: 5.0,
      current: 0.9,
      power: 4.5,
      icon: Lightbulb,
    },
  ];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-6 space-y-8 text-zinc-900 dark:text-zinc-50">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Estación Fotovoltaica
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Monitoreo electromagnético en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-700 self-start">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Sincronizado
        </div>
      </header>

      {/* TARJETAS DE SENSORES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </section>

      {/* SECCIÓN DE GRÁFICAS (Reemplazar placeholders con Recharts) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-80 flex flex-col">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" /> Histórico de Voltajes
          </h3>
          <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
            [Insertar LineChart de Recharts aquí]
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-80 flex flex-col">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" /> Histórico de
            Corrientes
          </h3>
          <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 text-sm">
            [Insertar AreaChart de Recharts aquí]
          </div>
        </div>
      </section>

      {/* BALANCE ENERGÉTICO */}
      <section className="p-6 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row justify-around gap-4 text-center">
        <div>
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Generado
          </span>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            5.72 W
          </p>
        </div>
        <div className="hidden md:block border-l border-zinc-200 dark:border-zinc-800"></div>
        <div>
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Consumido
          </span>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            4.50 W
          </p>
        </div>
        <div className="hidden md:block border-l border-zinc-200 dark:border-zinc-800"></div>
        <div>
          <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">
            Eficiencia Neta
          </span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            +1.22 W
          </p>
        </div>
      </section>
    </main>
  );
}
