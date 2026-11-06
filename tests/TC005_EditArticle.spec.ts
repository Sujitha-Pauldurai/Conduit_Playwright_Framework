import { expect } from "playwright/test"
import {test} from "../helper/customeFixture"
import { updateValue,readData, updateData } from "../helper/jsonFileHandler"

import data from "../test-data/Article.json"

test("Verify the user is able to edit the article",async({signIn,home,article,fileReader})=>{

    let uniqueTitle = data.TC004_new.title
    let count =0
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
        await home.selectArticle(articleNew)
        count = 1
        }
    else {
        console.log("The Article is not present in the Global Feed.");
         await home.clickOnNewArticle()
        uniqueTitle =  updateValue('TC004_new.title',`${Date.now()}`)
        console.log(uniqueTitle);
        await article.newArticle(uniqueTitle, data.TC004_new.description, data.TC004_new.body, data.TC004_new.tagList)
     }
    })

    await test.step(`Edit the article ${uniqueTitle}`,async()=>{
        if(count === 1){
        await article.isURLHave(/\/article\/.+/);
        console.log("\n The ariticle need to be updated:",uniqueTitle,"\nUpdate title before unique match : ",data.TC005_update.newTitle);
        const uniqueTitle1 =  updateValue('TC005_update.newTitle',`${Date.now()}`)
        const latestData = readData()
        console.log("Update title after unique match : ",latestData.TC005_update.newTitle);
        await article.editArticle(uniqueTitle, latestData.TC005_update)
        }
    //updateData("TC005_title", uniqueTitle)
    })
 })