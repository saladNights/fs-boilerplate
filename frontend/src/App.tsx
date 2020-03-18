import React, {useEffect, useState} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Header from './Header';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import {setAccessToken} from './accessToken';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      'http://localhost:4000/refresh_token',
      {
        method: 'POST',
        credentials: 'include',
      }
    ).then(
      async (response) => {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Header />
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
