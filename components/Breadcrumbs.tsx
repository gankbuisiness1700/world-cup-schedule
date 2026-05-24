// C:\world-cup-schedule\components\Breadcrumbs.tsx
import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  // Googleに伝えるための「構造化データ（JSON-LD）」を自動生成
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      // ※ 後でVercelの公開URLに変更してください（例: https://my-soccer-app.vercel.app）
      item: `https://your-domain.com${item.href}`,
    })),
  };

  return (
    <>
      {/* 検索エンジン用の見えないデータを注入 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 実際の画面に表示されるパンくずリスト */}
      <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-400">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-gray-600">/</span>}

              {index === items.length - 1 ? (
                // 一番最後（現在のページ）はリンクにせず、色を明るくする
                <span className="text-gray-200 font-bold" aria-current="page">
                  {item.name}
                </span>
              ) : (
                // 途中の階層はリンクにする
                <Link href={item.href} className="hover:text-blue-400 transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
