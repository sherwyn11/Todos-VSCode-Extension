import * as React from 'react';
import './App.css';
import Sidebar from './Sidebar';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default App;
