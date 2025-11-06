import React from "react";
import { API_BASE_URL } from "@/lib/config";

async function fetchFaq(slug) {
  const res = await fetch(`${API_BASE_URL}/api/faq/api/faqs/${slug}/`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function FaqDetailPage({ params }) {
  const { slug } = params;
  const faq = await fetchFaq(slug);

  if (!faq) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900">FAQ not found</h1>
        <p className="text-gray-600 mt-2">The requested question could not be found.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white font-inter py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          {faq.question}
        </h1>
        {faq.short_answer && (
          <p className="text-gray-700 text-lg mb-6">{faq.short_answer}</p>
        )}
        <article
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: faq.answer }}
        />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }) {
  const faq = await fetchFaq(params.slug);
  if (!faq) return { title: "FAQ | Insurance Panda" };
  return {
    title: `${faq.question} | Insurance Panda`,
    description: faq.short_answer || "Detailed answer from Insurance Panda FAQs",
  };
}