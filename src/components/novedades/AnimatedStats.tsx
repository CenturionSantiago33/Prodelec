"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function Counter({ end, duration = 2000, suffix = "", prefix = "" }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function (easeOutQuart)
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="font-mono">
      {prefix}{count}{suffix}
    </span>
  );
}

const STATS = [
  { value: 39, prefix: "+", suffix: "", label: "Años en la Industria" },
  { value: 10, prefix: "", suffix: "", label: "Familias de Productos" },
  { value: 30, prefix: "+", suffix: "", label: "Modelos y Variantes" },
  { value: 9001, prefix: "ISO ", suffix: "", label: "Calidad Certificada" },
];

export function AnimatedStats() {
  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-x divide-gray-100">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col items-center text-center ${i !== 0 ? "pl-8 md:pl-12" : ""}`}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-primary-600 mb-2 tracking-tight">
                <Counter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base font-bold text-gray-400 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
