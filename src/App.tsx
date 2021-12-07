import React from 'react';
import logo from "./logo.svg"
import './App.css';
import testing_main from "./testing";

function App() {
    return (
      <div>
          <div className="App">
              <header className="App-header">
                  <button className="button" id="myButton" onClick={testing_main}>
                      Test
                  </button>
                  <div id="myTestText">
                      Hello!
                  </div>
                  <img src={logo} className="App-logo" alt="logo" />
              </header>
          </div>
    </div>
  );
}

export default App;
