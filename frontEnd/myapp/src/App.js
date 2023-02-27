import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';

import './App.css';

import { authCheck } from './store/actions/authActions';

import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Comments from './components/Comments';
import AddComment from './components/AddComment';
import EditComment from './components/EditComment';

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(authCheck());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <div className="App">
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <div className="container">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/" component={Comments} />
          <Route exact path="/comments/new" component={AddComment} />
          <Route exact path="/comments/edit/:id" component={EditComment} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
