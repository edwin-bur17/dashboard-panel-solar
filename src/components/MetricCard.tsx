import { MetricData } from "../types/dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";

export function MetricCard({
  title,
  voltage,
  current,
  power,
  status,
  fecha,
  icon: Icon,
}: MetricData) {
  return (
    <Card className="transition-all hover:shadow-md border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground">Voltaje</span>
            <span className="text-xl font-bold tracking-tight">
              {voltage}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                V
              </span>
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-muted-foreground">Corriente</span>
            <span className="text-xl font-bold tracking-tight">
              {current}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                mhA
              </span>
            </span>
          </div>
          <div className="flex justify-between items-baseline pt-4 border-t">
            <span className="text-sm font-semibold">Potencia</span>
            <span className="text-2xl font-black text-orange-500 dark:text-orange-400">
              {power}
              <span className="text-sm font-bold ml-1">
                mhW
              </span>
            </span>
          </div>
          {status && (
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  status === "Active" ? "bg-emerald-500" : "bg-zinc-400"
                )}
              />
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                {status}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                {fecha}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
