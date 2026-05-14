"use client"

import * as React from "react"
import { Send, Bot, User, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card } from "@/src/components/ui/card"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp: string
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    role: "assistant",
    content: "¡Hola! Soy tu asistente solar inteligente. ¿En qué puedo ayudarte hoy?",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    role: "user",
    content: "¿Cuál ha sido el rendimiento de mis paneles hoy?",
    timestamp: "10:01 AM",
  },
  {
    id: 3,
    role: "assistant",
    content: "Hoy el rendimiento ha sido excelente. Has generado un total de 12.5 kWh hasta ahora, superando el promedio diario en un 15%. La radiación solar máxima se alcanzó a las 12:30 PM.",
    timestamp: "10:01 AM",
  },
]

export default function ChatbotPage() {
  const [messages, setMessages] = React.useState<Message[]>(MOCK_MESSAGES)
  const [input, setInput] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Solo UI: simulamos que el usuario envía un mensaje
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")

    // Simulamos una respuesta corta para mostrar la UI
    setTimeout(() => {
      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Esta es una respuesta de prueba. Como no hay lógica implementada todavía, solo puedo mostrarte cómo se ve la interfaz. ¡Espero que te guste!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, assistantMsg])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto px-4 py-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-linear-to-tr from-orange-400 to-yellow-500 p-2 rounded-lg text-white shadow-lg shadow-orange-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">Asistente Solar</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-muted-foreground font-medium">En línea e inteligente</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <Trash2 size={20} />
          </Button>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-md">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-linear-to-tr from-orange-400 to-yellow-500 text-white"
                  }`}>
                  {msg.role === "user" ? <User size={16} /> : <Sparkles size={16} />}
                </div>

                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted text-foreground rounded-tl-none border border-border/50"
                    }`}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Form */}
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
              className="bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-md shadow-orange-500/20 px-5 h-11"
            >
              <Send size={18} />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-wider font-semibold opacity-60">
            Inteligencia Artificial Especializada en Energía Fotovoltaica
          </p>
        </div>
      </Card>
    </div>
  )
}
