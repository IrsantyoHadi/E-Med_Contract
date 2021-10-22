import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import StartingPage from '../pages/StartingPage';
import RegistrationPage from '../pages/RegistrationPage';
import ListPage from '../pages/ListPage';
import '../public/styles/overview.css';

export default function BasicRoute({ drizzle }) {
  const [loading, setLoading] = useState(true);
  const [drizzleState, setDrizzle] = useState(null);
  useEffect(() => {
    // subscribe to changes in the store
    const unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleS = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleS.drizzleStatus.initialized) {
        setLoading(false);
        setDrizzle(drizzleS);
      }
    });
    return () => {};
  }, []);
  return (
    <>
      {loading && <h1>Loading...</h1>}
      {!loading && drizzleState && (
        <Router>
          <Switch>
            <Route exact path="/">
              <StartingPage drizzle={drizzle} drizzleState={drizzleState} />
            </Route>
            <Route path="/registration">
              <RegistrationPage drizzle={drizzle} drizzleState={drizzleState} />
            </Route>
            <Route path="/list">
              <ListPage drizzle={drizzle} drizzleState={drizzleState} />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
}
