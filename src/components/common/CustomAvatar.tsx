
import React from "react";
import Avatar from "@/components/common/Avatar";

type CustomAvatarProps = {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  src,
  alt,
  size = "md",
  className,
}) => {
  return <Avatar src={src} alt={alt} size={size} className={className} />;
};

export default CustomAvatar;
