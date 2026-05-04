import { useState } from 'react';
import AvatarPlaceholder from "./AvatarPlaceholder";

// URLs que fallaron en esta sesión — evita reintentar la petición de red
const failedUrls = new Set<string>();

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  alt?: string;
}

export default function UserAvatar({ src, name, size = 40, className = "", alt }: UserAvatarProps) {
  const [imgError, setImgError] = useState(() => !!src && failedUrls.has(src));

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? "avatar"}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
        loading="eager"
        onError={() => {
          failedUrls.add(src);
          setImgError(true);
        }}
      />
    );
  }

  return <AvatarPlaceholder name={name ?? "U"} size={size} className={className} />;
}
