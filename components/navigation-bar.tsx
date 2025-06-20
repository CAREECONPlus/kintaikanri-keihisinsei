"use client"

import { Camera, Calendar, MessageSquare } from "lucide-react"

interface NavigationBarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  return (
    <div className="flex h-16 w-full items-center justify-around border-t border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => onTabChange("camera")}
        className={`flex h-full w-full flex-col items-center justify-center transition-colors ${
          activeTab === "camera" ? "text-primary-blue" : "text-gray-500"
        }`}
      >
        <Camera className="h-6 w-6" />
        <span className="mt-1 text-xs font-medium">カメラ</span>
      </button>

      <button
        onClick={() => onTabChange("schedule")}
        className={`flex h-full w-full flex-col items-center justify-center transition-colors ${
          activeTab === "schedule" ? "text-primary-blue" : "text-gray-500"
        }`}
      >
        <Calendar className="h-6 w-6" />
        <span className="mt-1 text-xs font-medium">スケジュール</span>
      </button>

      <button
        onClick={() => onTabChange("chat")}
        className={`flex h-full w-full flex-col items-center justify-center transition-colors ${
          activeTab === "chat" ? "text-primary-blue" : "text-gray-500"
        }`}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="mt-1 text-xs font-medium">チャット</span>
      </button>
    </div>
  )
}
