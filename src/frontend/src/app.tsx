import './app.css';

// import api from './api';
import Page from './page';
import Game from './pages/game';
import Home from './pages/home';
import Error from './pages/error';
import Success from './pages/success';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate, useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from "@azure/msal-browser";
import { Fragment, useEffect } from 'react';
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
  return (
    <MsalProvider instance={props.instance}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Page page={<Home />} />} />
          <Route path='/game/*' element={<RequireAuth><Game /></RequireAuth>} />
          <Route path='/error'element={<Page page={<Error />} />} />
          <Route path='/success'element={<Page page={<Success />} />} />
          <Route path='*' element={<Page page={<Error />} />} />
        </Routes>
      </BrowserRouter>
  </MsalProvider>
  );
}

export default App;
