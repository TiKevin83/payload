import React from 'react'
import { createRoot } from 'react-dom/client'

import Root from './Root'

const container = document.getElementById('app')
if (container) {
  const root = createRoot(container)
  root.render(<Root />)
}

// Needed for Hot Module Replacement
if (
  typeof module !== 'undefined' &&
  module &&
  'hot' in module &&
  module.hot !== null &&
  typeof module.hot === 'object' &&
  'accept' in module.hot &&
  typeof module.hot.accept === 'function'
) {
  module.hot.accept()
}
