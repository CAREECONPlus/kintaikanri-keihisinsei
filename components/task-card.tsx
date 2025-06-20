"use client"
import { MapPin, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Task {
  id: number
  title: string
  location: string
  startTime: Date
  endTime: Date
  description: string
  color: string
}

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  // 所要時間を計算（分単位）
  const durationMinutes = Math.round((task.endTime.getTime() - task.startTime.getTime()) / (1000 * 60))

  // レギュレーションカラーに基づく色設定
  const getCardStyle = () => {
    const colorMap: Record<string, string> = {
      "bg-blue-100 border-blue-300": "border-l-primary-blue bg-white",
      "bg-green-100 border-green-300": "border-l-regulation-green bg-white",
      "bg-yellow-100 border-yellow-300": "border-l-regulation-yellow bg-white",
      "bg-orange-100 border-orange-300": "border-l-regulation-red bg-white",
      "bg-purple-100 border-purple-300": "border-l-secondary-blue bg-white",
      "bg-red-100 border-red-300": "border-l-regulation-red bg-white",
    }

    return colorMap[task.color] || "border-l-primary-blue bg-white"
  }

  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Card className={`overflow-hidden border-l-4 shadow-sm transition-all hover:shadow-md ${getCardStyle()}`}>
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-regulation-black">{task.title}</h3>

          <div className="mt-2 flex flex-col space-y-2 text-gray-600">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span className="text-sm">{task.location}</span>
            </div>

            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span className="text-sm">{durationMinutes}分</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
