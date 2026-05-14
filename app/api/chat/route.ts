import { NextRequest, NextResponse } from "next/server";
import { ref, get, query, limitToLast } from "firebase/database";
import { db } from "@/src/lib/firebase";
import { Sensor } from "@/src/types/dashboard";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function GET() {
  return NextResponse.json({ 
    status: "online", 
    hasKey: !!process.env.OPENROUTER_API_KEY 
  });
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Configuración incompleta: OPENROUTER_API_KEY" }, { status: 500 });
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Formato de mensajes inválido" }, { status: 400 });
    }

    // 1. Intentar obtener datos de Firebase (silencioso si falla)
    let solarContext = "No hay datos en tiempo real disponibles en este momento.";
    try {
      const psRef = query(ref(db, "sensores/PS"), limitToLast(1));
      const batRef = query(ref(db, "sensores/bateria"), limitToLast(1));
      
      const [psSnap, batSnap] = await Promise.all([get(psRef), get(batRef)]);
      
      let psVal: Sensor | null = null;
      let batVal: Sensor | null = null;

      if (psSnap.exists()) {
        const val = psSnap.val();
        psVal = val && typeof val === 'object' ? Object.values(val)[0] : val;
      }
      if (batSnap.exists()) {
        const val = batSnap.val();
        batVal = val && typeof val === 'object' ? Object.values(val)[0] : val;
      }

      if (psVal || batVal) {
        solarContext = `
          DATOS ACTUALES DEL SISTEMA:
          - Paneles: ${psVal ? `${psVal.voltaje || 0}V, ${psVal.amperaje || 0}mA, ${psVal.potencia || 0}mW` : "Sin datos"}
          - Batería: ${batVal ? `${batVal.voltaje || 0}V, ${batVal.amperaje || 0}mA, ${batVal.potencia || 0}mW` : "Sin datos"}
        `;
      }
    } catch (e) {
      console.warn("Error obteniendo contexto de Firebase:", e);
    }

    // 2. Contexto del asistente
   const systemInstruction = `
    Eres el asistente de un dashboard de monitoreo energético solar.

    CONTEXTO DEL PROYECTO:
    Este proyecto es una maqueta/prototipo educativo universitario orientado al aprendizaje.
    El sistema simula la captura, monitoreo y visualización de energía obtenida desde un panel solar, almacenada en una batería y utilizada para alimentar pequeños bombillos o cargas básicas.

    La captura de datos se realiza mediante sensores INA, los cuales permiten medir:
    - Voltaje
    - Amperaje
    - Potencia

    El objetivo del proyecto es enseñar conceptos relacionados con:
    - Energía solar
    - Monitoreo IoT
    - Sensado electrónico
    - Visualización de datos en tiempo real
    - Gestión básica de energía

    Los datos mostrados en el dashboard corresponden a la maqueta/prototipo académico y no a una instalación eléctrica industrial o comercial.

    DATOS ACTUALES DEL SISTEMA:
    ${solarContext}

    INSTRUCCIONES DE RESPUESTA:
    - Responde en español.
    - Sé claro y amigable.
    - Mantén respuestas cortas (máximo 3 frases).
    - Si preguntan sobre valores eléctricos o estado del sistema, usa el contexto técnico proporcionado.
    - Si preguntan sobre el proyecto, explica que es una maqueta educativa universitaria enfocada en aprendizaje e investigación.
  `;

    const formattedMessages: Message[] = [
      { role: "system", content: systemInstruction },
      ...messages.map((m: Message) => ({
        role: m.role,
        content: m.content
      }))
    ];

    // 3. Llamada a OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://dashboard-panel-solar.vercel.app", // Opcional
        "X-Title": "Solar Dashboard Assistant", // Opcional
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-001",
        messages: formattedMessages,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenRouter error: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0]?.message?.content || "No recibí una respuesta clara.";

    return NextResponse.json({ content: responseText });

  } catch (error: unknown) {
    console.error("Chat Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error en el servidor de chat", details: errorMessage },
      { status: 500 }
    );
  }
}
