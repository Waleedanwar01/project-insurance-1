import ReviewDetailClient from "./ReviewDetailClient";
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata({ params }) {
  const slug = params?.slug;
  let title = `Review: ${slug}`;
  let description = "Car insurance company review";
  try {
    const resBlog = await fetch(`${API_BASE_URL}/api/blog/posts/${slug}/`, { cache: "no-store" });
    if (resBlog.ok) {
      const post = await resBlog.json();
      title = post?.title || title;
      description = post?.summary || description;
      return { title, description }; 
    }
  } catch {}
  // Prefer company review data if available
  try {
    const resReviews = await fetch(`${API_BASE_URL}/api/company/insurers/${slug}/reviews/`, { cache: "no-store" });
    if (resReviews.ok) {
      const list = await resReviews.json();
      const first = Array.isArray(list) ? list[0] : null;
      if (first) {
        title = first?.title || title;
        description = first?.summary || description;
        return { title, description };
      }
    }
  } catch {}
  try {
    const resCo = await fetch(`${API_BASE_URL}/api/company/insurers/${slug}/`, { cache: "no-store" });
    if (resCo.ok) {
      const co = await resCo.json();
      title = `${co?.name} Review`;
      description = co?.description || description;
    }
  } catch {}
  return { title, description };
}

export default function Page(props) {
  return <ReviewDetailClient {...props} />;
}