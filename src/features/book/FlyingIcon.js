import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const FlyingIcon = ({ icon, onAnimationEnd }) => {
  const [hide, setHide] = useState(false);

  const animation = useSpring({
    from: { left: icon.x, top: icon.y, transform: "scale(1)" },
    to: { left: icon.targetX, top: icon.targetY, transform: "scale(1.5)" },
    config: { duration: 800 }, 
    onRest: () => {
      setTimeout(() => {
        setHide(true); 
        onAnimationEnd(icon.id);
      }, 400); 
    },
  });

  return !hide ? (
    <animated.div
      style={{
        position: "fixed",
        left: animation.left,
        top: animation.top,
        zIndex: 1000,
        fontSize: "20px",
        color: "orange", 
        fontWeight: "bold",
        pointerEvents: "none",
        transform: animation.transform,
      }}
    >
      1
    </animated.div>
  ) : null;
};

export default FlyingIcon;
