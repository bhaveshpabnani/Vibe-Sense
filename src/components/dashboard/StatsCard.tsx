
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  className,
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div 
      className={cn(
        "glass-card card-hover p-6",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
        )}
      </div>
      
      {(isPositive || isNegative) && (
        <div className="mt-4 flex items-center">
          <span 
            className={cn(
              "inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5", 
              isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            )}
          >
            {isPositive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
            {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="ml-2 text-xs text-muted-foreground">
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
