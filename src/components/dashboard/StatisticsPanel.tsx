import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { Activity, Calendar, CreditCard, AlertCircle } from "lucide-react";

interface StatisticCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatisticCard = ({
  title = "Statistic",
  value = "0",
  description = "No description available",
  icon = <Activity className="h-5 w-5" />,
  trend,
  className,
}: StatisticCardProps) => {
  return (
    <Card className={cn("h-full bg-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-full bg-muted p-2">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500",
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StatisticsPanelProps {
  statistics?: StatisticCardProps[];
  className?: string;
}

const StatisticsPanel = ({
  statistics = [
    {
      title: "Active Patients",
      value: "1,248",
      description: "Total patients currently in system",
      icon: <Activity className="h-5 w-5" />,
      trend: { value: 12, isPositive: true },
    },
    {
      title: "Appointments Today",
      value: "42",
      description: "Scheduled for today",
      icon: <Calendar className="h-5 w-5" />,
      trend: { value: 8, isPositive: true },
    },
    {
      title: "Pending Bills",
      value: "$12,450",
      description: "Outstanding payments",
      icon: <CreditCard className="h-5 w-5" />,
      trend: { value: 5, isPositive: false },
    },
    {
      title: "System Status",
      value: "Healthy",
      description: "All systems operational",
      icon: <AlertCircle className="h-5 w-5" />,
    },
  ],
  className,
}: StatisticsPanelProps) => {
  return (
    <div className={cn("w-full bg-card p-4 rounded-lg", className)}>
      <h2 className="text-lg font-semibold mb-4">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statistics.map((stat, index) => (
          <StatisticCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default StatisticsPanel;
