"use client";

import { useState, useRef, useEffect } from "react";
import { Box, Heading, Text, TextField } from "@radix-ui/themes";
import styles from "./ListSlide.module.css";
import { useSlideNavigation } from "@/contexts/SlideNavigationContext";

interface ListSlideProps {
  title: string;
  items: Array<{ content: string; key: string }>;
  correctPassword?: string;
}

export default function ListSlide({
  title,
  items,
  correctPassword,
}: ListSlideProps) {
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [password, setPassword] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const { setCanGoNext } = useSlideNavigation();

  const isPasswordCorrect = correctPassword
    ? password === correctPassword
    : true;

  useEffect(() => {
    if (correctPassword) {
      setCanGoNext(isPasswordCorrect);
    } else {
      setCanGoNext(true);
    }
  }, [password, correctPassword, isPasswordCorrect, setCanGoNext]);

  useEffect(() => {
    lastScrollTimeRef.current = Date.now();
  }, []);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    const hasScrolled = scrollTop > 5;
    const hasMoreBelow = scrollTop + clientHeight < scrollHeight - 5;

    setShowTopShadow(hasScrolled);
    setShowBottomShadow(hasMoreBelow);

    lastScrollTimeRef.current = Date.now();
    setShowScrollHint(false);

    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (hasMoreBelow) {
      inactivityTimerRef.current = setTimeout(() => {
        const timeSinceLastScroll = Date.now() - lastScrollTimeRef.current;
        if (timeSinceLastScroll >= 5000) {
          setShowScrollHint(true);
        }
      }, 5000);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();

    const handleScroll = () => {
      checkScroll();
    };
    container.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkScroll, 0);
    });
    resizeObserver.observe(container);

    const timeoutId = setTimeout(checkScroll, 100);

    const initialTimer = setTimeout(() => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollContainerRef.current;
        const hasMoreBelow = scrollTop + clientHeight < scrollHeight - 5;
        if (hasMoreBelow) {
          setShowScrollHint(true);
        }
      }
    }, 5000);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
      clearTimeout(initialTimer);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [items]);

  return (
    <Box className={styles.listSlideContent}>
      <Heading size="8" className={styles.title}>
        {title}
      </Heading>
      <div
        className={`${styles.listListWrapper} ${
          correctPassword ? styles.hasPassword : ""
        }`}
        style={{ flex: correctPassword ? "1 1 0" : "1" }}
      >
        {showTopShadow && <div className={styles.scrollShadowTop} />}
        <div ref={scrollContainerRef} className={styles.listList}>
          {items.map((item) => (
            <Box
              key={item.key}
              style={{
                background: "#ffffff",
                border: "2px solid var(--primary)",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                boxShadow: "0 2px 8px rgba(15, 118, 110, 0.15)",
                padding: "1rem 1.25rem",
              }}
            >
              <Text
                size="3"
                style={{
                  color: "var(--primary)",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {item.content} ({item.key})
              </Text>
            </Box>
          ))}
        </div>
        {showBottomShadow && (
          <div className={styles.scrollShadowBottom}>
            {showScrollHint && (
              <div className={styles.scrollHint}>
                <div className={styles.scrollHintArrow}>↓</div>
              </div>
            )}
          </div>
        )}
      </div>
      {correctPassword && (
        <Box className={styles.passwordField}>
          <TextField.Root
            type="text"
            placeholder="Voer wachtwoord in"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="3"
            style={{
              width: "100%",
            }}
          />
        </Box>
      )}
    </Box>
  );
}
