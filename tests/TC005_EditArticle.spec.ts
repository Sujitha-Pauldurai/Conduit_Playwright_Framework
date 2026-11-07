import { expect } from "playwright/test"
import {test} from "../helper/customeFixture"
import { readData, updateData, updateUniqueTitle } from "../helper/jsonFileHandler"

import data from "../test-data/Article.json"
test.describe("Edit Article", () => {

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
// Verify that the user can edit an existing article.
    test("Verify the user is able to edit the article",async({signIn,home,article,fileReader})=>{
        // Store the article title and initialize the article-found flag.
        let uniqueTitle = latestData.API_TC01.article.title;
        let count = 0;
        await test.step("Opening App",async()=>{
        await home.loadApplication()})

        await test.step("User logged in",async()=>{
        await home.clickOnSignIn()
        const email =   fileReader.readData("users", "EMAIL2")
        const password =   fileReader.readData("users", "PASSWORD2")
        await signIn.login( email, password)
        })

        // Search for the article in the Global Feed.
        await test.step(`Search for the article ${uniqueTitle}`,async()=>{
        const articleNew = await home.searchArticleInGlobalFeed(uniqueTitle)
        if(await articleNew.count() > 0){
            // Open the existing article and mark it as found.
            console.log("The Article is present in the Global Feed");
            await home.selectArticle(articleNew)
            count = 1
            }
        })

        // Edit the article only when the existing article was found.
        await test.step(`Edit the article ${uniqueTitle}`,async()=>{
            if(count === 1){
            await article.isURLHave(/\/article\/.+/);
            console.log("\n The ariticle need to be updated:",uniqueTitle,"\nUpdate title before unique match : ",data.TC005_update.newTitle);
            
            // Generate a unique title for the article update.
            const uniqueTitle1 =  updateUniqueTitle('TC005_update.newTitle',`${Date.now()}`)
            const latestData = readData()
            console.log("Update title after unique match : ",latestData.TC005_update.newTitle);

            // Update the article using the new title and test data.
            await article.editArticle(uniqueTitle, latestData.TC005_update)
            await expect(await article.returnArticleHeading()).toHaveText(uniqueTitle1)

            // Capture the updated article URL.
            const currentUrl = await article.returnPageURL()

            // Extract the slug from the URL.
            articleSlug = currentUrl.split("/article/")[1]
           
            }
        //updateData("TC005_title", uniqueTitle)
        })

     })

    

    test.afterEach(async ({ apiRequest }) => {

        let resBody = await  apiRequest.deleteRequest(table, baseURL, token, articleSlug)
        expect(resBody.status()).toBe(204)
        console.log(resBody.status())
                
        expect(resBody.statusText()).toBe('No Content')
        console.log(resBody.statusText())
    })
})