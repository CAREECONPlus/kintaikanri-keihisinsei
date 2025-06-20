"use client"

import { useState } from "react"
import { X, Camera, Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Task {
  id: number
  title: string
  location: string
  startTime: Date
  endTime: Date
  description: string
  color: string
}

interface ReportModalProps {
  task: Task
  onClose: () => void
  checkInTime: Date | null
  checkOutTime: Date | null
}

export function ReportModal({ task, onClose, checkInTime, checkOutTime }: ReportModalProps) {
  const [reportContent, setReportContent] = useState("")
  const [workStatus, setWorkStatus] = useState("completed")
  const [issues, setIssues] = useState("")
  const [nextActions, setNextActions] = useState("")

  const formatDateTime = (date: Date | null) => {
    if (!date) return "未記録"
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${month}/${day} ${hours}:${minutes}`
  }

  const handleSaveReport = () => {
    // 作業報告保存処理（実際の実装では API 呼び出しなど）
    console.log("作業報告を保存:", {
      taskId: task.id,
      reportContent,
      workStatus,
      issues,
      nextActions,
      checkInTime,
      checkOutTime,
    })
    onClose()
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-2 w-full max-w-[300px] max-h-[580px] rounded-lg bg-white shadow-xl flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 flex-shrink-0">
          <h2 className="text-base font-medium text-gray-900">作業報告</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* 案件情報 */}
            <div className="rounded-lg bg-gray-50 p-2">
              <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
              <p className="text-xs text-gray-600">{task.location}</p>
            </div>

            {/* 作業時間 */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700">作業時間</h4>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>
                  <span className="text-gray-500">入場:</span>
                  <span className="ml-1 font-mono">{formatDateTime(checkInTime)}</span>
                </div>
                <div>
                  <span className="text-gray-500">退場:</span>
                  <span className="ml-1 font-mono">{formatDateTime(checkOutTime)}</span>
                </div>
              </div>
            </div>

            {/* 作業状況 */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700">作業状況</h4>
              <select
                value={workStatus}
                onChange={(e) => setWorkStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
              >
                <option value="completed">完了</option>
                <option value="in-progress">進行中</option>
                <option value="pending">保留</option>
                <option value="cancelled">中止</option>
              </select>
            </div>

            {/* 作業内容 */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700">作業内容</h4>
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                placeholder="実施した作業内容を記入してください..."
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                rows={2}
              />
            </div>

            {/* 問題・課題 */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700">問題・課題</h4>
              <textarea
                value={issues}
                onChange={(e) => setIssues(e.target.value)}
                placeholder="発生した問題や課題があれば記入してください..."
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                rows={2}
              />
            </div>

            {/* 次回対応事項 */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700">次回対応事項</h4>
              <textarea
                value={nextActions}
                onChange={(e) => setNextActions(e.target.value)}
                placeholder="次回の作業予定や対応事項を記入してください..."
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                rows={2}
              />
            </div>

            {/* 写真添付 */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-700">写真添付</h4>
              <div className="flex space-x-1">
                <button className="flex flex-1 items-center justify-center space-x-1 rounded-lg border border-gray-300 p-2 text-xs text-gray-600 hover:bg-gray-50">
                  <Camera className="h-3 w-3" />
                  <span>撮影</span>
                </button>
                <button className="flex flex-1 items-center justify-center space-x-1 rounded-lg border border-gray-300 p-2 text-xs text-gray-600 hover:bg-gray-50">
                  <Upload className="h-3 w-3" />
                  <span>アップロード</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="flex space-x-2 border-t border-gray-200 p-3 flex-shrink-0">
          <Button onClick={onClose} variant="outline" className="flex-1 text-xs h-8">
            キャンセル
          </Button>
          <Button
            onClick={handleSaveReport}
            className="flex flex-1 items-center justify-center space-x-1 bg-[#00B900] hover:bg-[#009900] text-xs h-8"
          >
            <Save className="h-3 w-3" />
            <span>保存</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
