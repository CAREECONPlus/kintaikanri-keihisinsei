"use client"

import { useState, useRef, useEffect } from "react"
import { X, Camera, RotateCcw, Check, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExpenseOCRCameraProps {
  onClose: () => void
  onResult: (result: { category: string; amount: number; description: string }) => void
}

export function ExpenseOCRCamera({ onClose, onResult }: ExpenseOCRCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrResult, setOcrResult] = useState<{
    category: string
    amount: number
    description: string
    confidence: number
  } | null>(null)

  // OCR処理のシミュレーション
  const simulateOCR = (imageData: string) => {
    // 実際の実装では、OCR APIを呼び出す
    const mockResults = [
      {
        category: "transport",
        amount: 320,
        description: "JR山手線 新宿→渋谷",
        confidence: 0.95,
      },
      {
        category: "meal",
        amount: 850,
        description: "昼食代 ファミリーレストラン",
        confidence: 0.88,
      },
      {
        category: "material",
        amount: 2500,
        description: "ネジ・ボルト類 ホームセンター",
        confidence: 0.92,
      },
      {
        category: "office",
        amount: 180,
        description: "コピー用紙 A4 500枚",
        confidence: 0.85,
      },
      {
        category: "other",
        amount: 450,
        description: "駐車場代 2時間",
        confidence: 0.78,
      },
    ]

    return mockResults[Math.floor(Math.random() * mockResults.length)]
  }

  const startCamera = async () => {
    try {
      // videoRefが存在し、DOMに接続されているかチェック
      if (!videoRef.current || !videoRef.current.isConnected) {
        console.warn("Video element is not ready")
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      // 再度videoRefの存在確認
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOn(true)
      } else {
        // videoRefがnullの場合はストリームを停止
        stream.getTracks().forEach((track) => track.stop())
      }
    } catch (err) {
      console.error("カメラの起動に失敗しました:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraOn(false)
    }
  }

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsProcessing(true)

    try {
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (!context) return

      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight

      context.drawImage(videoRef.current, 0, 0)
      const imageData = canvas.toDataURL("image/jpeg", 0.8)

      // OCR処理のシミュレーション（実際の実装では外部APIを使用）
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const result = simulateOCR(imageData)
      setOcrResult(result)
    } catch (error) {
      console.error("OCR処理中にエラーが発生しました:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleConfirm = () => {
    if (ocrResult) {
      onResult({
        category: ocrResult.category,
        amount: ocrResult.amount,
        description: ocrResult.description,
      })
    }
  }

  const handleRetry = () => {
    setOcrResult(null)
  }

  useEffect(() => {
    // コンポーネントがマウントされた後、少し遅延してカメラを起動
    const timer = setTimeout(() => {
      startCamera()
    }, 100)

    return () => {
      clearTimeout(timer)
      stopCamera()
    }
  }, [])

  const getCategoryLabel = (category: string) => {
    const categories = {
      transport: "交通費",
      meal: "食費",
      material: "資材費",
      office: "事務用品",
      other: "その他",
    }
    return categories[category as keyof typeof categories] || "その他"
  }

  return (
    <div className="flex h-full flex-col bg-black pt-8">
      {/* ヘッダー */}
      <div className="absolute top-12 left-4 right-4 z-10 flex items-center justify-between">
        <h2 className="text-white font-medium">レシート読み取り</h2>
        <button onClick={onClose} className="p-2 bg-black/50 rounded-full text-white">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* カメラビュー */}
      <div className="relative flex-1">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

        {/* スキャンエリアのオーバーレイ */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-72 h-44 border-2 border-white border-dashed rounded-lg bg-white/10">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <Scan className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-xs">レシートをここに合わせてください</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 処理中オーバーレイ */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>レシートを解析中...</p>
            </div>
          </div>
        )}

        {/* OCR結果表示 */}
        {ocrResult && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-4 w-full max-w-xs">
              <h3 className="text-base font-medium text-gray-900 mb-3">読み取り結果</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">カテゴリ</label>
                  <p className="text-sm text-gray-900">{getCategoryLabel(ocrResult.category)}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">金額</label>
                  <p className="text-sm text-gray-900 font-mono">¥{ocrResult.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">説明</label>
                  <p className="text-sm text-gray-900">{ocrResult.description}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">信頼度</label>
                  <p className="text-sm text-gray-900">{Math.round(ocrResult.confidence * 100)}%</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={handleRetry} variant="outline" className="flex-1 text-xs h-8">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  再撮影
                </Button>
                <Button onClick={handleConfirm} className="flex-1 bg-[#FF6B35] hover:bg-[#E55A2B] text-xs h-8">
                  <Check className="h-3 w-3 mr-1" />
                  確定
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 撮影ボタン */}
      {!ocrResult && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={captureAndAnalyze}
            disabled={!isCameraOn || isProcessing}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
          >
            <Camera className="h-8 w-8 text-gray-700" />
          </button>
        </div>
      )}

      {/* 隠しキャンバス */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  )
}
