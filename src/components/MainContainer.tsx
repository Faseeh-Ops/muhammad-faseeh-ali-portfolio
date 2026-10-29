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
  const [isMobile] = useState<boolean>(window.innerWidth <= 768);
  const [shouldRenderCharacter, setShouldRenderCharacter] = useState(false);
  const [isCharacterVisible, setIsCharacterVisible] = useState(true);

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    const sections = [
      document.getElementById("landingDiv"),
      document.getElementById("about"),
      document.querySelector(".whatIDO"),
    ].filter((section): section is Element => section !== null);
    if (!sections.length) return;

    const visibleSections = new Map<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(
            entry.target,
            entry.isIntersecting && entry.intersectionRatio >= 0.05
          );
        });
        setIsCharacterVisible([...visibleSections.values()].some(Boolean));
      },
      { threshold: 0.05 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1024) return;

    setShouldRenderCharacter(true);
  }, []);

  return (
    <div className={`container-main ${isCharacterVisible ? "character-visible" : ""}`}>
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && !isMobile && shouldRenderCharacter && children}
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
