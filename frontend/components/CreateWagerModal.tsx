import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "./ui/button";

interface CryptoOption {
  id: string;
  name: string;
  symbol: string;
  icon: string;
}

const cryptoOptions: CryptoOption[] = [
  { id: "apt", name: "Aptos", symbol: "APT", icon: "🪙" },
  { id: "usdc", name: "USD Coin", symbol: "USDC", icon: "💵" },
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "⟠" },
  // Add more options as needed
];

interface CreateWagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWagerModal({ isOpen, onClose }: CreateWagerModalProps) {
  const [title, setTitle] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoOption | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle wager creation logic here
    console.log({ title, selectedCrypto });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 w-full">
          <Dialog.Title className="text-xl font-bold mb-4">Create New Wager</Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter wager title"
                required
              />
            </div>

            {/* Crypto Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Crypto</label>
              <div className="relative">
                <select
                  onChange={(e) => {
                    const crypto = cryptoOptions.find((c) => c.id === e.target.value);
                    setSelectedCrypto(crypto || null);
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end mt-6">
              <Button type="button" onClick={onClose} variant="outline" className="px-4 py-2">
                Cancel
              </Button>
              <Button type="submit" className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600">
                Create Wager
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
