import React, { useState } from 'react'
import type { Position, FeatureType, ToneType, Suggestion } from '../types'

interface SuggestionPanelProps {
    panelPosition: Position
    activeFeature: FeatureType
    selectedTone: ToneType
    isLoading: boolean
    suggestions: Suggestion[]
    activeInput: HTMLElement | null
    onFeatureChange: (feature: FeatureType) => void
    onToneChange: (tone: ToneType) => void
    onClose: () => void
    onApplySuggestion: (suggestion: Suggestion) => void
    
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({
    panelPosition,
    activeFeature,
    selectedTone,
    isLoading,
    suggestions,
    activeInput,
    onFeatureChange,
    onToneChange,
    onClose,
    onApplySuggestion
}) => {
    const [position, setPosition] = useState({ top: panelPosition.top, left: panelPosition.left })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - position.left,
            y: e.clientY - position.top
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                top: e.clientY - dragOffset.y,
                left: e.clientX - dragOffset.x
            });
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDocumentMouseUp = () => {
        setIsDragging(false);
    };

    const handleHeaderClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleDocumentMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleDocumentMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleDocumentMouseUp);
        };
    }, [isDragging, dragOffset]);

    return (
        <div
            className="absolute w-96 max-h-[500px] bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col font-sans text-sm leading-relaxed text-black pointer-events-auto box-border"
            style={{ 
                top: `${position.top}px`, 
                left: `${position.left}px`,
                zIndex: 2147483647,
            }}
        >

            {/* Header with toggleable options and shortcut */}
            <div 
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onClick={handleHeaderClick}
                className={`flex items-center justify-between p-3 border-b border-gray-100 flex-shrink-0 box-border m-0 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
                <div className="flex gap-2 flex-1 box-border m-0">
                    <button
                        onClick={() => onFeatureChange('paraphrasing')}
                        onMouseDown={(e) => e.stopPropagation()}
                        className={`flex items-center px-3 py-2 rounded-md text-xs font-medium cursor-pointer font-inherit box-border m-0 w-auto ${
                            activeFeature === 'paraphrasing' 
                                ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-600' 
                                : 'border border-gray-300 bg-white text-gray-600'
                        }`}
                    >
                        📝 Suggestions
                    </button>

                    <button
                        onClick={() => onFeatureChange('tone')}
                        onMouseDown={(e) => e.stopPropagation()}
                        className={`flex items-center px-3 py-2 rounded-md text-xs font-medium cursor-pointer font-inherit box-border m-0 w-auto ${
                            activeFeature === 'tone' 
                                ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-600' 
                                : 'border border-gray-300 bg-white text-gray-600'
                        }`}
                    >
                        🎭 Tone Menu    
                    </button>
                </div>

                {/* Shortcut hint and Close button */}
                <div className="flex items-center gap-2 box-border m-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap m-0">⚡ Ctrl+Shift+G</span>
                    <button
                        onClick={onClose}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="text-2xl text-gray-600 bg-transparent border-none cursor-pointer p-1 leading-none box-border m-0 w-auto"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Tone Changing Menu */}
            {activeFeature === 'tone' && (
                <div className="flex flex-col p-3 overflow-y-auto box-border m-0">
                    <div className="text-sm text-gray-800 font-medium mb-3 box-border">
                        🎭 Change Tone
                    </div>

                    <div className="flex flex-col gap-2 box-border m-0">
                        {['default', 'friendly', 'formal', 'professional', 'casual', 'confident'].map((tone) => (
                            <button
                                key={tone}
                                onClick={() => onToneChange(tone as  ToneType)}
                                onMouseDown={(e) => e.stopPropagation()}
                                className={`flex items-center p-2 rounded-md text-xs font-medium cursor-pointer text-left capitalize font-inherit box-border m-0 w-full ${
                                    selectedTone === tone
                                        ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-600'
                                        : 'border border-gray-200 bg-gray-50 text-gray-800'
                                }`}
                            >
                                {tone === 'default' ? '📝 Default' :
                                    tone === 'friendly' ? '😊 Friendly' :
                                        tone === 'formal' ? '👔 Formal' :
                                            tone === 'professional' ? '💼 Professional' :
                                                tone === 'casual' ? '😎 Casual' : '💪 Confident'}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestion Box */}
            {activeFeature === 'paraphrasing' && (
                <div className="flex flex-col overflow-y-auto box-border m-0">
                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm p-6 box-border m-0">
                            <div className="w-4 h-4 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin box-border" />
                            <span className="text-gray-600 m-0">Getting AI suggestions...</span>
                        </div>
                    )}

                    {/* Suggestions - Clean and Compact */}
                    {!isLoading && suggestions.length > 0 && (
                        <div className="flex flex-col p-3 gap-2 box-border m-0">
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onApplySuggestion(suggestion);
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    className="p-3 border border-gray-200 rounded-lg cursor-pointer bg-white transition-all duration-200 box-border m-0 w-full hover:bg-emerald-50 hover:border-emerald-500"
                                >
                                    <div className="text-gray-800 text-sm leading-relaxed m-0 box-border">
                                        {suggestion.suggestion}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* No suggestions state */}
                    {!isLoading && suggestions.length === 0 && activeInput && (
                        <div className="flex flex-col items-center justify-center text-gray-600 text-sm p-6 text-center box-border m-0">
                            <div className="text-2xl text-emerald-500 mb-2">✅</div>
                            <div className="text-gray-600 text-sm font-medium m-0">Your text looks great!</div>
                            <div className="text-gray-500 text-xs mt-1">
                                Type something to get AI suggestions
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SuggestionPanel
