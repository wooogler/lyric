import { IconType } from "react-icons";

interface IconButtonProps {
  icon: IconType;
  onClick: () => void;
  title?: string;
  variant?: "default" | "primary";
  size?: number;
  className?: string;
  disabled?: boolean;
}

export function IconButton({
  icon: Icon,
  onClick,
  title,
  variant = "default",
  size = 16,
  className = "",
  disabled = false,
}: IconButtonProps) {
  const baseStyles = "p-3 transition-colors";
  const variantStyles = {
    default: "text-gray-600 hover:text-blue-600",
    primary: "bg-blue-500 text-white rounded-full hover:bg-blue-600",
  };
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
      title={title}
      disabled={disabled}
    >
      <Icon size={size} />
    </button>
  );
}
