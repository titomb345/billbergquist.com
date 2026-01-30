import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArcadePage from './pages/ArcadePage';
import { MinesweeperPage } from './games/minesweeper';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'arcade',
        element: <ArcadePage />,
      },
      {
        path: 'arcade/minesweeper',
        element: <MinesweeperPage />,
      },
    ],
  },
]);
