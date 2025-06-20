"use client"

import { useState } from "react"
import { X, FileText, AlertTriangle } from "lucide-react"

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

interface ElectronicBoardSettingsModalProps {
  settings: ElectronicBoardSettings
  onClose: () => void
  onSave: (settings: ElectronicBoardSettings) => void
}

export function ElectronicBoardSettingsModal({ settings, onClose, onSave }: ElectronicBoardSettingsModalProps) {
  const [formData, setFormData] = useState<ElectronicBoardSettings>(settings)

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const workTypeOptions = [
    "土工事",
    "コンクリート工事",
    "鉄筋工事",
    "型枠工事",
    "鉄骨工事",
    "屋根工事",
    "外装工事",
    "内装工事",
    "設備工事",
    "舗装工事",
    "その他",
  ]

  const workCategoryOptions = [
    "施工状況",
    "材料検査",
    "品質管理",
    "安全管理",
    "出来形管理",
    "完成検査",
    "中間検査",
    "その他",
  ]

  const workSubCategoryOptions = [
    "基礎工事",
    "躯体工事",
    "仕上工事",
    "設備工事",
    "外構工事",
    "準備工事",
    "仮設工事",
    "その他",
  ]

  const inspectionResultOptions = ["合格", "要注意", "不合格"]

  // 必須項目チェック（国交省基準）
  const isFormValid =
    formData.projectName &&
    formData.workType &&
    formData.workCategory &&
    formData.workSubCategory &&
    formData.photographer &&
    formData.contractorName

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-2 w-full max-w-[300px] max-h-[580px] rounded-lg bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <h2 className="text-base font-medium text-gray-900">電子小黒板設定</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-4">
            {/* 国交省基準の説明 */}
            <div className="rounded-lg bg-orange-50 border border-orange-200 p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-orange-800">
                  <div className="font-medium mb-1">国土交通省基準準拠</div>
                  <p>電子小黒板の利用ガイドラインに基づく必須項目を設定してください。</p>
                </div>
              </div>
            </div>

            {/* 必須項目 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">必須項目 *</h3>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">工事名 *</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, projectName: e.target.value }))}
                  placeholder="例：○○ビル新築工事"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">請負業者名 *</label>
                <input
                  type="text"
                  value={formData.contractorName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, contractorName: e.target.value }))}
                  placeholder="例：○○建設株式会社"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">工種 *</label>
                <select
                  value={formData.workType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, workType: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                >
                  <option value="">選択してください</option>
                  {workTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">種別 *</label>
                <select
                  value={formData.workCategory}
                  onChange={(e) => setFormData((prev) => ({ ...prev, workCategory: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                >
                  <option value="">選択してください</option>
                  {workCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">細別 *</label>
                <select
                  value={formData.workSubCategory}
                  onChange={(e) => setFormData((prev) => ({ ...prev, workSubCategory: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                >
                  <option value="">選択してください</option>
                  {workSubCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">撮影者 *</label>
                <input
                  type="text"
                  value={formData.photographer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, photographer: e.target.value }))}
                  placeholder="例：田中太郎"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">撮影日</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                />
              </div>
            </div>

            {/* 任意項目 */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">任意項目</h3>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">測定値・寸法</label>
                <input
                  type="text"
                  value={formData.measurements}
                  onChange={(e) => setFormData((prev) => ({ ...prev, measurements: e.target.value }))}
                  placeholder="例：幅2.5m×高さ3.0m"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">備考</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
                  placeholder="特記事項があれば記入"
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">検査結果</label>
                <select
                  value={formData.inspectionResult}
                  onChange={(e) => setFormData((prev) => ({ ...prev, inspectionResult: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-[#00B900] focus:outline-none"
                >
                  {inspectionResultOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
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
            disabled={!isFormValid}
            className={`flex-1 rounded-lg py-2 text-sm font-medium text-white ${
              isFormValid ? "bg-[#00B900] hover:bg-[#009900]" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
