import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { AdminPage } from './Pages/AdminPage';
import { Homepage } from './Pages/Homepage';
import { Login } from './Pages/Login';
import { Profile } from './Pages/Profile';
import './main.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Homepage}></Route>
        <Route path="/login" exact component={Login}></Route>
        <Route path="/profile" exact component={Profile}></Route>
        <Route path="/admin" exact component={AdminPage}></Route>
      </Switch>
    </Router>
  );
}

export default App;
