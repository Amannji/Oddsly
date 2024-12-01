import PredictionBlock from "@/components/prediction-block";

export default function LiveBetsList() {
  return (
    <>
      <div className="flex flex-col justify-center gap-4 overflow-y-auto scrollbar-hide max-h-[calc(100vh-200px)] px-4 pb-32">
        <PredictionBlock title="Trump ends Ukraine war by first 90 days?" volume="$4M" comments={887} />
        <PredictionBlock title="Will Bitcoin reach $100k by end of 2024?" volume="$2.5M" comments={654} />
        <PredictionBlock title="Will Apple release AR glasses in 2024?" volume="$1.8M" comments={432} />
        <PredictionBlock title="Will SpaceX successfully land on Mars in 2024?" volume="$5.2M" comments={1243} />
        <PredictionBlock title="Will ChatGPT 5 be released before July 2024?" volume="$3.1M" comments={765} />
      </div>
    </>
  );
}
