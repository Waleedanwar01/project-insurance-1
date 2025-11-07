import React from "react";
import MonthlyCarInsuranceClient from "./MonthlyCarInsuranceClient";
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/monthly-car-insurance/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || "Monthly Car Insurance Plans (2025) – Flexible Month-to-Month Coverage";
    const description = page?.meta_description || "Learn how monthly car insurance plans work, compare costs, explore pros and cons, and find the best companies offering flexible month-to-month car insurance.";
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : [
      "monthly car insurance",
      "month-to-month car insurance",
      "auto insurance monthly payments",
      "affordable car insurance plans",
      "cancel car insurance anytime",
      "GEICO monthly insurance",
      "State Farm monthly car insurance",
      "Progressive monthly plans",
      "USAA month-to-month coverage",
    ];
    return { title, description, keywords };
  } catch (e) {
    return { title: "Monthly Car Insurance Plans (2025) – Flexible Month-to-Month Coverage", description: "Learn how monthly car insurance plans work, compare costs, explore pros and cons, and find the best companies offering flexible month-to-month car insurance." };
  }
}

const MonthlyCarInsurance = () => {
  return (
    <div className="text-left">
      <MonthlyCarInsuranceClient />
    </div>
  );
};

export default MonthlyCarInsurance;
