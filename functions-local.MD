# How to run functions locally

[Full tutorial](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code?tabs=csharp)

Steps without Azure account:

- Install [VSCode extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
- Go to new extension, add function, go through wizard to add an HTTP triggered function
- Run the project to run the function locally, URL will be show in terminal

With Azure account:

- Remind Jorrit to invite you guys to his subscription, this will get you an Azure account.
- Through the same VSCODE wizard you can deploy the function and test it (this is only for DEV purposes, later this will be done through pipelines)

- Not necessary for this, but useful to install [AZ-CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)