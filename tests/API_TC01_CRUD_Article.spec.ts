import { expect } from "@playwright/test"
import {test} from "../helper/customeFixture"

import data from "../test-data/Article.json"

test("Verify the Article Flow Publish, Edit and Delete From the API usind CRUD methods",async({apiRequest,fileReader})=>{

const username =   fileReader.readData("users", "apiUsername")
const email =   fileReader.readData("users", "apiEmail")
const password =   fileReader.readData("users", "apiPassword")
const baseURL = fileReader.readData("apiData", "baseUrl")
const table = 'articles'
let token:any
let articleId:any


await test.step("User Logged In from API",async()=>{
    token = await apiRequest.loginUser(baseURL, email, password)
    if(token === null){
        token = await apiRequest.signUpUser(baseURL, email, username, password)
    }
})

await test.step("Create a article from API",async()=>{
    if(token !== null){
        articleId = await apiRequest.POSTRequest(table, baseURL, token , data.API_TC01)
    }
})

await test.step("Fetch the article data from API",async()=>{
    
    const getRes = await apiRequest.getRequest(table, baseURL, token, articleId)

    console.log("Article Detail: ", getRes)

})


await test.step("Update the article data from API",async()=>{

         let resBody = await apiRequest.putRequest(table, baseURL, token, articleId, data.API_TC01_PUT)
        
         let response = await resBody.json() 
        if (resBody.status() === 200) {
            console.log(`PUT request for ${table} is success`);
            articleId = response.article.slug
        }

        else if (resBody.status() === 422) {
            console.log(`PUT request for ${table} failed: Duplicate`);
            console.log(response.errors);
        }
        else{
            throw new Error(`Unexpected status: ${resBody.status()}`); 
        }
})

await test.step("Delete the article data from API",async()=>{

    let resBody = await  apiRequest.deleteRequest(table, baseURL, token, articleId)
    expect(resBody.status()).toBe(204)
    console.log(resBody.status())
            
    expect(resBody.statusText()).toBe('No Content')
    console.log(resBody.statusText())
})
    

})