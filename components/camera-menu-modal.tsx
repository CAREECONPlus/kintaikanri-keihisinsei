"use client"

import { X, FileText, Settings, ToggleLeft, ToggleRight, LayoutTemplateIcon as Template } from "lucide-react"

interface CALSSettings {
  enabled: boolean
  projectCode: string
  projectName: string
  photographer: string
  workStage: "pre-construction" | "during-construction" | "completion" | "inspection"
  location: string
  shootingLocation: string
}

interface CameraMenuModalProps {
  onClose: () => void
  calsSettings: CALSSettings
  onCALSToggle: () => void
  onCALSSettings: () => void
  showElectronicBoard: boolean
  onElectronicBoardToggle: () => void
  onElectronicBoardSettings: () => void
  onElectronicBoardTemplates: () => void
}

export function CameraMenuModal({
  onClose,
  calsSettings,
  onCALSToggle,
  onCALSSettings,
  showElectronicBoard,
  onElectronicBoardToggle,
  onElectronicBoardSettings,
  onElectronicBoardTemplates,
}: CameraMenuModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-2 w-full max-w-[280px] rounded-lg bg-white shadow-xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3">
          <h2 className="text-base font-medium text-regulation-black">カメラ設定</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* メニュー項目 */}
        <div className="p-3 space-y-3">
          {/* CALS規格 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-regulation-green" />
                <span className="text-sm font-medium text-regulation-black">CALS規格</span>
              </div>
              <button onClick={onCALSToggle}>
                {calsSettings.enabled ? (
                  <ToggleRight className="h-5 w-5 text-regulation-green" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {calsSettings.enabled && (
              <button
                onClick={() => {
                  onCALSSettings()
                  onClose()
                }}
                className="flex w-full items-center space-x-2 rounded-lg bg-background-blue p-2 text-left hover:bg-tertiary-blue/20"
              >
                <Settings className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">CALS設定</span>
              </button>
            )}
          </div>

          {/* 電子小黒板 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-regulation-red" />
                <span className="text-sm font-medium text-regulation-black">電子小黒板</span>
              </div>
              <button onClick={onElectronicBoardToggle}>
                {showElectronicBoard ? (
                  <ToggleRight className="h-5 w-5 text-regulation-red" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {showElectronicBoard && (
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onElectronicBoardTemplates()
                    onClose()
                  }}
                  className="flex w-full items-center space-x-2 rounded-lg bg-background-blue p-2 text-left hover:bg-tertiary-blue/20"
                >
                  <Template className="h-3 w-3 text-primary-blue" />
                  <span className="text-xs text-primary-blue font-medium">テンプレート選択</span>
                </button>
                <button
                  onClick={() => {
                    onElectronicBoardSettings()
                    onClose()
                  }}
                  className="flex w-full items-center space-x-2 rounded-lg bg-background-blue p-2 text-left hover:bg-tertiary-blue/20"
                >
                  <Settings className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">詳細設定</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-background-blue py-2 text-sm font-medium text-regulation-black hover:bg-tertiary-blue/20"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
