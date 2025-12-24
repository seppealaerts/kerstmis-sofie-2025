"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./TrainTicket.module.css";

export default function TrainTicket() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (frontRef.current && backRef.current) {
        const frontHeight = frontRef.current.offsetHeight;
        const backHeight = backRef.current.offsetHeight;
        setHeight(Math.max(frontHeight, backHeight));
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleTap = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      ref={containerRef}
      className={styles.ticketContainer}
      onClick={handleTap}
      style={height ? { height: `${height}px` } : undefined}
    >
      {!isFlipped && (
        <motion.div
          className={styles.tapHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Tik om te draaien 👆
        </motion.div>
      )}
      <motion.div
        className={styles.ticketInner}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        <div ref={frontRef} className={styles.ticketFace}>
          <div className={styles.ticketContent}>
            <div className={styles.ticketLeft}>
              <div className={styles.sideText}>6137042598</div>
            </div>
            <div className={styles.ticketCenter}>
              <div
                className={`${styles.contentWrapper} ${styles.contentWrapperFront}`}
              >
                TICKET
              </div>
            </div>
            <div className={styles.ticketRight}>
              <div className={styles.sideText}>6137042598</div>
            </div>
          </div>
        </div>

        <div
          ref={backRef}
          className={`${styles.ticketFace} ${styles.ticketBack}`}
        >
          <div className={styles.ticketContent}>
            <div className={styles.ticketLeft}>
              <div className={styles.sideText}>6137042598</div>
            </div>
            <div className={styles.ticketCenter}>
              <div className={styles.contentWrapper}>
                <div>
                  <strong>Voorstelling:</strong> Doornroosje
                </div>
                <div>
                  <strong>Locatie:</strong> Studio 100 Theater, De Panne
                </div>
                <div>
                  <strong>Datum:</strong> ?
                </div>
              </div>
            </div>
            <div className={styles.ticketRight}>
              <div className={styles.sideText}>6137042598</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
