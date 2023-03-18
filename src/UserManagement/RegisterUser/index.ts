import { AzureFunction, Context, HttpRequest } from "@azure/functions"
// import * as sql from 'mssql';

// const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
//     context.log('JavaScript HTTP trigger and SQL output binding function processed a request.');
//     context.log(req.body);

//     if (req.body) {
//         context.bindings.userTable = req.body;
//         context.res = {
//             body: req.body,
//             mimetype: "application/json",
//             status: 201
//         }
//     } else {
//         context.res = {
//             status: 400,
//             body: "Error reading request body"
//         }
//     }
// };
// ,
//     {
//         "name": "userTable",
//         "type": "sql",
//         "direction": "out",
//         "commandText": "dbo.users",
//         "connectionStringSetting": "SqlConnectionString"
//     },
//     {
//         "name": "userStats",
//         "type": "sql",
//         "direction": "out",
//         "commandText": "dbo.user_stats",
//         "connectionStringSetting": "SqlConnectionString"
//     }

const sql = require('mssql');

const connectionString = (process.env.SqlConnectionString as string)


async function connectToDatabase(connectionString) {
    try {
        const pool = await sql.connect(connectionString);
        console.log('Successfully connected to the database.');
        return pool;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('JavaScript HTTP trigger and SQL output binding function processed a request.');
    context.log(req.body);
    var resultSet;
    try {
        const poolConnection = await connectToDatabase(connectionString);

        context.log("Insert user");

        resultSet = await poolConnection.request().query(`INSERT INTO dbo.users (first_name, last_name, email) OUTPUT inserted.id  VALUES ('John', 'Doe', 'john.doe@example.com');`);
        context.log(resultSet);

        const userId = resultSet.recordset[0].id;
        context.log(userId);

        var resultSetTwo = await poolConnection.request().query(`INSERT INTO dbo.user_stats (user_id)  VALUES (${userId});`);

        context.log(resultSetTwo);
        // // close connection only when we're certain application is finished
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: resultSet
    };
    //     context.res = {
    //         body: {
    //             version: "1.0.0",
    //             action: "Continue",
    //             userId: result.id
    //         },
    //         mimetype: "application/json",
    //         status: 201
    //     };
    // } else {
    //     context.res = {
    //         status: 400,
    //         body: "Error reading request body"
    //     }
    // }
}





// interface B2CUser {
//   email: string;
//   identities: Identity[];
//   displayName: string;
//   objectId: string;
//   [key: string]: any;
// }

// interface Identity {
//   signInType: string;
//   issuer: string;
//   issuerAssignedId: string;
// }

// const config = {
//   server: '<your_server_name>.database.windows.net',
//   database: 'sqldb-user-dev',
//   user: '<your_username>',
//   password: '<your_password>',
//   options: {
//     encrypt: true
//   }
// };

// const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
//     const user: B2CUser = req.body;

//   try {
//     const pool = await sql.connect(config);

//     const result = await pool.request()
//       .input('email', sql.VarChar(100), user.email)
//       .query('SELECT id FROM users WHERE email = @email');

//     if (result.recordset.length === 0) {
//       const insertResult = await pool.request()
//         .input('first_name', sql.VarChar(50), user.displayName)
//         .input('last_name', sql.VarChar(50), '')
//         .input('email', sql.VarChar(100), user.email)
//         .input('admin', sql.Bit, 0)
//         .query('INSERT INTO users (first_name, last_name, email, admin) VALUES (@first_name, @last_name, @email, @admin)');

//       const userId = insertResult.recordset[0].id;
//       context.log(`User created successfully with ID: ${userId}`);

//       context.res = {
//         status: 200,
//         body: {
//           version: '1.0.0',
//           action: 'Continue',
//           userId: userId
//         }
//       };
//     } else {
//       const userId = result.recordset[0].id;
//       context.log(`User already exists with ID: ${userId}`);

//       context.res = {
//         status: 200,
//         body: {
//           version: '1.0.0',
//           action: 'Continue',
//           userId: userId
//         }
//       };
//     }
//   } catch (err) {
//     context.log.error(`Error creating user: ${err}`);

//     context.res = {
//       status: 500,
//       body: {
//         version: '1.0.0',
//         action: 'End',
//         message: 'Error creating user'
//       }
//     };
//   }
// }

export default httpTrigger;