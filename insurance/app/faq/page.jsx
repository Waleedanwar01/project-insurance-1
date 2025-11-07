import React from 'react';
import FaqsClient from '../faqs/FaqsClient';
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/faq/`, {
      next: { revalidate: 600 },
    });
    const page = res.ok ? await res.json() : null;

    const title = page?.meta_title || page?.title || 'Car Insurance FAQs | Common Auto Insurance Questions Answered';
    const description = page?.meta_description ||
      'Find answers to the most frequently asked questions about car insurance. Learn how coverage works, how to save money, and how to choose the right auto insurance policy.';
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k => k.trim()) : [
      'car insurance faqs',
      'auto insurance questions',
      'insurance panda faqs',
      'car coverage help',
      'auto policy guide',
      'how car insurance works',
      'car insurance answers',
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
      title: 'Car Insurance FAQs | Common Auto Insurance Questions Answered',
      description: 'Find answers to the most frequently asked questions about car insurance. Learn how coverage works, how to save money, and how to choose the right auto insurance policy.',
    };
  }
}

export default function FAQPage() {
  return (
    <div>
      <FaqsClient />
    </div>
  );
}