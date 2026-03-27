"use client";
import * as React from "react";
import { Sun, } from "lucide-react";
import { MetricCard } from "@/src/components/MetricCard";
import { MetricData, SensoresDB } from "@/src/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ref, onValue } from "firebase/database";
import { db } from "@/src/lib/firebase";
import { getLastValue, parseChartData } from "@/src/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [metrics, setMetrics] = React.useState<MetricData[]>([]);
  const [chartData, setChartData] = React.useState<any[]>([]);

  React.useEffect(() => {
    setMounted(true);

    const sensoresRef = ref(db, "sensores");

    const unsubscribe = onValue(sensoresRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as SensoresDB;

        console.log(getLastValue(data.PS));
        setChartData(parseChartData(data.PS));

        const newMetrics: MetricData[] = [
          {
            title: "Paneles Solares",
            voltage: getLastValue(data.PS).voltaje,
            current: getLastValue(data.PS).amperaje,
            power: getLastValue(data.PS).potencia,
            fecha: getLastValue(data.PS).fecha,
            icon: Sun,
            status: "Active",
          },
          // {
          //   title: "Paneles Solares",
          //   voltage: data.panel?.voltaje ?? data.voltaje,
          //   current: data.panel?.corriente ??  data.amperaje,
          //   power: data.panel?.potencia ?? data.potencia,
          //   icon: Sun,
          //   status: "Active",
          // },
          // {
          //   title: "Almacenamiento/Batería",
          //   voltage: data.bateria?.voltaje ?? 0,
          //   current: data.bateria?.corriente ?? 0,
          //   power: data.bateria?.potencia ?? 0,
          //   icon: BatteryCharging,
          //   status: "Active",
          // },
          // {
          //   title: "Consumo LEDs",
          //   voltage: data.leds?.voltaje ?? 0,
          //   current: data.leds?.corriente ?? 0,
          //   power: data.leds?.potencia ?? 0,
          //   icon: Lightbulb,
          //   status: "Active",
          // },
        ];

        setMetrics(newMetrics);
      }
    });

    return () => unsubscribe();
  }, []);

  // const metrics: MetricData[] = [
  //   {
  //     title: "Paneles Solares",
  //     voltage: 5.2,
  //     current: 1.1,
  //     power: 5.72,
  //     icon: Sun,
  //     status: "Active",
  //   },
  //   {
  //     title: "Almacenamiento/Batería",
  //     voltage: 3.7,
  //     current: -0.5,
  //     power: 1.85,
  //     status: "Active",
  //     icon: BatteryCharging,
  //   },
  //   {
  //     title: "Consumo LEDs",
  //     voltage: 5.0,
  //     current: 0.9,
  //     power: 4.5,
  //     status: "Active",
  //     icon: Lightbulb,
  //   },
  // ];

  if (!mounted) return null;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      {/* <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl">
          Panel de Control Solar
        </h1>
        <p className="text-muted-foreground">
          Sistema de monitoreo de energía fotovoltaica en tiempo real.
        </p>
      </div> */}

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Voltaje */}
        <Card>
          <CardHeader>
            <CardTitle>Voltaje (V)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />

                  <Line dataKey="voltaje" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Corriente */}
        <Card>
          <CardHeader>
            <CardTitle>Corriente (mhA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amperaje"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Potencia */}
        <Card>
          <CardHeader>
            <CardTitle>Potencia (mhW)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />

                  <Line dataKey="potencia" stroke="#ef4444" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* CHARTS PLACEHOLDERS */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" /> Histórico de Voltajes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full bg-muted/30 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground text-sm">
              <div className="flex flex-col items-center gap-2">
                <Activity className="h-8 w-8 opacity-20" />
                <span>Visualización de datos próximamente</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* SUMMARY SECTION */}
      {/* <Card className="bg-linear-to-br from-background to-muted/30 border-border/50">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generado Total</p>
              <p className="text-4xl font-black text-foreground">5.72 <span className="text-lg font-bold">W</span></p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Consumo Total</p>
              <p className="text-4xl font-black text-foreground">4.50 <span className="text-lg font-bold">W</span></p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Eficiencia</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-emerald-500">+1.22 <span className="text-lg font-bold">W</span></p>
                <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500">OPTIMAL</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
