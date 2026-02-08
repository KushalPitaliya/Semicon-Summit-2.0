import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import PageLoader from './components/PageLoader.jsx'
import './index.css'
import './styles/semiconductor-theme.css'

function Root() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <StrictMode>
      {isLoading && <PageLoader onLoadComplete={() => setIsLoading(false)} />}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />)
