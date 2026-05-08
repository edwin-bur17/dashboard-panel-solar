"use client";
import * as React from "react";
import { Download, Loader2, Table as TableIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ref, get } from "firebase/database";
import { db } from "@/src/lib/firebase";
import { Button } from "@/src/components/ui/button";
import * as XLSX from "xlsx";

type SensorItem = {
  fecha: string;
  voltaje: number;
  amperaje: number;
  potencia: number;
};

type SensorCollection = Record<string, SensorItem>;

type SensoresDB = {
  PS: SensorCollection;
  bateria: SensorCollection;
};

type MergedDataItem = {
  fecha: string;
  timestamp: number;
  voltajePS?: number;
  amperajePS?: number;
  potenciaPS?: number;
  voltajeBat?: number;
  amperajeBat?: number;
  potenciaBat?: number;
};

const normalizeDate = (date: string): string => {
  return date.replace(" ", "T");
};

export default function AllDataPage() {
  const [mounted, setMounted] = React.useState(false);
  const [data, setData] = React.useState<MergedDataItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const sensoresRef = ref(db, "sensores");
      const snapshot = await get(sensoresRef);

      if (snapshot.exists()) {
        const rawData = snapshot.val() as SensoresDB;

        console.log("🚀 ~ fetchAllData ~ rawData:", rawData);

        const psItems = Object.values(rawData.PS || {}).map((item) => ({
          ...item,
          fecha: normalizeDate(item.fecha),
        }));

        const batItems = Object.values(rawData.bateria || {}).map((item) => ({
          ...item,
          fecha: normalizeDate(item.fecha),
        }));

        const map = new Map<number, MergedDataItem>();

        psItems.forEach((item) => {
          const timestamp = new Date(item.fecha).getTime();

          map.set(timestamp, {
            fecha: item.fecha,
            timestamp,
            voltajePS: item.voltaje,
            amperajePS: item.amperaje,
            potenciaPS: item.potencia,
          });
        });

        batItems.forEach((item) => {
          const timestamp = new Date(item.fecha).getTime();
          const existing = map.get(timestamp);

          map.set(timestamp, {
            ...(existing || { fecha: item.fecha, timestamp }),
            voltajeBat: item.voltaje,
            amperajeBat: item.amperaje,
            potenciaBat: item.potencia,
          });
        });

        const merged = Array.from(map.values()).sort(
          (a, b) => b.timestamp - a.timestamp
        );

        setData(merged);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const exportData = data.map((item) => ({
      Fecha: item.fecha.replace("T", " "),
      "Voltaje PS (V)": item.voltajePS || 0,
      "Amperaje PS (mA)": item.amperajePS || 0,
      "Potencia PS (mW)": item.potenciaPS || 0,
      "Voltaje Bat (V)": item.voltajeBat || 0,
      "Amperaje Bat (mA)": item.amperajeBat || 0,
      "Potencia Bat (mW)": item.potenciaBat || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Datos Sensores");

    XLSX.writeFile(
      wb,
      `datos_panel_solar_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Exportación de Datos
          </h1>

          <p className="text-muted-foreground">
            Consulta y descarga todo el historial de sensores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={exportToExcel}
            disabled={loading || data.length === 0}
            className="cursor-pointer"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar a Excel
          </Button>

          <Button
            variant="outline"
            onClick={fetchAllData}
            disabled={loading}
            className="cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Actualizar"
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <TableIcon className="h-5 w-5 text-blue-500" />
            Registros Históricos
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Fecha</th>

                  <th className="bg-blue-500/5 px-4 py-3 text-center font-medium">
                    V. PS (V)
                  </th>

                  <th className="bg-blue-500/5 px-4 py-3 text-center font-medium">
                    A. PS (mA)
                  </th>

                  <th className="bg-blue-500/5 px-4 py-3 text-center font-medium text-blue-600 dark:text-blue-400">
                    P. PS (mW)
                  </th>

                  <th className="bg-orange-500/5 px-4 py-3 text-center font-medium">
                    V. Bat (V)
                  </th>

                  <th className="bg-orange-500/5 px-4 py-3 text-center font-medium">
                    A. Bat (mA)
                  </th>

                  <th className="bg-orange-500/5 px-4 py-3 text-center font-medium text-orange-600 dark:text-orange-400">
                    P. Bat (mW)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />

                        <span>Cargando datos...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      No se encontraron registros.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.timestamp}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                        {item.fecha.replace("T", " ")}
                      </td>

                      <td className="px-4 py-3 text-center tabular-nums">
                        {item.voltajePS?.toFixed(2) || "0.00"}
                      </td>

                      <td className="px-4 py-3 text-center tabular-nums">
                        {item.amperajePS?.toFixed(2) || "0.00"}
                      </td>

                      <td className="px-4 py-3 text-center font-bold tabular-nums text-blue-600 dark:text-blue-400">
                        {item.potenciaPS?.toFixed(2) || "0.00"}
                      </td>

                      <td className="px-4 py-3 text-center tabular-nums">
                        {item.voltajeBat?.toFixed(2) || "0.00"}
                      </td>

                      <td className="px-4 py-3 text-center tabular-nums">
                        {item.amperajeBat?.toFixed(2) || "0.00"}
                      </td>

                      <td className="px-4 py-3 text-center font-bold tabular-nums text-orange-600 dark:text-orange-400">
                        {item.potenciaBat?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && data.length > 0 && (
            <div className="mt-4 text-right text-xs text-muted-foreground">
              Mostrando {data.length} registros.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
