import TeamClient from './TeamClient';
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/team/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || 'Our Team - Insurance Panda';
    const description = page?.meta_description || 'Meet the dedicated team behind Insurance Panda. Learn about our experts who help you find the best insurance coverage.';
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()) : ['insurance team','insurance experts','about our team','insurance professionals'];
    return { title, description, keywords };
  } catch (e) {
    return { title: 'Our Team - Insurance Panda', description: 'Meet the dedicated team behind Insurance Panda. Learn about our experts who help you find the best insurance coverage.' };
  }
}

export default function TeamPage() {
  return <TeamClient />;
}