import React from "react";
import ContactClient from "./ContactClient";
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/pages/contact/`, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const page = await res.json();
    const title = page?.meta_title || page?.title || "Contact Us";
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
    return { title: "Contact Us | Insurance Panda" };
  }
}

const Contact = () => {
  return (
    <div>
      <ContactClient />
    </div>
  );
};

export default Contact;
