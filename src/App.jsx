import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext'
import SearchPage from './pages/SearchPage'
import DepartureListPage from './pages/DepartureListPage'
import ReturnListPage from './pages/ReturnListPage'
import CheckoutPage from './pages/CheckoutPage'

function App() {
  return (
    <BookingProvider>
      <BrowserRouter>
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
