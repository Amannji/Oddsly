import { useState } from "react";

export function StickyBottom() {
  const [connected, setConnected] = useState(false);

  const connectWallet = () => {
    setConnected(!connected);
  };

  return (
    <>
      <div className="flex items-center justify-center flex-col fixed bottom-0 w-full py-[2rem] bg-black">
        {!connected ? (
          <div
            className="bg-blue-500 text-white rounded-full p-2 w-full h-full text-center text-xl"
            onClick={connectWallet}
          >
            Connect Wallet
          </div>
        ) : (
          <div className="flex gap-4 w-full">
            <div className="bg-green-500 text-white rounded-full p-2 w-full h-full text-center text-xl">Create</div>
            <div
              className="bg-purple-500 text-white rounded-full p-2 w-full h-full text-center text-xl"
              onClick={connectWallet}
            >
              Join
            </div>
            <div
              className="bg-orange-500 text-white rounded-full p-2 w-full h-full text-center text-xl"
              onClick={connectWallet}
            >
              Watchlist
            </div>
          </div>
        )}
        <div className="text-xs text-slate-400 mt-4">Made with ❤️ by Aman Gupta</div>
      </div>
    </>
  );
}
