"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Box, Flex } from "@radix-ui/themes";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import styles from "./SlideContainer.module.css";
import { useSlideNavigation } from "@/contexts/SlideNavigationContext";

interface SlideContainerProps {
  children: React.ReactNode[];
}

export default function SlideContainer({ children }: SlideContainerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const totalSlides = children.length;
  const { canGoNext, setCanGoNext, disableSwipe } = useSlideNavigation();

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1 && canGoNext) {
      setDirection("forward");
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection("backward");
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.slidesWrapper}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={{
              enter: (dir: "forward" | "backward") => ({
                opacity: 0,
                x: dir === "forward" ? 100 : -100,
              }),
              center: {
                opacity: 1,
                x: 0,
              },
              exit: (dir: "forward" | "backward") => ({
                opacity: 0,
                x: dir === "forward" ? -100 : 100,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            drag={disableSwipe ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset, velocity }) => {
              if (disableSwipe) return;
              const swipe = Math.abs(offset.x) * velocity.x;
              if (swipe < -10000 && canGoNext) {
                nextSlide();
              } else if (swipe > 10000) {
                prevSlide();
              }
            }}
            className={styles.slide}
          >
            {children[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </Box>

      <Box className={styles.navigation}>
        <Flex
          className={styles.dots}
          role="tablist"
          aria-label="Slide navigation"
          justify="center"
          gap="2"
        >
          <VisuallyHidden.Root>
            <span>
              Slide {currentSlide + 1} of {totalSlides}
            </span>
          </VisuallyHidden.Root>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              id={`tab-${index}`}
              className={`${styles.dot} ${
                index === currentSlide ? styles.dotActive : ""
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </Flex>

        <Flex className={styles.buttons} gap="4" justify="center">
          <AnimatePresence mode="wait">
            {currentSlide > 0 && (
              <motion.div
                key="prev"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Button
                  onClick={prevSlide}
                  size="4"
                  variant="solid"
                  color="teal"
                  className={styles.navButton}
                >
                  <VisuallyHidden.Root>Vorige slide</VisuallyHidden.Root>
                  <span aria-hidden="true">←</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {currentSlide < totalSlides - 1 && (
              <motion.div
                key="next"
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Button
                  onClick={nextSlide}
                  size="4"
                  variant="solid"
                  color="teal"
                  className={styles.navButton}
                  disabled={!canGoNext}
                >
                  <span aria-hidden="true">Volgende slide →</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Flex>
      </Box>
    </Box>
  );
}
