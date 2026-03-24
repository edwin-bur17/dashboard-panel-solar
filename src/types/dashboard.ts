export interface MetricData {
  title: string;
  voltage: number;
  current: number;
  power: number;
  status?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface HistoryData {
  time: string;
  vSolar: number;
  vBat: number;
  vOut: number;
  iSolar: number;
  iBat: number;
  iOut: number;
}
