
import React from "react";
import { cn } from "@/lib/utils";
import { StatusType } from "@/data/mockData";

type StatusProps = {
  status: StatusType;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
  className?: string;
};

const Status: React.FC<StatusProps> = ({
  status,
  size = "md",
  withLabel = true,
  className,
}) => {
  const statusConfig = {
    submitted: {
      color: "bg-green-500",
      label: "Submitted",
    },
    not_submitted: {
      color: "bg-red-500",
      label: "Not Submitted",
    },
    reschedule_requested: {
      color: "bg-blue-500",
      label: "Reschedule Requested",
    },
    rescheduled: {
      color: "bg-purple-500",
      label: "Rescheduled",
    },
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("rounded-full", sizeClasses[size], config.color)} />
      {withLabel && (
        <span className="text-sm font-medium">{config.label}</span>
      )}
    </div>
  );
};

export default Status;
