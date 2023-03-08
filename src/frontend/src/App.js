import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import api from './api.js';

import Page from './Page.js';

import Home from './pages/Home.js';
import Error from './pages/Home.js';
import NotFound from './pages/Home.js';

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
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Page page={<Home />} />} />
          <Route path='/error' element={<Page page={<Error />} />} />
          <Route path='*' element={<Page page={<NotFound />} />} />
        </Routes>
      </BrowserRouter>
    )
  }
}

export default App;
