import SentimentAnalysis from "@/components/sentiment-analysis";

export default async function Home() {
  return (
    <main className="p-3 md:p-6 space-y-8 max-w-4xl m-auto">
      <h1 className="text-3xl font-bold">Tweet Sentiment Analysis</h1>
      <SentimentAnalysis />
    </main>
  );
}
