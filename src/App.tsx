import * as React from 'react';
import './App.css';
import Sidebar from './Sidebar';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Hello World!</h1>
          <h3>- Sherwyn D'souza</h3>
          <p>Connected to extension</p>
          <Sidebar></Sidebar>
        </header>
      </div>
    );
  }
}

export default App;
