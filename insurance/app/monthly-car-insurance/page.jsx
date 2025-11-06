import React from "react";
import MonthlyCarInsuranceClient from "./MonthlyCarInsuranceClient";

export const metadata = {
  title: "Monthly Car Insurance Plans (2025) – Flexible Month-to-Month Coverage",
  description:
    "Learn how monthly car insurance plans work, compare costs, explore pros and cons, and find the best companies offering flexible month-to-month car insurance.",
  keywords: [
    "monthly car insurance",
    "month-to-month car insurance",
    "auto insurance monthly payments",
    "affordable car insurance plans",
    "cancel car insurance anytime",
    "GEICO monthly insurance",
    "State Farm monthly car insurance",
    "Progressive monthly plans",
    "USAA month-to-month coverage",
  ],
};

const MonthlyCarInsurance = () => {
  return (
    <div className="text-left">
      <MonthlyCarInsuranceClient />
    </div>
  );
};

export default MonthlyCarInsurance;
