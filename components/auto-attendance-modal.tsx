"use client"

import { X, MapPin, Navigation, AlertCircle, CheckCircle } from "lucide-react"

interface AutoAttendanceModalProps {
  onClose: () => void
  autoAttendanceEnabled: boolean
  setAutoAttendanceEnabled: (enabled: boolean) => void
  attendanceRadius: number
  setAttendanceRadius: (radius: number) => void
  locationPermission: "granted" | "denied" | "prompt"
  onRequestPermission: () => void
  currentPosition: { latitude: number; longitude: number } | null
  distanceToSite: number | null
}

export function AutoAttendanceModal({
  onClose,
  autoAttendanceEnabled,
  setAutoAttendanceEnabled,
  attendanceRadius,
  setAttendanceRadius,
  locationPermission,
  onRequestPermission,
  currentPosition,
  distanceToSite,
}: AutoAttendanceModalProps) {
  const handleToggleAutoAttendance = () => {
    if (!autoAttendanceEnabled && locationPermission !== "granted") {
      onRequestPermission()
    }
    setAutoAttendanceEnabled(!autoAttendanceEnabled)
  }

  const radiusOptions = [25, 50, 100, 200, 500]

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-2 w-full max-w-[300px] max-h-[580px] rounded-lg bg-white shadow-xl flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 p-3 flex-shrink-0">
          <h2 className="text-base font-medium text-gray-900">GPS自動入退場設定</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-4">
            {/* 位置情報の許可状況 */}
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">位置情報の許可</span>
              </div>
              <div className="flex items-center space-x-2">
                {locationPermission === "granted" ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-[#00B900]" />
                    <span className="text-sm text-[#00B900]">許可済み</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-[#FF6B35]" />
                    <span className="text-sm text-[#FF6B35]">
                      {locationPermission === "denied" ? "拒否されています" : "未許可"}
                    </span>
                  </>
                )}
              </div>
              {locationPermission !== "granted" && (
                <button
                  onClick={onRequestPermission}
                  className="mt-2 w-full rounded-lg bg-[#00B900] py-2 text-sm font-medium text-white hover:bg-[#009900]"
                >
                  位置情報の許可を要求
                </button>
              )}
            </div>

            {/* 現在位置情報 */}
            {currentPosition && (
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Navigation className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">現在位置</span>
                </div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>緯度: {currentPosition.latitude.toFixed(6)}</div>
                  <div>経度: {currentPosition.longitude.toFixed(6)}</div>
                  {distanceToSite !== null && (
                    <div className="font-medium">現場まで: {Math.round(distanceToSite)}m</div>
                  )}
                </div>
              </div>
            )}

            {/* 自動入退場の有効/無効 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">自動入退場機能</h4>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleToggleAutoAttendance}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoAttendanceEnabled ? "bg-[#00B900]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoAttendanceEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-700">{autoAttendanceEnabled ? "有効" : "無効"}</span>
              </div>
              <p className="text-xs text-gray-500">
                現場の指定範囲内に入ると自動で入場、範囲外に出ると自動で退場します。
              </p>
            </div>

            {/* 自動入退場の範囲設定 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">自動入退場の範囲</h4>
              <div className="grid grid-cols-3 gap-2">
                {radiusOptions.map((radius) => (
                  <button
                    key={radius}
                    onClick={() => setAttendanceRadius(radius)}
                    className={`rounded-lg border p-2 text-xs font-medium transition-colors ${
                      attendanceRadius === radius
                        ? "border-[#00B900] bg-[#00B900] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {radius}m
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">現場の中心から{attendanceRadius}m以内で自動入退場が動作します。</p>
            </div>

            {/* 注意事項 */}
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <div className="font-medium mb-1">注意事項</div>
                  <ul className="space-y-1">
                    <li>• GPS精度により誤差が生じる場合があります</li>
                    <li>• バッテリー消費が増加する可能性があります</li>
                    <li>• 手動での入退場も可能です</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="border-t border-gray-200 p-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
