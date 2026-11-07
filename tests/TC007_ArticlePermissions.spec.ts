import { BrowserContext, expect, Page } from "@playwright/test"
import {test} from "../helper/customeFixture"
import { ArticlePage } from "../pages/ArticlePage"
import { HomePage } from "../pages/HomePage"
import { SignInPage } from "../pages/SignInPage"

import data from "../test-data/Article.json"
import { updateUniqueTitle } from "../helper/jsonFileHandler"

// Store the article title and slug to share article details across test cases.
let uniqueTitle = data.TC004_new.title
let articleSlug:string

// Execute tests sequentially because the permission tests depend on the article created by User A.
test.describe.serial("Execute the test in serial mode",async()=>{

// Clean up the article created during the test execution.
test.afterAll("Delete the created article",async({apiRequest,fileReader})=>{

    const username =   fileReader.readData("users", "USERNAME1")
    const email =   fileReader.readData("users", "EMAIL1")
    const password =   fileReader.readData("users", "PASSWORD1")
    const baseURL = fileReader.readData("apiData", "baseUrl")
    const table = 'articles'
    let token : any

    await test.step("Login to the API as User A",async()=>{
        token = await apiRequest.loginUser(baseURL, email, password)
        if(token === null){
            const token = await apiRequest.signUpUser(baseURL, email, username, password)
        }
    })

     await test.step("Try to delete the aritcle created from API",async()=>{

        const resBody1 = await  apiRequest.deleteRequest(table, baseURL, token, articleSlug)
        
        expect(resBody1.status()).toBe(204)
        console.log(resBody1.status())
                
        expect(resBody1.statusText()).toBe('No Content')
        console.log(resBody1.statusText())
    })
    

})

 // Verify that User A can create an article and access its edit/delete options.
test("Verify the user A is able to Publish / Edit / Delete the article",async({signIn,home,article,fileReader})=>{

    
    await test.step("Opening App",async()=>{
    await home.loadApplication()})

    await test.step("User logged in",async()=>{
    await home.clickOnSignIn()
    const email =   fileReader.readData("users", "EMAIL1")
    const password =   fileReader.readData("users", "PASSWORD1")
    await signIn.login( email, password)
    })

    await test.step("Create article",async()=>{

    await home.clickOnNewArticle()
    uniqueTitle =  updateUniqueTitle('TC004_new.title',`${Date.now()}`)    
    articleSlug = await article.newArticle(uniqueTitle, data.TC004_new.description, data.TC004_new.body, data.TC004_new.tagList)
    console.log(`The article ${uniqueTitle} is created`,articleSlug);
    
    })

    await test.step("Verify 'Edit & Delete' is enabled for User A",async()=>{
    await article.isURLHave(/\/article\/.+/);
     // Verify that Edit and Delete options are visible to the article owner.
    expect(await article.isEditVisible()).toBeTruthy()

    expect(await article.isDeleteVisible()).toBeTruthy()
     })
})

 // Verify that User B cannot modify or delete User A's article through the UI.
test("Verify the user B is not able to edit / delete the article from UI",async({signIn,home,article,fileReader})=>{

   
    await test.step("Opening App",async()=>{
        await home.loadApplication()})

        await test.step("User logged in",async()=>{
        await home.clickOnSignIn()
        const email =   fileReader.readData("users", "EMAIL2")
        const password =   fileReader.readData("users", "PASSWORD2")
        await signIn.login( email, password)
    })

     await test.step(`Search for the article ${uniqueTitle}`,async()=>{
   const articleNew = await home.searchArticleInGlobalFeed(uniqueTitle)

     if(await articleNew.count() > 0){
        console.log("The Article is present in the Global Feed");
        await expect(articleNew).toHaveCount(1);
        await home.selectArticle(articleNew)
        expect(await article.isEditVisible()).toBeFalsy()
        expect(await article.isDeleteVisible()).toBeFalsy()
         
    }
    else {
        console.log("The Article is not present in the Global Feed.");

    }
    })
    
})

// Verify article ownership restrictions through API requests.
test("Verify the user is not able to edit or delete another user's article from API",async({apiRequest,fileReader})=>{

    const username =   fileReader.readData("users", "apiUsername")
    const email =   fileReader.readData("users", "apiEmail")
    const password =   fileReader.readData("users", "apiPassword")
    const baseURL = fileReader.readData("apiData", "baseUrl")
    const table = 'articles'
    let token : any

    await test.step("Login to the API as User B",async()=>{
        token = await apiRequest.loginUser(baseURL, email, password)
        if(token === null){
            token = await apiRequest.signUpUser(baseURL, email, username, password)
        }
    })

    await test.step("Fetch the aritcle created by another User ",async()=>{
        
        const getRes = await apiRequest.getRequest(table, baseURL, token, articleSlug)
        console.log("Article Detail: ", getRes)
    })

    // Verify that the API returns 403 Forbidden when user attempt to update User A's article using User B's token.
    await test.step("Try to edit the aritcle created by another User  from API",async()=>{

        const resBody = await apiRequest.putRequest(table, baseURL, token, articleSlug, data.API_TC01_PUT)
        let response = await resBody.json()
    
        if (resBody.status() === 403) {
                console.log(`Failed : User don't have permission to PUT request for ${table}`);
                console.log(await response.errors);
            }
            else{ 
                throw new Error(`Unexpected status: ${resBody.status()}`);
            }
        expect(resBody.status()).toBe(403);
    })
    
     // Verify that the API returns 403 Forbidden when user attempt to delete User A's article using User B's token.
    await test.step("Try to delete the aritcle created by another User  from API",async()=>{

    const resBody1 = await  apiRequest.deleteRequest(table, baseURL, token, articleSlug)
    let response = await resBody1.json()
    if (resBody1.status() === 403) {
            console.log(`Failed : User don't have permission to DELETE request for ${table}`);
            console.log(await response.errors);
        }
        else{ 
            throw new Error(`Unexpected status: ${resBody1.status()}`);
        }
    expect(resBody1.status()).toBe(403);
    })

})



})



