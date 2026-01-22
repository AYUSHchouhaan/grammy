import React, { useState, useEffect, useRef } from 'react'
import type { FeatureType, ToneType } from './types'
import { useInputDetection, useAISuggestions, useSuggestionActions } from './hooks/useWritingAssistant'
import GrammarlyIcon from './components/GrammarlyIcon'
import SuggestionPanel from './components/SuggestionPanel'

const ProfessionalWritingAssistant: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFeature, setActiveFeature] = useState<FeatureType>('paraphrasing')
  const [selectedTone, setSelectedTone] = useState<ToneType>('default')
  
  const activeInputRef = useRef<HTMLElement | null>(null)

  const { activeInput, iconPosition, panelPosition } = useInputDetection()
  const { suggestions, isLoading, analyzeText, setSuggestions } = useAISuggestions(
    activeInput, 
    activeFeature, 
    selectedTone
  )
  const { applySuggestion, applyFirstSuggestion } = useSuggestionActions(activeInputRef)
  
  // Update ref when activeInput changes
  useEffect(() => {
    if (activeInput) {
      activeInputRef.current = activeInput;
    }
  }, [activeInput]);

  // Handle icon click
  const handleIconClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const newExpandedState = !isExpanded
    setIsExpanded(newExpandedState)
    
    if (newExpandedState && activeInput) {
      const text = activeInput instanceof HTMLInputElement || activeInput instanceof HTMLTextAreaElement 
        ? activeInput.value 
        : activeInput.textContent || ''
      
      if (text.trim()) {
        analyzeText(text)
      }
    }
  }

  // Handle feature change
  const handleFeatureChange = (feature: FeatureType) => {
    setActiveFeature(feature)
    if (activeInput) {
      const text = activeInput instanceof HTMLInputElement || activeInput instanceof HTMLTextAreaElement 
        ? activeInput.value 
        : activeInput.textContent || ''
      analyzeText(text)
    }
  }

  // Handle tone change
  const handleToneChange = (tone: ToneType) => {
    setSelectedTone(tone)
    if (activeInput) {
      const text = activeInput instanceof HTMLInputElement || activeInput instanceof HTMLTextAreaElement 
        ? activeInput.value 
        : activeInput.textContent || ''
      analyzeText(text)
    }
  }

  // Handle suggestion application
  const handleApplySuggestion = (suggestion: any) => {
    applySuggestion(suggestion);   
  }

  // Handle panel close
  const handleClose = () => {
    setIsExpanded(false)
    setSuggestions([])
  }

  // Auto-open panel when suggestions arrive (if not manually closed)
  // useEffect(() => {
  //   if (suggestions.length > 0 && !isExpanded && activeInput) {
  //     setIsExpanded(true)
  //   }
  // }, [suggestions, activeInput])

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+G to apply first suggestion
      if (e.ctrlKey && e.shiftKey && e.key === 'G' && suggestions.length > 0) {
        e.preventDefault()
        applyFirstSuggestion(suggestions)
        setSuggestions([])
        setIsExpanded(false)
      }

      // Ctrl+Shift+F to toggle suggestion panel
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault()
        setIsExpanded(!isExpanded)
        if (!isExpanded && activeInput) {
          const text = activeInput instanceof HTMLInputElement || activeInput instanceof HTMLTextAreaElement 
            ? activeInput.value 
            : activeInput.textContent || ''
          if (text.trim()) {
            analyzeText(text)
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [applyFirstSuggestion, suggestions, setSuggestions, setIsExpanded, activeInput, analyzeText])

  if (!iconPosition) return null

  return (
    <div className="writing-assistant-container">
      {/* Grammarly Icon */}
      <GrammarlyIcon 
        iconPosition={iconPosition}
        onClick={handleIconClick}
      />

      {/* Suggestion Panel */}
      {isExpanded && (
        <SuggestionPanel
          panelPosition={panelPosition}
          activeFeature={activeFeature}
          selectedTone={selectedTone}
          isLoading={isLoading}
          suggestions={suggestions}
          activeInput={activeInput}
          onFeatureChange={handleFeatureChange}
          onToneChange={handleToneChange}
          onClose={handleClose}
          onApplySuggestion={handleApplySuggestion}
        />
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default ProfessionalWritingAssistant
