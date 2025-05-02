
import React from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  className?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  status,
  className,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  const statusClasses = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500",
  };

  const initials = alt
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium overflow-hidden",
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              if (target.nextElementSibling) {
                (target.nextElementSibling as HTMLElement).style.display = "flex";
              }
            }}
          />
        ) : null}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            src ? "hidden" : "flex"
          )}
        >
          {initials}
        </div>
      </div>
      {status && (
        <span
          className={cn(
            "absolute block rounded-full ring-2 ring-white",
            statusClasses[status],
            size === "sm" ? "w-2 h-2 bottom-0 right-0" : "w-3 h-3 bottom-0 right-0"
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
