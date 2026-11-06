import dotenv from "dotenv"

export class envFileMethods{


    /**
     * Description: Reads and loads environment variables from the specified .env file.
     * @param file - The environment file name without the .env extension.
     * @returns The parsed environment variables as an object.
     */
    readFromFile(file:string){

        //const user = process.env.user || 'users';
       // const appClient = process.env.client || 'appClient';
       
        const result = dotenv.config({path:`test-data/${file}.env`})

        if (result.error) {
            throw result.error;
        }
        return result.parsed
    }

    /**
     * Description: Reads a specific environment variable, loading it from the specified .env file if it is not already available.
     * @param file - The environment file name without the .env extension.
     * @param value - The name of the environment variable to retrieve.
     * @returns The value of the requested environment variable.
     * @throws Error if the file cannot be loaded or the environment variable is missing.
     */
    readData(file:string,value:string){

        if (!process.env[value]) {
            const result = dotenv.config({path: `test-data/${file}.env`});

            if (result.error) throw result.error;
        }

        const data = process.env[value];

        if (!data) {
            throw new Error(`Missing environment variable: ${value}`);
        }

        return data;

    }
}