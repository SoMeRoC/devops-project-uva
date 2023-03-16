import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalProvider } from '@azure/msal-react';

import api from './api.js';
import Page from './Page.js';
import Home from './pages/Home.js';
import Error from './pages/Home.js';
import NotFound from './pages/Home.js';

import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

function ErrorComponent({error}) {
  return <p>An Error Occurred: {error}</p>;
}

function LoadingComponent() {
  return <p>Authentication in progress...</p>;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tokenData: api.getApiTokenData(),
    };
    api.setTokenChangeCallback(this.onTokenChange);
  }

  onTokenChange = (tokenData) => {
    this.setState({ tokenData });
  }

  render() {
    // Redirect if not authenticated
    // See: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md#msalauthenticationtemplate-component
    const authRequest = {
      scopes: ["openid", "profile"]
    };

    return (
      <MsalProvider instance={this.props.instance}>
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
    )
  }
}

export default App;
