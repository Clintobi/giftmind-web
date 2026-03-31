import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

interface NoteInput {
  text: string;
  category: string;
  created_at: string;
}

export interface SuggestionOutput {
  title: string;
  description: string;
  price_range: string;
  category: string;
  search_query: string;
  rationale: string;
}

export async function generateGiftSuggestions(
  personName: string,
  relationship: string,
  notes: NoteInput[],
  occasionType?: string
): Promise<SuggestionOutput[]> {
  const notesText = notes
    .slice(0, 20)
    .map((n, i) => `${i + 1}. [${n.category}] "${n.text}" (noted ${n.created_at})`)
    .join("\n");

  const prompt = `You are a thoughtful gift suggestion assistant for GiftMind. Based on notes that a user has logged about someone they care about, suggest 3-5 specific, purchasable gift ideas.

Person: ${personName}
Relationship: ${relationship}
${occasionType ? `Upcoming occasion: ${occasionType}` : ""}

Notes logged about this person:
${notesText}

For each suggestion, provide:
- title: A specific product or experience name (not generic)
- description: Why this would be perfect for them (1-2 sentences)
- price_range: Estimated price (e.g. "$20-40", "$50-100")
- category: One of: product, book, experience, food, other
- search_query: A specific Amazon search query that would find this item
- rationale: Which note(s) inspired this suggestion (reference what the person mentioned)

Return your response as a JSON array of objects. Only return the JSON array, nothing else.`;

  const client = getClient();
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Failed to parse suggestions");

  return JSON.parse(jsonMatch[0]) as SuggestionOutput[];
}
