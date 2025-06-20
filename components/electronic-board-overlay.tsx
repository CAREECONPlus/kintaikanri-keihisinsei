"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface ElectronicBoardSettings {
  projectName: string
  workType: string
  workCategory: string
  workSubCategory: string
  photographer: string
  date: string
  measurements: string
  remarks: string
  inspectionResult: string
  contractorName: string
}

interface ElectronicBoardOverlayProps {
  settings: ElectronicBoardSettings
}

export function ElectronicBoardOverlay({ settings }: ElectronicBoardOverlayProps) {
  const [position, setPosition] = useState({ x: 16, y: 16 }) // 初期位置
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const boardRef = useRef<HTMLDivElement>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${month}/${day}`
  }

  const getCurrentTime = () => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, "0")
    const minutes = now.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  // マウスイベント
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !boardRef.current) return

    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y

    // 画面境界チェック
    const boardRect = boardRef.current.getBoundingClientRect()
    const parentRect = boardRef.current.parentElement?.getBoundingClientRect()

    if (parentRect) {
      const maxX = parentRect.width - boardRect.width
      const maxY = parentRect.height - boardRect.height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // タッチイベント
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    })
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !boardRef.current) return

    e.preventDefault()
    const touch = e.touches[0]
    const newX = touch.clientX - dragStart.x
    const newY = touch.clientY - dragStart.y

    // 画面境界チェック
    const boardRect = boardRef.current.getBoundingClientRect()
    const parentRect = boardRef.current.parentElement?.getBoundingClientRect()

    if (parentRect) {
      const maxX = parentRect.width - boardRect.width
      const maxY = parentRect.height - boardRect.height

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // イベントリスナーの設定
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging, dragStart])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 縮小された電子小黒板（画面の1/6サイズ） */}
      <div
        ref={boardRef}
        className={`absolute pointer-events-auto cursor-move select-none ${isDragging ? "z-50" : "z-20"}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: "140px", // 約1/6サイズ
          transform: isDragging ? "scale(1.05)" : "scale(1)",
          transition: isDragging ? "none" : "transform 0.2s ease",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="bg-white/95 border-2 border-black rounded shadow-lg text-[8px] leading-tight">
          {/* ヘッダー */}
          <div className="text-center border-b border-black py-1 bg-gray-100">
            <h3 className="font-bold text-black">電子小黒板</h3>
          </div>

          {/* コンパクトな情報表示 */}
          <div className="p-1 space-y-1">
            {/* 工事名 */}
            <div className="border border-gray-400 p-1 bg-white">
              <div className="font-bold text-black">工事名</div>
              <div className="text-black truncate" title={settings.projectName}>
                {settings.projectName || "未設定"}
              </div>
            </div>

            {/* 工種・種別 */}
            <div className="grid grid-cols-2 gap-1">
              <div className="border border-gray-400 p-1 bg-white">
                <div className="font-bold text-black">工種</div>
                <div className="text-black truncate" title={settings.workType}>
                  {settings.workType || "未設定"}
                </div>
              </div>
              <div className="border border-gray-400 p-1 bg-white">
                <div className="font-bold text-black">種別</div>
                <div className="text-black truncate" title={settings.workCategory}>
                  {settings.workCategory || "未設定"}
                </div>
              </div>
            </div>

            {/* 撮影者・日時 */}
            <div className="grid grid-cols-2 gap-1">
              <div className="border border-gray-400 p-1 bg-white">
                <div className="font-bold text-black">撮影者</div>
                <div className="text-black truncate" title={settings.photographer}>
                  {settings.photographer || "未設定"}
                </div>
              </div>
              <div className="border border-gray-400 p-1 bg-white">
                <div className="font-bold text-black">日時</div>
                <div className="text-black">
                  {formatDate(settings.date)} {getCurrentTime()}
                </div>
              </div>
            </div>

            {/* 検査結果 */}
            <div className="border border-gray-400 p-1 bg-white">
              <div className="font-bold text-black">検査結果</div>
              <div
                className={`text-center font-bold py-0.5 rounded ${
                  settings.inspectionResult === "合格"
                    ? "text-blue-600 bg-blue-50"
                    : settings.inspectionResult === "要注意"
                      ? "text-yellow-600 bg-yellow-50"
                      : "text-red-600 bg-red-50"
                }`}
              >
                {settings.inspectionResult}
              </div>
            </div>

            {/* 測定値・備考（表示がある場合のみ） */}
            {settings.measurements && (
              <div className="border border-gray-400 p-1 bg-white">
                <div className="font-bold text-black">測定値</div>
                <div className="text-black truncate" title={settings.measurements}>
                  {settings.measurements}
                </div>
              </div>
            )}

            {settings.remarks && (
              <div className="border border-gray-400 p-1 bg-white">
                <div className="font-bold text-black">備考</div>
                <div className="text-black truncate" title={settings.remarks}>
                  {settings.remarks}
                </div>
              </div>
            )}
          </div>

          {/* ドラッグヒント */}
          <div className="text-center py-0.5 bg-gray-100 border-t border-gray-400">
            <div className="text-gray-600 text-[6px]">ドラッグで移動</div>
          </div>
        </div>
      </div>
    </div>
  )
}
