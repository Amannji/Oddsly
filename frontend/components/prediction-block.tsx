"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, MessageCircle, Star } from "lucide-react";

interface PredictionBlockProps {
  title: string;
  volume: string;
  comments: number;
}

export default function PredictionBlock({
  title = "Trump ends Ukraine war by first 90 days?",
  volume = "$4m",
  comments = 887,
}: PredictionBlockProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const titleElement = titleRef.current;
    const containerElement = containerRef.current;

    if (titleElement && containerElement) {
      const shouldAnimate = titleElement.scrollWidth > containerElement.clientWidth;

      if (shouldAnimate) {
        const animationDuration = titleElement.scrollWidth / 50;
        titleElement.style.animationDuration = `${animationDuration}s`;
        setIsAnimating(true);
      } else {
        setIsAnimating(false);
      }
    }
  }, [title]);

  return (
    <div className="w-full max-w-3xl bg-slate-900 rounded-lg p-[1.5rem]">
      <div className="flex gap-4">
        <div className="w-[70%] space-y-4">
          <div ref={containerRef} className="relative h-12 overflow-hidden">
            <h2
              ref={titleRef}
              className={`text-xl font-bold text-white whitespace-nowrap ${isAnimating ? "animate-marquee" : ""}`}
            >
              {title}
            </h2>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-medium">{volume} Vol.</span>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </div>
            <Star className="w-4 h-4" />
          </div>
        </div>

        <div className="w-[30%]">
          <div className="space-y-2">
            <Button className="w-full bg-green-900  text-green-500" variant="ghost">
              Buy Yes
            </Button>
            <Button className="w-full bg-red-900 text-red-500" variant="ghost">
              Buy No
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
