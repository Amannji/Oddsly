import { WalletSelector } from "@/components/WalletSelector";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { CreateWagerModal } from "./CreateWagerModal";

export function StickyBottom() {
  const { connected, wallets = [] } = useWallet();
  const mizuWallet = wallets.find((w) => w.name === "Mizu Wallet");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const connectWallet = () => {};

  return (
    <>
      <div className="flex items-center justify-center flex-col fixed bottom-0 w-full py-[2rem] bg-slate-900">
        {!connected ? (
          <div
            className="bg-blue-500 text-white rounded-full p-2 w-full h-full text-center text-xl"
            onClick={connectWallet}
          >
            <div className="mx-4">
              <WalletSelector />
            </div>
          </div>
        ) : (
          <div className="flex gap-4 w-full">
            <div
              className="bg-green-500 text-white rounded-full p-2 w-full h-full text-center text-xl cursor-pointer"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create
            </div>

            <div
              className="bg-orange-500 text-white rounded-full p-2 w-full h-full text-center text-xl cursor-pointer"
              onClick={connectWallet}
            >
              Watchlist
            </div>
          </div>
        )}
        <div className="text-xs text-slate-400 mt-4">Made with ❤️ by Aman Gupta</div>
      </div>

      <CreateWagerModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  );
}
