"use client"

import { useEffect, useRef, useState } from "react"
import { TaskCard } from "@/components/task-card"
import { LogIn, LogOut, Receipt, Clock, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface DailyScheduleProps {
  onTaskSelect: (task: Task) => void
}

// サンプルデータ（緯度経度を追加）
const scheduleData = [
  {
    id: 1,
    title: "朝礼・安全確認",
    location: "工務店事務所",
    latitude: 35.6762,
    longitude: 139.6503,
    startTime: new Date(2023, 0, 1, 8, 0),
    endTime: new Date(2023, 0, 1, 8, 30),
    description: "本日の作業予定と安全事項の確認",
    color: "bg-blue-100 border-blue-300",
  },
  {
    id: 2,
    title: "田中様邸 現場調査",
    location: "〇〇市△△町1-2-3",
    latitude: 35.6895,
    longitude: 139.6917,
    startTime: new Date(2023, 0, 1, 9, 30),
    endTime: new Date(2023, 0, 1, 11, 0),
    description: "キッチンリフォームの現場調査・採寸",
    color: "bg-green-100 border-green-300",
  },
  {
    id: 3,
    title: "佐藤様邸 工事進捗確認",
    location: "〇〇市□□町4-5-6",
    latitude: 35.6586,
    longitude: 139.7454,
    startTime: new Date(2023, 0, 1, 11, 30),
    endTime: new Date(2023, 0, 1, 12, 30),
    description: "外壁塗装工事の進捗確認と品質チェック",
    color: "bg-yellow-100 border-yellow-300",
  },
  {
    id: 4,
    title: "昼食・休憩",
    location: "現場近くの食堂",
    latitude: 35.6654,
    longitude: 139.7707,
    startTime: new Date(2023, 0, 1, 12, 30),
    endTime: new Date(2023, 0, 1, 13, 30),
    description: "昼食と午後の作業準備",
    color: "bg-orange-100 border-orange-300",
  },
  {
    id: 5,
    title: "山田様邸 お客様打ち合わせ",
    location: "〇〇市◇◇町7-8-9",
    latitude: 35.6581,
    longitude: 139.7414,
    startTime: new Date(2023, 0, 1, 14, 0),
    endTime: new Date(2023, 0, 1, 15, 30),
    description: "増築工事の詳細打ち合わせ・見積もり説明",
    color: "bg-purple-100 border-purple-300",
  },
  {
    id: 6,
    title: "資材発注・事務作業",
    location: "工務店事務所",
    latitude: 35.6762,
    longitude: 139.6503,
    startTime: new Date(2023, 0, 1, 16, 0),
    endTime: new Date(2023, 0, 1, 17, 30),
    description: "明日の工事に必要な資材発注と日報作成",
    color: "bg-red-100 border-red-300",
  },
]

export function DailySchedule({ onTaskSelect }: DailyScheduleProps) {
  const taskRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  // 現在地を取得
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("位置情報の取得に失敗しました:", error)
          // 位置情報が取得できない場合は工務店事務所を現在地とする
          setCurrentLocation({
            latitude: 35.6762,
            longitude: 139.6503,
          })
        },
      )
    } else {
      // Geolocationがサポートされていない場合
      setCurrentLocation({
        latitude: 35.6762,
        longitude: 139.6503,
      })
    }
  }

  // Googleマップで経路を表示する関数
  const openGoogleMapsRoute = (fromTask: Task, toTask: Task) => {
    let origin = ""
    let destination = ""

    // 出発地の設定
    if (currentLocation) {
      origin = `${currentLocation.latitude},${currentLocation.longitude}`
    } else {
      origin = `${fromTask.latitude},${fromTask.longitude}`
    }

    // 目的地の設定
    destination = `${toTask.latitude},${toTask.longitude}`

    // GoogleマップのURL構築
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`

    // 新しいタブでGoogleマップを開く
    window.open(googleMapsUrl, "_blank")

    console.log("Googleマップで経路を表示:", {
      from: fromTask.location,
      to: toTask.location,
      origin,
      destination,
    })
  }

  const handleExpenseReport = () => {
    onTaskSelect({
      id: 999,
      title: "経費申請",
      location: "経費管理",
      latitude: 0,
      longitude: 0,
      startTime: new Date(),
      endTime: new Date(),
      description: "本日の経費を申請してください",
      color: "bg-orange-100 border-orange-300",
    } as any)
  }

  // 現在時刻から次のタスクを見つける関数
  const findNextTask = () => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes() // 現在時刻を分に変換

    // 各タスクの開始時刻と終了時刻を分に変換
    const tasksWithTime = scheduleData.map((task, index) => ({
      ...task,
      index,
      startMinutes: task.startTime.getHours() * 60 + task.startTime.getMinutes(),
      endMinutes: task.endTime.getHours() * 60 + task.endTime.getMinutes(),
    }))

    // 現在進行中のタスクを探す
    const currentTask = tasksWithTime.find((task) => currentTime >= task.startMinutes && currentTime <= task.endMinutes)

    if (currentTask) {
      return currentTask.index
    }

    // 次の未来のタスクを探す
    const nextTask = tasksWithTime.find((task) => currentTime < task.startMinutes)

    if (nextTask) {
      return nextTask.index
    }

    // 全てのタスクが過去の場合は最後のタスクを返す
    return tasksWithTime.length - 1
  }

  // 初期スクロール位置の設定
  useEffect(() => {
    // 現在地を取得
    getCurrentLocation()

    const nextTaskIndex = findNextTask()
    const targetTaskRef = taskRefs.current[scheduleData[nextTaskIndex].id]

    if (targetTaskRef) {
      // 少し遅延を入れてDOMが完全にレンダリングされてからスクロール
      setTimeout(() => {
        targetTaskRef.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        })
      }, 100)
    }
  }, [])

  // 時間をフォーマットする関数
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  // 移動時間を計算する関数
  const calculateTravelTime = (index: number) => {
    if (index === 0) return null

    const currentTask = scheduleData[index]
    const previousTask = scheduleData[index - 1]

    const travelTimeMinutes = Math.round(
      (currentTask.startTime.getTime() - previousTask.endTime.getTime()) / (1000 * 60),
    )

    return travelTimeMinutes > 0 ? travelTimeMinutes : null
  }

  // タスクの状態を判定する関数
  const getTaskStatus = (task: Task) => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const taskStartMinutes = task.startTime.getHours() * 60 + task.startTime.getMinutes()
    const taskEndMinutes = task.endTime.getHours() * 60 + task.endTime.getMinutes()

    if (currentTime >= taskStartMinutes && currentTime <= taskEndMinutes) {
      return "current" // 現在進行中
    } else if (currentTime > taskEndMinutes) {
      return "completed" // 完了
    } else {
      return "upcoming" // 未来
    }
  }

  // 出勤処理
  const handleCheckIn = () => {
    setIsCheckedIn(true)
    setCheckInTime(new Date())
    console.log("出勤しました:", new Date())
  }

  // 退勤処理
  const handleCheckOut = () => {
    setIsCheckedIn(false)
    console.log("退勤しました:", new Date())
    console.log("勤務時間:", checkInTime ? `${formatTime(checkInTime)} - ${formatTime(new Date())}` : "不明")
  }

  return (
    <div className="relative w-full">
      {/* 時間軸の縦線 */}
      <div className="absolute left-[12px] top-0 h-full w-0.5 bg-gray-300" />

      <div className="space-y-6">
        {/* 出勤ボタン（最初） */}
        <div className="relative">
          <div className="mb-1 flex items-center space-x-2 ml-6">
            <div className="text-sm font-medium text-gray-600">
              {scheduleData[0] ? formatTime(scheduleData[0].startTime) : "08:00"} 前
            </div>
          </div>
          <div className="ml-6">
            <div className="rounded-lg border-2 border-dashed border-regulation-green bg-background-blue p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-regulation-green">
                    <LogIn className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-regulation-black">出勤</h3>
                    <p className="text-sm text-gray-600">
                      {isCheckedIn && checkInTime ? `${formatTime(checkInTime)} に出勤済み` : "出勤打刻をしてください"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCheckIn}
                  disabled={isCheckedIn}
                  className={`${
                    isCheckedIn
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-regulation-green hover:bg-regulation-green/90 text-white"
                  }`}
                >
                  {isCheckedIn ? "出勤済み" : "出勤"}
                </Button>
              </div>
              {isCheckedIn && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>勤務開始: {checkInTime ? formatTime(checkInTime) : "不明"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 既存のタスク一覧 */}
        {scheduleData.map((task, index) => {
          const taskStatus = getTaskStatus(task)
          const travelTime = calculateTravelTime(index)

          return (
            <div key={task.id} ref={(el) => (taskRefs.current[task.id] = el)} className="relative">
              {/* 移動時間の表示 */}
              {travelTime && (
                <div className="ml-6 mb-2 flex items-center text-sm text-gray-500">
                  <div className="h-6 w-0.5 bg-gray-300" />
                  <button
                    onClick={() => openGoogleMapsRoute(scheduleData[index - 1], task)}
                    className="ml-2 flex items-center rounded-full bg-tertiary-blue/20 px-3 py-1 shadow-sm border border-tertiary-blue hover:bg-tertiary-blue/30 transition-colors cursor-pointer"
                  >
                    <Navigation className="h-3 w-3 mr-1 text-primary-blue" />
                    <span className="text-primary-blue font-medium">移動時間: {travelTime}分</span>
                  </button>
                </div>
              )}

              {/* 時間表示 */}
              <div className="mb-1 flex items-center space-x-2 ml-6">
                <div
                  className={`text-sm font-medium ${
                    taskStatus === "current"
                      ? "text-regulation-green"
                      : taskStatus === "completed"
                        ? "text-gray-400"
                        : "text-gray-600"
                  }`}
                >
                  {formatTime(task.startTime)} - {formatTime(task.endTime)}
                </div>
                {taskStatus === "current" && (
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 rounded-full bg-regulation-green animate-pulse"></div>
                    <span className="text-xs font-medium text-regulation-green">進行中</span>
                  </div>
                )}
                {taskStatus === "completed" && <span className="text-xs font-medium text-gray-400">完了</span>}
              </div>

              {/* タスクカード */}
              <div className={`ml-6 ${taskStatus === "completed" ? "opacity-60" : ""}`}>
                <TaskCard task={task} onClick={() => onTaskSelect(task)} />
              </div>
            </div>
          )
        })}

        {/* 経費申請&退勤ボタン（最後） */}
        <div className="relative">
          <div className="mb-1 flex items-center space-x-2 ml-6">
            <div className="text-sm font-medium text-gray-600">
              {scheduleData[scheduleData.length - 1]
                ? formatTime(scheduleData[scheduleData.length - 1].endTime)
                : "17:30"}{" "}
              以降
            </div>
          </div>
          <div className="ml-6 space-y-3">
            {/* 経費申請ボタン */}
            <div className="rounded-lg border-2 border-dashed border-regulation-yellow bg-background-blue p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-regulation-yellow">
                    <Receipt className="h-5 w-5 text-regulation-black" />
                  </div>
                  <div>
                    <h3 className="font-medium text-regulation-black">経費申請</h3>
                    <p className="text-sm text-gray-600">本日の交通費・経費を申請してください</p>
                  </div>
                </div>
                <Button
                  onClick={handleExpenseReport}
                  className="bg-regulation-yellow hover:bg-regulation-yellow/90 text-regulation-black"
                >
                  申請
                </Button>
              </div>
            </div>

            {/* 退勤ボタン */}
            <div className="rounded-lg border-2 border-dashed border-regulation-red bg-background-blue p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-regulation-red">
                    <LogOut className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-regulation-black">退勤</h3>
                    <p className="text-sm text-gray-600">
                      {isCheckedIn ? "本日の業務を終了してください" : "出勤打刻が必要です"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCheckOut}
                  disabled={!isCheckedIn}
                  className={`${
                    !isCheckedIn
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-regulation-red hover:bg-regulation-red/90 text-white"
                  }`}
                >
                  退勤
                </Button>
              </div>
              {isCheckedIn && checkInTime && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    勤務時間: {formatTime(checkInTime)} - {formatTime(new Date())} (
                    {Math.round(((new Date().getTime() - checkInTime.getTime()) / (1000 * 60 * 60)) * 10) / 10}時間)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
