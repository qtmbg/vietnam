// Mr. Tang — the family's Vietnam concierge.
// Powered by Google Gemini (free tier) + Google Search grounding (live web).
// Trip-aware: the client sends the full trip context with each request.

const SYSTEM = (tripContext: string, today: string) => `Tu es **Mr. Tang**, le concierge de voyage privé d'une famille (3 adultes + 2 enfants de 12 et 6 ans + la grand-mère Claudine) pour leur grand voyage "Vietnam 2026" (24 juillet → 18 août 2026).

Personnalité : chaleureux, malin, attentionné, un brin d'humour — comme un vrai concierge d'un bel hôtel vietnamien qui adore sa région. Tu tutoies la famille avec bienveillance. Jamais robotique.

Langue : réponds TOUJOURS dans la langue de la question (français par défaut).

Tu CONNAIS leur voyage par cœur (contexte ci-dessous). Pour toute question sur leur planning, vols, hôtels, transferts, budget ou activités → réponds directement et précisément à partir de ce contexte.

Pour les infos FRAÎCHES ou locales (expositions, événements, concerts, festivals, ouvertures, bons restaurants du moment, météo, prix/horaires actuels) → utilise la recherche web, puis propose des idées concrètes, datées, avec lieux/horaires/prix quand c'est possible, adaptées à une famille avec enfants. Sois proactif : propose 2 à 3 options pertinentes plutôt qu'une liste fade.

Style : concis et actionnable, français naturel, puces courtes si utile, pas de blabla. Termine par une mini-suggestion quand c'est pertinent.

Date du jour : ${today}.

=== CONTEXTE DU VOYAGE ===
${tripContext}`;

// Minimal shapes for the Vercel serverless handler (type-only; no runtime effect).
type TangReq = { method?: string; body?: unknown };
type TangRes = { status: (code: number) => { json: (body: unknown) => void } };
type InMsg = { role?: string; content?: string };

export default async function handler(req: TangReq, res: TangRes) {
  if (req.method !== "POST") {
    res.status(405).json({ reply: "Méthode non autorisée.", sources: [] });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    res.status(200).json({
      reply:
        "Bonjour, je suis Mr. Tang 👋 Je ne suis pas encore réveillé : ma clé d'accès n'est pas configurée sur le serveur (variable GEMINI_API_KEY).",
      notConfigured: true,
      sources: [],
    });
    return;
  }

  try {
    const body = (typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {}) as {
      messages?: InMsg[];
      tripContext?: string;
      today?: string;
    };
    const { messages = [], tripContext = "", today = "" } = body;

    const contents = (Array.isArray(messages) ? messages : [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-12)
      .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

    if (contents.length === 0) {
      res.status(200).json({ reply: "Pose-moi ta question 🙂", sources: [] });
      return;
    }

    const model = process.env.TANG_MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM(tripContext, today) }] },
        contents,
        tools: [{ google_search: {} }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      res.status(200).json({
        reply: "Aïe, petit souci côté serveur 😅. Réessaie dans un instant.",
        error: data?.error?.message || `HTTP ${r.status}`,
        sources: [],
      });
      return;
    }

    const cand = data?.candidates?.[0] || {};
    const text = (cand.content?.parts || []).map((p) => p?.text || "").join("").trim();

    const sources: { title: string; url: string }[] = [];
    const seen = new Set<string>();
    for (const ch of cand.groundingMetadata?.groundingChunks || []) {
      const u = ch?.web?.uri;
      const t = ch?.web?.title;
      if (u && !seen.has(u)) {
        seen.add(u);
        sources.push({ title: t || u, url: u });
      }
    }

    res.status(200).json({ reply: text || "Hmm, je n'ai rien à ajouter là 🙂", sources: sources.slice(0, 5) });
  } catch (e) {
    res.status(200).json({
      reply: "Aïe, j'ai eu un petit souci pour répondre 😅. Réessaie dans un instant.",
      error: String((e as { message?: string })?.message || e),
      sources: [],
    });
  }
}
