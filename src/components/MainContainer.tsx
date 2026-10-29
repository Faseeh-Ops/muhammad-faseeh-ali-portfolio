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
  const [isCharacterVisible, setIsCharacterVisible] = useState(false);

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
    const whatIDo = document.querySelector(".whatIDO");
    const sections = (isMobile
      ? [whatIDo]
      : [
          document.getElementById("landingDiv"),
          document.getElementById("about"),
          whatIDo,
        ]
    ).filter((section): section is Element => section !== null);
    if (!sections.length) return;

    const visibleSections = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.05;
          visibleSections.set(entry.target, isVisible);
          if (isMobile && entry.target === whatIDo && isVisible) {
            setShouldRenderCharacter(true);
          }
        });
        setIsCharacterVisible([...visibleSections.values()].some(Boolean));
      },
      { threshold: 0.05 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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
