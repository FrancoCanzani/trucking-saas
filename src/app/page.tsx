import SentimentAnalysis from "@/components/sentiment-analysis";

export default function Home() {
  return (
    <main className="container mx-auto p-4 space-y-8 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight">Tweet Analysis</h1>
      <SentimentAnalysis />
    </main>
  );
}
