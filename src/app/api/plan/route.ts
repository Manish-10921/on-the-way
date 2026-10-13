import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const prompt = body.prompt

    const apiKey = process.env.ANTHROPIC_API_KEY
    console.log('API Key exists:', !!apiKey)
    console.log('API Key start:', apiKey?.substring(0, 10))

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    console.log('Anthropic response status:', response.status)
    console.log('Anthropic data:', JSON.stringify(data).substring(0, 200))

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'API error' }, { status: 500 })
    }

    return NextResponse.json({ result: data.content[0].text })
  } catch (err) {
    console.log('Caught error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}