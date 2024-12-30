"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown, MessageCircle, Star } from "lucide-react";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { VITE_MODULE_ADDRESS } from "@/constants";
import { AptosClient } from "aptos";

interface PredictionBlockProps {
  id: string;
  title: string;
  volume: string;
  comments: number;
}

export default function PredictionBlock({
  id = "0",
  title = "Trump ends Ukraine war by first 90 days?",
  volume = "$4m",
  comments = 887,
}: PredictionBlockProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [choice, setChoice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { signAndSubmitTransaction } = useWallet();
  const { account } = useWallet();

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

  const confirmBet = async () => {
    if (!account) return;
    setIsLoading(true);
    let idNumber = Number(id);
    const transaction: InputTransactionData = {
      data: {
        function: `${VITE_MODULE_ADDRESS}::price_prediction::make_bet`,
        functionArguments: [idNumber, choice, stakeAmount],
      },
    };

    try {
      const tx = await signAndSubmitTransaction(transaction);
      const client = new AptosClient("https://fullnode.devnet.aptoslabs.com");
      await client.waitForTransaction(tx.hash);
      setIsLoading(false);
      console.log("Bet placed successfully");
      setShowDialog(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBet = (betChoice: "yes" | "no") => {
    if (betChoice === "yes") {
      setChoice(true);
    } else {
      setChoice(false);
    }
    setShowDialog(true);
  };

  return (
    <>
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
              <Button className="w-full bg-green-900 text-green-500" variant="ghost" onClick={() => handleBet("yes")}>
                Buy Yes
              </Button>
              <Button className="w-full bg-red-900 text-red-500" variant="ghost" onClick={() => handleBet("no")}>
                Buy No
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`w-3 h-3 rounded-full ${choice ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"}`}
              ></div>
              <p className="text-white">You have chosen {choice}</p>
            </div>

            <div className="mb-6">
              <input
                type="range"
                min="0"
                max="100"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-slate-400">
                <span>0</span>
                <span>Stake: {stakeAmount}</span>
                <span>100</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-slate-700" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600"
                onClick={() => {
                  confirmBet();
                }}
              >
                Bet
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
