import OpenAI from 'openai'

// Lazy-init so missing keys don't crash on import
let openaiClient = null

const getOpenAI = () => {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openaiClient
}

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT ||
  'You are a helpful, friendly customer support assistant. Answer clearly and concisely.'

const AI_MODEL    = process.env.AI_MODEL    || 'gpt-4o'
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'

// ── OpenAI ────────────────────────────────────────────────
async function chatOpenAI(history) {
  const client = getOpenAI()
  const response = await client.chat.completions.create({
    model: AI_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history
    ],
    max_tokens: 1024,
    temperature: 0.7
  })
  const reply  = response.choices[0].message.content
  const tokens = response.usage?.total_tokens || 0
  return { reply, tokens }
}

// ── Anthropic Claude (native fetch — no SDK needed) ───────
async function chatClaude(history) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model:      process.env.AI_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   history
    })
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Claude API error')
  }

  const data   = await res.json()
  const reply  = data.content[0].text
  const tokens = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
  return { reply, tokens }
}

// ── Main export ────────────────────────────────────────────
export async function getAIReply(history) {
  if (AI_PROVIDER === 'anthropic') return chatClaude(history)
  return chatOpenAI(history)
}
