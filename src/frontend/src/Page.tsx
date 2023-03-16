import React, { ReactNode } from 'react';
import { Container } from 'react-bootstrap';

type props = {
  page: ReactNode;
}

class Page extends React.Component<props> {
  render() {
    return (
      <Container>
        {this.props.page}
      </Container>
    );
  }
}

export default Page;
