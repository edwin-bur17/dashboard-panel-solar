"use client"
import React, { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card } from "@/src/components/ui/card"
import { Message, ApiResponse } from "@/src/types/chatbot"

const getCurrentTime = (): string => {
  const now = new Date()

  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)

  // Mensaje inicial solo en cliente
  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content:
          "¡Hola! Soy tu asistente inteligente. Estoy conectado a tus paneles en tiempo real. ¿Qué deseas saber hoy?",
        timestamp: getCurrentTime(),
      },
    ])
  }, [])

  // Scroll automático
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: getCurrentTime(),
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({} as Record<string, unknown>))

        throw new Error(
          (errorData.details as string) ||
            (errorData.error as string) ||
            "Error en la API"
        )
      }

      const data: ApiResponse = await response.json()

      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          data.content ||
          "No se ha podido obtener una respuesta del sistema. Por favor, intenta de nuevo.",
        timestamp: getCurrentTime(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (error: unknown) {
      console.error("Chat Error:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido"
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: `Error: ${errorMessage}. Por favor, verifica tu conexión y la API Key en .env.local.`,
        timestamp: getCurrentTime(),
      }

      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const limpiarChat = (): void => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: "Historial borrado. ¿En qué más puedo ayudarte?",
        timestamp: getCurrentTime(),
      },
    ])
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-4 gap-4">
      <div className="flex items-center justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-tr from-orange-400 to-yellow-500 p-2 rounded-lg text-white shadow-lg shadow-orange-500/20">
            <Bot size={24} />
          </div>

          <div>
            <h1 className="font-bold text-lg leading-none">
              Asistente - chatbot
            </h1>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>

              <span className="text-xs text-muted-foreground font-medium">
                En línea
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive transition-colors"
            onClick={limpiarChat}
          >
            <Trash2 size={20} />
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-md">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
                  msg.role === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-linear-to-tr from-orange-400 to-yellow-500 text-white"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                </div>

                <div
                  className={`flex flex-col ${
                    msg.role === "user"
                      ? "items-end"
                      : "items-start"
                  }`}
                >
                  <div
                    className={`p-4 rounded-2xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed break-words ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none border border-border/50"
                    }`}
                  >
                    {msg.content}
                  </div>

                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%] md:max-w-[75%] items-center">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-linear-to-tr from-orange-400 to-yellow-500 text-white shadow-sm">
                  <Sparkles size={16} className="animate-spin" />
                </div>

                <div className="bg-muted text-muted-foreground p-3 rounded-2xl rounded-tl-none border border-border/50 text-xs italic">
                  Procesando pregunta...
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-muted/30 border-t border-border">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta algo sobre tus paneles..."
              className="bg-background border-border/50 focus-visible:ring-orange-400 h-11"
            />

            <Button
              type="submit"
              className="bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-md shadow-orange-500/20 px-5 h-11 cursor-pointer"
            >
              <Send size={18} />
            </Button>
          </form>

        </div>
      </Card>
    </div>
  )
}
