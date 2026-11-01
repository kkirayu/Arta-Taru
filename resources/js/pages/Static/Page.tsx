import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import type { StaticPageProps } from '@/types';

export default function StaticPage({ title, content, items }: StaticPageProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <PublicLayout>
      <Head title={title} />
      <div className="bg-gray-50 min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>

          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left"
                  >
                    <span className="flex items-start gap-2 text-sm font-semibold text-gray-900">
                      <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      {item.question}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openIndex === i && (
                    <div className="px-4 pb-4 pl-10 text-sm text-gray-600 leading-relaxed">{item.answer}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {content}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
