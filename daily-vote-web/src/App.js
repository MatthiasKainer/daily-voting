import React, { Component } from 'react';
import './App.css';
import Question from './questions';
import { hash } from './questions/hash';

class App extends Component {
  render() {
    const body = hash.survey
      ? <Question />
      : <div className="splash-container">
        <div className="splash">
          <h1 className="splash-head">Welcome! Please open your voting directly to continue.</h1>
        </div>
      </div>;
    return (
      <div className="App">

        <div className="header">
          <div className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
            <a className="pure-menu-heading" href="/">Daily Question</a>
          </div>
        </div>

        {body}
      </div>
    );
  }
}

export default App;
