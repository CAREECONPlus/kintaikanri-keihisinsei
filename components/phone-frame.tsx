import type { ReactNode } from "react"

interface PhoneFrameProps {
  children: ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="mx-auto overflow-hidden rounded-[55px] bg-[#1f1f1f] p-2 shadow-xl">
      <div className="relative overflow-hidden rounded-[48px] border-[12px] border-black bg-white">
        {/* ノッチ部分 */}
        <div className="absolute left-1/2 top-0 z-10 h-7 w-36 -translate-x-1/2 rounded-b-2xl bg-black">
          <div className="absolute left-1/2 top-2 h-2 w-2 -translate-x-[24px] rounded-full bg-[#222]"></div>
          <div className="absolute left-1/2 top-2 h-2 w-8 -translate-x-1/2 rounded-full bg-[#222]"></div>
          <div className="absolute left-1/2 top-2 h-2 w-2 translate-x-[16px] rounded-full bg-[#222]"></div>
        </div>

        {/* 側面のボタン（音量ボタン） */}
        <div className="absolute -left-[17px] top-24 h-12 w-1 rounded-l-lg bg-[#1a1a1a]"></div>
        <div className="absolute -left-[17px] top-40 h-12 w-1 rounded-l-lg bg-[#1a1a1a]"></div>

        {/* 側面のボタン（電源ボタン） */}
        <div className="absolute -right-[17px] top-32 h-16 w-1 rounded-r-lg bg-[#1a1a1a]"></div>

        {/* 画面コンテンツ */}
        <div className="relative h-[650px] w-[320px] overflow-hidden bg-gray-50">{children}</div>
      </div>
    </div>
  )
}
