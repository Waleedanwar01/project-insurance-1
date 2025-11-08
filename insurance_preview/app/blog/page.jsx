import BlogsClient from './BlogsClient';
import { API_BASE_URL } from '@/lib/config';

export async function generateMetadata() {
  try {
    const [pageRes, companyRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/pages/blog/`, { next: { revalidate: 600 } }),
      fetch(`${API_BASE_URL}/api/pages/company/`, { next: { revalidate: 600 } }),
    ]);

    const page = pageRes.ok ? await pageRes.json() : null;
    const company = companyRes.ok ? await companyRes.json() : null;
    const companyName = company?.company_name || null;

    const title = page?.meta_title || page?.title || (companyName ? `Blog | ${companyName}` : 'Blog');
    const description = page?.meta_description || (companyName
      ? `Stay updated with the latest insurance news, tips, and insights from ${companyName}.`
      : 'Stay updated with the latest insurance news, tips, and insights.');
    const keywords = page?.meta_keywords
      ? page.meta_keywords.split(',').map(k => k.trim()).filter(Boolean)
      : undefined;

    return {
      title,
      description,
      keywords,
      openGraph: { title, description },
      twitter: { title, description },
    };
  } catch (e) {
    return {
      title: 'Blog',
      description: 'Stay updated with the latest insurance news, tips, and insights.',
    };
  }
}

export default async function BlogPage() {
  let companyName = null;
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/company/`, { next: { revalidate: 600 } });
    if (res.ok) {
      const company = await res.json();
      companyName = company?.company_name || null;
    }
  } catch (e) {
    // silent fallback
  }

  return <BlogsClient companyName={companyName} />;
}