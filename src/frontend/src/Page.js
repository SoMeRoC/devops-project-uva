import React from 'react';
import { Container } from 'react-bootstrap';

class Page extends React.Component {
  render() {
    return (
      <Container>
        {this.props.page}
      </Container>
    );
  }
}

export default Page;
