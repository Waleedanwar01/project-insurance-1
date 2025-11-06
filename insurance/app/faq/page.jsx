import React from 'react';
import FaqsClient from '../faqs/FaqsClient';
import { SITE_URL, SITE_NAME } from '@/lib/config';

export const metadata = {
  title: 'Car Insurance FAQs | Common Auto Insurance Questions Answered',
  description:
    'Find answers to the most frequently asked questions about car insurance. Learn how coverage works, how to save money, and how to choose the right auto insurance policy.',
  keywords: [
    'car insurance faqs',
    'auto insurance questions',
    'insurance panda faqs',
    'car coverage help',
    'auto policy guide',
    'how car insurance works',
    'car insurance answers',
  ],
  openGraph: {
    title: 'Car Insurance FAQs | Common Auto Insurance Questions Answered',
    description:
      'Get clear answers to your car insurance questions — from coverage types to claim processes. Insurance Panda helps you understand every detail.',
    url: SITE_URL ? `${SITE_URL}/faq` : undefined,
    siteName: SITE_NAME,
    images: [
      {
        url: '/images/faq-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Car Insurance FAQs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car Insurance FAQs | Common Auto Insurance Questions Answered',
    description:
      'Find answers to your car insurance questions. Learn how to get the best coverage and save with Insurance Panda.',
    images: ['/images/faq-banner.jpg'],
  },
};

export default function FAQPage() {
  return (
    <div>
      <FaqsClient />
    </div>
  );
}