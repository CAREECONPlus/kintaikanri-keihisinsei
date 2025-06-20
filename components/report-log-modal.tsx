"use client"

import { useState } from "react"
import { X, Clock, User, ChevronDown, ChevronUp } from "lucide-react"

interface Task {
  id: number
  title: string
  location: string
  startTime: Date
  endTime: Date
  description: string
  color: string
}

interface ReportLogModalProps {
  task: Task
  onClose: () => void
}

interface WorkReport {
  id: number
  date: Date
  status: "completed" | "in-progress" | "pending" | "cancelled"
  content: string
  issues?: string
  nextActions?: string
  checkInTime?: Date
  checkOutTime?: Date
  reporter: string
}

// サンプルデータ
const sampleReports: WorkReport[] = [
  {
    id: 1,
    date: new Date(2023, 11, 15, 16, 30),
    status: "completed",
    content: "外壁塗装の下地処理を完了しました。高圧洗浄後、ひび割れ部分の補修を行い、プライマーを塗布しました。",
    issues: "南側外壁に予想以上のひび割れを発見。追加補修が必要です。",
    nextActions: "明日から本塗装に入る予定。追加補修箇所の見積もりを作成します。",
    checkInTime: new Date(2023, 11, 15, 9, 0),
    checkOutTime: new Date(2023, 11, 15, 16, 30),
    reporter: "田中 太郎",
  },
  {
    id: 2,
    date: new Date(2023, 11, 14, 15, 45),
    status: "in-progress",
    content: "足場の設置が完了しました。安全確認も済んでいます。",
    nextActions: "明日から外壁の洗浄作業を開始します。",
    checkInTime: new Date(2023, 11, 14, 8, 30),
    checkOutTime: new Date(2023, 11, 14, 15, 45),
    reporter: "田中 太郎",
  },
  {
    id: 3,
    date: new Date(2023, 11, 13, 17, 0),
    status: "completed",
    content: "現場調査を実施。外壁の劣化状況を詳細に確認し、塗装が必要な範囲を測定しました。",
    nextActions: "足場設置の準備を進めます。",
    checkInTime: new Date(2023, 11, 13, 14, 0),
    checkOutTime: new Date(2023, 11, 13, 17, 0),
    reporter: "佐藤 花子",
  },
]

export function ReportLogModal({ task, onClose }: ReportLogModalProps) {
  const [expandedReport, setExpandedReport] = useState<number | null>(null)

  const formatDateTime = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${month}/${day} ${hours}:${minutes}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-[#00B900] text-[#00B900] bg-green-50"
      case "in-progress":
        return "border-[#FF9500] text-[#FF9500] bg-orange-50"
      case "pending":
        return "border-[#6B7280] text-[#6B7280] bg-gray-50"
      case "cancelled":
        return "border-[#EF4444] text-[#EF4444] bg-red-50"
      default:
        return "border-gray-300 text-gray-600 bg-gray-50"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "完了"
      case "in-progress":
        return "進行中"
      case "pending":
        return "保留"
      case "cancelled":
        return "中止"
      default:
        return "不明"
    }
  }

  const toggleExpand = (reportId: number) => {
    setExpandedReport(expandedReport === reportId ? null : reportId)
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-2 w-full max-w-[300px] max-h-[580px] rounded-lg bg-white shadow-xl flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 flex-shrink-0">
          <h2 className="text-base font-medium text-gray-900">作業報告ログ</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* 案件情報 */}
        <div className="border-b border-gray-200 p-3 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
          <p className="text-xs text-gray-600">{task.location}</p>
        </div>

        {/* 報告ログ一覧 */}
        <div className="flex-1 overflow-y-auto">
          {sampleReports.map((report) => (
            <div key={report.id} className="border-b border-gray-100 p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusColor(
                        report.status,
                      )}`}
                    >
                      {getStatusText(report.status)}
                    </span>
                    <span className="text-xs text-gray-500">{formatDateTime(report.date)}</span>
                  </div>

                  <div className="flex items-center space-x-1 mb-1">
                    <User className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-600">{report.reporter}</span>
                  </div>

                  <p className="text-xs text-gray-800 mb-1 line-clamp-2">{report.content}</p>

                  {/* 作業時間 */}
                  {report.checkInTime && report.checkOutTime && (
                    <div className="flex flex-col space-y-1 text-xs text-gray-500 mb-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>入場: {formatDateTime(report.checkInTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>退場: {formatDateTime(report.checkOutTime)}</span>
                      </div>
                    </div>
                  )}

                  {/* 詳細情報（展開可能） */}
                  {(report.issues || report.nextActions) && (
                    <button
                      onClick={() => toggleExpand(report.id)}
                      className="flex items-center space-x-1 text-xs text-[#00B900] hover:text-[#009900]"
                    >
                      <span>詳細を{expandedReport === report.id ? "閉じる" : "見る"}</span>
                      {expandedReport === report.id ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                  )}

                  {/* 展開された詳細情報 */}
                  {expandedReport === report.id && (
                    <div className="mt-2 space-y-1 rounded-lg bg-gray-50 p-2">
                      {report.issues && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-1">問題・課題</h5>
                          <p className="text-xs text-gray-600">{report.issues}</p>
                        </div>
                      )}
                      {report.nextActions && (
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-1">次回対応事項</h5>
                          <p className="text-xs text-gray-600">{report.nextActions}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
