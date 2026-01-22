

const API_KEY = process.env.VITE_GROQ_API_KEY;
const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

async function testGroqParaphrase() {
  console.log('Testing Groq API with key:', API_KEY.substring(0, 10) + '...');

  const inputText = 'i need to go to store to buy something';
  const prompt = `You are a professional writing assistant. The user typed this text and wants you to fix and improve it.

Text: "${inputText}"

Your task:
- Fix ALL grammar, spelling, and punctuation errors
- Make it sound clear, natural, and fluent
- Improve word choice if needed
- Use proper sentence structure
- Keep the same meaning
- Make it sound like proper English

IMPORTANT: The text likely has errors - you MUST fix them and improve it. Do not return it unchanged.

Give exactly 4 corrected and improved versions, one per line, no numbering.`;

  const body = {
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: 'You are a helpful writing assistant.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 512,
    temperature: 0.7
  };

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error('Groq API error:', response.status, await response.text());
      return;
    }

    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));
    const content = data.choices?.[0]?.message?.content || '';
    const suggestions = content.split(/\n+/).map(s => s.trim()).filter(Boolean);
    console.log('\nParsed suggestions:');
    suggestions.forEach((s, i) => console.log(`${i + 1}. ${s}`));
  } catch (err) {
    console.error('Request failed:', err);
  }
}

testGroqParaphrase();
