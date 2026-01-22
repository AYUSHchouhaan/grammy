export type FeatureType = 'paraphrasing' | 'tone'
export type ToneType = 'default' | 'formal' | 'friendly' | 'professional' | 'casual' | 'confident'

export interface Suggestion {
  id: string
  type: FeatureType
  original: string
  suggestion: string
  explanation: string
  confidence: number
  tone?: ToneType
}

export interface Position {
  top: number
  left: number
}

export interface IconPosition {
  top: number
  left: number
  inputElement: HTMLElement
}
