import React, { ReactNode } from 'react';
import { Container } from 'react-bootstrap';

type props = {
  page: ReactNode;
}

class Page extends React.Component<props> {
  render() {
    console.log(this.props)
    return (
      <div className="h-100">
        {this.props.page}
      </div>
    );
  }
}

export default Page;
