import React from "react";
import StatesClient from "./StatesClient";
import { API_BASE_URL } from "@/lib/config";

// ✅ Page Metadata
export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/states/`, {
      next: { revalidate: 600 },
    });
    const page = res.ok ? await res.json() : null;

    const title = page?.meta_title || page?.title || "Car Insurance by State | Compare Auto Insurance Rates Near You";
    const description =
      page?.meta_description ||
      "Find car insurance rates, coverage laws, and top insurers in your state. Compare quotes and learn about minimum coverage requirements across the U.S.";
    const keywords = page?.meta_keywords
      ? page.meta_keywords.split(",").map((k) => k.trim())
      : [
          "car insurance by state",
          "auto insurance rates USA",
          "state insurance laws",
          "minimum car insurance requirements",
          "insurance panda states",
          "compare state insurance",
          "car insurance quotes by location",
        ];

    return {
      title,
      description,
      keywords,
      openGraph: { title, description },
      twitter: { title, description },
    };
  } catch (e) {
    return {
      title: "Car Insurance by State | Compare Auto Insurance Rates Near You",
      description:
        "Find car insurance rates, coverage laws, and top insurers in your state. Compare quotes and learn about minimum coverage requirements across the U.S.",
    };
  }
}

const StatesPage = () => {
  return (
    <div>
      <StatesClient />
    </div>
  );
};

export default StatesPage;
