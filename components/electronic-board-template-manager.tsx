"use client"

import { useState } from "react"
import { X, Plus, Edit3, Trash2, Copy, Star, StarOff, FileText, Building, Wrench, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ElectronicBoardTemplate {
  id: string
  name: string
  category: "general" | "construction" | "inspection" | "safety" | "custom"
  isDefault: boolean
  isFavorite: boolean
  settings: {
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
  createdAt: Date
  lastUsed?: Date
}

interface ElectronicBoardTemplateManagerProps {
  onClose: () => void
  onSelectTemplate: (template: ElectronicBoardTemplate) => void
  currentTemplate?: ElectronicBoardTemplate
}

export function ElectronicBoardTemplateManager({
  onClose,
  onSelectTemplate,
  currentTemplate,
}: ElectronicBoardTemplateManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ElectronicBoardTemplate | null>(null)

  // サンプルテンプレートデータ
  const [templates, setTemplates] = useState<ElectronicBoardTemplate[]>([
    {
      id: "template-1",
      name: "外壁塗装工事",
      category: "construction",
      isDefault: true,
      isFavorite: true,
      settings: {
        projectName: "○○ビル外壁塗装工事",
        workType: "外装工事",
        workCategory: "施工状況",
        workSubCategory: "仕上工事",
        photographer: "田中太郎",
        date: new Date().toISOString().split("T")[0],
        measurements: "",
        remarks: "",
        inspectionResult: "合格",
        contractorName: "○○建設株式会社",
      },
      createdAt: new Date(2023, 11, 1),
      lastUsed: new Date(2023, 11, 15),
    },
    {
      id: "template-2",
      name: "基礎工事検査",
      category: "inspection",
      isDefault: false,
      isFavorite: true,
      settings: {
        projectName: "",
        workType: "土工事",
        workCategory: "完成検査",
        workSubCategory: "基礎工事",
        photographer: "佐藤花子",
        date: new Date().toISOString().split("T")[0],
        measurements: "",
        remarks: "基礎配筋検査",
        inspectionResult: "合格",
        contractorName: "○○建設株式会社",
      },
      createdAt: new Date(2023, 10, 15),
      lastUsed: new Date(2023, 11, 10),
    },
    {
      id: "template-3",
      name: "安全管理確認",
      category: "safety",
      isDefault: false,
      isFavorite: false,
      settings: {
        projectName: "",
        workType: "その他",
        workCategory: "安全管理",
        workSubCategory: "準備工事",
        photographer: "山田次郎",
        date: new Date().toISOString().split("T")[0],
        measurements: "",
        remarks: "安全設備点検",
        inspectionResult: "合格",
        contractorName: "○○建設株式会社",
      },
      createdAt: new Date(2023, 10, 1),
    },
    {
      id: "template-4",
      name: "内装工事進捗",
      category: "construction",
      isDefault: false,
      isFavorite: false,
      settings: {
        projectName: "",
        workType: "内装工事",
        workCategory: "施工状況",
        workSubCategory: "仕上工事",
        photographer: "鈴木一郎",
        date: new Date().toISOString().split("T")[0],
        measurements: "",
        remarks: "",
        inspectionResult: "合格",
        contractorName: "○○建設株式会社",
      },
      createdAt: new Date(2023, 9, 20),
    },
    {
      id: "template-5",
      name: "汎用テンプレート",
      category: "general",
      isDefault: false,
      isFavorite: false,
      settings: {
        projectName: "",
        workType: "",
        workCategory: "",
        workSubCategory: "",
        photographer: "",
        date: new Date().toISOString().split("T")[0],
        measurements: "",
        remarks: "",
        inspectionResult: "合格",
        contractorName: "",
      },
      createdAt: new Date(2023, 9, 1),
    },
  ])

  const categories = [
    { value: "all", label: "すべて", icon: FileText, color: "text-gray-600" },
    { value: "general", label: "汎用", icon: FileText, color: "text-gray-600" },
    { value: "construction", label: "施工", icon: Building, color: "text-primary-blue" },
    { value: "inspection", label: "検査", icon: Wrench, color: "text-regulation-green" },
    { value: "safety", label: "安全", icon: Palette, color: "text-regulation-red" },
    { value: "custom", label: "カスタム", icon: Star, color: "text-regulation-yellow" },
  ]

  const filteredTemplates = templates
    .filter((template) => selectedCategory === "all" || template.category === selectedCategory)
    .sort((a, b) => {
      // お気に入り、デフォルト、最終使用日の順でソート
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
      if (a.isDefault !== b.isDefault) return a.isDefault ? -1 : 1
      if (a.lastUsed && b.lastUsed) return b.lastUsed.getTime() - a.lastUsed.getTime()
      if (a.lastUsed && !b.lastUsed) return -1
      if (!a.lastUsed && b.lastUsed) return 1
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

  const toggleFavorite = (templateId: string) => {
    setTemplates(
      templates.map((template) =>
        template.id === templateId ? { ...template, isFavorite: !template.isFavorite } : template,
      ),
    )
  }

  const setAsDefault = (templateId: string) => {
    setTemplates(
      templates.map((template) => ({
        ...template,
        isDefault: template.id === templateId,
      })),
    )
  }

  const duplicateTemplate = (template: ElectronicBoardTemplate) => {
    const newTemplate: ElectronicBoardTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (コピー)`,
      isDefault: false,
      isFavorite: false,
      createdAt: new Date(),
      lastUsed: undefined,
    }
    setTemplates([...templates, newTemplate])
  }

  const deleteTemplate = (templateId: string) => {
    if (templates.find((t) => t.id === templateId)?.isDefault) {
      alert("デフォルトテンプレートは削除できません")
      return
    }
    setTemplates(templates.filter((template) => template.id !== templateId))
  }

  const handleSelectTemplate = (template: ElectronicBoardTemplate) => {
    // 最終使用日を更新
    setTemplates(templates.map((t) => (t.id === template.id ? { ...t, lastUsed: new Date() } : t)))
    onSelectTemplate(template)
    onClose()
  }

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}/${day}`
  }

  const getCategoryInfo = (category: string) => {
    return categories.find((cat) => cat.value === category) || categories[0]
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-2 w-full max-w-[320px] max-h-[600px] rounded-lg bg-white shadow-xl flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <h2 className="text-base font-medium text-regulation-black">電子小黒板テンプレート</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1 text-primary-blue hover:bg-background-blue rounded"
              title="新規作成"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* カテゴリフィルター */}
        <div className="border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex space-x-1 overflow-x-auto">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.value
                      ? "bg-primary-blue text-white"
                      : "bg-background-blue text-gray-600 hover:bg-tertiary-blue/20"
                  }`}
                >
                  <IconComponent className="h-3 w-3" />
                  <span>{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* テンプレート一覧 */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {filteredTemplates.map((template) => {
              const categoryInfo = getCategoryInfo(template.category)
              const IconComponent = categoryInfo.icon

              return (
                <div
                  key={template.id}
                  className={`rounded-lg border p-3 transition-colors cursor-pointer ${
                    currentTemplate?.id === template.id
                      ? "border-primary-blue bg-tertiary-blue/10"
                      : "border-gray-200 bg-white hover:bg-background-blue"
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className={`p-1 rounded ${categoryInfo.color}`}>
                        <IconComponent className="h-3 w-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-regulation-black truncate">{template.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {template.isDefault && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-blue text-white">
                              デフォルト
                            </span>
                          )}
                          {template.isFavorite && <Star className="h-3 w-3 text-regulation-yellow fill-current" />}
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(template.id)
                        }}
                        className="p-1 text-gray-400 hover:text-regulation-yellow rounded"
                        title={template.isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
                      >
                        {template.isFavorite ? (
                          <Star className="h-3 w-3 fill-current text-regulation-yellow" />
                        ) : (
                          <StarOff className="h-3 w-3" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateTemplate(template)
                        }}
                        className="p-1 text-gray-400 hover:text-primary-blue rounded"
                        title="複製"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingTemplate(template)
                        }}
                        className="p-1 text-gray-400 hover:text-primary-blue rounded"
                        title="編集"
                      >
                        <Edit3 className="h-3 w-3" />
                      </button>
                      {!template.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTemplate(template.id)
                          }}
                          className="p-1 text-gray-400 hover:text-regulation-red rounded"
                          title="削除"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* テンプレート詳細 */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>工種: {template.settings.workType || "未設定"}</span>
                      <span>種別: {template.settings.workCategory || "未設定"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>撮影者: {template.settings.photographer || "未設定"}</span>
                      {template.lastUsed && <span>最終使用: {formatDate(template.lastUsed)}</span>}
                    </div>
                  </div>

                  {/* クイックアクション */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      {!template.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setAsDefault(template.id)
                          }}
                          className="text-xs text-primary-blue hover:underline"
                        >
                          デフォルトに設定
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">作成: {formatDate(template.createdAt)}</span>
                  </div>
                </div>
              )
            })}

            {filteredTemplates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">テンプレートがありません</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 text-xs text-primary-blue hover:underline"
                >
                  新規作成
                </button>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <div className="flex space-x-2">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 bg-primary-blue hover:bg-primary-blue/90 text-white text-xs h-8"
            >
              <Plus className="h-3 w-3 mr-1" />
              新規作成
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 text-xs h-8">
              閉じる
            </Button>
          </div>
        </div>
      </div>

      {/* 新規作成・編集モーダル */}
      {(showCreateModal || editingTemplate) && (
        <TemplateEditModal
          template={editingTemplate}
          onClose={() => {
            setShowCreateModal(false)
            setEditingTemplate(null)
          }}
          onSave={(template) => {
            if (editingTemplate) {
              // 編集
              setTemplates(templates.map((t) => (t.id === editingTemplate.id ? template : t)))
            } else {
              // 新規作成
              setTemplates([...templates, template])
            }
            setShowCreateModal(false)
            setEditingTemplate(null)
          }}
        />
      )}
    </div>
  )
}

// テンプレート編集モーダル
interface TemplateEditModalProps {
  template?: ElectronicBoardTemplate | null
  onClose: () => void
  onSave: (template: ElectronicBoardTemplate) => void
}

function TemplateEditModal({ template, onClose, onSave }: TemplateEditModalProps) {
  const [formData, setFormData] = useState<Partial<ElectronicBoardTemplate>>({
    name: template?.name || "",
    category: template?.category || "general",
    settings: template?.settings || {
      projectName: "",
      workType: "",
      workCategory: "",
      workSubCategory: "",
      photographer: "",
      date: new Date().toISOString().split("T")[0],
      measurements: "",
      remarks: "",
      inspectionResult: "合格",
      contractorName: "",
    },
  })

  const categories = [
    { value: "general", label: "汎用" },
    { value: "construction", label: "施工" },
    { value: "inspection", label: "検査" },
    { value: "safety", label: "安全" },
    { value: "custom", label: "カスタム" },
  ]

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

  const handleSave = () => {
    if (!formData.name?.trim()) {
      alert("テンプレート名を入力してください")
      return
    }

    const newTemplate: ElectronicBoardTemplate = {
      id: template?.id || `template-${Date.now()}`,
      name: formData.name,
      category: formData.category as ElectronicBoardTemplate["category"],
      isDefault: template?.isDefault || false,
      isFavorite: template?.isFavorite || false,
      settings: formData.settings!,
      createdAt: template?.createdAt || new Date(),
      lastUsed: template?.lastUsed,
    }

    onSave(newTemplate)
  }

  return (
    <div className="absolute inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="mx-2 w-full max-w-[320px] max-h-[600px] rounded-lg bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 p-3 flex-shrink-0">
          <h3 className="text-base font-medium text-regulation-black">
            {template ? "テンプレート編集" : "新規テンプレート"}
          </h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* テンプレート名 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">テンプレート名 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="例：外壁塗装工事"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-blue focus:outline-none"
              />
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">カテゴリ</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as ElectronicBoardTemplate["category"],
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-blue focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 工事名 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">工事名</label>
              <input
                type="text"
                value={formData.settings?.projectName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings!, projectName: e.target.value },
                  }))
                }
                placeholder="例：○○ビル新築工事"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-blue focus:outline-none"
              />
            </div>

            {/* 請負業者名 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">請負業者名</label>
              <input
                type="text"
                value={formData.settings?.contractorName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings!, contractorName: e.target.value },
                  }))
                }
                placeholder="例：○○建設株式会社"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-blue focus:outline-none"
              />
            </div>

            {/* 工種 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">工種</label>
              <select
                value={formData.settings?.workType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings!, workType: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-blue focus:outline-none"
              >
                <option value="">選択してください</option>
                {workTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 種別 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">種別</label>
              <select
                value={formData.settings?.workCategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings!, workCategory: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-blue focus:outline-none"
              >
                <option value="">選択してください</option>
                {workCategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 細別 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">細別</label>
              <select
                value={formData.settings?.workSubCategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings!, workSubCategory: e.target.value },
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-blue focus:outline-none"
              >
                <option value="">選択してください</option>
                {workSubCategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* 撮影者 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">撮影者</label>
              <input
                type="text"
                value={formData.settings?.photographer}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings!, photographer: e.target.value },
                  }))
                }
                placeholder="例：田中太郎"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-blue focus:outline-none"
              />
            </div>

            {/* 備考 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">備考</label>
              <textarea
                value={formData.settings?.remarks}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    settings: { ...prev.settings!, remarks: e.target.value },
                  }))
                }
                placeholder="デフォルトの備考を入力"
                className="w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-blue focus:outline-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-2 border-t border-gray-200 p-3 flex-shrink-0">
          <Button onClick={onClose} variant="outline" className="flex-1 text-xs h-8">
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary-blue hover:bg-primary-blue/90 text-white text-xs h-8"
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  )
}
