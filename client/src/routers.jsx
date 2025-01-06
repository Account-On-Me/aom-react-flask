import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './views/HomePage';
import { PeoplePage } from './views/PeoplePage';
import { TopAppBarContainer } from './components/AppBar';
import { CreatePage } from './views/CreatePage';
import { OrderProvider } from './contexts/orderContext';


export const RouterProvider = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopAppBarContainer />}>
          <Route index element={<HomePage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="create" element={<CreatePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
};