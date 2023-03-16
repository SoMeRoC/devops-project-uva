import './App.css';

import api from './api';
import Page from './Page';
import Home from './pages/Home';
import Error from './pages/Home';
import NotFound from './pages/Home';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from '@azure/msal-react';
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

function ErrorComponent(error:any) {
  return <p>An Error Occurred: {error}</p>;
}

function LoadingComponent() {
  return <p>Authentication in progress...</p>;
}

function App(props:any) {
  console.log(props);
  // Redirect if not authenticated
  // See: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md#msalauthenticationtemplate-component
  const authRequest = {
    scopes: ["openid", "profile"]
  };

  return (
    <MsalProvider instance={props.instance}>
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
      errorComponent={ErrorComponent}
      loadingComponent={LoadingComponent}
      >
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Page page={<Home />} />} />
          <Route path='/error' element={<Page page={<Error />} />} />
          <Route path='*' element={<Page page={<NotFound />} />} />
        </Routes>
      </BrowserRouter>
    </MsalAuthenticationTemplate>
  </MsalProvider>
  );
}

export default App;
