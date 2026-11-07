import { expect } from "@playwright/test"
import {test} from "../helper/customeFixture"
import { readData, updateUniqueTitle } from "../helper/jsonFileHandler"

import data from "../test-data/Article.json"

test.describe("Delete Article", () => {

       // Credentials and base URL come from the environment (.env locally, GitHub secrets in CI)
        let username:string
        let email:string
        let password:string
        let baseURL:string
        const table = 'articles'

        //Shared across steps: the token authorizes each request, and articleId
        // identifies the article created in step 2 and used in later steps
        let token:any
        let articleId:any
        let latestData:any
        let articleSlug:string

    // Create a prerequisite article through API before the test.
    test.beforeEach(async ({ apiRequest, fileReader }) => {

        username =   fileReader.readData("users", "USERNAME2")
        email =   fileReader.readData("users", "EMAIL2")
        password =   fileReader.readData("users", "PASSWORD2")
        baseURL = fileReader.readData("apiData", "baseUrl")


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
                latestData = readData()
                articleId = await apiRequest.POSTRequest(table, baseURL, token , latestData.API_TC01)
                expect(articleId).toBeTruthy()
            }
        })

    })

    test("Verify the user is able to delete the article",async({signIn,home,article,fileReader})=>{

        let uniqueTitle = latestData.API_TC01.article.title
        await test.step("Opening App",async()=>{
        await home.loadApplication()})

        await test.step("User logged in",async()=>{
        await home.clickOnSignIn()
        const email =   fileReader.readData("users", "EMAIL2")
        const password =   fileReader.readData("users", "PASSWORD2")
        await signIn.login( email, password)
        })

        await test.step(`Search for the article ${uniqueTitle}`,async()=>{
        let articleNew = await home.searchArticleInGlobalFeed(uniqueTitle)
        if(await articleNew.count() > 0){
            console.log("The Article is present in the Global Feed");
            await home.selectArticle(articleNew)
            await article.deleteArticle(uniqueTitle)
            articleNew = await home.searchArticleInGlobalFeed(uniqueTitle)
            await expect(articleNew).toHaveCount(0);
        }
        else {
            console.log("The Article is not present in the Global Feed.");
        /*  await home.clickOnNewArticle()
            const uniqueTitle =  updateValue('TC004_new.title',`${Date.now()}`)
            console.log(uniqueTitle);
            await article.newArticle(uniqueTitle, data.TC004_new.description, data.TC004_new.body, data.TC004_new.tagList)
        */
        }
    })
        

        



    })
})