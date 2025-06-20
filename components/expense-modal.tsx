"use client"

import { useState } from "react"
import { X, Plus, Trash2, Camera, FileText, Car, Utensils, Wrench, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ExpenseOCRCamera } from "@/components/expense-ocr-camera"

interface ExpenseItem {
  id: number
  category: string
  amount: number
  description: string
  receipt?: string
}

interface ExpenseModalProps {
  onClose: () => void
}

export function ExpenseModal({ onClose }: ExpenseModalProps) {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])
  const [showOCRCamera, setShowOCRCamera] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null)

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
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-2 w-full max-w-md max-h-[90vh] rounded-lg bg-white shadow-xl flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-900">経費申請</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* 経費項目一覧 */}
            {expenses.map((expense) => {
              const categoryInfo = getCategoryInfo(expense.category)
              const IconComponent = categoryInfo.icon

              return (
                <div key={expense.id} className="rounded-lg border border-gray-200 p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${categoryInfo.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <select
                        value={expense.category}
                        onChange={(e) => updateExpense(expense.id, "category", e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:border-[#FF6B35] focus:outline-none"
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
                        className="p-1 text-[#FF6B35] hover:bg-orange-50 rounded"
                        title="レシート撮影"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">金額</label>
                      <input
                        type="number"
                        value={expense.amount || ""}
                        onChange={(e) => updateExpense(expense.id, "amount", Number.parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:border-[#FF6B35] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                      <input
                        type="text"
                        value={expense.description}
                        onChange={(e) => updateExpense(expense.id, "description", e.target.value)}
                        placeholder="詳細"
                        className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:border-[#FF6B35] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            {/* 経費追加ボタン */}
            <button
              onClick={addExpense}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
            >
              <Plus className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm">経費を追加</span>
            </button>

            {/* OCRカメラボタン */}
            <button
              onClick={() => {
                setEditingExpense(null)
                setShowOCRCamera(true)
              }}
              className="w-full bg-[#FF6B35] text-white rounded-lg p-3 hover:bg-[#E55A2B] transition-colors"
            >
              <Camera className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm">レシートを撮影して追加</span>
            </button>

            {/* 合計金額表示 */}
            {expenses.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">合計金額</span>
                  <span className="text-lg font-bold text-gray-900">¥{getTotalAmount().toLocaleString()}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">{expenses.length}件の経費項目</div>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="flex space-x-3 border-t border-gray-200 p-4 flex-shrink-0">
          <Button onClick={onClose} variant="outline" className="flex-1">
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

      {/* OCRカメラモーダル */}
      {showOCRCamera && (
        <ExpenseOCRCamera
          onClose={() => {
            setShowOCRCamera(false)
            setEditingExpense(null)
          }}
          onResult={handleOCRResult}
        />
      )}
    </div>
  )
}
