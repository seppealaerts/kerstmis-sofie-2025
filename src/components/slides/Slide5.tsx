"use client";

import SlideImage from "../SlideImage";
import { useSlideNavigation } from "@/contexts/SlideNavigationContext";
import { useEffect } from "react";

export default function Slide5() {
  const { setCanGoNext } = useSlideNavigation();

  useEffect(() => {
    setCanGoNext(true);
  }, [setCanGoNext]);

  return (
    <SlideImage
      src="/assets/img/wheres-waldo-2.png"
      alt="Waar is Wallie?"
      priority
    />
  );
}
