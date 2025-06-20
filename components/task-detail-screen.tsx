"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Clock, Calendar, FileText, LogIn, LogOut, Edit3, Settings, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReportModal } from "@/components/report-modal"
import { ReportLogModal } from "@/components/report-log-modal"
import { AutoAttendanceModal } from "@/components/auto-attendance-modal"

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

interface TaskDetailScreenProps {
  task: Task
  onBack: () => void
}

interface Position {
  latitude: number
  longitude: number
}

export function TaskDetailScreen({ task, onBack }: TaskDetailScreenProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showReportLogModal, setShowReportLogModal] = useState(false)
  const [showAutoAttendanceModal, setShowAutoAttendanceModal] = useState(false)

  // GPS関連のstate
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null)
  const [distanceToSite, setDistanceToSite] = useState<number | null>(null)
  const [autoAttendanceEnabled, setAutoAttendanceEnabled] = useState(false)
  const [attendanceRadius, setAttendanceRadius] = useState(50) // メートル
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [isInSiteArea, setIsInSiteArea] = useState(false)

  // 距離計算関数（ハーバーサイン公式）
  const calculateDistance = (pos1: Position, pos2: Position): number => {
    const R = 6371e3 // 地球の半径（メートル）
    const φ1 = (pos1.latitude * Math.PI) / 180
    const φ2 = (pos2.latitude * Math.PI) / 180
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // 位置情報の取得
  const getCurrentPosition = (): Promise<Position> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      )
    })
  }

  // 位置情報の監視開始
  const startLocationWatching = () => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setCurrentPosition(newPosition)

        const distance = calculateDistance(newPosition, {
          latitude: task.latitude,
          longitude: task.longitude,
        })
        setDistanceToSite(distance)

        const inArea = distance <= attendanceRadius
        setIsInSiteArea(inArea)

        // 自動入退場の処理
        if (autoAttendanceEnabled) {
          if (inArea && !isCheckedIn) {
            handleAutoCheckIn()
          } else if (!inArea && isCheckedIn) {
            handleAutoCheckOut()
          }
        }
      },
      (error) => {
        console.error("位置情報の取得に失敗しました:", error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    )

    return watchId
  }

  // 位置情報の許可を要求
  const requestLocationPermission = async () => {
    try {
      const position = await getCurrentPosition()
      setCurrentPosition(position)
      setLocationPermission("granted")

      const distance = calculateDistance(position, {
        latitude: task.latitude,
        longitude: task.longitude,
      })
      setDistanceToSite(distance)
      setIsInSiteArea(distance <= attendanceRadius)
    } catch (error) {
      console.error("位置情報の取得に失敗しました:", error)
      setLocationPermission("denied")
    }
  }

  // 自動入場
  const handleAutoCheckIn = () => {
    setIsCheckedIn(true)
    setCheckInTime(new Date())
    // 通知やログの記録
    console.log("自動入場しました")
  }

  // 自動退場
  const handleAutoCheckOut = () => {
    setIsCheckedIn(false)
    setCheckOutTime(new Date())
    // 通知やログの記録
    console.log("自動退場しました")
  }

  // 手動入場
  const handleCheckIn = () => {
    setIsCheckedIn(true)
    setCheckInTime(new Date())
  }

  // 手動退場
  const handleCheckOut = () => {
    setIsCheckedIn(false)
    setCheckOutTime(new Date())
  }

  const handleCreateReport = () => {
    setShowReportModal(true)
  }

  const handleShowReportLog = () => {
    setShowReportLogModal(true)
  }

  const handleShowAutoAttendance = () => {
    setShowAutoAttendanceModal(true)
  }

  // 位置情報監視の開始/停止
  useEffect(() => {
    let watchId: number | null = null

    if (autoAttendanceEnabled && locationPermission === "granted") {
      watchId = startLocationWatching()
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [autoAttendanceEnabled, locationPermission, attendanceRadius, isCheckedIn])

  const formatDateTime = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${month}/${day} ${hours}:${minutes}`
  }

  const formatDate = (date: Date) => {
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = weekdays[date.getDay()]
    return `${year}年${month}月${day}日(${weekday})`
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  return (
    <div className="relative flex h-full flex-col bg-gray-50 pt-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between bg-white p-4 shadow-sm border-b border-gray-200">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3 rounded-full p-2 hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">案件詳細</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleShowAutoAttendance}
            className="flex items-center space-x-1 rounded-lg bg-gray-100 px-2 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={handleCreateReport}
            className="flex items-center space-x-2 rounded-lg bg-[#00B900] px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#009900]"
          >
            <Edit3 className="h-4 w-4" />
            <span>作業報告</span>
          </button>
        </div>
      </div>

      {/* 案件詳細エリア（4/5） */}
      <div className="flex-1 overflow-y-auto p-4" style={{ height: "80%" }}>
        <div className="space-y-6">
          {/* タイトル */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          </div>

          {/* GPS情報表示 */}
          {autoAttendanceEnabled && (
            <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-700">GPS自動入退場</h3>
                <div className={`flex items-center space-x-1 ${isInSiteArea ? "text-[#00B900]" : "text-gray-500"}`}>
                  <Navigation className="h-4 w-4" />
                  <span className="text-sm">{isInSiteArea ? "現場内" : "現場外"}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {distanceToSite !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">現場までの距離</span>
                    <span className="font-mono text-gray-700">{Math.round(distanceToSite)}m</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">自動入退場範囲</span>
                  <span className="font-mono text-gray-700">{attendanceRadius}m</span>
                </div>
                {locationPermission === "denied" && (
                  <div className="text-red-500 text-xs">位置情報の許可が必要です</div>
                )}
              </div>
            </div>
          )}

          {/* 基本情報 */}
          <div className="space-y-5">
            <div className="flex items-start">
              <Calendar className="mr-3 h-5 w-5 text-[#00B900]" />
              <div>
                <div className="font-medium text-gray-700">作業予定時間</div>
                <div className="text-gray-600">{formatDate(task.startTime)}</div>
                <div className="text-gray-600">
                  {formatTime(task.startTime)} - {formatTime(task.endTime)}
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="mr-3 h-5 w-5 text-[#00B900]" />
              <div>
                <div className="font-medium text-gray-700">作業場所</div>
                <div className="text-gray-600">{task.location}</div>
                <div className="text-xs text-gray-500">
                  {task.latitude.toFixed(6)}, {task.longitude.toFixed(6)}
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="mr-3 h-5 w-5 text-[#00B900]" />
              <div>
                <div className="font-medium text-gray-700">予定作業時間</div>
                <div className="text-gray-600">
                  {Math.round((task.endTime.getTime() - task.startTime.getTime()) / (1000 * 60))}分
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <FileText className="mr-3 h-5 w-5 text-[#00B900]" />
              <div>
                <div className="font-medium text-gray-700">作業内容</div>
                <div className="text-gray-600">{task.description}</div>
              </div>
            </div>
          </div>

          {/* 打刻履歴 */}
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
            <h3 className="mb-3 font-medium text-gray-700">本日の打刻履歴</h3>
            <div className="space-y-2 text-sm">
              {checkInTime && (
                <div className="flex items-center justify-between">
                  <span className="text-[#00B900]">入場時刻</span>
                  <span className="font-mono text-gray-700">{formatDateTime(checkInTime)}</span>
                </div>
              )}
              {checkOutTime && (
                <div className="flex items-center justify-between">
                  <span className="text-[#FF6B35]">退場時刻</span>
                  <span className="font-mono text-gray-700">{formatDateTime(checkOutTime)}</span>
                </div>
              )}
              {!checkInTime && !checkOutTime && <div className="text-gray-500">まだ打刻されていません</div>}
            </div>
          </div>

          {/* 最新の作業報告 */}
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">最新の作業報告</h3>
              <button onClick={handleShowReportLog} className="text-sm text-[#00B900] hover:text-[#009900]">
                すべて見る
              </button>
            </div>
            <div className="space-y-3">
              <div className="border-l-4 border-[#00B900] pl-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">作業完了</span>
                  <span className="text-xs text-gray-500">12/15 16:30</span>
                </div>
                <p className="text-sm text-gray-600">
                  外壁塗装の下地処理を完了しました。明日から本塗装に入る予定です。
                </p>
              </div>
              <div className="border-l-4 border-[#FF9500] pl-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">進行中</span>
                  <span className="text-xs text-gray-500">12/14 15:45</span>
                </div>
                <p className="text-sm text-gray-600">足場の設置が完了。明日から外壁の洗浄作業を開始します。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 打刻UIエリア（1/5） */}
      <div className="border-t border-gray-200 bg-white p-4 shadow-sm" style={{ height: "20%" }}>
        <div className="flex h-full items-center justify-center space-x-4">
          <Button
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className={`flex h-16 flex-1 items-center justify-center space-x-2 rounded-lg text-lg shadow-sm ${
              isCheckedIn
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#00B900] text-white hover:bg-[#009900]"
            }`}
          >
            <LogIn className="h-6 w-6" />
            <span>入場</span>
          </Button>

          <Button
            onClick={handleCheckOut}
            disabled={!isCheckedIn}
            className={`flex h-16 flex-1 items-center justify-center space-x-2 rounded-lg text-lg shadow-sm ${
              !isCheckedIn
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#FF6B35] text-white hover:bg-[#E55A2B]"
            }`}
          >
            <LogOut className="h-6 w-6" />
            <span>退場</span>
          </Button>
        </div>
      </div>

      {/* 作業報告モーダル */}
      {showReportModal && (
        <ReportModal
          task={task}
          onClose={() => setShowReportModal(false)}
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
        />
      )}

      {/* 作業報告ログモーダル */}
      {showReportLogModal && <ReportLogModal task={task} onClose={() => setShowReportLogModal(false)} />}

      {/* 自動入退場設定モーダル */}
      {showAutoAttendanceModal && (
        <AutoAttendanceModal
          onClose={() => setShowAutoAttendanceModal(false)}
          autoAttendanceEnabled={autoAttendanceEnabled}
          setAutoAttendanceEnabled={setAutoAttendanceEnabled}
          attendanceRadius={attendanceRadius}
          setAttendanceRadius={setAttendanceRadius}
          locationPermission={locationPermission}
          onRequestPermission={requestLocationPermission}
          currentPosition={currentPosition}
          distanceToSite={distanceToSite}
        />
      )}
    </div>
  )
}
