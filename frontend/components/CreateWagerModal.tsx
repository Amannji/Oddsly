import { useState } from "react";
import { Button } from "./ui/button";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { VITE_MODULE_ADDRESS } from "@/constants";
import { getAptosClient } from "@/utils/aptosClient";
import { AptosClient } from "aptos";
interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

const cryptoOptions: CryptoOption[] = [
  { id: "apt", name: "Aptos", symbol: "APT", icon: "🪙" },
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "⟠" },
  { id: "btc", name: "Bitcoin", symbol: "BTC", icon: "B" },
];

interface CreateWagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWagerModal({ isOpen, onClose }: CreateWagerModalProps) {
  const [title, setTitle] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);
  const [targetPrice, setTargetPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [minStake, setMinStake] = useState("");
  const { account, signAndSubmitTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!account) return;
    setIsLoading(true);
    const transaction: InputTransactionData = {
      data: {
        function: `${VITE_MODULE_ADDRESS}::price_prediction::create_wager`,
        functionArguments: [title, minStake, expiryTime], // need to put crypto id here, and target price
      },
    };

    try {
      const tx = await signAndSubmitTransaction(transaction);
      const client = new AptosClient("https://fullnode.testnet.aptoslabs.com");
      await client.waitForTransaction(tx.hash);
      setIsLoading(true);
      console.log("Wager created successfully");
    } catch (error) {
      console.error(error);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg w-96 mt-5">
        <h3 className="text-xl font-bold text-white mb-4">Create New Wager</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter wager title"
                  required
                />
              </div>

              {/* Crypto Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Select Crypto</label>
                <select
                  onChange={(e) => {
                    const crypto = cryptoOptions.find((c) => c.id === e.target.value);
                    setSelectedCrypto(crypto || null);
                  }}
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a cryptocurrency</option>
                  {cryptoOptions.map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>
                      {crypto.icon} {crypto.name} ({crypto.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Price Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Target Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter target price"
                  required
                />
              </div>

              {/* Minimum Stake Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Minimum Stake (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={minStake}
                  onChange={(e) => setMinStake(e.target.value)}
                  className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter minimum stake amount"
                  required
                />
              </div>

              {/* Expiry Date and Time */}
              <div className="flex">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-white mb-1">Expiry Time</label>
                  <input
                    type="time"
                    value={expiryTime}
                    onChange={(e) => setExpiryTime(e.target.value)}
                    className="w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 text-white hover:bg-slate-600"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-500" disabled={isLoading}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
