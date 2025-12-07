import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    fetch("/api/insights")
      .then((res) => res.json())
      .then((data) =>
        setInsights(
          data.map((i: any) => ({
            ...i,
            date: new Date(i.date ?? i.createdAt),
          }))
        )
      );
  }, []);

  const handleDelete = (id: number) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <main className={styles.main}>
      <Header />
      <Insights className={styles.insights} insights={insights} onDelete={handleDelete} />
    </main>
  );
};
