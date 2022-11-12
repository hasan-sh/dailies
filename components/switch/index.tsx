import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";

/**
 * This is an example of layout animations in Framer Motion 2.
 *
 * It's as simple as adding a `layout` prop to the `motion.div`. When
 * the flexbox changes, the handle smoothly animates between layouts.
 *
 * Try adding whileHover={{ scale: 1.2 }} to the handle - the layout
 * animation is now fully compatible with user-set transforms.
 */

export default function Switch({ title, cb }: {title: string, cb: (a: boolean) => void }) {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    cb(!isOn)
    setIsOn(!isOn);
  }

  const titleEl = <span className={styles.title}>{title}</span>
  return (
      <div className={styles.switch} data-ison={isOn} onClick={toggleSwitch}>
        {isOn && titleEl}
        <motion.div className={styles.handle} layout transition={spring} />
        {!isOn && titleEl}
      </div>
  );
}

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 60
};
