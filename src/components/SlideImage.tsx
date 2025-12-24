"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./SlideImage.module.css";
import { useSlideNavigation } from "@/contexts/SlideNavigationContext";

interface SlideImageProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function SlideImage({
  src,
  alt,
  priority = false,
}: SlideImageProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouch, setLastTouch] = useState<{ x: number; y: number } | null>(
    null
  );
  const [lastTap, setLastTap] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const initialDistanceRef = useRef<number | null>(null);
  const { setDisableSwipe } = useSlideNavigation();

  // Reset zoom when image changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [src]);

  // Disable swipe navigation when zoomed in or actively interacting
  useEffect(() => {
    // Always disable swipe when zoomed in or actively interacting (pinching/dragging)
    const shouldDisable = zoom > MIN_ZOOM || isInteracting;
    setDisableSwipe(shouldDisable);
  }, [zoom, isInteracting, setDisableSwipe]);

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 5;
  const DOUBLE_TAP_DELAY = 300;

  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touch1: React.Touch, touch2: React.Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const constrainPan = (newPan: { x: number; y: number }, currentZoom: number) => {
    if (!containerRef.current || !imageWrapperRef.current) return newPan;

    const container = containerRef.current.getBoundingClientRect();
    const image = imageWrapperRef.current.getBoundingClientRect();

    const maxX = Math.max(0, (image.width * currentZoom - container.width) / 2);
    const maxY = Math.max(0, (image.height * currentZoom - container.height) / 2);

    return {
      x: Math.max(-maxX, Math.min(maxX, newPan.x)),
      y: Math.max(-maxY, Math.min(maxY, newPan.y)),
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setLastTouch({ x: touch.clientX, y: touch.clientY });
      setIsDragging(zoom > MIN_ZOOM);

      // Double tap detection
      const now = Date.now();
      if (now - lastTap < DOUBLE_TAP_DELAY) {
        if (zoom > MIN_ZOOM) {
          setZoom(MIN_ZOOM);
          setPan({ x: 0, y: 0 });
        } else {
          setZoom(2);
        }
        setLastTap(0);
      } else {
        setLastTap(now);
      }
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const distance = getDistance(e.touches[0], e.touches[1]);
      initialDistanceRef.current = distance;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && zoom > MIN_ZOOM) {
      e.preventDefault();
      const touch = e.touches[0];
      if (lastTouch) {
        const deltaX = touch.clientX - lastTouch.x;
        const deltaY = touch.clientY - lastTouch.y;

        setPan((prevPan) => {
          const newPan = {
            x: prevPan.x + deltaX,
            y: prevPan.y + deltaY,
          };
          return constrainPan(newPan, zoom);
        });

        setLastTouch({ x: touch.clientX, y: touch.clientY });
      }
    } else if (e.touches.length === 2 && initialDistanceRef.current !== null) {
      e.preventDefault();
      const distance = getDistance(e.touches[0], e.touches[1]);
      const scale = distance / initialDistanceRef.current;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * scale));

      if (Math.abs(newZoom - zoom) > 0.01) {
        const center = getCenter(e.touches[0], e.touches[1]);
        if (containerRef.current) {
          const container = containerRef.current.getBoundingClientRect();
          const centerX = center.x - container.left - container.width / 2;
          const centerY = center.y - container.top - container.height / 2;

          setZoom(newZoom);
          // Adjust pan to keep the pinch center point fixed
          if (newZoom > MIN_ZOOM) {
            setPan((prevPan) => {
              const zoomRatio = newZoom / zoom;
              const newPan = {
                x: centerX - (centerX - prevPan.x) * zoomRatio,
                y: centerY - (centerY - prevPan.y) * zoomRatio,
              };
              return constrainPan(newPan, newZoom);
            });
          } else {
            setPan({ x: 0, y: 0 });
          }
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouch(null);
    initialDistanceRef.current = null;
    // Delay clearing isInteracting to prevent immediate swipe after zoom
    setTimeout(() => {
      setIsInteracting(false);
    }, 100);
  };

  const imageStyle = {
    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
    transition: isDragging ? "none" : "transform 0.1s ease-out",
  };

  return (
    <div
      ref={containerRef}
      className={styles.imageContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div ref={imageWrapperRef} className={styles.imageWrapper} style={imageStyle}>
        <Image
          src={src}
          alt={alt}
          fill
          className={styles.image}
          priority={priority}
          unoptimized
          sizes="100vw"
          draggable={false}
        />
      </div>
      {zoom > MIN_ZOOM && (
        <button
          className={styles.resetButton}
          onClick={() => {
            setZoom(MIN_ZOOM);
            setPan({ x: 0, y: 0 });
          }}
          aria-label="Reset zoom"
        >
          Reset
        </button>
      )}
    </div>
  );
}
