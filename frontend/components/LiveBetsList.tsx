import PredictionBlock from "@/components/prediction-block";
import { getAptosClient } from "@/utils/aptosClient";
import { VITE_MODULE_ADDRESS } from "@/constants";
import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

type WagerResponse = {
  creator: string;
  title: string;
  price_feed_id: string;
  stake_amount: string;
  end_timestamp: string;
  total_up_stake: string;
  total_down_stake: string;
  resolved_price: string;
  is_settled: boolean;
  wager_id: string;
  winner: boolean;
};
export default function LiveBetsList() {
  const [wagers, setWagers] = useState<WagerResponse[]>([]);
  const { account } = useWallet();

  const fetchWagers = async () => {
    try {
      const response = await getAptosClient().view({
        payload: {
          function: `${VITE_MODULE_ADDRESS}::price_prediction::view_all_wagers`,
          typeArguments: [],
          functionArguments: [],
        },
      });

      // Convert the response to proper Wager types
      console.log(response);
      // Since response is an array of wager objects, set it directly
      setWagers(response[0] as WagerResponse[]); // The response is nested, so we take the first element
    } catch (error) {
      console.error("Error fetching wagers:", error);
    }
  };

  useEffect(() => {
    fetchWagers();
  }, []);

  return (
    <div className="flex flex-col justify-center gap-4 overflow-y-auto scrollbar-hide max-h-full px-4 pb-32 mt-10">
      {wagers.map((wager, index) => (
        <PredictionBlock
          key={index}
          title={wager.title}
          volume={`$${Number(wager.total_up_stake) + Number(wager.total_down_stake)}`}
          comments={10}
        />
      ))}
    </div>
  );
}
