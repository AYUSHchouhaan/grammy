import React from 'react'

interface GrammarlyIconProps {
  iconPosition: { top: number; left: number }
  onClick: () => void
}

const GrammarlyIcon: React.FC<GrammarlyIconProps> = ({ iconPosition, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick()
  }

  return (
    <div
      className="
        absolute 
        z-[10000] 
        w-8 h-8 
        bg-green-500 
        rounded-full 
        cursor-pointer 
        shadow-md 
        transition-transform 
        duration-200 
        flex items-center justify-center
        hover:scale-110 hover:bg-green-600
        pointer-events-auto
        writing-assistant-container
      "
      style={{ top: iconPosition.top, left: iconPosition.left }}
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className="text-white text-base font-bold">G</span>
    </div>
  )
}

export default GrammarlyIcon
