import * as React from "react";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import styles from './menu.module.css'

import { useDimensions } from "./use-dimensions";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 100}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2
    }
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

export default function SideMenu({ content } : { content: React.ReactNode}) {
  const [isOpen, toggleOpen] = useCycle(true, false);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  return (
    <motion.nav
      initial={false}
      className={`${styles.nav} ${!isOpen && styles.navClosed}`}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
    >
      {/* <motion.div className={styles.background} variants={sidebar} /> */}
      {/* <Navigation /> */}
      <div className={styles.content}>
        {isOpen && content}
      </div>
      <MenuToggle toggle={() => toggleOpen()} />
    </motion.nav>
  );
};
