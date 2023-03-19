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
  givenName: string;
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
    const user: B2CUser = req.body;
    context.log(user);
    try {
        const pool = await connectToDatabase(connectionString);

        const result = await pool.request()
            .input('email', sql.VarChar(100), user.email)
            .query('SELECT id FROM users WHERE email = @email');
        context.log(result);
        context.log("1");

        if (result.recordset.length === 0) {
            const insertResult = await pool.request()
            .input('first_name', sql.VarChar(50), user.givenName)
            .input('last_name', sql.VarChar(50), user.surname)
            .input('email', sql.VarChar(100), user.email)
            .query('INSERT INTO dbo.users (first_name, last_name, email) OUTPUT inserted.id VALUES (@first_name, @last_name, @email)');

            const userId = insertResult.recordset[0].id;
            context.log(`User created successfully with ID: ${userId}`);

            const insertResultStats = await pool.request()
            .input('user_id', sql.Int(), userId)
            .query('INSERT INTO dbo.user_stats (user_id)  VALUES (@user_id)');

            // context.log(insertResultStats);

            context.res = {
            status: 200,
            body: {
                version: '1.0.0',
                action: 'Continue',
                userId: userId
            }
            };
        } else {
            const userId = result.recordset[0].id;
            context.log(`User already exists with ID: ${userId}`);

            context.res = {
            status: 200,
            body: {
                version: '1.0.0',
                action: 'Continue',
                userId: userId
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
}

export default httpTrigger;
