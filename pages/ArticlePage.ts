import { expect } from "@playwright/test";
import ElementHandler from "../helper/elementHandler";
import { PWLocators } from "../locators/playwrightLocators"
import { articleLocators } from "../locators/articleLocators"
import { homeLocators } from "../locators/homeLocators";
import { updateValue } from "../helper/jsonFileHandler";



export class ArticlePage extends ElementHandler{


    async newArticle(title:string,description:string,body:string,tags:string[]){

        
        await this.enterText(PWLocators.role, title,PWLocators.roleTypes.textbox,articleLocators.titleName)
        await this.enterText(PWLocators.role, description,PWLocators.roleTypes.textbox,articleLocators.descriptionName)
        await this.enterText(PWLocators.role, body,PWLocators.roleTypes.textbox,articleLocators.bodyName)
        for(const tag of tags){
            await this.enterText(PWLocators.role, tag ,PWLocators.roleTypes.textbox,articleLocators.tagsName)
            await this.pressEnter()
        }

        // Start listening before clicking Publish so the response isn't missed
        const responsePromise = this.page.waitForResponse(res =>
            res.url().includes('/api/articles') &&
            res.request().method() === 'POST'
        );

        await this.click(PWLocators.role,PWLocators.roleTypes.button,articleLocators.publishButtonName)

        const response = await responsePromise;
        expect(response.status()).toBe(201);

        const resbody = await response.json();
                
        const slug = resbody.article.slug;
        
        const targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.heading,title )
        await expect(targetElement).toBeVisible()

        return slug

        
    }

    async editArticle(oldTitle:string,data:{newTitle?:string;description?:string;body?:string;addTags?:string[];removeTags?:string[]}){


        let targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.heading,oldTitle)
        await expect(targetElement).toBeVisible()
               
        const editArticle = await this.findElement(PWLocators.role,PWLocators.roleTypes.link,articleLocators.editArticle)
        await editArticle.first().click()
        await expect(await this.findElement(PWLocators.role,PWLocators.roleTypes.textbox,articleLocators.titleName)).toHaveValue(oldTitle)
        if(data.newTitle !== undefined){
            await this.enterText(PWLocators.role, data.newTitle,PWLocators.roleTypes.textbox,articleLocators.titleName)
        }
        if(data.description !== undefined)
            await this.enterText(PWLocators.role, data.description,PWLocators.roleTypes.textbox,articleLocators.descriptionName)
        if(data.body !== undefined)
            await this.enterText(PWLocators.role, data.body,PWLocators.roleTypes.textbox,articleLocators.bodyName)
        if(data.addTags?.length){
            for(const tag of data.addTags){
                await this.enterText(PWLocators.role, tag ,PWLocators.roleTypes.textbox,articleLocators.tagsName)
                await this.pressEnter()
            }
        }
        if(data.removeTags?.length){
            for(const tag of data.removeTags){
                await this.click(articleLocators.removeTag(tag))
            }
            
        }
        await this.click(PWLocators.role,PWLocators.roleTypes.button,articleLocators.publishButtonName)

        targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.heading,data.newTitle)
        await expect(targetElement).toBeVisible()

    
      
    }

    async deleteArticle(oldTitle:string){
        let targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.heading,oldTitle)
        await expect(targetElement).toBeVisible()

        const editArticle = await this.findElement(PWLocators.role,PWLocators.roleTypes.button,articleLocators.deleteArticle)
        await editArticle.first().click()

        targetElement = await this.findElement(homeLocators.homeDiv)
        await expect(targetElement).toBeVisible()

    }

    async isEditVisible(){
        await expect(this.page).toHaveURL(/\/article\/.+/);
        const editButton = (await this.findElement(PWLocators.role,PWLocators.roleTypes.link,articleLocators.editArticle))
        
        return this.areAllVisible(editButton)

    }

    async isDeleteVisible(){
        await expect(this.page).toHaveURL(/\/article\/.+/);
        const deleteButton = await this.findElement(PWLocators.role,PWLocators.roleTypes.button,articleLocators.deleteArticle)
        return this.areAllVisible(deleteButton)

    }


    

    

}

    



