import { Link } from 'react-router-dom';

function App() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Hello World</h1>
      <p>Welcome to billbergquist.com</p>
      <nav style={{ marginTop: '40px' }}>
        <Link to="/minesweeper">Play Minesweeper</Link>
      </nav>
    </div>
  );
}

export default App;
