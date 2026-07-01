import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "니케의 모든 것",
  description: "승리의 여신: 니케 유저를 위한 비공식 통합 도우미 웹앱"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</main>
        <footer className="border-t border-signal/20 bg-black/30 px-4 py-6 text-center text-xs leading-6 text-slate-500">
          <span className="font-black uppercase text-magenta">Notice</span> · 이 앱은 승리의 여신: 니케 유저를 위한 비공식 도우미입니다. 최종 추천은 공식 정보, 커뮤니티 공략, 외부 도구, 관리자 검수 데이터를 참고해 계산됩니다. 실제 메타는 패치와 보스 기믹에 따라 달라질 수 있습니다.
        </footer>
      </body>
    </html>
  );
}
