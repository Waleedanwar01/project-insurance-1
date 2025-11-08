"use client";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";

export default function BlogCard({ blog, basePath = "/blog" }) {
  if (!blog) return null;
  const slug = blog.slug || (blog.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const date = blog.published_at ? new Date(blog.published_at) : null;

  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Featured Image */}
      {blog.feature_image && (
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {/* Use next/image when URL is absolute; fallback to img for simplicity */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={blog.feature_image} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        {blog.category && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
              {blog.category.name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          <Link href={`${basePath}/${slug}`} className="hover:text-red-600 transition-colors">
            {blog.title}
          </Link>
        </h3>

        {/* Summary */}
        {blog.summary && (
          <p className="text-gray-700 leading-relaxed mb-4">
            {blog.summary}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          {date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <Link
            href={`${basePath}/${slug}`}
            className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors group"
          >
            Read Full Article
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}