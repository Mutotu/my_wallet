import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage"
import Home from "./pages/Home"
import SignInPage from "./pages/SignInPage"
import TransferPage from "./pages/TransferPage"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/signup" element={<SignUpPage />} />
        <Route exact path="/signin" element={<SignInPage />} />
        <Route exact path="/transfer" element={<TransferPage />} />
        <Route
          path='/*'
          element={<Navigate to='/' replace={true} />}
        />
      </Routes>
    </div>
  )
}

export default App
