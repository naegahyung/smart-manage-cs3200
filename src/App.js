import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import './App.css'
import Login from 'component/Login'
import Home from 'component/Home'
import PropertyDetail from 'component/PropertyDetail'

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/property/:id" component={PropertyDetail} />
      </Router>
    );
  }
}

export default App;
