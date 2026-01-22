import Groq from 'groq-sdk'
import type { ToneType, Suggestion, FeatureType } from '../types'

const groqApiKey = import.meta.env?.VITE_GROQ_API_KEY
console.log('🔑 GROQ API Key loaded:', groqApiKey ? 'YES (length: ' + groqApiKey.length + ')' : 'NO - MISSING!')

const groqClient = groqApiKey
  ? new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true })
  : null

console.log('🤖 Groq Client initialized:', groqClient ? 'YES' : 'NO')

const ensureGroqClient = () => {
  if (!groqClient) {
    console.error('❌ Groq client unavailable: missing VITE_GROQ_API_KEY environment variable.')
    return null
  }
  return groqClient
}

// Real AI-powered paraphrasing using Groq
export const getAIParaphrase = async (text: string): Promise<string[]> => {
  console.log('🤖 getAIParaphrase called with text:', text.substring(0, 50) + '...')
  console.log('📊 Text length:', text.length)
  
  try {
    const client = ensureGroqClient()
    if (!client) {
      console.log('❌ No Groq client available - returning original text')
      return [text]
    }

    console.log('✅ Groq client available, preparing prompt...')
    const prompt = `You are a professional writing assistant. The user typed this text and wants you to fix and improve it.

Text: "${text}"

Your task:
- Fix ALL grammar, spelling, and punctuation errors
- Make it sound clear, natural, and fluent
- Improve word choice if needed
- Use proper sentence structure
- Keep the same meaning
- Make it sound like proper English

IMPORTANT: The text likely has errors - you MUST fix them and improve it. Do not return it unchanged.

Give exactly 4 corrected and improved versions, one per line, no numbering.`

    console.log('📡 Sending request to Groq API...')
    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 400,
    })

    console.log('✅ Received response from Groq API')
    const result = completion.choices[0]?.message?.content || ""
    console.log('📝 Raw result:', result)
    console.log('📏 Raw result length:', result.length)
    
    // If result is empty, log error
    if (!result || result.length === 0) {
      console.error('❌ ERROR: API returned empty result!')
      console.error('❌ Full completion object:', JSON.stringify(completion, null, 2))
    }
    
    // If result is same as input, something went wrong
    if (result.trim() === text.trim()) {
      console.warn('⚠️ WARNING: AI returned same text as input!')
    }
    
    // Split by newlines and also try to split by numbered patterns (1., 2., etc.)
    let paraphrases = result
      .split(/\n+/)  // Split by one or more newlines
      .map(line => line.trim())
      .map(line => line.replace(/^\d+[\.\)]\s*/, ''))  // Remove numbering like "1. " or "1) "
      .map(line => line.replace(/^[-•*]\s*/, ''))  // Remove bullet points
      .filter(line => line.length > 0)
      .slice(0, 4)

    // If we still don't have 4 paraphrases, try splitting by periods for long single-line responses
    if (paraphrases.length < 4 && result.length > 100) {
      paraphrases = result
        .split(/(?<=[.!?])\s+(?=[A-Z])/)  // Split by sentence boundaries
        .map(line => line.trim())
        .filter(line => line.length > 10)
        .slice(0, 4)
    }

    console.log('✅ Processed paraphrases:', paraphrases.length, 'items')
    console.log('📋 Paraphrases:', paraphrases)
    return paraphrases.length > 0 ? paraphrases : [text]
  } catch (error) {
    console.error('❌ Groq AI Error:', error)
    console.error('❌ Error details:', JSON.stringify(error, null, 2))
    // Fallback: return the text with basic capitalization fix as 4 variations
    const fallback = text.charAt(0).toUpperCase() + text.slice(1)
    return [fallback, fallback, fallback, fallback]
  }
}

// Real AI-powered tone adjustment using Groq
export const getAIToneAdjustment = async (text: string, tone: ToneType): Promise<string[]> => {
  try {
    const client = ensureGroqClient()
    if (!client) {
      return [text]
    }

    const toneDescriptions: Record<ToneType, string> = {
      default: "natural and standard",
      formal: "formal and professional",
      friendly: "friendly and warm",
      professional: "professional and polished",
      casual: "casual and relaxed",
      confident: "confident and direct"
    }

    const prompt = `Fix and improve this text with a ${toneDescriptions[tone]} tone. Make it sound like it was written by someone who knows English well.

Text: "${text}"

Rules:
- Fix all grammar, spelling, and punctuation mistakes
- Use a ${tone} tone
- Make it sound clear, fluent, and well-written
- Use proper sentence structure and standard English
- Keep it natural (not overly fancy)
- Keep the same meaning

Give me 3 improved versions with ${tone} tone that sound educated and fluent.
One per line, no numbering.`

  const completion = await client.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
  model: "llama-3.1-8b-instant",
      temperature: 0.6,
      max_tokens: 300,
    })

    const result = completion.choices[0]?.message?.content || ""
    const variations = result.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.trim())
      .slice(0, 3)

    return variations.length > 0 ? variations : [text]
  } catch (error) {
    console.error('Groq AI Error:', error)
    return [text]
  }
}

// Real AI-powered suggestions using Groq
export const getAISuggestions = async (
  text: string, 
  activeFeature: FeatureType, 
  selectedTone: ToneType
): Promise<Suggestion[]> => {
  console.log('🌐 getAISuggestions called with:', { 
    textLength: text.length, 
    activeFeature, 
    selectedTone 
  })

  if (!text.trim()) {
    console.log('⚠️ Empty text, returning empty array')
    return []
  }
  
  const suggestions: Suggestion[] = []
  
  try {
    if (activeFeature === 'paraphrasing') {
      console.log('📝 Processing paraphrasing feature...')
      // Get AI paraphrases
      const paraphrases = await getAIParaphrase(text)
      console.log('✅ Received paraphrases:', paraphrases)
      
      paraphrases.forEach((paraphrase, index) => {
        suggestions.push({
          id: `ai-paraphrase-${index}`,
          type: 'paraphrasing',
          original: text,
          suggestion: paraphrase,
          explanation: index === 0 ? "AI-Enhanced Professional Version" : `AI Alternative ${index + 1}`,
          confidence: 0.95 - (index * 0.05)
        })
      })
      console.log('📊 Created', suggestions.length, 'paraphrase suggestions')
    }
    
    if (activeFeature === 'tone' && selectedTone !== 'default') {
      console.log('🎭 Processing tone feature with tone:', selectedTone)
      // Get AI tone adjustments
      const toneVariations = await getAIToneAdjustment(text, selectedTone)
      console.log('✅ Received tone variations:', toneVariations)
      
      toneVariations.forEach((variation, index) => {
        suggestions.push({
          id: `ai-tone-${index}`,
          type: 'tone',
          original: text,
          suggestion: variation,
          explanation: `AI ${selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} Tone`,
          confidence: 0.92,
          tone: selectedTone
        })
      })
      console.log('📊 Created', suggestions.length, 'tone suggestions')
    }
    
    console.log('🎉 Returning total suggestions:', suggestions.length)
    return suggestions
  } catch (error) {
    console.error('❌ AI Suggestions Error:', error)
    return []
  }
}
