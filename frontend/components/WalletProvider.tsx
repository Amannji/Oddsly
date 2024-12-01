import { PropsWithChildren } from "react";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { useToast } from "@/components/ui/use-toast";
// Internal constants
import { NETWORK, APTOS_API_KEY } from "@/constants";

export function WalletProvider({ children }: PropsWithChildren) {
  const { toast } = useToast();

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: NETWORK,
        mizuwallet: {
          // Learn more https://docs.mizu.io/docs/preparation/mizu-app-id
          appId: undefined,
          // Learn more https://docs.mizu.io/docs/preparation/manifest-json
          manifestURL: "https://assets.mz.xyz/static/config/mizuwallet-connect-manifest.json",
          // aptosApiKey is not a valid property for the mizuwallet config object
          // Removing aptosApiKey since it's not supported in the type definition
        },
      }}
      optInWallets={["Mizu Wallet"]}
      onError={(error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error || "Unknown wallet error",
        });
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
