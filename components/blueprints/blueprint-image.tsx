"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';

const PLACEHOLDER_IMAGE = '/images/icons/icon-aic.webp';

interface BlueprintImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function BlueprintImage({ src, alt, width, height, className, priority }: BlueprintImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error('[Blueprint Detail] Failed to load image:', src);
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-zinc-900 ${className}`}>
        <Image
          src={PLACEHOLDER_IMAGE}
          alt="AIC Blueprint Placeholder"
          width={64}
          height={64}
          className="opacity-50 mb-2"
        />
        <span className="text-sm font-medium text-zinc-500">图片加载失败</span>
        <span className="text-xs text-zinc-600 mt-1">请检查图片链接或重新上传</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleImageError}
    />
  );
}
