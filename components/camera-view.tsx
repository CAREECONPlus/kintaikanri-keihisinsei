"use client"

import { useState, useRef, useEffect } from "react"
import { CameraIcon as FlipCamera, Circle, Grid3X3, MoreHorizontal, Zap, ZapOff } from "lucide-react"
import { CALSSettingsModal } from "@/components/cals-settings-modal"
import { ElectronicBoardSettingsModal } from "@/components/electronic-board-settings-modal"
import { ElectronicBoardOverlay } from "@/components/electronic-board-overlay"
import { CameraMenuModal } from "@/components/camera-menu-modal"
import { ElectronicBoardTemplateManager } from "@/components/electronic-board-template-manager"

interface CALSSettings {
  enabled: boolean
  projectCode: string
  projectName: string
  photographer: string
  workStage: "pre-construction" | "during-construction" | "completion" | "inspection"
  location: string
  shootingLocation: string
}

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

export function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isFrontCamera, setIsFrontCamera] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCALSSettings, setShowCALSSettings] = useState(false)
  const [showElectronicBoard, setShowElectronicBoard] = useState(false)
  const [showBoardSettings, setShowBoardSettings] = useState(false)
  const [showCameraMenu, setShowCameraMenu] = useState(false)
  const [showTemplateManager, setShowTemplateManager] = useState(false)
  const [photoCounter, setPhotoCounter] = useState(1)
  const [currentTemplate, setCurrentTemplate] = useState<ElectronicBoardTemplate | null>(null)

  const [calsSettings, setCALSSettings] = useState<CALSSettings>({
    enabled: false,
    projectCode: "",
    projectName: "",
    photographer: "",
    workStage: "during-construction",
    location: "",
    shootingLocation: "",
  })

  const [boardSettings, setBoardSettings] = useState({
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
  })

  const startCamera = async () => {
    try {
      // videoRefが存在し、DOMに接続されているかチェック
      if (!videoRef.current || !videoRef.current.isConnected) {
        console.warn("Video element is not ready")
        return
      }

      const constraints = {
        video: {
          facingMode: isFrontCamera ? "user" : "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      // 再度videoRefの存在確認
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOn(true)
        setError(null)
      } else {
        // videoRefがnullの場合はストリームを停止
        stream.getTracks().forEach((track) => track.stop())
      }
    } catch (err) {
      console.error("カメラの起動に失敗しました:", err)
      setError("カメラへのアクセスが許可されていないか、利用できません。")
      setIsCameraOn(false)
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

  const switchCamera = () => {
    stopCamera()
    setIsFrontCamera(!isFrontCamera)
  }

  const toggleGrid = () => {
    setShowGrid(!showGrid)
  }

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled)
  }

  // フラッシュ効果の実装
  const triggerFlash = () => {
    if (!flashEnabled) return

    const flashElement = document.createElement("div")
    flashElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      opacity: 1;
      z-index: 9999;
      pointer-events: none;
    `
    document.body.appendChild(flashElement)

    // フラッシュ効果のアニメーション
    setTimeout(() => {
      flashElement.style.opacity = "0"
      flashElement.style.transition = "opacity 0.1s ease-out"
    }, 50)

    setTimeout(() => {
      document.body.removeChild(flashElement)
    }, 200)
  }

  // 統一されたシャッター機能
  const handleCapture = () => {
    if (!videoRef.current || !isCameraOn) {
      console.warn("カメラが起動していません")
      return
    }

    try {
      // フラッシュ効果を先に実行
      if (flashEnabled) {
        triggerFlash()
      }

      // キャンバスを作成して写真を撮影
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      if (!context) {
        console.error("Canvas context を取得できませんでした")
        return
      }

      // ビデオのサイズに合わせてキャンバスを設定
      canvas.width = videoRef.current.videoWidth || 1920
      canvas.height = videoRef.current.videoHeight || 1080

      // ビデオフレームをキャンバスに描画
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      // 電子小黒板が有効な場合は、オーバーレイ情報も含めて撮影
      if (showElectronicBoard && currentTemplate) {
        console.log("電子小黒板情報を含めて撮影:", currentTemplate.name)
      }

      // CALS規格が有効な場合の処理
      if (calsSettings.enabled) {
        const now = new Date()
        const year = now.getFullYear().toString()
        const month = (now.getMonth() + 1).toString().padStart(2, "0")
        const day = now.getDate().toString().padStart(2, "0")
        const counter = photoCounter.toString().padStart(3, "0")

        const filename = `${calsSettings.projectCode}_${calsSettings.shootingLocation}_${year}${month}${day}_${counter}.jpg`

        const calsData = {
          filename,
          projectCode: calsSettings.projectCode,
          projectName: calsSettings.projectName,
          shootingLocation: calsSettings.shootingLocation,
          photographer: calsSettings.photographer,
          shootingDate: `${year}-${month}-${day}`,
          shootingTime: now.toTimeString().split(" ")[0],
          workStage: calsSettings.workStage,
          location: calsSettings.location,
          imageSize: `${canvas.width}x${canvas.height}`,
          fileFormat: "JPEG",
          compressionRatio: "1/10以下",
          gpsLatitude: "35.6762",
          gpsLongitude: "139.6503",
          sequenceNumber: counter,
          electronicBoard: showElectronicBoard && currentTemplate ? currentTemplate.settings : null,
          flashUsed: flashEnabled,
          templateUsed: currentTemplate?.name,
        }

        console.log("CALS規格準拠撮影:", calsData)
        setPhotoCounter((prev) => prev + 1)
      } else {
        console.log("通常撮影を実行", {
          flashUsed: flashEnabled,
          templateUsed: currentTemplate?.name,
        })
      }

      // 撮影音効果（フラッシュ使用時は少し遅延）
      setTimeout(
        () => {
          const audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT",
          )
          audio.volume = 0.3
          audio.play().catch(() => {
            // 音声再生に失敗しても撮影は続行
          })
        },
        flashEnabled ? 100 : 0,
      )

      // 撮影成功のフィードバック（フラッシュ無効時のみ）
      if (!flashEnabled) {
        const flashElement = document.createElement("div")
        flashElement.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          opacity: 0.8;
          z-index: 9999;
          pointer-events: none;
        `
        document.body.appendChild(flashElement)

        setTimeout(() => {
          document.body.removeChild(flashElement)
        }, 150)
      }

      console.log("撮影完了")
    } catch (error) {
      console.error("撮影中にエラーが発生しました:", error)
    }
  }

  const handleTemplateSelect = (template: ElectronicBoardTemplate) => {
    setCurrentTemplate(template)
    setBoardSettings(template.settings)
    console.log("テンプレートを選択:", template.name)
  }

  const getWorkStageText = (stage: string) => {
    switch (stage) {
      case "pre-construction":
        return "着工前"
      case "during-construction":
        return "施工中"
      case "completion":
        return "完成"
      case "inspection":
        return "検査"
      default:
        return "施工中"
    }
  }

  useEffect(() => {
    // コンポーネントがマウントされた後、少し遅延してカメラを起動
    const timer = setTimeout(() => {
      if (!isCameraOn && !error) {
        startCamera()
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      stopCamera()
    }
  }, [isFrontCamera])

  return (
    <div className="relative flex h-full flex-col bg-black pt-8">
      {/* 簡略化されたヘッダー */}
      <div className="absolute top-12 left-0 right-0 z-20 flex items-center justify-between px-4">
        {/* 左側：モード表示 */}
        <div className="flex items-center space-x-2">
          {calsSettings.enabled && (
            <div className="rounded-lg bg-regulation-green/80 px-2 py-1">
              <span className="text-xs text-white font-medium">CALS</span>
            </div>
          )}
          {showElectronicBoard && (
            <div className="rounded-lg bg-regulation-red/80 px-2 py-1">
              <span className="text-xs text-white font-medium">
                {currentTemplate ? currentTemplate.name : "電子小黒板"}
              </span>
            </div>
          )}
          {flashEnabled && (
            <div className="rounded-lg bg-regulation-yellow/80 px-2 py-1">
              <span className="text-xs text-regulation-black font-medium">フラッシュ</span>
            </div>
          )}
        </div>

        {/* 右側：統合メニューとグリッド */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleGrid}
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors ${
              showGrid ? "bg-regulation-green text-white" : "bg-black/30 text-white hover:bg-black/50"
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowCameraMenu(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white shadow-sm transition-colors hover:bg-black/50"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative flex-1">
        {error ? (
          <div className="flex h-full items-center justify-center p-4 text-center text-white">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
              style={{ transform: isFrontCamera ? "scaleX(-1)" : "none" }}
            />

            {/* 電子小黒板オーバーレイ */}
            {showElectronicBoard && currentTemplate && <ElectronicBoardOverlay settings={currentTemplate.settings} />}

            {/* 9分割グリッド */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/3 top-0 h-full w-0.5 bg-white/30"></div>
                <div className="absolute left-2/3 top-0 h-full w-0.5 bg-white/30"></div>
                <div className="absolute top-1/3 left-0 w-full h-0.5 bg-white/30"></div>
                <div className="absolute top-2/3 left-0 w-full h-0.5 bg-white/30"></div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-center bg-white p-6 shadow-lg">
        <div className="flex w-full max-w-xs items-center justify-between">
          {/* フラッシュon/offボタン */}
          <button
            onClick={toggleFlash}
            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-colors ${
              flashEnabled
                ? "bg-regulation-yellow text-regulation-black hover:bg-regulation-yellow/90"
                : "bg-background-blue text-gray-600 hover:bg-tertiary-blue/20"
            }`}
          >
            {flashEnabled ? <Zap className="h-6 w-6" /> : <ZapOff className="h-6 w-6" />}
          </button>

          {/* シャッターボタン */}
          <button
            onClick={handleCapture}
            disabled={!isCameraOn}
            className={`flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-sm transition-transform hover:scale-105 active:scale-95 ${
              !isCameraOn
                ? "border-gray-300 bg-gray-300 cursor-not-allowed"
                : calsSettings.enabled || showElectronicBoard
                  ? "border-regulation-red bg-regulation-red"
                  : "border-regulation-green"
            }`}
          >
            <Circle
              className={`h-full w-full ${
                !isCameraOn
                  ? "text-gray-400"
                  : calsSettings.enabled || showElectronicBoard
                    ? "text-white"
                    : "text-regulation-green"
              }`}
              fill={!isCameraOn ? "gray" : calsSettings.enabled || showElectronicBoard ? "white" : "#1DCE85"}
            />
          </button>

          {/* カメラ切り替えボタン */}
          <button
            onClick={switchCamera}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-background-blue text-gray-600 shadow-sm transition-colors hover:bg-tertiary-blue/20"
          >
            <FlipCamera className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* 隠しキャンバス（撮影処理用） */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* 統合メニューモーダル */}
      {showCameraMenu && (
        <CameraMenuModal
          onClose={() => setShowCameraMenu(false)}
          calsSettings={calsSettings}
          onCALSToggle={() => setCALSSettings((prev) => ({ ...prev, enabled: !prev.enabled }))}
          onCALSSettings={() => setShowCALSSettings(true)}
          showElectronicBoard={showElectronicBoard}
          onElectronicBoardToggle={() => setShowElectronicBoard(!showElectronicBoard)}
          onElectronicBoardSettings={() => setShowBoardSettings(true)}
          onElectronicBoardTemplates={() => setShowTemplateManager(true)}
        />
      )}

      {/* テンプレート管理モーダル */}
      {showTemplateManager && (
        <ElectronicBoardTemplateManager
          onClose={() => setShowTemplateManager(false)}
          onSelectTemplate={handleTemplateSelect}
          currentTemplate={currentTemplate}
        />
      )}

      {/* CALS設定モーダル */}
      {showCALSSettings && (
        <CALSSettingsModal
          settings={calsSettings}
          onClose={() => setShowCALSSettings(false)}
          onSave={setCALSSettings}
        />
      )}

      {/* 電子小黒板設定モーダル */}
      {showBoardSettings && (
        <ElectronicBoardSettingsModal
          settings={boardSettings}
          onClose={() => setShowBoardSettings(false)}
          onSave={(settings) => {
            setBoardSettings(settings)
            // 現在のテンプレートがある場合は更新
            if (currentTemplate) {
              setCurrentTemplate({
                ...currentTemplate,
                settings: settings,
              })
            }
          }}
        />
      )}
    </div>
  )
}
