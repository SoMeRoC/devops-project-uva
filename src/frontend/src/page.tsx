import React, { ReactNode } from 'react';

type props = {
  page: ReactNode;
}

class Page extends React.Component<props> {
  render() {
    return (
      <div className="h-100">
        {this.props.page}
      </div>
    );
  }
}

export default Page;
