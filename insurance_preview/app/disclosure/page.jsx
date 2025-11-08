import DisclosureClient from './DisclosureClient';
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/disclosure/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || 'Advertiser Disclosure - Insurance Panda';
    const description = page?.meta_description || 'Learn about our advertising relationships and how we maintain transparency in our insurance comparison services.';
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : ['advertiser disclosure','insurance comparison','transparency','affiliate relationships'];
    return { title, description, keywords };
  } catch (e) {
    return { title: 'Advertiser Disclosure - Insurance Panda', description: 'Learn about our advertising relationships and how we maintain transparency in our insurance comparison services.' };
  }
}

export default function DisclosurePage() {
  return <DisclosureClient />;
}