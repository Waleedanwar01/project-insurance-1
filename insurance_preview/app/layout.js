// app/layout.js
import "./globals.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import InsuranceBanner from "./components/InsuranceBanner";
import Footer from "./components/Footer";
import GoToTopButton from "./components/GoToTopButton";
import { getCompanyInfo } from "@/lib/api/pages";
import { API_BASE_URL } from "@/lib/config";

export async function generateMetadata() {
  const companyInfo = await getCompanyInfo().catch(() => null);
  const defaultTitle = companyInfo?.company_name || "Insurance Panda";
  const defaultDescription = "Insurance Was Never So Black & White";
  const rawImage = companyInfo?.meta_image || companyInfo?.navbar_logo || companyInfo?.footer_logo || "/logo/logo.png";
  const imageUrl = /^https?:\/\//i.test(rawImage) ? rawImage : `${API_BASE_URL}${rawImage}`;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3003'),
    title: companyInfo?.meta_title || defaultTitle,
    description: companyInfo?.meta_description || defaultDescription,
    openGraph: {
      title: companyInfo?.meta_title || defaultTitle,
      description: companyInfo?.meta_description || defaultDescription,
      images: imageUrl ? [{ url: imageUrl }] : [],
      siteName: defaultTitle,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: companyInfo?.meta_title || defaultTitle,
      description: companyInfo?.meta_description || defaultDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function RootLayout({ children }) {
  const companyInfo = await getCompanyInfo().catch(() => null);
  const faviconUrl = (() => {
    const url = companyInfo?.favicon || null;
    if (!url) return '/favicon.ico';
    return /^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url}`;
  })();
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=TASA+Orbiter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href={faviconUrl} />
      </head>
      <body>
        <Navbar companyInfo={companyInfo} />
        <HeroSection companyInfo={companyInfo} />
        {children}
        <InsuranceBanner companyInfo={companyInfo} />
        <GoToTopButton />
        <Footer companyInfo={companyInfo} />
      </body>
    </html>
  );
}
