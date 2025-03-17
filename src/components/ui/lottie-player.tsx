import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LottiePlayerProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  background?: string;
  speed?: number;
  style?: React.CSSProperties;
}

const LottiePlayer = ({
  src,
  className,
  loop = true,
  autoplay = true,
  background = "transparent",
  speed = 1,
  style,
}: LottiePlayerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the lottie-player script if it's not already loaded
    if (!document.querySelector('script[src*="lottie-player"]')) {
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Create and configure the lottie-player element
    if (ref.current) {
      const player = document.createElement("lottie-player");
      player.src = src;
      player.loop = loop;
      player.autoplay = autoplay;
      player.background = background;
      player.speed = speed;

      // Apply styles
      if (style) {
        Object.entries(style).forEach(([key, value]) => {
          player.style[key as any] = value;
        });
      }

      // Clear previous content and append the player
      ref.current.innerHTML = "";
      ref.current.appendChild(player);
    }

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [src, loop, autoplay, background, speed, style]);

  return <div ref={ref} className={cn("lottie-container", className)} />;
};

export default LottiePlayer;
