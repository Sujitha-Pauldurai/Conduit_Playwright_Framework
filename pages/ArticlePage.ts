import { expect } from "@playwright/test";
import ElementHandler from "../helper/elementHandler";
import { PWLocators } from "../locators/playwrightLocators"
import { articleLocators } from "../locators/articleLocators"
import { homeLocators } from "../locators/homeLocators";



/** Page object for creating, editing, and deleting articles, and checking which actions are visible. */
export class ArticlePage extends ElementHandler{

     /**
     * Fills in the new article form, publishes it, and returns the article's slug.
     *
     * @param title - The article title to enter.
     * @param description - The short description to enter.
     * @param body - The article body text to enter.
     * @param tags - Tags to add. Each tag is entered and confirmed with Enter.
     * @returns The slug of the created article, used in its URL and for API calls.
     */
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

    /**
     * Opens an existing article, applies the provided changes, and publishes.
     *
     * @param oldTitle - The current title of the article, used to find it and check the editor.
     * @param data - The changes to apply. Omit a field to leave it unchanged. Fields: newTitle, description, body, addTags, removeTags.
     * @returns Resolves once the updated article's title is visible on the page.
     */
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


    /**
     * Opens an article by its title and deletes it, then waits for the home page.
     *
     * @param oldTitle - The title of the article to delete.
     *  Resolves once the home page is visible.
     */
    async deleteArticle(oldTitle:string){
        let targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.heading,oldTitle)
        await expect(targetElement).toBeVisible()

        const responsePromise = this.page.waitForResponse(res =>
            res.url().includes('/api/articles') &&
            res.request().method() === 'DELETE'
        );

        const deleteArticle = await this.findElement(PWLocators.role,PWLocators.roleTypes.button,articleLocators.deleteArticle)
        await deleteArticle.first().click()

        const response = await responsePromise;
        expect(response.status()).toBe(204);
      

        targetElement = await this.findElement(homeLocators.homeDiv)
        await expect(targetElement).toBeVisible()

    }

    /**
     * Checks whether the Edit control is visible on the current article page.
     *
     * @returns Whether the Edit link is visible.
     */
    async isEditVisible(){
        await expect(this.page).toHaveURL(/\/article\/.+/);
        const editButton = (await this.findElement(PWLocators.role,PWLocators.roleTypes.link,articleLocators.editArticle))
        
        return this.areAllVisible(editButton)

    }

    /**
     * Checks whether the Delete control is visible on the current article page.
     *
     * @returns Whether the Delete button is visible.
     */
    async isDeleteVisible(){
        await expect(this.page).toHaveURL(/\/article\/.+/);
        const deleteButton = await this.findElement(PWLocators.role,PWLocators.roleTypes.button,articleLocators.deleteArticle)
        return this.areAllVisible(deleteButton)

    }

    async returnArticleHeading(){
        await expect(this.page).toHaveURL(/\/article\/.+/);
        const deleteButton = await this.findElement(articleLocators.heading)
        return deleteButton
    }

    // Intercept Global Feed request
   async increaseArticleLimit() {
    await this.page.route(/\/api\/articles\?.*/, async (route) => {
        const url = new URL(route.request().url());
        url.searchParams.set('limit', '100');
        url.searchParams.set('offset', '30');

        const response = await route.fetch({
            url: url.toString()
        });

        const body = await response.text()
        const bodyText = JSON.parse(body);


       console.log("Response body:", bodyText);
       /*  console.log(
            "Target article found:",
            body.articles.some((a: any) =>
                a.title.includes("Future of AI in Software Testing")
            )
        ); */

        await route.fulfill({ response });
    });
}
}
    
    


    



