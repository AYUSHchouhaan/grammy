import { createRoot } from 'react-dom/client'
import ProfessionalWritingAssistant from './content/EnhancedWritingAssistant'


// Create a container for our React app
const createAssistantContainer = () => {
  const container = document.createElement('div')
  container.id = 'enhanced-writing-assistant-root'
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  `
  document.body.appendChild(container)
  
  // Create root and render
  const root = createRoot(container)
  root.render(<ProfessionalWritingAssistant />)
  
  console.log('Enhanced Writing Assistant mounted')
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createAssistantContainer)
} else {
  createAssistantContainer()
}
