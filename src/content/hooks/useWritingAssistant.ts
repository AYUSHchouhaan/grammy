import { useState, useEffect, useCallback } from 'react';
import type { Position, IconPosition, Suggestion, FeatureType, ToneType } from '../types'
import { getAISuggestions } from '../services/groqService'

// Hook for managing input field detection and positioning
export const useInputDetection = () => {
  const [activeInput, setActiveInput] = useState<HTMLElement | null>(null)
  const [iconPosition, setIconPosition] = useState<IconPosition | null>(null)
  const [panelPosition, setPanelPosition] = useState<Position>({ top: 0, left: 0 })

  // Position the icon above input field (like Grammarly)
  const positionIcon = useCallback((inputElement: HTMLElement) => {
    const rect = inputElement.getBoundingClientRect()
    setIconPosition({
      top: rect.top + window.scrollY - 35, // Above the input box
      left: rect.right + window.scrollX - 30, // Right side like Grammarly
      inputElement
    })
  }, [])

  // Position the panel near input field
  const positionPanel = useCallback((inputElement: HTMLElement) => {
    const rect = inputElement.getBoundingClientRect()
    setPanelPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX
    })
  }, [])

  // Monitor input fields for focus
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement

      if (target instanceof HTMLInputElement || 
          target instanceof HTMLTextAreaElement || 
          target.isContentEditable) {
        
        setActiveInput(target)
        positionIcon(target)
        positionPanel(target)
      }
    }

    const handleFocusOut = (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement
      const target = e.target as HTMLElement
      
      // Check if focus is moving to the assistant (icon or panel)
      const movingToAssistant = relatedTarget?.closest('.writing-assistant-container')
      const fromAssistant = target?.closest('.writing-assistant-container')
      
      // Only hide if focus is truly leaving the input and not going to assistant
      if (!movingToAssistant && !fromAssistant) {
        setTimeout(() => {
          setActiveInput(null)
          setIconPosition(null)
        }, 300)
      }
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)

    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
    }
  }, [positionIcon, positionPanel])

  return {
    activeInput,
    iconPosition,
    panelPosition,
    setActiveInput,
    setIconPosition
  }
}

// Hook for managing AI suggestions
export const useAISuggestions = (
  activeInput: HTMLElement | null,
  activeFeature: FeatureType,
  selectedTone: ToneType
) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [typingTimer, setTypingTimer] = useState<NodeJS.Timeout | null>(null)

  // Handle text analysis with real AI
  const analyzeText = useCallback(async (text: string) => {
    if (!text.trim()) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    
    try {
      const newSuggestions = await getAISuggestions(text, activeFeature, selectedTone)
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Error analyzing text:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [activeFeature, selectedTone])

  // Monitor text changes with debounce (3-4 seconds as requested)
  useEffect(() => {
    if (!activeInput) return

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement
      const text = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement 
        ? target.value 
        : target.textContent || ''
      
      // Clear existing timer
      if (typingTimer) {
        clearTimeout(typingTimer)
      }

      // Set new timer for 3-4 seconds as requested
      const newTimer = setTimeout(() => {
        analyzeText(text)
      }, 4000) // 2 seconds
      
      setTypingTimer(newTimer)
    }

    activeInput.addEventListener('input', handleInput)

    return () => {
      activeInput.removeEventListener('input', handleInput)
      if (typingTimer) {
        clearTimeout(typingTimer)
      }
    }
  }, [activeInput, analyzeText])

  return {
    suggestions,
    isLoading,
    analyzeText,
    setSuggestions
  }
}

// Hook for applying suggestions
export const useSuggestionActions = (activeInputRef: React.RefObject<HTMLElement | null>) => {
  // Apply suggestion to the active input
  const applySuggestion = useCallback((suggestion: Suggestion) => {
    const activeInput = activeInputRef.current;
    
    if (!activeInput) {
      console.error('No active input found');
      return;
    }
    
    const newValue = suggestion.suggestion;
    
    // Simple logic: Just set the value and trigger input event
    if (activeInput instanceof HTMLInputElement || activeInput instanceof HTMLTextAreaElement) {
      activeInput.value = newValue;
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.focus();
    } else if (activeInput.isContentEditable) {
      activeInput.textContent = newValue;
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.focus();
    }
  }, [activeInputRef])

  // Apply first suggestion with keyboard shortcut
  const applyFirstSuggestion = useCallback((suggestions: Suggestion[]) => {
    if (suggestions.length > 0) {
      applySuggestion(suggestions[0])
    }
  }, [applySuggestion])

  return {
    applySuggestion,
    applyFirstSuggestion
  }
}
