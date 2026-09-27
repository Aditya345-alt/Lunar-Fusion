import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface IntroVideoProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function IntroVideo({ onComplete }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lunarFusionIntroSeen", "true");
    }
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 400);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Fully muted with zero audio/voice
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay attempt:", err);
      });
    }

    const onEndedHandler = () => {
      handleComplete();
    };

    video.addEventListener("ended", onEndedHandler);
    return () => {
      video.removeEventListener("ended", onEndedHandler);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="intro-video-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            margin: 0,
            padding: 0,
          }}
          onClick={() => {
            // If paused or stalled, click anywhere resumes playback
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.play().catch(() => {});
            }
          }}
        >
          <video
            ref={videoRef}
            src="/I_want_to_make_a_logo_video_of_gwr_video_mvp.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onError={handleComplete}
            style={{
              width: "100%",
              height: "100%",
              maxWidth: "100vw",
              maxHeight: "100vh",
              objectFit: "contain",
              background: "#000000",
              display: "block",
              border: "none",
              outline: "none",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IntroVideo;
