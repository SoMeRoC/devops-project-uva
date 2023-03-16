import './App.css';

import api from './api';
import Page from './Page';
import Game from './pages/Game';
import Home from './pages/Home';
import Error from './pages/Home';
import NotFound from './pages/Home';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthenticatedTemplate, MsalAuthenticationTemplate, MsalProvider, UnauthenticatedTemplate, useMsal, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from "@azure/msal-browser";
import { Component, Fragment, useEffect } from 'react';


// Used to require authentication on specific Urls
export const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  // Redirect if not authenticated
  // See: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md#msalauthenticationtemplate-component
  const authRequest = {
    scopes: ["openid", "profile"]
  };

  console.log("TEST");
  console.log(process.env.NODE_ENV);
  console.log("TESTSS");

  const { login, result, error } = useMsalAuthentication(InteractionType.Redirect, authRequest);

  useEffect(() => {
      if (error) {
          login(InteractionType.Redirect, authRequest);
      }
  }, [error]);

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
  return (
    <MsalProvider instance={props.instance}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Page page={<Home />} />} />
          <Route path='/game/*' element={<RequireAuth><Game/></RequireAuth>} />
          <Route path='/error'element={<Page page={<Error />} />} />
          <Route path='*' element={<Page page={<NotFound />} />} />
        </Routes>
      </BrowserRouter>
  </MsalProvider>
  );
}

export default App;
