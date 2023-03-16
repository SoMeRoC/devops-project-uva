import React from "react";
import { withMsal } from "@azure/msal-react";

class LoginButton extends React.Component {
    render() {
        const isAuthenticated = this.props.msalContext.accounts.length > 0;
        const msalInstance = this.props.msalContext.instance;
        if (isAuthenticated) {
            return <button onClick={() => msalInstance.logout()}>Logout</button>    
        } else {
            return <button onClick={() => msalInstance.loginPopup()}>Login</button>
        }
    }
}

export default LoginButton = withMsal(LoginButton);