import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from '../context/AppContext'
import { ThemeProvider } from '../context/ThemeContext'

// Custom render function that includes providers (without Redux)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
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
