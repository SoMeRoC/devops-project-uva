import { AzureFunction, Context, HttpRequest } from "@azure/functions"

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

interface B2CUser {
  email: string;
  identities: Identity[];
  displayName: string;
  objectId: string;
  [key: string]: any;
}

interface Identity {
  signInType: string;
  issuer: string;
  issuerAssignedId: string;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('JavaScript HTTP trigger and SQL output binding function processed a request.');
    context.log(req.body);
    context.log("----------");
    const user: B2CUser = req.body;
    // context.log(typeof req.body);
    // context.log("User");
    // context.log(user);
    // context.log("xxx");

    try {
        const pool = await connectToDatabase(connectionString);
        // context.log("User2");
        // context.log(user);
        // context.log("yyyyyy");

        const result = await pool.request()
            .input('email', sql.VarChar(100), user.email)
            .query('SELECT id FROM users WHERE email = @email');
        context.log(result);
        context.log("1");
        context.log(user.displayName);
        context.log(user.email);
        context.log(user.objectId);
        context.log("2");

        if (result.recordset.length === 0) {
            const insertResult = await pool.request()
            .input('displayName', sql.VarChar(50), user.displayName)
            .input('email', sql.VarChar(100), user.email)
            .input('userId', sql.VarChar(100), user.objectId)
            .query('INSERT INTO dbo.users (userName, email, userId) VALUES (@displayName, @email, @userId)');

            context.log(`User created successfully with ID: ${user.objectId}`);

            context.res = {
            status: 200,
            body: {
                version: '1.0.0',
                action: 'Continue',
            }
            };
        } else {
            context.log(`User already exists with ID: ${user.objectId}`);

            context.res = {
            status: 200,
            body: {
                version: '1.0.0',
                action: 'Continue',
            }
            };
        }
        } catch (err) {
        context.log.error(`Error creating user: ${err}`);

        context.res = {
            status: 500,
            body: {
            version: '1.0.0',
            action: 'End',
            message: 'Error creating user'
            }
        };
        }
};

export default httpTrigger;