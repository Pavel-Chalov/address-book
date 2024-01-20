import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Authorization from './components/pages/Authorization/Authorization.jsx';
import Home from './components/pages/Home/Home.jsx';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Authorization />} />

          <Route path="*" element={<h1>Страница не найдена</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
