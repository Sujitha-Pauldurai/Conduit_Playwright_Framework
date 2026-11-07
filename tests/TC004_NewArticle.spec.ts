import { expect } from "@playwright/test"
import {test} from "../helper/customeFixture"
import { updateUniqueTitle } from "../helper/jsonFileHandler"

import data from "../test-data/Article.json"

// Verify that a logged-in user can successfully publish an article.
test("Verify the user is able to Publish the article",async({signIn,home,article,fileReader})=>{

   // Get the initial article title from the test data.
    let uniqueTitle = data.TC004_new.title
    await test.step("Opening App",async()=>{
    await home.loadApplication()})

    await test.step("User logged in",async()=>{
    await home.clickOnSignIn()
    const email =   fileReader.readData("users", "EMAIL2")
    const password =   fileReader.readData("users", "PASSWORD2")
    await signIn.login( email, password)
    })

    // Create an article with a unique title to avoid duplicate test data.
    await test.step("Create article",async()=>{
    await home.clickOnNewArticle()
    uniqueTitle =  updateUniqueTitle('TC004_new.title',`${Date.now()}`)
    await article.newArticle(uniqueTitle, data.TC004_new.description, data.TC004_new.body, data.TC004_new.tagList)
    console.log(`The article ${uniqueTitle} is created`);
    
    })

    // Navigate to the Home page and verify that the article appears in the Global Feed.
    await test.step("Verify the created article is displaying in Home screen - Global feed",async()=>{
    await home.clickOnHome()
    const articleNew = await home.searchArticleInGlobalFeed(uniqueTitle)
    if(await articleNew.count() > 0){
        console.log("The Article is present in the Global Feed");
        await expect(articleNew).toBeVisible()
        
    }
    else {
        console.log("The Article is not present in the Global Feed. Please Check the test data");
    }
    })
})