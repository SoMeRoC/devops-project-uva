import './app.css';

// import api from './api';
import Page from './page';
import Test from './pages/test';
import Game from './pages/game';
import Home from './pages/home';
import Error from './pages/error';
import Success from './pages/success';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from "@azure/msal-browser";
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

// Used to require authentication on specific Urls
export const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  // Redirect if not authenticated
  // See: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md#msalauthenticationtemplate-component
  const authRequest = {
    scopes: ["openid", "profile"]
  };

  const { error } = useMsalAuthentication(InteractionType.Redirect, authRequest);
  const navigate = useNavigate();

  useEffect(() => {
      if (error) {
        navigate("/error");
      }
  }, [error, navigate]);

  return  (
    <Fragment>
      <AuthenticatedTemplate>
        {children}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <p>Not signed in, attempting to sign you in.</p>
      </UnauthenticatedTemplate>
    </Fragment>
  )
};

function App(props:any) {

  const [sessionId, setSessionId] = useState('');
  const [apiToken, setApiToken] = useState('');

  function openGame(sessionId: string, apiToken: string) {
    setSessionId(sessionId);
    setApiToken(apiToken);
  }

  if (sessionId && apiToken) {
    return (
    <MsalProvider instance={props.instance}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<Game sessionId={sessionId} apiToken={apiToken} />} />
        </Routes>
      </BrowserRouter>

    </MsalProvider>
    )
  }

  return (
    <MsalProvider instance={props.instance}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Page page={<Home openGame={openGame} />} />} />
          <Route path='/test' element={<RequireAuth><Test /></RequireAuth>} />
          <Route path='/error'element={<Page page={<Error />} />} />
          <Route path='/success'element={<Page page={<Success />} />} />
          <Route path='*' element={<Page page={<Error />} />} />
        </Routes>
      </BrowserRouter>
  </MsalProvider>
  );
}

export default App;
