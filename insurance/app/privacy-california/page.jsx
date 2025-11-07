import React from 'react'
import CaliforniaClient from './CaliforniaClient'
import { API_BASE_URL } from '@/lib/config'

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/california_privacy/`, { next: { revalidate: 600 } });
    const page = res.ok ? await res.json() : null;
    const title = page?.meta_title || page?.title || 'California Privacy Policy';
    const description = page?.meta_description || 'California privacy information and disclosures.';
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k=>k.trim()).filter(Boolean) : undefined;
    return { title, description, keywords, openGraph: { title, description }, twitter: { title, description } };
  } catch (e) {
    return { title: 'California Privacy Policy', description: 'California privacy information and disclosures.' };
  }
}

const CaliforniaPage = () => {
  return (
    <div>
        <CaliforniaClient />
        </div>
  )
}

export default CaliforniaPage