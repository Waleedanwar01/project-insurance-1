"use client";
import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
// Data for the feature steps with image paths
const steps = [
  {
    image: "/images/enter-zip-code.png", // Placeholder image 1
    stepNumber: "STEP 1",
    title: "Enter Your ZIP Code",
    description:
      "Where you live plays a huge role in determining your insurance rates.",
  },
  {
    image: "/images/vehicle-details.png", // Placeholder image 2
    stepNumber: "STEP 2",
    title: "Enter Your Vehicle Details",
    description: "Which car do you drive? We'll customize rates for you.",
  },
  {
    image: "/images/compare-and-save.png", // Placeholder image 3
    stepNumber: "STEP 3",
    title: "Compare Rates and Save",
    description: "Choose your quote from our secure auto insurance portal.",
  },
];
const testimonials = [
  {
    name: "Maria T., Georgetown, TX",
    quote:
      "I was skeptical about using Panda, but I'm so glad I did! I saved AT LEAST $200 on my annual premium without sacrificing coverage. Their customer service was fantastic and made the process super smooth.",
  },
  {
    name: "Elliott H., Decatur, GA",
    quote:
      "I've been overpaying for car insurance for years. At Insurance Panda, I found a policy that saved me $400. The process was quick and the savings were immediate.",
  },
  {
    name: "Jordan K., Sarasota, FL",
    quote:
      "Insurance Panda is a game changer. As a first-time driver, I was worried about price, but they found me an amazing policy. I ended up saving $150, and the agent helped me find just what I wanted.",
  },
  {
    name: "Samantha W., Philadelphia, PA",
    quote:
      "Using Panda to get a quote was one of the best decisions I've made this year. I saved $330 on my car insurance, and their customer care team made sure I understood every step of the process.",
  },
  {
    name: "Chris D., Seattle, WA",
    quote:
      "I couldn't believe the savings – nearly $300 less than what I was paying from my old insurer. The transition was seamless, and their support team answered all my questions.",
  },
  {
    name: "Mike L., Bakersfield, CA",
    quote:
      "Definitely is top-notch. I saved over $320 on my car insurance. Their support team is dedicated, and the personalized customer service made me feel like a valued customer.",
  },
];
// Removed static sample articles; homepage will render dynamic latest blogs



const FeatureSection = () => {
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [recentFaqs, setRecentFaqs] = useState([]);
  const [loading, setLoading] = useState({ blogs: true, faqs: true });
  const [error, setError] = useState({ blogs: null, faqs: null });

  const slugify = (text) =>
    String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const getSafeSlug = (faq) => faq?.slug || slugify(faq?.question);

  useEffect(() => {
    let isMounted = true;

    const fetchRecentBlogs = async () => {
      try {
        // Fetch only the latest 6 posts ordered by publish date
        const res = await fetch(`${API_BASE_URL}/api/blog/posts/?limit=6`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Blogs request failed: ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];
        if (isMounted) setRecentBlogs(items);
      } catch (err) {
        if (isMounted) setError((prev) => ({ ...prev, blogs: err.message }));
      } finally {
        if (isMounted) setLoading((prev) => ({ ...prev, blogs: false }));
      }
    };

    const fetchRecentFaqs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/faq/api/faqs/recent/?limit=6`, { cache: "no-store" });
        if (!res.ok) throw new Error(`FAQs request failed: ${res.status}`);
        const data = await res.json();
        if (isMounted) setRecentFaqs(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setError((prev) => ({ ...prev, faqs: err.message }));
      } finally {
        if (isMounted) setLoading((prev) => ({ ...prev, faqs: false }));
      }
    };

    fetchRecentBlogs();
    fetchRecentFaqs();

    return () => {
      isMounted = false;
    };
  }, []);
  // GSAP imports and logic removed to resolve compilation error.
  // The animation is now handled purely by CSS.
  return (
    // Outer container: Standard section padding and pure white background
    <section className="w-full bg-white font-inter py-6 md:py-10 lg:py-24"
    
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Content Block: Headline and Paragraph (Centered and wide) */}
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
          <h2
            className="text-gray-900 text-4xl sm:text-5xl font-bold mb-4 leading-tight animate-fade-in-up"
            style={{ animationDelay: "0s" }}
          >
            Save on Car Insurance{" "}
            <span className="text-red-600 font-extrabold">
              with Insurance Panda
            </span>
          </h2>

          <p
            className="text-gray-600 text-lg md:text-xl font-normal leading-relaxed px-4 md:px-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Our user-friendly online platform empowers you to effortlessly
            compare rates from leading auto insurance providers -{" "}
            <strong className="text-gray-800">all at no cost</strong> and
            secured with{" "}
            <strong className="text-gray-800">
              industry-standard SHA-256 encryption
            </strong>
            . Obtain multiple quotes instantly within a streamlined three-step
            process. Here's how it works:
          </p>
          {/* Subtle line separator */}
          <hr
            className="h-[1px] w-1/3 mx-auto mt-6 border-gray-300 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          />
        </div>

        {/* 3-Column Features Grid: Fully responsive grid setup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              // Card style matching the image: White background, subtle gray border, soft rounded corners, and shadow
              className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-lg transition duration-300 hover:shadow-xl cursor-pointer flex flex-col items-center text-center animate-fade-in-up"
              style={{ animationDelay: `${0.6 + index * 0.2}s` }} // Staggered delay for cards
            >
              {/* Image Container - mimicking the large white/gray box around the illustrations */}
              <div className="flex justify-center items-center w-full max-w-[200px] h-[180px] mb-6">
                {/* Placeholder Image URL - Replace with your actual illustration paths */}
                <Image
                  width={200}
                  height={200}
                  src={step.image}
                  alt={step.title}
                  className="object-contain w-full h-full"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>

              {/* Step Number Badge */}
              <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-4 shadow-md">
                {step.stepNumber}
              </span>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>

              <p className="text-gray-600 text-base leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Custom styles for Inter font and the new CSS animation */}
      <style>{`
        .font-inter {
            font-family: 'Inter', sans-serif;
        }

        /* Define CSS Keyframes for fade-in effect */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Apply the animation class */
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; /* Using a clean cubic-bezier for professional ease */
          opacity: 0; /* Hide elements initially */
        }
      `}</style>

      
      <section className="w-full bg-gray-50 font-inter py-6 md:py-10 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Card Container */}
          <div className="bg-white p-6 md:p-12 lg:p-16 rounded-xl border border-gray-200 shadow-xl">
            {/* Responsive Layout: Grid layout that switches from 1 column (mobile) to 2 columns (large screens) */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">
              {/* Column 1: Image / Illustration (Takes 2/5ths width on desktop) */}
              <div className="lg:col-span-2 flex justify-center lg:justify-start">
                <Image
                  width={200}
                  height={200}
                  // Placeholder image URL for the panda in the red car. You MUST replace this URL.
                  src="/images/about-insurance-panda.png"
                  alt="Illustration of Insurance Panda in a red car"
                  className="w-full max-w-sm h-auto object-contain rounded-lg"
                  style={{ width: 'auto', height: 'auto' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/400x350/F0F8FF/2C3E50?text=Image+Load+Error";
                  }}
                />
              </div>

              {/* Column 2: Text Content (Takes 3/5ths width on desktop) */}
              <div className="lg:col-span-3">
                <h2 className="text-gray-900 text-3xl md:text-4xl font-extrabold mb-6 leading-snug">
                  About <span className="text-red-600">Insurance Panda</span>
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  Insurance Panda is a leading auto insurance quote comparison
                  platform designed to help American drivers secure affordable
                  coverage. Through our secure and user-friendly tool, you can
                  easily compare quotes from reputable insurers in your area,
                  potentially saving you up to **$1,000 annually** on your auto
                  insurance premiums.
                </p>

                <p className="text-gray-600 text-lg leading-relaxed">
                  Get started today by entering your zip code in the section
                  above! We are committed to transparency, security, and making
                  sure you find the best rate without the hassle.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom styles for Inter font */}
        <style>{`
        .font-inter {
            font-family: 'Inter', sans-serif;
        }
      `}</style>
      </section>
      <section className="w-full bg-gray-50 font-inter py-6 md:py-10 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Content Block: Headline and Subtitle */}
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
            <h2
              className="text-gray-900 text-4xl sm:text-5xl font-bold mb-3 leading-tight animate-fade-in-up"
              style={{ animationDelay: "0s" }}
            >
              See How Much Others Saved on{" "}
              <span className="text-red-600">Car Insurance</span>
            </h2>

            <p
              className="text-gray-600 text-lg md:text-xl font-normal leading-relaxed px-4 md:px-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Read how Insurance Panda helped others save. Trusted testimonials
              from real drivers.
            </p>
          </div>

          {/* Testimonials Grid: Responsive two-column layout with flexible gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                // Card style: Clean white background, subtle shadow, padding, and border
                className="relative bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-md transition duration-300 hover:shadow-lg animate-fade-in-up flex flex-col justify-between"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }} // Staggered delay
              >
                {/* Large, faded Quote Icon (for uniqueness) */}
                <span className="absolute top-2 right-4 text-gray-100 text-7xl font-serif leading-none select-none">
                  "
                </span>

                {/* Quote content */}
                <p className="text-gray-700 text-base italic leading-relaxed z-10 mb-4">
                  "{testimonial.quote}"
                </p>

                {/* Separator Line */}
                <hr className="w-1/4 h-0.5 bg-red-600 rounded-full mb-3" />

                {/* Name and Location (Strongly styled for professionalism) */}
                <p className="font-semibold text-gray-900 text-sm tracking-wider uppercase z-10">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Custom styles for Inter font and the CSS animation */}
        <style>{`
        .font-inter {
            font-family: 'Inter', sans-serif;
        }

        /* Define CSS Keyframes for fade-in effect */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Apply the animation class */
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
          opacity: 0; 
        }
      `}</style>
      </section>
      <section className="w-full bg-white font-inter py-6 md:py-10 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Content Block: Headline and Subtitle */}
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20">
            <h2
              className="text-gray-900 text-4xl sm:text-5xl font-bold mb-3 leading-tight animate-fade-in-up"
              style={{ animationDelay: "0s" }}
            >
              Latest <span className="text-red-600">Articles</span>
            </h2>

            <p
              className="text-gray-600 text-lg md:text-xl font-normal leading-relaxed px-4 md:px-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Fresh insights from our blog — compare coverage, decode terms, and
              make informed insurance decisions.
            </p>
          </div>

          {/* Dynamic Latest Blogs Grid: Responsive three-column layout */}
          {loading.blogs ? (
            <div className="text-center py-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading latest articles…</p>
            </div>
          ) : error.blogs ? (
            <div className="text-center py-12 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to load articles</h3>
              <p className="text-gray-600">{error.blogs}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.slice(0, 6).map((blog, index) => (
                <article
                  key={blog.id || blog.slug || index}
                  className="group bg-white rounded-xl border border-gray-200 shadow-md transition duration-300 hover:shadow-xl hover:border-red-300 animate-fade-in-up"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  {/* Content-only Card (no image) */}
                  <div className="p-6">
                    {/* Category Badge */}
                    {blog.category?.name && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          {blog.category.name}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-gray-900 text-xl font-bold mb-2 transition duration-300 group-hover:text-red-600">
                      <Link href={`/blog/${blog.slug}`} className="hover:text-red-600">
                        {blog.title}
                      </Link>
                    </h3>

                    {/* Meta (Date and optional author) */}
                    <div className="text-sm text-gray-500 mb-3">
                      {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                      {blog.author && (
                        <span className="ml-3">{blog.author}</span>
                      )}
                    </div>

                    {/* Summary */}
                    {blog.summary && (
                      <p className="text-gray-600 text-base leading-relaxed">
                        {blog.summary}
                      </p>
                    )}

                    {/* Read More */}
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-red-600 hover:text-red-800 font-medium transition-colors duration-200 mt-4"
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Custom styles for Inter font and the CSS animation */}
        <style>{`
        .font-inter {
            font-family: 'Inter', sans-serif;
        }
        
        /* Utility for aspect ratio (Tailwind default aspect utilities not fully available in all environments) */
        .aspect-w-16 {
            padding-top: 62.5%; /* 10 / 16 = 0.625 */
            position: relative;
        }
        .aspect-w-16 img {
            position: absolute;
            top: 0;
            height: 100%;
        }

        /* Define CSS Keyframes for fade-in effect */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Apply the animation class */
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
          opacity: 0; 
        }
      `}</style>
      </section>

      <section className="w-full bg-white font-inter py-6 md:py-10 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content Grid: Two columns on large screens, stacked on mobile */}
          {/* We use lg:grid-cols-2 to keep the two-column layout on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Illustration - Hidden on mobile, visible on large screens */}
            <div
              className="hidden lg:flex justify-center order-2 lg:order-1 animate-fade-in-up"
              style={{ animationDelay: "0s" }}
            >
              {/* The image is contained and scales with the container */}
              <Image
                width={200}
                height={200}
                src="/images/questions-image.png"
                alt="Questions and Answers Illustration"
                className="w-full max-w-xs md:max-w-md h-auto"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>

            {/* Right Column: Headline and FAQ List */}
            {/* On mobile, this becomes the only visible content (order-1) */}
            <div className="order-1 lg:order-2">
              {/* Headline and Subtitle */}
              <h2
                className="text-gray-900 text-4xl sm:text-5xl font-extrabold mb-6 leading-tight animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                Questions & Answers{" "}
                <span className="text-red-600">With Our Experts</span>
              </h2>

              {/* FAQ List from DB */}
              {loading.faqs ? (
                <p className="text-gray-500 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>Loading questions…</p>
              ) : error.faqs ? (
                <p className="text-red-600 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>Failed to load questions: {error.faqs}</p>
              ) : (
                <ul
                  className="space-y-4 animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                >
              {recentFaqs.slice(0, 6).map((faq) => (
                <li key={faq.slug} className="flex items-start">
                  <span className="text-red-600 font-bold mr-3 text-2xl leading-none">•</span>
                  <div>
                    <Link
                      href={`/faq/${getSafeSlug(faq)}`}
                      className="text-gray-800 text-lg hover:text-red-600 transition duration-200 leading-snug font-semibold"
                    >
                      {faq.question}
                    </Link>
                    {faq.short_answer && (
                      <p className="text-gray-600 text-sm mt-1">
                        {faq.short_answer}
                      </p>
                    )}
                  </div>
                </li>
              ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Custom styles for Inter font and the CSS animation */}
        <style>{`
        .font-inter {
            font-family: 'Inter', sans-serif;
        }

        /* Define CSS Keyframes for fade-in effect */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Apply the animation class */
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
          opacity: 0; 
        }
      `}</style>
      </section>
    </section>
  );
};

export default FeatureSection;
