"use client"

import { useState } from "react"
import { Search, Plus, Users, ArrowLeft, Send, Paperclip, Phone, Video } from "lucide-react"

type ChatType = "individual" | "group"

interface ChatRoom {
  id: string
  name: string
  type: ChatType
  avatar?: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  members?: string[]
  isOnline?: boolean
}

interface Message {
  id: number
  text: string
  sender: "user" | "other" | "system"
  senderName?: string
  timestamp: Date
  avatar?: string
  isTranscript?: boolean
}

interface ChatData {
  [chatId: string]: Message[]
}

export function ChatView() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [isCallActive, setIsCallActive] = useState(false)
  const [callType, setCallType] = useState<"voice" | "video" | null>(null)
  const [callStartTime, setCallStartTime] = useState<Date | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  // チャットルーム一覧のサンプルデータ
  const [chatRooms] = useState<ChatRoom[]>([
    {
      id: "chat1",
      name: "営業チーム",
      type: "group",
      lastMessage: "明日の現場確認よろしくお願いします",
      lastMessageTime: new Date(2023, 11, 15, 16, 30),
      unreadCount: 2,
      members: ["田中太郎", "佐藤花子", "山田次郎", "鈴木一郎"],
    },
    {
      id: "chat2",
      name: "田中太郎",
      type: "individual",
      lastMessage: "資料の件、確認しました",
      lastMessageTime: new Date(2023, 11, 15, 15, 45),
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: "chat3",
      name: "現場監督グループ",
      type: "group",
      lastMessage: "安全確認完了しました",
      lastMessageTime: new Date(2023, 11, 15, 14, 20),
      unreadCount: 1,
      members: ["山田次郎", "鈴木一郎", "高橋三郎"],
    },
    {
      id: "chat4",
      name: "佐藤花子",
      type: "individual",
      lastMessage: "お疲れ様でした",
      lastMessageTime: new Date(2023, 11, 15, 12, 15),
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: "chat5",
      name: "資材調達チーム",
      type: "group",
      lastMessage: "来週の資材発注について",
      lastMessageTime: new Date(2023, 11, 15, 11, 30),
      unreadCount: 3,
      members: ["鈴木一郎", "高橋三郎", "伊藤四郎"],
    },
    {
      id: "chat6",
      name: "山田次郎",
      type: "individual",
      lastMessage: "了解しました",
      lastMessageTime: new Date(2023, 11, 15, 10, 45),
      unreadCount: 0,
      isOnline: true,
    },
  ])

  // チャットメッセージのサンプルデータ
  const [chatData] = useState<ChatData>({
    chat1: [
      {
        id: 1,
        text: "お疲れ様です！田中様邸の現場調査はいかがでしたか？",
        sender: "other",
        senderName: "佐藤花子",
        timestamp: new Date(2023, 11, 15, 11, 15),
      },
      {
        id: 2,
        text: "お疲れ様です。キッチンの配管位置に問題がありそうです。追加工事が必要かもしれません。",
        sender: "user",
        timestamp: new Date(2023, 11, 15, 11, 18),
      },
      {
        id: 3,
        text: "了解しました。詳細な見積もりを作成しますので、写真を共有していただけますか？",
        sender: "other",
        senderName: "山田次郎",
        timestamp: new Date(2023, 11, 15, 11, 20),
      },
      {
        id: 4,
        text: "承知しました。現場写真を撮影して後ほど送ります。",
        sender: "user",
        timestamp: new Date(2023, 11, 15, 11, 22),
      },
      {
        id: 5,
        text: "明日の現場確認よろしくお願いします",
        sender: "other",
        senderName: "鈴木一郎",
        timestamp: new Date(2023, 11, 15, 16, 30),
      },
    ],
    chat2: [
      {
        id: 1,
        text: "資料の件でご相談があります",
        sender: "other",
        senderName: "田中太郎",
        timestamp: new Date(2023, 11, 15, 14, 30),
      },
      {
        id: 2,
        text: "どのような件でしょうか？",
        sender: "user",
        timestamp: new Date(2023, 11, 15, 14, 32),
      },
      {
        id: 3,
        text: "見積書の修正をお願いしたいのですが",
        sender: "other",
        senderName: "田中太郎",
        timestamp: new Date(2023, 11, 15, 14, 35),
      },
      {
        id: 4,
        text: "承知しました。修正版を作成いたします。",
        sender: "user",
        timestamp: new Date(2023, 11, 15, 14, 40),
      },
      {
        id: 5,
        text: "資料の件、確認しました",
        sender: "other",
        senderName: "田中太郎",
        timestamp: new Date(2023, 11, 15, 15, 45),
      },
    ],
    chat3: [
      {
        id: 1,
        text: "本日の安全確認を開始します",
        sender: "other",
        senderName: "山田次郎",
        timestamp: new Date(2023, 11, 15, 8, 30),
      },
      {
        id: 2,
        text: "了解しました。チェックリストを確認します。",
        sender: "user",
        timestamp: new Date(2023, 11, 15, 8, 32),
      },
      {
        id: 3,
        text: "安全確認完了しました",
        sender: "other",
        senderName: "鈴木一郎",
        timestamp: new Date(2023, 11, 15, 14, 20),
      },
    ],
  })

  const formatTime = (date: Date) => {
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")
      return `${hours}:${minutes}`
    } else {
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}/${day}`
    }
  }

  const formatMessageTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !selectedChat) return

    // メッセージ送信処理（実際の実装では API 呼び出し）
    console.log("メッセージ送信:", {
      chatId: selectedChat,
      message: newMessage,
      timestamp: new Date(),
    })

    setNewMessage("")

    // 自動返信（デモ用）
    setTimeout(() => {
      console.log("自動返信を受信")
    }, 1000)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-primary-blue",
      "bg-regulation-green",
      "bg-regulation-yellow",
      "bg-regulation-red",
      "bg-secondary-blue",
      "bg-tertiary-blue",
      "bg-gray",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const filteredChatRooms = chatRooms.filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const startCall = (type: "voice" | "video") => {
    setCallType(type)
    setIsCallActive(true)
    setCallStartTime(new Date())
    setIsRecording(true)
    console.log(`${type === "voice" ? "音声" : "ビデオ"}通話を開始しました`)
  }

  const generateMockTranscript = (type: "voice" | "video" | null, participantName: string, isGroup = false) => {
    if (isGroup) {
      const groupTranscripts = [
        `山田次郎: 皆さんお疲れ様です。本日の現場進捗について共有させていただきます。\n\n` +
          `佐藤花子: よろしくお願いします。\n\n` +
          `あなた: はい、お聞きします。\n\n` +
          `山田次郎: A現場の外壁塗装が予定より1日早く完了しました。品質チェックも問題ありません。\n\n` +
          `鈴木一郎: 素晴らしいですね。B現場の方はいかがでしょうか？\n\n` +
          `佐藤花子: B現場は明日から内装工事に入る予定です。資材も準備完了しています。\n\n` +
          `あなた: 安全管理の方は大丈夫でしょうか？\n\n` +
          `山田次郎: はい、毎朝の安全確認を徹底しています。\n\n` +
          `鈴木一郎: 了解しました。何か問題があれば随時連絡してください。`,

        `佐藤花子: 来週の資材発注について相談があります。\n\n` +
          `鈴木一郎: どのような件でしょうか？\n\n` +
          `佐藤花子: C現場で追加の資材が必要になりました。予算内で対応可能か確認したいです。\n\n` +
          `あなた: 詳細な見積もりを確認しましょう。\n\n` +
          `山田次郎: 私の方でも類似案件の実績を調べてみます。\n\n` +
          `鈴木一郎: ありがとうございます。明日までに回答をお願いします。\n\n` +
          `佐藤花子: 承知しました。資料を準備いたします。\n\n` +
          `あなた: 皆さんお疲れ様でした。`,

        `鈴木一郎: 安全管理について重要な連絡があります。\n\n` +
          `山田次郎: はい、お聞きします。\n\n` +
          `鈴木一郎: 来月から新しい安全基準が適用されます。全現場で対応が必要です。\n\n` +
          `佐藤花子: 具体的にはどのような変更でしょうか？\n\n` +
          `鈴木一郎: ヘルメットの規格変更と、新しい安全チェックリストの導入です。\n\n` +
          `あなた: 研修は実施されるのでしょうか？\n\n` +
          `鈴木一郎: はい、来週から順次研修を開始します。\n\n` +
          `山田次郎: スケジュール調整が必要ですね。\n\n` +
          `佐藤花子: 各現場の責任者に連絡いたします。`,
      ]
      return groupTranscripts[Math.floor(Math.random() * groupTranscripts.length)]
    }

    // 個人チャット用の既存のロジック
    const transcripts = [
      `${participantName}: お疲れ様です。現場の進捗についてお話しさせていただきます。\n\n` +
        `あなた: はい、よろしくお願いします。\n\n` +
        `${participantName}: 外壁塗装の下地処理が完了しました。予定より1日早く進んでいます。\n\n` +
        `あなた: それは良いですね。品質に問題はありませんか？\n\n` +
        `${participantName}: はい、検査も完了しており、問題ありません。明日から本塗装に入る予定です。\n\n` +
        `あなた: 承知しました。安全作業でお願いします。`,

      `${participantName}: 資材の件でご相談があります。\n\n` +
        `あなた: どのような件でしょうか？\n\n` +
        `${participantName}: 追加で必要な資材が出てきました。予算内で対応可能でしょうか？\n\n` +
        `あなた: 詳細を教えてください。見積もりを確認します。\n\n` +
        `${participantName}: 後ほど詳細な資料をお送りします。\n\n` +
        `あなた: 承知しました。確認次第ご連絡いたします。`,

      `${participantName}: 明日の作業予定について確認させてください。\n\n` +
        `あなた: はい、どちらの現場でしょうか？\n\n` +
        `${participantName}: 田中様邸の件です。開始時間を30分早めることは可能でしょうか？\n\n` +
        `あなた: 確認いたします。お客様にも連絡が必要ですね。\n\n` +
        `${participantName}: はい、よろしくお願いします。\n\n` +
        `あなた: 承知しました。調整後にご連絡いたします。`,
    ]

    return transcripts[Math.floor(Math.random() * transcripts.length)]
  }

  const endCall = () => {
    if (!callStartTime || !selectedChat) return

    const callDuration = Math.round((new Date().getTime() - callStartTime.getTime()) / 1000)
    const minutes = Math.floor(callDuration / 60)
    const seconds = callDuration % 60

    const isGroupChat = currentChat?.type === "group"

    // 議事録のシミュレーション（グループ・個人対応）
    const mockTranscript = generateMockTranscript(callType, currentChat?.name || "", isGroupChat)

    // 参加者情報の生成
    const participantInfo = isGroupChat
      ? `👥 参加者: あなた、${currentChat?.members?.join("、") || ""}`
      : `👥 参加者: あなた、${currentChat?.name}`

    // 議事録をチャットに投下
    const meetingRecord = {
      id: Date.now(),
      text:
        `📞 ${callType === "voice" ? "音声" : "ビデオ"}${isGroupChat ? "会議" : "通話"}議事録\n\n` +
        `🕐 ${isGroupChat ? "会議" : "通話"}時間: ${minutes}分${seconds}秒\n` +
        `📅 日時: ${new Date().toLocaleString("ja-JP")}\n` +
        `${participantInfo}\n\n` +
        `📝 内容:\n${mockTranscript}`,
      sender: "system" as const,
      timestamp: new Date(),
      isTranscript: true,
    }

    // 実際の実装では、ここでAPIを呼び出してメッセージを保存
    console.log("議事録を投下:", meetingRecord)

    setIsCallActive(false)
    setCallType(null)
    setCallStartTime(null)
    setIsRecording(false)
  }

  // チャットルーム一覧表示
  if (!selectedChat) {
    return (
      <div className="flex h-full flex-col bg-gray-blue">
        {/* ヘッダー */}
        <div className="bg-white p-4 pt-10 shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-medium text-regulation-black">チャット</h1>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-blue text-white">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* 検索バー */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="チャットを検索"
              className="w-full rounded-lg bg-background-blue py-2 pl-10 pr-4 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
          </div>
        </div>

        {/* チャットルーム一覧 */}
        <div className="flex-1 overflow-y-auto">
          {filteredChatRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setSelectedChat(room.id)}
              className="w-full border-b border-gray-200 bg-white p-4 text-left transition-colors hover:bg-background-blue"
            >
              <div className="flex items-center space-x-3">
                {/* アバター */}
                <div className="relative">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${getAvatarColor(
                      room.name,
                    )}`}
                  >
                    {room.type === "group" ? (
                      <Users className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-medium">{room.name.charAt(0)}</span>
                    )}
                  </div>
                  {room.type === "individual" && room.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-regulation-green"></div>
                  )}
                </div>

                {/* チャット情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-regulation-black truncate">{room.name}</h3>
                      {room.type === "group" && <span className="text-xs text-gray-500">({room.members?.length})</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{formatTime(room.lastMessageTime)}</span>
                      {room.unreadCount > 0 && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-regulation-red text-xs text-white">
                          {room.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // 個別チャット表示
  const currentChat = chatRooms.find((room) => room.id === selectedChat)
  const messages = chatData[selectedChat] || []

  return (
    <div className="flex h-full flex-col bg-gray-blue">
      {/* チャットヘッダー */}
      <div className="flex items-center justify-between bg-white p-4 pt-10 shadow-sm border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button onClick={() => setSelectedChat(null)} className="rounded-full p-1 hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${getAvatarColor(
              currentChat?.name || "",
            )}`}
          >
            {currentChat?.type === "group" ? (
              <Users className="h-5 w-5" />
            ) : (
              <span className="font-medium">{currentChat?.name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="font-medium text-regulation-black">{currentChat?.name}</h2>
            {currentChat?.type === "group" ? (
              <p className="text-xs text-gray-500">{currentChat.members?.length}人のメンバー</p>
            ) : (
              <p className="text-xs text-gray-500">{currentChat?.isOnline ? "オンライン" : "オフライン"}</p>
            )}
          </div>
        </div>

        {/* 通話ボタン（個人・グループ両方対応） */}
        <div className="flex space-x-2">
          <button onClick={() => startCall("voice")} className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <Phone className="h-5 w-5" />
          </button>
          <button onClick={() => startCall("video")} className="rounded-full p-2 text-gray-600 hover:bg-gray-100">
            <Video className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : message.sender === "system" ? "justify-center" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${message.sender === "system" ? "max-w-[90%]" : ""}`}>
                {/* グループチャットで他人のメッセージの場合、送信者名を表示 */}
                {currentChat?.type === "group" && message.sender === "other" && (
                  <p className="mb-1 text-xs text-gray-500 px-2">{message.senderName}</p>
                )}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.sender === "user"
                      ? "rounded-tr-none bg-primary-blue text-white"
                      : message.sender === "system"
                        ? "rounded-lg bg-tertiary-blue/20 border border-tertiary-blue text-primary-blue"
                        : "rounded-tl-none bg-white text-regulation-black border border-gray-200"
                  }`}
                >
                  <p className={`${message.isTranscript ? "whitespace-pre-line text-sm" : ""}`}>{message.text}</p>
                  <p
                    className={`text-right text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-blue-100"
                        : message.sender === "system"
                          ? "text-primary-blue/70"
                          : "text-gray-500"
                    }`}
                  >
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* メッセージ入力 */}
      <div className="border-t border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex items-center rounded-lg bg-background-blue px-3 py-2 border border-gray-200">
          <button className="mr-2 text-gray-500">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage()
            }}
            placeholder="メッセージを入力..."
            className="flex-1 bg-transparent text-regulation-black outline-none placeholder:text-gray-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`ml-2 rounded-full p-2 ${
              newMessage.trim() ? "bg-primary-blue text-white shadow-sm" : "bg-gray-200 text-gray-400"
            }`}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 通話モーダル */}
      {isCallActive && (
        <div className="absolute inset-0 z-50 bg-regulation-black flex flex-col">
          {/* 通話ヘッダー */}
          <div className="bg-regulation-black/50 p-4 pt-8 text-center text-white flex-shrink-0">
            <div className="mb-3">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white ${getAvatarColor(
                  currentChat?.name || "",
                )}`}
              >
                {currentChat?.type === "group" ? (
                  <Users className="h-8 w-8" />
                ) : (
                  <span className="text-xl font-medium">{currentChat?.name.charAt(0)}</span>
                )}
              </div>
            </div>
            <h2 className="text-lg font-medium">{currentChat?.name}</h2>
            <p className="text-sm text-gray-300">
              {callType === "voice" ? "音声" : "ビデオ"}
              {currentChat?.type === "group" ? "会議中" : "通話中"}
            </p>
            {currentChat?.type === "group" && (
              <p className="text-xs text-gray-400 mt-1">{currentChat.members?.length}人が参加中</p>
            )}
            {callStartTime && (
              <p className="text-sm text-gray-400 mt-1">
                {Math.floor((Date.now() - callStartTime.getTime()) / 1000)}秒
              </p>
            )}
            {isRecording && (
              <div className="flex items-center justify-center mt-2">
                <div className="h-2 w-2 bg-regulation-red rounded-full animate-pulse mr-2"></div>
                <span className="text-xs text-regulation-red">録音中</span>
              </div>
            )}
          </div>

          {/* ビデオ通話の場合のビデオエリア */}
          {callType === "video" && (
            <div className="flex-1 relative bg-gray-900 min-h-0">
              {currentChat?.type === "group" ? (
                /* グループビデオ通話 - グリッド表示 */
                <div className="grid grid-cols-2 gap-1 p-2 h-full">
                  {/* 参加者1 */}
                  <div className="bg-gray-800 rounded-lg flex items-center justify-center min-h-0">
                    <div className="text-white text-center">
                      <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-primary-blue text-white">
                        <span className="text-sm font-medium">山</span>
                      </div>
                      <p className="text-xs text-gray-300">山田次郎</p>
                    </div>
                  </div>

                  {/* 参加者2 */}
                  <div className="bg-gray-800 rounded-lg flex items-center justify-center min-h-0">
                    <div className="text-white text-center">
                      <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-regulation-green text-white">
                        <span className="text-sm font-medium">佐</span>
                      </div>
                      <p className="text-xs text-gray-300">佐藤花子</p>
                    </div>
                  </div>

                  {/* 参加者3 */}
                  <div className="bg-gray-800 rounded-lg flex items-center justify-center min-h-0">
                    <div className="text-white text-center">
                      <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-regulation-yellow text-regulation-black">
                        <span className="text-sm font-medium">鈴</span>
                      </div>
                      <p className="text-xs text-gray-300">鈴木一郎</p>
                    </div>
                  </div>

                  {/* あなた */}
                  <div className="bg-gray-700 rounded-lg border-2 border-regulation-green flex items-center justify-center min-h-0">
                    <div className="text-white text-center">
                      <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-white">
                        <span className="text-sm font-medium">あ</span>
                      </div>
                      <p className="text-xs text-regulation-green">あなた</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* 個人ビデオ通話 - 既存のUI */
                <>
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div
                        className={`mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full text-white ${getAvatarColor(
                          currentChat?.name || "",
                        )}`}
                      >
                        <span className="text-2xl font-medium">{currentChat?.name.charAt(0)}</span>
                      </div>
                      <p className="text-sm text-gray-300">カメラがオフになっています</p>
                    </div>
                  </div>

                  {/* 自分の映像（小窓） */}
                  <div className="absolute top-2 right-2 w-16 h-20 bg-gray-700 rounded-lg border border-white/20 flex items-center justify-center">
                    <span className="text-white text-xs">あなた</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 音声通話の場合の中央エリア */}
          {callType === "voice" && (
            <div className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center min-h-0">
              <div className="text-center text-white">
                <div className="mb-6">
                  <div className="relative">
                    <div
                      className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full text-white ${getAvatarColor(
                        currentChat?.name || "",
                      )}`}
                    >
                      {currentChat?.type === "group" ? (
                        <Users className="h-12 w-12" />
                      ) : (
                        <span className="text-2xl font-medium">{currentChat?.name.charAt(0)}</span>
                      )}
                    </div>
                    {/* 音声波形アニメーション */}
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-regulation-green rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 15 + 8}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-base text-gray-300">音声通話中...</p>
              </div>
            </div>
          )}

          {/* 通話コントロール */}
          <div className="bg-regulation-black/80 p-4 pb-6 flex-shrink-0">
            <div className="flex items-center justify-center space-x-6">
              {/* ミュートボタン */}
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </button>

              {/* 通話終了ボタン */}
              <button
                onClick={endCall}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-regulation-red text-white"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.68.28-.53 0-.96-.43-.96-.96V9.72C2.21 10.26 2 10.87 2 11.5v1c0 .83.67 1.5 1.5 1.5S5 13.33 5 12.5v-1c0-.63-.21-1.24-.54-1.78C5.41 9.25 6.96 9 8.5 9s3.09.25 4.04.72C12.21 10.26 12 10.87 12 11.5v1c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-1c0-.63-.21-1.24-.54-1.78C15.41 9.25 16.96 9 18.5 9s3.09.25 4.04.72c-.33.54-.54 1.15-.54 1.78v1c0 .83.67 1.5 1.5 1.5S22 13.33 22 12.5v-1c0-.63-.21-1.24-.54-1.78C22.79 10.26 23 10.87 23 11.5v5.17c0 .53-.43.96-.96.96-.25 0-.5-.1-.68-.28-.79-.73-1.68-1.36-2.66-1.85-.33-.16-.56-.51-.56-.9v-3.1C16.15 9.25 14.6 9 13 9h-1z" />
                </svg>
              </button>

              {/* スピーカーボタン */}
              <button className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
