import { WalletSelector } from "@/components/WalletSelector";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
export function Header() {
  const { connected } = useWallet();
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">
        <h1 className="display">Oddsly</h1>

        <div className="flex gap-2 items-center flex-wrap">
          {/* {connected ? <WalletSelector /> : <div>Not Connected</div>} */}
          <WalletSelector />
        </div>
      </div>

      <div className="flex justify-between mx-4">
        <div className="text-black text-2xl font-bold flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_2px_rgba(34,197,94,0.6)]"></div>
          Live
        </div>
        <div>Previous Bets</div>
      </div>
    </>
  );
}
