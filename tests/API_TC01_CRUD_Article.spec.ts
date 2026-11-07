import { expect } from "@playwright/test"
import {test} from "../helper/customeFixture"

import data from "../test-data/Article.json"
import { readData, updateUniqueTitle, updateValue } from "../helper/jsonFileHandler"

/**
 * End-to-end API test for the article lifecycle:
 * create, read, update, and delete, using a single authenticated user.
 */
test("Verify the Article Flow Publish, Edit and Delete From the API usind CRUD methods",async({apiRequest,fileReader})=>{

    // Credentials and base URL come from the environment (.env locally, GitHub secrets in CI)
    const username =   fileReader.readData("users", "apiUsername")
    const email =   fileReader.readData("users", "apiEmail")
    const password =   fileReader.readData("users", "apiPassword")
    const baseURL = fileReader.readData("apiData", "baseUrl")
    const table = 'articles'

    //Shared across steps: the token authorizes each request, and articleId
    // identifies the article created in step 2 and used in later steps
    let token:any
    let articleId:any


    await test.step("User Logged In from API",async()=>{
        // Try to log in first. If the user doesn't exist yet, sign them up instead
        token = await apiRequest.loginUser(baseURL, email, password)
        if(token === null){
            token = await apiRequest.signUpUser(baseURL, email, username, password)
        }
        if (!token) {
        throw new Error("Unable to authenticate user")
        }
    })

    await test.step("Create a article from API",async()=>{

        if(token !== null){
            // Give the article a unique title so repeated runs don't hit a duplicate-title error (422).
            // The helper writes the new title to the JSON file
            const uniqueTitle1 =  updateUniqueTitle('API_TC01.article.title',`${Date.now()}`)
            // Re-read the file so the payload uses the title written above, not the value loaded at import
            let latestData = readData()
            articleId = await apiRequest.POSTRequest(table, baseURL, token , latestData.API_TC01)
            expect(articleId).toBeTruthy()
        }
    })


    await test.step("Fetch the article data from API",async()=>{
        // Read the article back to confirm it was saved with the right slug and author
        const getRes = await apiRequest.getRequest(table, baseURL, token, articleId)

        console.log("Article Detail: ", getRes)
        expect(getRes.article.slug).toBe(articleId)
        expect(getRes.article.author.username).toBe(username)

    })


    await test.step("Update the article data from API",async()=>{
        // Give the update a new unique title, then re-read the file to send it
        const uniqueTitle1 =  updateUniqueTitle('API_TC01_PUT.article.title',`${Date.now()}`)
        let latestData = readData()
        let resBody = await apiRequest.putRequest(table, baseURL, token, articleId, latestData.API_TC01_PUT)
        
        // The API returns 200 on success. A 422 means validation failed, usually a duplicate title, so log the errors to help diagnose it
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
        expect(resBody.status()).toBe(200)
        // Confirm the API stored the title that was sent
        expect(response.article.title).toBe(latestData.API_TC01_PUT.article.title)
})

await test.step("Delete the article data from API",async()=>{
    // A successful delete returns 204 No Content, which has no body
    let resBody = await  apiRequest.deleteRequest(table, baseURL, token, articleId)
    expect(resBody.status()).toBe(204)
    console.log(resBody.status())
            
    expect(resBody.statusText()).toBe('No Content')
    console.log(resBody.statusText())
})
    

})