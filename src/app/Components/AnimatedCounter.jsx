"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const AnimatedCounter = ({
  value,
  target,
  duration = 2000,
  className = "",
  prefix = "",
  suffix: suffixProp,
  decimals = 0,
  ready = true,
}) => {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const lastAnimatedTarget = useRef(null);
  const rafIdRef = useRef(0);

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
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!ready || !isInView) return;
    if (lastAnimatedTarget.current === numericTarget) return;

    lastAnimatedTarget.current = numericTarget;
    cancelAnimationFrame(rafIdRef.current);

    if (reduceMotion) {
      setCount(numericTarget);
      return;
    }

    let cancelled = false;
    const startTime = performance.now();
    const multiplier = 10 ** decimals;

    const updateCount = (currentTime) => {
      if (cancelled) return;

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
      rafIdRef.current = requestAnimationFrame(updateCount);
    };

    setCount(0);
    rafIdRef.current = requestAnimationFrame(updateCount);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [ready, isInView, numericTarget, duration, reduceMotion, decimals]);

  const formatted =
    decimals > 0
      ? count.toFixed(decimals)
      : hasComma
        ? count.toLocaleString()
        : String(count);

  return (
    <span
      ref={ref}
      className={`inline-block min-w-[1ch] tabular-nums ${className}`.trim()}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
