import HowToUseClient from './HowToUseClient';
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/how-to-use/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || 'How to Use Insurance Panda - Step-by-Step Guide | Insurance Panda';
    const description = page?.meta_description || 'Learn how to use Insurance Panda to find the best insurance quotes. Our comprehensive guide walks you through every step of the process.';
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : ['how to use insurance panda','insurance quotes guide','compare insurance','insurance shopping guide'];
    return { title, description, keywords, openGraph: { title, description } };
  } catch (e) {
    return { title: 'How to Use Insurance Panda - Step-by-Step Guide | Insurance Panda', description: 'Learn how to use Insurance Panda to find the best insurance quotes. Our comprehensive guide walks you through every step of the process.' };
  }
}

export default function HowToUsePage() {
  return <HowToUseClient />;
}