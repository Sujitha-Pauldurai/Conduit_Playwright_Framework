// Import page object classes used by the test framework.
import {test as base} from "@playwright/test"
import { APIMethods } from "../api/APIHandler"
import { envFileMethods } from "./envFileHandler"
import { JIRAHandler } from "../api/JiraAPIHandler"
import { SignUpPage } from "../pages/SignUpPage"
import { HomePage } from "../pages/HomePage"
import { SignInPage } from "../pages/SignInPage"
import { ArticlePage } from "../pages/ArticlePage"
import { SettingsPage } from "../pages/SettingsPage"

// Define the custom fixture types and their corresponding page objects.
type myFixture={
    
    apiRequest : APIMethods
    fileReader : envFileMethods
    JIRAMethods : JIRAHandler
    signUp : SignUpPage
    home : HomePage
    signIn : SignInPage
    article : ArticlePage 
    settings : SettingsPage

}

// Extend the base Playwright test with reusable custom fixtures.
export const test=base.extend<myFixture>({

    // Create a instance's using the current browser page.
    
    apiRequest:async({request},use)=>{
    let api=new APIMethods(request)
    await use(api)

    },
    fileReader:async({},use) =>{
        let envFile= new envFileMethods()
        await use(envFile)
    },
    JIRAMethods:async({},use) =>{
        let jira= new JIRAHandler()
        await use(jira)
    },
    signUp:async({page},use)=>{
    let signUpcf=new SignUpPage(page)
    await use(signUpcf)
    },
    home:async({page},use)=>{
    let homecf=new HomePage(page)
    await use(homecf)
    },
    signIn:async({page},use)=>{
    let logincf=new SignInPage(page)
    await use(logincf)
    },
    article:async({page},use)=>{
    let articlecf=new ArticlePage(page)
    await use(articlecf)
    },
    settings:async({page},use)=>{
    let settingcf=new SettingsPage(page)
    await use(settingcf)
    }



})