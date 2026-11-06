import { expect, Locator, Page } from "@playwright/test";
import ElementHandler from "../helper/elementHandler";
import { authLocators } from "../locators/authLocators";
import { PWLocators } from "../locators/playwrightLocators"
import { articleLocators } from "../locators/articleLocators"
import { homeLocators } from "../locators/homeLocators";
import {settingsLocators} from "../locators/settingsLocators"



export class HomePage extends ElementHandler{



async clickOnSignUp(){

      await this.click(PWLocators.role,PWLocators.roleTypes.link,authLocators.signUpName)
      const signUpHeading = await this.findElement(PWLocators.role,PWLocators.roleTypes.heading,authLocators.signUpName)
      await expect(signUpHeading).toBeVisible()
}

async clickOnSignIn(){

      await this.click(PWLocators.role,PWLocators.roleTypes.link,authLocators.loginName)
      const signInHeading = await this.findElement(PWLocators.role,PWLocators.roleTypes.heading,authLocators.loginName)
      await expect(signInHeading).toBeVisible()
}

async clickOnNewArticle() {

    await this.click(PWLocators.role,PWLocators.roleTypes.link,articleLocators.newArticleLink)
    const targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.button,articleLocators.publishButtonName)
    await expect(targetElement).toBeVisible()
   
    
}

async clickOnSettings(){

    await this.click(PWLocators.role,PWLocators.roleTypes.link,homeLocators.settingsLink)
    const targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.button,settingsLocators.logoutButton)
    await expect(targetElement).toBeVisible()

}

async clickOnHome(){

    await this.click(PWLocators.role,PWLocators.roleTypes.link,homeLocators.homeLink)
    const targetElement = await this.findElement(homeLocators.homeDiv)
    await expect(targetElement).toBeVisible()
    const globalFeed = await this.findElement(PWLocators.text,homeLocators.globalFeed)
    await expect(globalFeed).toBeVisible()
    await expect(globalFeed).toHaveClass(/active/)
     


}


async clickOnGlobalFeed(){
     await this.click(PWLocators.role,PWLocators.roleTypes.link,homeLocators.globalFeed)
     await expect(await this.findElement(PWLocators.role,PWLocators.roleTypes.link,homeLocators.globalFeed)).toHaveClass(/active/)
     
}

async clickOnYourFeed(){
     await this.click(PWLocators.role,PWLocators.roleTypes.link,homeLocators.yourFeed)
     await expect(await this.findElement(PWLocators.role,PWLocators.roleTypes.link,homeLocators.yourFeed)).toHaveClass(/active/)
     
}

async searchArticleInGlobalFeed(title:string):Promise<Locator>{

    let expectedArticle:any
    const loadingMsg = await this.findElement(PWLocators.text,homeLocators.loadMsg)
    await expect(loadingMsg).toBeHidden()
    const articalList = await this.findElement(homeLocators.articlePreview)
    if(await articalList.count()){

        // console.log(await articalList.allInnerTexts());
        const artical = await this.findElement(homeLocators.articleHeading,undefined,undefined,articalList)
       // console.log(await artical.allInnerTexts());
        
        expectedArticle = this.filterElement(artical, title)
        console.log(await expectedArticle.allInnerTexts());
    }

   

 return expectedArticle

}

async selectArticle(article:Locator){

    await article.click()
    const targetElement = await this.findElement(articleLocators.articlePage)
    await expect(targetElement).toBeVisible()


}



}