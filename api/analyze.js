module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, mediaType, market, timeframe } = req.body;

    const prompt = `You are ChartEdge AI, an expert technical analyst. Analyze this ${market} chart on the ${timeframe} timeframe.

Provide a comprehensive trading analysis in this EXACT JSON format (respond with JSON only, no markdown):
{
  "signal": "LONG" or "SHORT" or "NEUTRAL",
  "confidence": number between 0 and 100,
  "entry": "price or zone description",
  "stopLoss": "price or zone description",
  "takeProfit": "price or zone description",
  "riskReward": "ratio like 1:2.5",
  "patterns": ["pattern1", "pattern2"],
  "indicators": ["indicator observation 1", "indicator observation 2"],
  "summary": "2-3 sentence analysis summary explaining the reasoning behind the signal",
  "keyLevels": "description of key support/resistance levels observed",
  "trend": "UPTREND" or "DOWNTREND" or "SIDEWAYS"
}`;

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageData } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
