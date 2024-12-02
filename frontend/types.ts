export type WagerResponse = {
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
