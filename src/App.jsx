import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import TaskFlow from './components/TaskFlow'
import SearchPage from './pages/SearchPage'
import DepartureListPage from './pages/DepartureListPage'
import ReturnListPage from './pages/ReturnListPage'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <BookingProvider>
      {/* BASE_URL keeps routes working under the GitHub Pages subpath */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        {/* Outside Routes so the task flow helper stays on every screen */}
        <TaskFlow />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/departure" element={<DepartureListPage />} />
          <Route path="/return" element={<ReturnListPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </BookingProvider>
  )
}

export default App
