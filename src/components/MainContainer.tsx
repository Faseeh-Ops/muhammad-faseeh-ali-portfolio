import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import setSplitText from "./utils/splitText";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const [shouldRenderCharacter, setShouldRenderCharacter] = useState(false);
  // Keep the character visible through the introduction and About sections.
  // It should still leave the screen once the portfolio moves past What I Do.
  const [isCharacterVisible, setIsCharacterVisible] = useState(
    window.innerWidth > 768
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
      setIsMobile(window.innerWidth <= 768);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    const characterSections = document.querySelectorAll(
      ".landing-section, .about-section, .whatIDO"
    );
    if (!characterSections.length) return;

    let observer: IntersectionObserver | undefined;
    const sectionVisibility = new Map<Element, boolean>();
    const observeWhatIDo = () => {
      observer?.disconnect();
      sectionVisibility.clear();
      const centerMargin = Math.min(180, Math.round(window.innerHeight * 0.2));
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            sectionVisibility.set(entry.target, entry.isIntersecting);
          });
          const visibleSections = [...sectionVisibility.entries()];
          const isVisible = visibleSections.some(
            ([section, visible]) =>
              visible && (!isMobile || section.matches(".whatIDO"))
          );
          setIsCharacterVisible(isVisible);
          const isWhatIDoVisible = visibleSections.some(
            ([section, visible]) => visible && section.matches(".whatIDO")
          );
          if (isMobile && isWhatIDoVisible) {
            setShouldRenderCharacter(true);
          }
        },
        {
          rootMargin: `-${centerMargin}px 0px -${centerMargin}px 0px`,
          threshold: 0,
        }
      );
      characterSections.forEach((section) => observer?.observe(section));
    };

    observeWhatIDo();
    window.addEventListener("resize", observeWhatIDo);
    return () => {
      window.removeEventListener("resize", observeWhatIDo);
      observer?.disconnect();
    };
  }, [isMobile]);

  useEffect(() => {
    if (isDesktopView) {
      setShouldRenderCharacter(true);
    }
  }, [isDesktopView]);

  return (
    <div className={`container-main ${isCharacterVisible ? "character-visible" : ""}`}>
      <Cursor />
      <Navbar />
      <SocialIcons />
      {(isDesktopView || isMobile) && shouldRenderCharacter && children}
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStackNew />
        <CallToAction />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
