/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel, PublicClientApplication } from "@azure/msal-browser";

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
    names: {
        signUpSignIn: 'B2C_1_gameclient_signupsignin'
    },
    authorities: {
        signUpSignIn: {
            authority: 'https://someroc.b2clogin.com/someroc.onmicrosoft.com/B2C_1_gameclient_signupsignin',
        }
    },
    authorityDomain: 'someroc.b2clogin.com',
};


const appConfig = require("@azure/app-configuration");
const connection_string = process.env.AZURE_APP_CONFIG_CONNECTION_STRING;

async function getRedirectUri() {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    } else {
        const client = new appConfig.AppConfigurationClient(connection_string);

        let retrievedSetting = await client.getConfigurationSetting({
            key: "dev:redirecturi"
        });

      console.log("Retrieved value:", retrievedSetting.value);
      return retrievedSetting.value;
    }
  }

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export async function getMsalConfig() {
    const redirectUri = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : await getRedirectUri();

    return {
        auth: {
            clientId: '58045bc1-1bac-4d5f-bdf8-731e6f6995ad', // This is the ONLY mandatory field that you need to supply.
            authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
            knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
            redirectUri: redirectUri,
            // redirectUri: 'http://localhost:3000', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
            postLogoutRedirectUri: '', // Indicates the page to navigate after logout.
            navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
        },
        cache: {
            cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        },
        system: {
            loggerOptions: {
                loggerCallback: (level:any, message:any, containsPii:any) => {
                    if (containsPii) {
                        return;
                    }
                    switch (level) {
                        case LogLevel.Error:
                            console.error(message);
                            return;
                        case LogLevel.Info:
                            console.info(message);
                            return;
                        case LogLevel.Verbose:
                            console.debug(message);
                            return;
                        case LogLevel.Warning:
                            console.warn(message);
                            return;
                        default:
                            return;
                    }
                },
            },
        },
    }
}

// export const msalConfig = {
//     auth: {
//         clientId: '58045bc1-1bac-4d5f-bdf8-731e6f6995ad', // This is the ONLY mandatory field that you need to supply.
//         authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
//         knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
//         redirectUri: x,
//         // redirectUri: 'http://localhost:3000', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
//         postLogoutRedirectUri: '', // Indicates the page to navigate after logout.
//         navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
//     },
//     cache: {
//         cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
//         storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
//     },
//     system: {
//         loggerOptions: {
//             loggerCallback: (level:any, message:any, containsPii:any) => {
//                 if (containsPii) {
//                     return;
//                 }
//                 switch (level) {
//                     case LogLevel.Error:
//                         console.error(message);
//                         return;
//                     case LogLevel.Info:
//                         console.info(message);
//                         return;
//                     case LogLevel.Verbose:
//                         console.debug(message);
//                         return;
//                     case LogLevel.Warning:
//                         console.warn(message);
//                         return;
//                     default:
//                         return;
//                 }
//             },
//         },
//     },
// };

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
    gamewebapi: {
        endpoint: "http://localhost:5000/",
        scopes: {
            read: ["https://someroc.onmicrosoft.com/game/game.read"],
            write: ["https://someroc.onmicrosoft.com/game/game.write"],
        },
    },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: [...protectedResources.gamewebapi.scopes.read, ...protectedResources.gamewebapi.scopes.write],
};
