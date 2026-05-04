interface AvatarPlaceholderProps {
  name?: string;
  size?: number;
  className?: string;
}

export default function AvatarPlaceholder({ name = "U", size = 40, className = "" }: AvatarPlaceholderProps) {
  const fontSize = Math.max(10, Math.round(size * 0.35));

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-violet-900 ring-1 ring-lime-200/20 text-lime-200 font-semibold shadow-[0_0_20px_rgba(132,204,22,0.15)] transition-all duration-300 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span style={{ fontSize }}>{(name || "U").charAt(0).toUpperCase()}</span>
    </div>
  );
}
