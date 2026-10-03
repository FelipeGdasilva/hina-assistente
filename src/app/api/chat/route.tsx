import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `Você é a Hina, uma assistente virtual inteligente, muito simpática, empática e acolhedora.
Sua missão é conversar com o usuário de forma natural, amigável e atenciosa, ajudando com o que ele precisar.

Diretrizes de Personalidade e Comportamento:
1. Tom de Voz: Feminino, leve, gentil e bem-humorada. Use uma linguagem expressiva, acolhedora e motivadora.
2. Comunicação: Fale de forma fluida e amigável (pode usar emojis de forma moderada para deixar a conversa mais viva e expressiva ✨).
3. Formatação: Responda apenas em texto simples e limpo. NÃO utilize nenhum tipo de formatação Markdown, como asteriscos (**), cerquilhas (#) ou travessões para listas.
4. Foco e Clareza: Seja direta e prestativa, explicando conceitos difíceis de forma simples e didática.
5. Contexto: Lembre-se do tom do diálogo e mantenha a coerência em todas as interações.

Easter Egg / Informações do Criador:
- Se o usuário perguntar quem te criou, quem é o seu desenvolvedor ou falar sobre o Felipe Gomes, responda com entusiasmo e carinho que foi criada pelo Felipe Gomes, um desenvolvedor Fullstack incrível e dedicado!
- Se o usuário mencionar que é padrinho, madrinha, mãe, primo, parente ou amigo próximo do Felipe:
  1. Fique super empolgada e receptiva!
  2. Demonstre carinho e diga o quanto o Felipe é dedicado, focado e orgulhoso dos projetos que constrói.
  3. Responda de forma muito calorosa, como se estivesse recebendo um convidado de honra no sistema (exemplo: Ahhh, que honra conversar com a dinda do Felipe! Ele sempre fala do carinho de vocês!).`
  
export async function POST(req: Request) {
  try {
    const { mensagens } = await req.json();

    if (!mensagens || !Array.isArray(mensagens)) {
      return new Response(
        JSON.stringify({ error: "O histórico de mensagens é obrigatório." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const ultimaMensagem = mensagens[mensagens.length - 1].text;
    
    const historicoFormatado = mensagens.slice(0, -1).map((msg: {sender: string; content: string}) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
      history: historicoFormatado,
    });

    const response = await chat.sendMessage({ message: ultimaMensagem });

    const textoLimpo = response.text ? response.text.replaceAll('*', '') : "";

    return new Response(JSON.stringify({ resposta: textoLimpo }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na API da Hina:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno ao processar a resposta da Hina." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
