import React from "react";
import AboutClient from "./AboutClient"; // Adjust path as needed
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/about/`, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const page = await res.json();
    const title = page?.meta_title || page?.title || "About Us";
    const description = page?.meta_description || undefined;
    const keywords = page?.meta_keywords ? page.meta_keywords.split(',').map(k => k.trim()).filter(Boolean) : undefined;
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
      },
    };
  } catch {
    return { title: "About Us | Insurance Panda" };
  }
}

const About = () => {
  return (
    <div>
      <AboutClient />
    </div>
  );
};

export default About;
