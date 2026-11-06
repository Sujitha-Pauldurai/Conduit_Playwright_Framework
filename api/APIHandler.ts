import { expect, APIRequestContext } from "@playwright/test"
import { log } from "node:console"


export class APIMethods{

    protected request

    constructor(request:APIRequestContext){
        this.request = request
    }

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
        
        let response = await resBody.json()
        if (resBody.status() === 201) {
            console.log('User registered successfully');
            return response.user.token;
        }

        if (resBody.status() === 422) {
            console.log('Registration failed: Duplicate email or username');
            console.log(response.errors);
            return null;
        }

        throw new Error(`Registration failed: ${resBody.status()} - ${JSON.stringify(response)}`);



   }

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

        if (resBody.status() === 404) {
            console.log('Login failed: Invalid email or password');
            console.log(response.errors);
            return null;
        }
        throw new Error(`Unexpected status: ${resBody.status()}`);
   }
   
   
       async POSTRequest(table:string,baseUrl:string,tokenValue:string,data:object){
       
        
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