'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function ThankYouBack({ message = 'Thank you for reading! If you found this helpful, share it with others.' }) {
  const router = useRouter();

  return (
    <section className="mt-16 w-full">
      <div className="w-full">
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-md p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you for reading</h3>
          <p className="text-gray-700 leading-relaxed mb-6">{message}</p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}