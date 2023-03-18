import React from "react";

import "./full-page-background.scss"

class Success extends React.Component {

    render(): any {
        return (
            <div className="full-background d-flex flex-column min-vh-100 justify-content-center align-items-center">
                <h1>Login success</h1>
                <h2>Redirecting now...</h2>
                <a href="/" className="btn btn-light">Back to home</a>
            </div>
        )
    }
}
export default Success