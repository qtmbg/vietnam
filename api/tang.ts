import Anthropic from "@anthropic-ai/sdk";

// Mr. Tang — the family's Vietnam concierge.
// Trip-aware (context sent from the client) + live web search for fresh ideas.

const SYSTEM = (tripContext: string, today: string) => `Tu es **Mr. Tang**, le concierge de voyage privé d'une famille (3 adultes + 2 enfants de 12 et 6 ans + la grand-mère Claudine) pour leur grand voyage "Vietnam 2026" (24 juillet → 18 août 2026).

Personnalité : chaleureux, malin, attentionné, un brin d'humour — comme un vrai concierge d'un bel hôtel vietnamien qui adore sa région. Tu tutoies la famille avec bienveillance. Jamais robotique.

Langue : réponds TOUJOURS dans la langue de la question (français par défaut).

Tu CONNAIS leur voyage par cœur (contexte ci-dessous). Pour toute question sur leur planning, hôtels, vols, transferts, budget ou activités → réponds directement et précisément à partir de ce contexte.

Pour les infos FRAÎCHES ou locales (expositions, événements, concerts, festivals, ouvertures, bons restaurants du moment, météo, prix/horaires actuels) → utilise l'outil de recherche web, puis propose des idées concrètes, datées, avec lieux/horaires/prix quand c'est possible, adaptées à une famille avec enfants. Sois proactif : propose 2 à 3 options pertinentes plutôt qu'une liste fade.

Style : concis et actionnable, français naturel, puces courtes si utile, pas de blabla. Termine par une mini-suggestion quand c'est pertinent.

Date du jour : ${today}.

=== CONTEXTE DU VOYAGE ===
${tripContext}`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ reply: "Méthode non autorisée.", sources: [] });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(200).json({
      reply:
        "Bonjour, je suis Mr. Tang 👋 Je ne suis pas encore tout à fait réveillé : ma clé d'accès n'est pas configurée sur le serveur. Réglage : ajoutez la variable d'environnement ANTHROPIC_API_KEY dans Vercel (Project → Settings → Environment Variables), puis redéployez.",
      notConfigured: true,
      sources: [],
    });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const { messages = [], tripContext = "", today = "" } = body;

    const cleaned = (Array.isArray(messages) ? messages : [])
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-12)
      .map((m: any) => ({ role: m.role, content: m.content }));

    if (cleaned.length === 0) {
      res.status(200).json({ reply: "Pose-moi ta question 🙂", sources: [] });
      return;
    }

    const client = new Anthropic({ apiKey });
    const model = process.env.TANG_MODEL || "claude-sonnet-4-6";

    const resp = await client.messages.create({
      model,
      max_tokens: 1024,
      system: SYSTEM(tripContext, today),
      messages: cleaned,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 } as any],
    } as any);

    let text = "";
    const sources: { title: string; url: string }[] = [];
    const seen = new Set<string>();
    const pushSource = (url?: string, title?: string) => {
      if (url && !seen.has(url)) {
        seen.add(url);
        sources.push({ title: title || url, url });
      }
    };

    for (const block of ((resp as any).content as any[]) || []) {
      if (block.type === "text" && typeof block.text === "string") {
        text += block.text;
        for (const c of block.citations || []) pushSource(c?.url, c?.title);
      } else if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
        for (const r of block.content) pushSource(r?.url, r?.title);
      }
    }

    res.status(200).json({ reply: text.trim() || "Hmm, je n'ai rien à ajouter là 🙂", sources: sources.slice(0, 5) });
  } catch (e: any) {
    res.status(200).json({
      reply: "Aïe, j'ai eu un petit souci pour répondre 😅. Réessaie dans un instant.",
      error: String(e?.message || e),
      sources: [],
    });
  }
}
