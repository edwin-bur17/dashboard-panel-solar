import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Sensor } from "../types/dashboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLastValue = (obj: Sensor): { voltaje: number; amperaje: number; potencia: number; fecha: string } => {
  if (!obj) return { voltaje: 0, amperaje: 0, potencia: 0, fecha: "" };

  const values = Object.values(obj) as { voltaje: number; amperaje: number; potencia: number; fecha: string }[];

  if (values.length === 0) return { voltaje: 0, amperaje: 0, potencia: 0, fecha: "" };

  // ordenar por fecha (por si acaso)
  values.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return values[values.length - 1];
};

export const parseChartData = (obj: Sensor) => {
  if (!obj) return [];

  return Object.values(obj)
    .slice(-30)
    .sort(
      (a: Sensor, b: Sensor) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )
    .map((item: { fecha: string; voltaje: number; amperaje: number; potencia: number }) => ({
      fecha: item.fecha,
      voltaje: item.voltaje,
      amperaje: item.amperaje,
      potencia: item.potencia,
    }));
};