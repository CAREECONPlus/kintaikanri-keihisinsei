ｄ"use client"

import { useState } from "react"
import { PhoneFrame } from "@/components/phone-frame"
import { NavigationBar } from "@/components/navigation-bar"
import { DailySchedule } from "@/components/daily-schedule"
import { CameraView } from "@/components/camera-view"
import { TaskDetailScreen } from "@/components/task-detail-screen"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ExpenseScreen } from "@/components/expense-screen"
import { ChatView } from "@/components/chat-view" // Declare ChatView

interface Task {
  id: number
  title: string
  location: string
  latitude: number
  longitude: number
  startTime: Date
  endTime: Date
  description: string
  color: string
}

// selectedTaskの型を拡張
interface ExtendedTask extends Task {
  isExpenseScreen?: boolean
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("schedule")
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  // handleTaskSelectを修正
  const handleTaskSelect = (task: Task | ExtendedTask) => {
    setSelectedTask(task as ExtendedTask)
  }

  const handleBackToSchedule = () => {
    setSelectedTask(null)
  }

  const goToPreviousDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() - 1)
      return newDate
    })
  }

  const goToNextDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      newDate.setDate(newDate.getDate() + 1)
      return newDate
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const formatDateHeader = (date: Date) => {
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = weekdays[date.getDay()]
    const dateStr = `${month}月${day}日(${weekday})`
    return isToday(date) ? `${dateStr} (今日)` : dateStr
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <PhoneFrame>
        <div className="relative flex h-full flex-col">
          <div className="flex-1 overflow-hidden">
            {/* selectedTaskの条件分岐を修正 */}
            {selectedTask ? (
              selectedTask.title === "経費申請" ? (
                <ExpenseScreen onBack={handleBackToSchedule} />
              ) : (
                <TaskDetailScreen task={selectedTask as Task} onBack={handleBackToSchedule} />
              )
            ) : (
              <>
                {activeTab === "schedule" && (
                  <div className="bg-white p-4 pt-10 h-full flex flex-col">
                    {/* 日付ヘッダー */}
                    <div className="mb-4 flex items-center justify-between flex-shrink-0">
                      <button
                        onClick={goToPreviousDay}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 border border-gray-200"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <h2 className="text-lg font-medium text-gray-800">{formatDateHeader(currentDate)}</h2>
                      <button
                        onClick={goToNextDay}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 border border-gray-200"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                    <h1 className="mb-6 text-xl font-bold text-gray-900 flex-shrink-0">本日のスケジュール</h1>
                    <div className="flex-1 overflow-y-auto">
                      <DailySchedule onTaskSelect={handleTaskSelect} />
                    </div>
                  </div>
                )}
                {activeTab === "camera" && <CameraView />}
                {activeTab === "chat" && <ChatView />}
              </>
            )}
          </div>
          {!selectedTask && <NavigationBar activeTab={activeTab} onTabChange={setActiveTab} />}
        </div>
      </PhoneFrame>
    </main>
  )
}
