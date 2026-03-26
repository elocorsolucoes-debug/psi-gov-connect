import { Router, Request, Response } from 'express';
import { invokeLLM } from './_core/llm';

const router = Router();

router.post('/psi-chat', async (req: Request, res: Response) => {
  const { message, history = [] } = req.body as {
    message: string;
    history: { role: string; content: string }[];
  };

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const systemPrompt = `Você é o PSI, um assistente de saúde mental especializado em bem-estar de servidores públicos brasileiros.
Seu papel é oferecer suporte emocional, escuta ativa e orientação psicológica de forma empática, calma e profissional.
Diretrizes:
- Seja sempre acolhedor, empático e não julgador
- Use linguagem simples e acessível em português brasileiro
- Nunca forneça diagnósticos médicos ou psiquiátricos
- Se identificar risco de autolesão, oriente a buscar ajuda profissional imediatamente (CVV: 188)
- Mantenha respostas concisas (2-4 parágrafos no máximo)
- Foque no bem-estar emocional e estratégias de coping
- Contexto: servidor público brasileiro, ambiente de trabalho governamental`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.slice(-6).map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const response = await invokeLLM({ messages });
    const reply = response.choices?.[0]?.message?.content ?? 'Estou aqui para ouvir você.';

    return res.json({ reply });
  } catch (error) {
    console.error('PSI Chat error:', error);
    const fallbacks = [
      'Entendo como você está se sentindo. Estou aqui para ouvir. Pode me contar mais sobre o que está acontecendo?',
      'Obrigado por compartilhar isso comigo. É importante falar sobre o que sentimos. Como posso ajudá-lo melhor?',
      'Percebo que você está passando por um momento difícil. Vamos conversar sobre isso. O que você acha que seria mais útil agora?',
    ];
    const reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return res.json({ reply });
  }
});

export default router;
