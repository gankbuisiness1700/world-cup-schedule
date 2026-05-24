// C:\world-cup-schedule\app\layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import AppLayout from "../components/AppLayout"; // 追加

export const metadata: Metadata = {
  title: "ワールドカップ2026 試合日程・選手名鑑",
  description: "最新のワールドカップ日程と登録選手名鑑",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {/* アプリ全体をサイドバーレイアウトで包む */}
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
