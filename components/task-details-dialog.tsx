"use client"

import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { MapPin, Clock, Calendar, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Task {
  id: number
  title: string
  location: string
  startTime: Date
  endTime: Date
  description: string
  color: string
}

interface TaskDetailsDialogProps {
  task: Task | null
  open: boolean
  onClose: () => void
}

export function TaskDetailsDialog({ task, open, onClose }: TaskDetailsDialogProps) {
  if (!task) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-start">
            <Calendar className="mr-3 h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium">日時</div>
              <div className="text-gray-600">
                {format(task.startTime, "yyyy年MM月dd日(EEE) HH:mm", { locale: ja })} -
                {format(task.endTime, "HH:mm", { locale: ja })}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="mr-3 h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium">場所</div>
              <div className="text-gray-600">{task.location}</div>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="mr-3 h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium">所要時間</div>
              <div className="text-gray-600">
                {Math.round((task.endTime.getTime() - task.startTime.getTime()) / (1000 * 60))}分
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <FileText className="mr-3 h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium">詳細</div>
              <div className="text-gray-600">{task.description}</div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            閉じる
          </Button>
          <Button>編集</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
