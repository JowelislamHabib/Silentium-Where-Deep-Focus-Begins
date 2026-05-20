"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const AnimatedCounter = ({
  value,
  target,
  duration = 2000,
  className,
  prefix = "",
  suffix: suffixProp,
  decimals = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px", amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  const { numericTarget, suffix } = useMemo(() => {
    if (typeof target === "number" && !Number.isNaN(target)) {
      return {
        numericTarget: target,
        suffix: suffixProp ?? "",
      };
    }
    const str = String(value ?? "");
    return {
      numericTarget: parseInt(str.replace(/[^0-9]/g, ""), 10) || 0,
      suffix: suffixProp ?? str.replace(/[0-9,.]/g, ""),
    };
  }, [target, value, suffixProp]);

  const hasComma = String(value ?? "").includes(",");

  useEffect(() => {
    if (!isInView) return;

    if (reduceMotion) {
      setCount(numericTarget);
      return;
    }

    const startTime = performance.now();
    const multiplier = 10 ** decimals;

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        setCount(numericTarget);
        return;
      }

      const progress = elapsedTime / duration;
      const easeOutQuad = progress * (2 - progress);
      const next =
        Math.floor(easeOutQuad * numericTarget * multiplier) / multiplier;
      setCount(next);
      requestAnimationFrame(updateCount);
    };

    setCount(0);
    requestAnimationFrame(updateCount);
  }, [isInView, numericTarget, duration, reduceMotion, decimals]);

  const formatted =
    decimals > 0
      ? count.toFixed(decimals)
      : hasComma
        ? count.toLocaleString()
        : String(count);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
