import './App.css';
import { useState } from 'react';
const App = () => {
  const [count, setCount] = useState(1);
  const name = 'Zahraa';

  return (
    <div className="App">
      <button onClick={() => alert('What did I say 😤')}> Never Click me !! </button>
      <h1>Hello, {name}!!</h1>
      <h1>{count}</h1>
      <button onClick={() => setCount((prevCount) => prevCount + 1 )}> Click Me for Extra Marks + </button>

    </div>
  );
}
  
export default App;
