import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [filename, setFilename] = useState("https://johnearnest.github.io/chip8Archive/roms/danm8ku.ch8");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setFilename(event.target.value);

  const loadFile = () => {
    fetch(filename)
      .then((resp) => resp.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer))
      .then((arr) => alert(arr.byteLength));
  };

  return (
    <div className="App">
      <header className="App-header">
        <input value={filename} onChange={handleChange} />
        <button onClick={loadFile}>Hellow</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
