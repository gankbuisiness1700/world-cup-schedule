// C:\world-cup-schedule\components\AppLayout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 現在のURLを取得するフック
import Flag from "react-world-flags";

import teamData from "../data/teams.json";
import { Team } from "../types/types";

const groupMap: { [key: string]: string[] } = {
  A: ["mex", "kor", "zaf", "cze"],
  B: ["can", "che", "qat", "bih"],
  C: ["bra", "mar", "GB-SCT", "hti"],
  D: ["usa", "aus", "pry", "tur"],
  E: ["deu", "ecu", "civ", "cuw"],
  F: ["nld", "jpn", "tun", "swe"],
  G: ["bel", "irn", "egy", "nzl"],
  H: ["esp", "ury", "sau", "cpv"],
  I: ["fra", "sen", "nor", "irq"],
  J: ["arg", "aut", "dza", "jor"],
  K: ["prt", "col", "uzb", "cod"],
  L: ["GB-ENG", "hrv", "pan", "gha"],
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const teams: Team[] = teamData as Team[];

  const [openSidebar, setOpenSidebar] = useState<string | null>(null);
  const [isGroupExpanded, setIsGroupExpanded] = useState<boolean>(false);

  // 現在のURLを見て、どのメニューを光らせるか判定
  const isScheduleMenu = pathname === "/" || pathname.startsWith("/group");
  const isTeamMenu = pathname.startsWith("/team");

  // ページ移動（URL変化）を検知したら、自動的にスマホ用メニューを閉じる
  useEffect(() => {
    setOpenSidebar(null);
  }, [pathname]);

  return (
    <div className="flex h-[100dvh] bg-gray-950 text-white md:p-2 overflow-hidden relative overscroll-none">
      {/* --- 第1層：スマホ用ボトムナビ --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around p-3 z-50 pb-safe">
        <button
          onClick={() => setOpenSidebar(openSidebar === "schedule" ? null : "schedule")}
          className={`flex-1 py-2 text-sm rounded-lg mx-1 font-bold ${isScheduleMenu || openSidebar === "schedule" ? "bg-gray-800 text-blue-400" : "text-gray-400"}`}
        >
          日程
        </button>
        <button
          onClick={() => {
            setIsGroupExpanded(false);
            setOpenSidebar(openSidebar === "team" ? null : "team");
          }}
          className={`flex-1 py-2 text-sm rounded-lg mx-1 font-bold ${isTeamMenu || openSidebar === "team" ? "bg-gray-800 text-blue-400" : "text-gray-400"}`}
        >
          チーム
        </button>
      </div>

      {/* --- 第1層：PC用サイドナビ --- */}
      <div className="hidden md:flex w-24 flex-col items-center py-6 gap-6 z-10 shrink-0">
        <button
          onClick={() => setOpenSidebar(openSidebar === "schedule" ? null : "schedule")}
          className={`p-2 rounded w-16 text-sm ${isScheduleMenu || openSidebar === "schedule" ? "bg-gray-800 font-bold" : "text-gray-400 hover:bg-gray-800"}`}
        >
          日程
        </button>
        <button
          onClick={() => {
            setIsGroupExpanded(false);
            setOpenSidebar(openSidebar === "team" ? null : "team");
          }}
          className={`p-2 rounded w-16 text-sm ${isTeamMenu || openSidebar === "team" ? "bg-gray-800 font-bold" : "text-gray-400 hover:bg-gray-800"}`}
        >
          チーム
        </button>
      </div>

      {/* --- 第2層：オーバーレイメニュー --- */}
      {openSidebar && (
        <div
          className="
          fixed inset-0 z-40 bg-gray-950 p-6 pt-12 pb-32 overflow-y-auto overscroll-y-none
          md:relative md:inset-auto md:w-56 md:p-0 md:pt-6 md:pr-4 md:bg-transparent md:z-10
          shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
        >
          <button
            className="md:hidden absolute top-4 right-4 text-gray-400 bg-gray-800 px-3 py-1 rounded-full text-sm"
            onClick={() => setOpenSidebar(null)}
          >
            ✕ 閉じる
          </button>

          {openSidebar === "schedule" && (
            <ul className="space-y-2">
              <li className="font-bold text-gray-500 mb-2 pl-2">日程</li>
              <li>
                <Link
                  href="/"
                  className={`block w-full text-left p-3 md:p-2 rounded-lg ${pathname === "/" ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  全体日程
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setIsGroupExpanded(!isGroupExpanded)}
                  className={`w-full text-left p-3 md:p-2 rounded-lg flex justify-between items-center ${pathname.startsWith("/group/") ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  グループ別
                  <span className="text-xs">{isGroupExpanded ? "▼" : "▶"}</span>
                </button>
                {isGroupExpanded && (
                  <ul className="ml-4 mt-2 space-y-1 border-l border-gray-700 pl-2">
                    {Object.keys(groupMap).map((key) => (
                      <li key={key}>
                        <Link
                          href={`/group/${key}`}
                          className={`block w-full text-left p-3 md:p-2 rounded-lg text-sm ${pathname === `/group/${key}` ? "bg-gray-700 text-white font-bold" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}
                        >
                          グループ {key}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                {/* 日本代表日程は、詳細ページに流すのが一番リッチです */}
                <Link
                  href="/team/jpn"
                  className={`block w-full text-left p-3 md:p-2 rounded-lg ${pathname === "/team/jpn" ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-800"}`}
                >
                  日本代表
                </Link>
              </li>
            </ul>
          )}
          {openSidebar === "team" && (
            <ul className="space-y-2">
              <li className="font-bold text-gray-500 mb-2 pl-2">チーム紹介</li>
              {teams.map((team) => (
                <li key={team.id}>
                  <Link
                    href={`/team/${team.id}`}
                    className={`w-full text-left p-3 md:p-2 rounded-lg flex items-center gap-3 md:gap-2 ${pathname === `/team/${team.id}` ? "bg-gray-800 text-white font-bold" : "text-gray-400 hover:bg-gray-700 hover:text-white"}`}
                  >
                    <Flag
                      code={team.id}
                      className="w-6 h-4 object-cover border border-gray-700 shrink-0"
                    />
                    {team.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ===== 各ページの中身がここに表示される ===== */}
      {children}
    </div>
  );
}
