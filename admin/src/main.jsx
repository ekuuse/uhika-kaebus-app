import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//TAILWINDCSS + CUSTOM
import './index.css';

//JSX FILES TO ROUTE
import Home from './container/Home';

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  </BrowserRouter>
);

