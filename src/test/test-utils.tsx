import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from '../store'
import { AppProvider } from '../context/AppContext'
import { ThemeProvider } from '../context/ThemeContext'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </Provider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Export the testing wrapper component
export const createTestingWrapper = () => AllTheProviders

export * from '@testing-library/react'
export { customRender as render }
