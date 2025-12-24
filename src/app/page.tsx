import SlideContainer from "@/components/SlideContainer";
import PasswordSlide from "@/components/slides/PasswordSlide";
import Slide1 from "@/components/slides/Slide1";
import Slide2 from "@/components/slides/Slide2";
import Slide3 from "@/components/slides/Slide3";
import Slide4 from "@/components/slides/Slide4";
import Slide5 from "@/components/slides/Slide5";
import Slide6 from "@/components/slides/Slide6";
import Slide7 from "@/components/slides/Slide7";
import { SlideNavigationProvider } from "@/contexts/SlideNavigationContext";

export default function Home() {
  return (
    <SlideNavigationProvider>
      <SlideContainer>
        <Slide1 />
        <Slide2 />
        <Slide3 />
        <PasswordSlide passwordKey="password1" correctPassword="F9" />
        <Slide4 />
        <Slide5 />
        <PasswordSlide passwordKey="password2" correctPassword="I11" />
        <Slide6 />
        <Slide7 />
      </SlideContainer>
    </SlideNavigationProvider>
  );
}
