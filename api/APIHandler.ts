import { expect, APIRequestContext } from "@playwright/test"
import { log } from "node:console"

/**
 * Thin wrapper around Playwright's APIRequestContext for the Conduit-style API.
 * Each method sends one request and returns either the parsed result or the raw response.
 */
export class APIMethods{

    protected request

    constructor(request:APIRequestContext){
        this.request = request
    }

     /**
     * Registers a new user.
     * Returns the auth token on 201, or null on 422 (email or username already taken).
     * Throws error for any other status.
     */
   async signUpUser(baseUrl:string,email:string,username:string,password:string):Promise<string | null>{

     let resBody =await this.request.post(`${baseUrl}/users`,{
                headers:{
                    "Content-Type" : "application/json",
                },
                data:{
                    "user": {
                        "email": email,
                        "username": username,
                        "password": password
                    }

                }
            })
        // Parse the body once so it can be logged on any status
        let response = await resBody.json()
        if (resBody.status() === 201) {
            console.log('User registered successfully');
            return response.user.token;
        }
        // 422 means the user already exists. The caller can then try to log in instead
        if (resBody.status() === 422) {
            console.log('Registration failed: Duplicate email or username');
            console.log(response.errors);
            return null;
        }

        throw new Error(`Registration failed: ${resBody.status()} - ${JSON.stringify(response)}`);
   }

   /**
     * Logs in an existing user.
     * Returns the auth token on 200, or null on 404 (wrong email or password).
     * Throws for any other status.
     */
   async loginUser(baseUrl:string,email:string,password:string):Promise<string | null>{

     let resBody =await this.request.post(`${baseUrl}/users/login`,{
                headers:{
                    "Content-Type" : "application/json",
                },
                data:{
                    "user": {
                        "email": email,
                        "password": password
                    }

                }
            })
        
        let response = await resBody.json()
        if (resBody.status() === 200) {
            console.log('User Logged In successfully');
            return response.user.token;
        }
        // 404 is returned for invalid credentials. The caller decides whether to sign up
        if (resBody.status() === 404) {
            console.log('Login failed: Invalid email or password');
            console.log(response.errors);
            return null;
        }
        throw new Error(`Unexpected status: ${resBody.status()}`);
   }
   
    /**
     * Creates a record in the given table (for example "articles").
     * Returns the slug from the new article on 201, or null on 422 (validation error, such as a duplicate title).
     * Throws error for any other status.
     */
       async POSTRequest(table:string,baseUrl:string,tokenValue:string,data:object){
       
        // trim() removes stray whitespace or newlines that would break the Authorization header
        let resBody =await this.request.post(`${baseUrl}/${table}`,{
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : `Token ${tokenValue.trim()}`
                },
                data:data
            })
        
        let response = await resBody.json()
        if (resBody.status() === 201) {
            console.log(`POST ${table} is success`);
            return response.article.slug
        }

        if (resBody.status() === 422) {
            console.log(`POST ${table} : Duplicate`);
            console.log(response.errors);
            return null;
        }

       throw new Error(`Unexpected status: ${resBody.status()}`); 
    }

    /**
     * Fetches one record by its id or slug.
     * Asserts a 200 OK status and returns the parsed body.
     * The status check is here so every caller gets the same guarantee.
     */
    async getRequest(table:string,baseURL:string,tokenValue:string,articleid:string){

         let resBody =await this.request.get(`${baseURL}/${table}/${articleid}`,{
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : `Token ${tokenValue}`
                }
            })
        
            let response = await resBody.json()
            expect(resBody.status()).toBe(200)
            expect(resBody.statusText()).toBe('OK')
            
        return response

    }


    /**
     * Updates one record.
     * Returns the raw response so the caller can check the status (200, 422, and so on)
     * and read the body. The caller decides how to handle each case.
     */
    async putRequest(table:string,baseURL:string,tokenValue:string,articleid:string,data:object){
         let resBody = await this.request.put(`${baseURL}/${table}/${articleid}`,{
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : `Token ${tokenValue}`
                },
                data:data
            })
           

       return resBody
    }

    /**
     * Deletes one record.
     * Returns the raw response. A successful delete returns 204 No Content with no body,
     * so the caller checks the status rather than parsing JSON.
     */
    async deleteRequest(table:string,baseURL:string,tokenValue:string,articleid:string){
        console.log(`${baseURL}/${table}/${articleid}`);
        
        let resBody = await this.request.delete(`${baseURL}/${table}/${articleid}`,{
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : `Token ${tokenValue}`
                }
            })
           /*  expect(resBody.status()).toBe(204)
            console.log(resBody.status())
        
            expect(resBody.statusText()).toBe('No Content')
            console.log(resBody.statusText()) */

            return resBody
    }

    
    
}