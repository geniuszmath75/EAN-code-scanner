import './App.css';
import Scanner from './components/Scanner';

function App() {
  return (
      <div className="App">
        <div className='title-container'>
          <h1 className='title'>Scan Barcode</h1>
        </div>
          <Scanner />
      </div>
  );
}

export default App;
