"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Trash2, Camera, FileText, Car, Utensils, Wrench, Receipt, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExpenseOCRCamera } from "@/components/expense-ocr-camera"

interface ExpenseItem {
  id: number
  category: string
  amount: number
  description: string
  receipt?: string
}

interface ExpenseScreenProps {
  onBack: () => void
}

export function ExpenseScreen({ onBack }: ExpenseScreenProps) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [showOCRCamera, setShowOCRCamera] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const expenseCategories = [
    { value: "transport", label: "交通費", icon: Car, color: "bg-blue-100 text-blue-600" },
    { value: "meal", label: "食費", icon: Utensils, color: "bg-green-100 text-green-600" },
    { value: "material", label: "資材費", icon: Wrench, color: "bg-orange-100 text-orange-600" },
    { value: "office", label: "事務用品", icon: FileText, color: "bg-purple-100 text-purple-600" },
    { value: "other", label: "その他", icon: Receipt, color: "bg-gray-100 text-gray-600" },
  ]

  const addExpense = () => {
    const newExpense: ExpenseItem = {
      id: Date.now(),
      category: "transport",
      amount: 0,
      description: "",
    }
    setExpenses([...expenses, newExpense])
  }

  const updateExpense = (id: number, field: keyof ExpenseItem, value: any) => {
    setExpenses(expenses.map((expense) => (expense.id === id ? { ...expense, [field]: value } : expense)))
  }

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const getTotalAmount = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const getCategoryInfo = (categoryValue: string) => {
    return expenseCategories.find((cat) => cat.value === categoryValue) || expenseCategories[0]
  }

  const handleOCRResult = (result: { category: string; amount: number; description: string }) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, "category", result.category)
      updateExpense(editingExpense.id, "amount", result.amount)
      updateExpense(editingExpense.id, "description", result.description)
    } else {
      const newExpense: ExpenseItem = {
        id: Date.now(),
        category: result.category,
        amount: result.amount,
        description: result.description,
      }
      setExpenses([...expenses, newExpense])
    }
    setShowOCRCamera(false)
    setEditingExpense(null)
  }

  const handleSubmit = () => {
    const expenseData = {
      expenses,
      totalAmount: getTotalAmount(),
      submittedAt: new Date(),
    }
    console.log("経費申請を送信:", expenseData)
    setIsSubmitted(true)

    // 3秒後に戻る
    setTimeout(() => {
      onBack()
    }, 3000)
  }

  if (showOCRCamera) {
    return (
      <ExpenseOCRCamera
        onClose={() => {
          setShowOCRCamera(false)
          setEditingExpense(null)
        }}
        onResult={handleOCRResult}
      />
    )
  }

  if (isSubmitted) {
    return (
      <div className="flex h-full flex-col bg-gray-50 pt-8">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">申請完了</h2>
            <p className="text-gray-600 mb-4">経費申請が正常に送信されました</p>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">申請金額</div>
              <div className="text-2xl font-bold text-gray-900">¥{getTotalAmount().toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">{expenses.length}件の経費項目</div>
            </div>
            <p className="text-sm text-gray-500 mt-4">自動的に前の画面に戻ります...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-gray-50 pt-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between bg-white p-4 shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3 rounded-full p-2 hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">経費申請</h1>
        </div>
        <div className="text-sm text-gray-500">{new Date().toLocaleDateString("ja-JP")}</div>
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* OCRカメラボタン */}
          <button
            onClick={() => {
              setEditingExpense(null)
              setShowOCRCamera(true)
            }}
            className="w-full bg-[#FF6B35] text-white rounded-lg p-4 hover:bg-[#E55A2B] transition-colors shadow-sm"
          >
            <Camera className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">レシートを撮影して追加</span>
          </button>

          {/* 経費項目一覧 */}
          {expenses.map((expense) => {
            const categoryInfo = getCategoryInfo(expense.category)
            const IconComponent = categoryInfo.icon

            return (
              <div key={expense.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <select
                      value={expense.category}
                      onChange={(e) => updateExpense(expense.id, "category", e.target.value)}
                      className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF6B35] focus:outline-none"
                    >
                      {expenseCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingExpense(expense)
                        setShowOCRCamera(true)
                      }}
                      className="p-2 text-[#FF6B35] hover:bg-orange-50 rounded-lg transition-colors"
                      title="レシート撮影"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">金額</label>
                    <input
                      type="number"
                      value={expense.amount || ""}
                      onChange={(e) => updateExpense(expense.id, "amount", Number.parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF6B35] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                    <input
                      type="text"
                      value={expense.description}
                      onChange={(e) => updateExpense(expense.id, "description", e.target.value)}
                      placeholder="詳細を入力してください"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-[#FF6B35] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {/* 経費追加ボタン */}
          <button
            onClick={addExpense}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
          >
            <Plus className="h-6 w-6 mx-auto mb-2" />
            <span className="text-sm font-medium">手動で経費を追加</span>
          </button>

          {/* 合計金額表示 */}
          {expenses.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-[#FF6B35]">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700 mb-1">合計申請金額</div>
                <div className="text-2xl font-bold text-[#FF6B35]">¥{getTotalAmount().toLocaleString()}</div>
                <div className="text-sm text-gray-500 mt-1">{expenses.length}件の経費項目</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-sm flex-shrink-0">
        <div className="flex space-x-3">
          <Button onClick={onBack} variant="outline" className="flex-1">
            キャンセル
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={expenses.length === 0}
            className={`flex-1 ${
              expenses.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#FF6B35] hover:bg-[#E55A2B]"
            } text-white`}
          >
            申請 (¥{getTotalAmount().toLocaleString()})
          </Button>
        </div>
      </div>
    </div>
  )
}
