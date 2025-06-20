"use client"

import { useState } from "react"
import { X, FileText } from "lucide-react"

interface CALSSettings {
  enabled: boolean
  projectCode: string
  projectName: string
  photographer: string
  workStage: "pre-construction" | "during-construction" | "completion" | "inspection"
  location: string
  shootingLocation: string
}

interface CALSSettingsModalProps {
  settings: CALSSettings
  onClose: () => void
  onSave: (settings: CALSSettings) => void
}

export function CALSSettingsModal({ settings, onClose, onSave }: CALSSettingsModalProps) {
  const [formData, setFormData] = useState<CALSSettings>(settings)

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const workStageOptions = [
    { value: "pre-construction", label: "着工前" },
    { value: "during-construction", label: "施工中" },
    { value: "completion", label: "完成" },
    { value: "inspection", label: "検査" },
  ]

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-2 w-full max-w-[300px] max-h-[580px] rounded-lg bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <h2 className="text-base font-medium text-gray-900">CALS規格設定</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <div className="text-xs text-blue-800">
                <div className="font-medium mb-1">CALS規格について</div>
                <p>
                  建設分野の電子納品要領に準拠した工事写真撮影を行います。ファイル名は「工事コード_撮影箇所_年月日_連番.jpg」形式で自動生成されます。
                </p>
              </div>
            </div>

            {/* 工事コード（CALS規格必須） */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">工事コード *</label>
              <input
                type="text"
                value={formData.projectCode}
                onChange={(e) => setFormData((prev) => ({ ...prev, projectCode: e.target.value }))}
                placeholder="例：2023-001"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#00B900] focus:outline-none"
              />
              <p className="text-xs text-gray-500">CALS規格のファイル命名に使用されます</p>
            </div>

            {/* 撮影箇所（CALS規格必須） */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">撮影箇所 *</label>
              <input
                type="text"
                value={formData.shootingLocation}
                onChange={(e) => setFormData((prev) => ({ ...prev, shootingLocation: e.target.value }))}
                placeholder="例：A1"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#00B900] focus:outline-none"
              />
              <p className="text-xs text-gray-500">撮影箇所コード（英数字推奨）</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">工事名 *</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
                placeholder="例：○○ビル外壁改修工事"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#00B900] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">撮影者 *</label>
              <input
                type="text"
                value={formData.photographer}
                onChange={(e) => setFormData((prev) => ({ ...prev, photographer: e.target.value }))}
                placeholder="例：田中太郎"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#00B900] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">工事段階</label>
              <select
                value={formData.workStage}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, workStage: e.target.value as CALSSettings["workStage"] }))
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#00B900] focus:outline-none"
              >
                {workStageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">撮影場所</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="例：1階エントランス"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#00B900] focus:outline-none"
              />
            </div>

            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
              <div className="text-xs text-gray-600">
                <div className="font-medium mb-1">ファイル命名例</div>
                <p className="font-mono text-xs bg-white px-2 py-1 rounded">
                  {formData.projectCode || "工事コード"}_{formData.shootingLocation || "撮影箇所"}_20231215_001.jpg
                </p>
                <div className="mt-2 space-y-1">
                  <div>• 解像度: 1920×1080以上推奨</div>
                  <div>• 圧縮率: 1/10以下</div>
                  <div>• GPS位置情報: 自動記録</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2 border-t border-gray-200 p-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={
              !formData.projectCode || !formData.shootingLocation || !formData.projectName || !formData.photographer
            }
            className={`flex-1 rounded-lg py-2 text-sm font-medium text-white ${
              formData.projectCode && formData.shootingLocation && formData.projectName && formData.photographer
                ? "bg-[#00B900] hover:bg-[#009900]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
