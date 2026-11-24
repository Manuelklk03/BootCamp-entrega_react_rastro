import { StrictMode } from 'react'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { CurrentUserProvider } from './features/users/CurrentUserProvider'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </Provider>
  </StrictMode>,
)
