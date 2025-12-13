import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MapPage from "./pages/MapPage";
import InfoPage from "./pages/InfoPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 처음 접속하면 안내 페이지로 */}
        <Route path="/" element={<Navigate to="/info" replace />} />

        {/* 실제 페이지들 */}
        <Route path="/info" element={<InfoPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
