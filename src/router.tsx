import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import MinesweeperPage from './pages/MinesweeperPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/minesweeper',
    element: <MinesweeperPage />,
  },
]);
