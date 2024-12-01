import { Header } from "@/components/Header";
import { Counter } from "@/components/Counter";
import { TopBanner } from "@/components/TopBanner";
import { useState } from "react";
import { StickyBottom } from "@/components/StickyBottom";
import PredictionBlock from "@/components/prediction-block";
import { IS_DEV } from "./constants";
import LiveBetsList from "@/components/LiveBetsList";

function App() {
  return (
    <>
      <Header />
      <LiveBetsList />
      <StickyBottom />
    </>
  );
}

export default App;
