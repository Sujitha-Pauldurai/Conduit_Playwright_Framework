import { expect } from "@playwright/test"
import {test} from "../helper/customeFixture"
import { readData, updateUniqueTitle } from "../helper/jsonFileHandler"

import data from "../test-data/Article.json"

/**
 * End-to-end UI test for the article lifecycle: create, edit, and delete an article
 * as a signed-in user.
 */
test("Verify the Article Flow Publish, Edit and Delete",async({signIn,home,article,fileReader})=>{

    // Holds the title currently used for the article. It starts from the JSON value
    // and is replaced with the unique title once the article is created
    let uniqueTitle = data.TC003_new.title

    // Latest copy of the JSON file, re-read after each update so the test uses the current values
    let latestData: any
    await test.step("Opening App",async()=>{
    await home.loadApplication()})

    await test.step("User logged in",async()=>{
    await home.clickOnSignIn()

    // Credentials come from the environment (.env locally, GitHub secrets in CI)
    const email =   fileReader.readData("users", "EMAIL2")
    const password =   fileReader.readData("users", "PASSWORD2")
    await signIn.login( email, password)
    })

    await test.step("Create article",async()=>{
    await home.clickOnNewArticle()

    // Add a timestamp to the title so repeated runs don't create duplicate titles.
    // The helper writes the new title to the JSON file and returns it
    uniqueTitle =  updateUniqueTitle('TC003_new.title',`${Date.now()}`)
    await article.newArticle(uniqueTitle, data.TC003_new.description, data.TC003_new.body, data.TC003_new.tagList)
    console.log(`The article ${uniqueTitle} is created`);
    
    })

    await test.step("Edit the article",async()=>{
        // Confirm the app navigated to the article page before editing
        await article.isURLHave(/\/article\/.+/);
        console.log("\n The ariticle need to be updated:",uniqueTitle,"\nUpdate title before unique match : ",data.TC003_update.newTitle);
        
        // Give the new title a unique suffix. The return value is not used here,
        // because the value is read back from the file below
        const uniqueTitle1 =  updateUniqueTitle('TC003_update.newTitle',`${Date.now()}`)

        // Re-read the file so the edit uses the title written above, not the value loaded at import
        latestData = readData()
        console.log("Update title after unique match : ",latestData.TC003_update.newTitle);

        // Edit using the current title, and apply the update values from the file
        await article.editArticle(uniqueTitle, latestData.TC003_update)

        await expect(await article.returnArticleHeading()).toHaveText(uniqueTitle1)
    })

    await test.step("Delete the article",async()=>{
        // Confirm the app is on the article page before deleting
        await article.isURLHave(/\/article\/.+/);

        // The article now has its edited title, so delete it by that title
        await article.deleteArticle(latestData.TC003_update.newTitle)

        // Look for the deleted article in the Global Feed.
        // Note: this call doesn't check the result, so the step passes even if the article is still listed
        const articleFound = await home.searchArticleInGlobalFeed(latestData.TC003_update.newTitle)
        await expect(articleFound).toHaveCount(0);
    })



})