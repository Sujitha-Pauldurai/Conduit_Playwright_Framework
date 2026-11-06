import {test} from "../helper/customeFixture"
import { readData, updateValue } from "../helper/jsonFileHandler"

import data from "../test-data/Article.json"

test("Verify the Article Flow Publish, Edit and Delete",async({signIn,home,article,fileReader})=>{

    let uniqueTitle = data.TC003_new.title
    let latestData: any
    await test.step("Opening App",async()=>{
    await home.loadApplication()})

    await test.step("User logged in",async()=>{
    await home.clickOnSignIn()
    const email =   fileReader.readData("users", "EMAIL2")
    const password =   fileReader.readData("users", "PASSWORD2")
    await signIn.login( email, password)
    })

    await test.step("Create article",async()=>{
    await home.clickOnNewArticle()
    uniqueTitle =  updateValue('TC003_new.title',`${Date.now()}`)
    await article.newArticle(uniqueTitle, data.TC003_new.description, data.TC003_new.body, data.TC003_new.tagList)
    console.log(`The article ${uniqueTitle} is created`);
    
    })

    await test.step("Edit the article",async()=>{
        await article.isURLHave(/\/article\/.+/);
        console.log("\n The ariticle need to be updated:",uniqueTitle,"\nUpdate title before unique match : ",data.TC003_update.newTitle);
        const uniqueTitle1 =  updateValue('TC003_update.newTitle',`${Date.now()}`)
        latestData = readData()
        console.log("Update title after unique match : ",latestData.TC003_update.newTitle);
        await article.editArticle(uniqueTitle, latestData.TC003_update)
    })

    await test.step("Delete the article",async()=>{
        await article.isURLHave(/\/article\/.+/);
        await article.deleteArticle(latestData.TC003_update.newTitle)
        await home.searchArticleInGlobalFeed(latestData.TC003_update.newTitle)
    })



})