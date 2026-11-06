import {test} from "../helper/customeFixture"
import { updateValue } from "../helper/jsonFileHandler"

import data from "../test-data/Article.json"

test("Verify the user is able to delete the article",async({signIn,home,article,fileReader})=>{

    let uniqueTitle = data.TC006_title
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
        await article.deleteArticle(data.TC006_title)
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