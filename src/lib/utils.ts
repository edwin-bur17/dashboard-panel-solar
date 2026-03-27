import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MetricData, Sensor } from "../types/dashboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getLastValue = (obj: Sensor): { voltaje: number; amperaje: number; potencia: number; fecha: string } =>{
  if (!obj) return { voltaje: 0, amperaje: 0, potencia: 0, fecha: "" };

  const values = Object.values(obj) as { voltaje: number; amperaje: number; potencia: number; fecha: string }[];

  if (values.length === 0) return { voltaje: 0, amperaje: 0, potencia: 0, fecha: "" };

  // ordenar por fecha (por si acaso)
  values.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return values[values.length - 1]; 
};