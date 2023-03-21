import React from "react";

import "./full-page-background.scss"

class Error extends React.Component {

    render(): any {
        return (
            <div className="full-background d-flex flex-column min-vh-100 justify-content-center align-items-center">
                <h1>Error</h1>
                <h2>Something went wrong</h2>
                <a href="/" className="btn btn-light">Back to home</a>
            </div>
        )
    }
}
export default Error