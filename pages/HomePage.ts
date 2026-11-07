import { expect, Locator, Page } from "@playwright/test";
import ElementHandler from "../helper/elementHandler";
import { authLocators } from "../locators/authLocators";
import { PWLocators } from "../locators/playwrightLocators"
import { articleLocators } from "../locators/articleLocators"
import { homeLocators } from "../locators/homeLocators";
import {settingsLocators} from "../locators/settingsLocators"


/** Page object for the home page: navigation between screens, feed switching, and article lookup. */
export class HomePage extends ElementHandler{

    /**
     * Opens the Sign Up page from the home page.
     *
     * @returns Nothing. Asserts that the Sign Up heading is visible.
     */
    async clickOnSignUp(){

        await this.click(PWLocators.role,PWLocators.roleTypes.link,authLocators.signUpName)
        const signUpHeading = await this.findElement(PWLocators.role,PWLocators.roleTypes.heading,authLocators.signUpName)
        await expect(signUpHeading).toBeVisible()
    }

    /* Opens the Sign In page from the home page and Resolves once the Sign In heading is visible. */
    async clickOnSignIn(){

        await this.click(PWLocators.role,PWLocators.roleTypes.link,authLocators.loginName)
        const signInHeading = await this.findElement(PWLocators.role,PWLocators.roleTypes.heading,authLocators.loginName)
        await expect(signInHeading).toBeVisible()
    }

    /**
     * Opens the New Article editor.Resolves once the Publish button is visible.
     */
     
    async clickOnNewArticle() {

        await this.click(PWLocators.role,PWLocators.roleTypes.link,articleLocators.newArticleLink)
        const targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.button,articleLocators.publishButtonName)
        await expect(targetElement).toBeVisible()
    }

     /**
     * Opens the Settings page and Resolves once the Logout button is visible.
     */
    async clickOnSettings(){

        await this.click(PWLocators.role,PWLocators.roleTypes.link,homeLocators.settingsLink)
        const targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.button,settingsLocators.logoutButton)
        await expect(targetElement).toBeVisible()

    }

    /**
     * Returns to the home page and confirms the Global Feed tab is active and
     *  Resolves once the home page and its active Global Feed tab are visible.
     */

    async clickOnHome(){

        await this.click(PWLocators.role,PWLocators.roleTypes.link,homeLocators.homeLink)
        const targetElement = await this.findElement(homeLocators.homeDiv)
        await expect(targetElement).toBeVisible()
        const globalFeed = await this.findElement(PWLocators.text,homeLocators.globalFeed)
        await expect(globalFeed).toBeVisible()
        await expect(globalFeed).toHaveClass(/active/)
    }

    /**
     * Switches to the Global Feed tab and confirms it is active and Resolves once the Global Feed tab has the active class. 
     */
    async clickOnGlobalFeed(){
        await this.click(PWLocators.role,PWLocators.roleTypes.link,homeLocators.globalFeed)
        await expect(await this.findElement(PWLocators.role,PWLocators.roleTypes.link,homeLocators.globalFeed)).toHaveClass(/active/)
        
    }

    /**
     * Switches to the Your Feed tab and confirms it is active and Resolves once the Your Feed tab has the active class.
     */
    async clickOnYourFeed(){
        await this.click(PWLocators.role,PWLocators.roleTypes.link,homeLocators.yourFeed)
        await expect(await this.findElement(PWLocators.role,PWLocators.roleTypes.link,homeLocators.yourFeed)).toHaveClass(/active/)
        
    }

    /**
     * Waits for the feed to finish loading, then finds the article preview whose heading matches the title.
     *
     * @param title - The article title to look for in the Global Feed.
     * @returns A Locator for the matching article heading, or undefined if the feed has no articles.
     */
    async searchArticleInGlobalFeed1(title:string):Promise<Locator>{

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

    async searchArticleInGlobalFeed(title: string): Promise<Locator> {

    const loadingMsg = await this.findElement(PWLocators.text, homeLocators.loadMsg);
    await expect(loadingMsg).toBeHidden();

    const articleList = await this.findElement(homeLocators.articlePreview);

    console.log("Articles loaded:", await articleList.count());
    const articles = await this.findElement(
        homeLocators.articleHeading,
        undefined,
        undefined,
        articleList
    );

    return this.filterElement(articles, title);
}

    /**
     * Opens an article from the feed and confirms the article page is visible and Resolves once the article page is visible.
     *
     * @param article - A Locator for the article to open, usually from searchArticleInGlobalFeed.
     */
    async selectArticle(article:Locator){

        await article.click()
        const targetElement = await this.findElement(articleLocators.articlePage)
        await expect(targetElement).toBeVisible()


    }

    // Verify the logged-in username is displayed in the header.
    async verifyLoggedInUsername(username: string) {
    const profileLink = await this.findElement(homeLocators.profileLink)

    await expect(profileLink.last()).toBeVisible()
    await expect(profileLink.last()).toHaveText(username)
    }

    async verifyHomeContentUI() {

    // Verify Your Feed (Local Feed).
    const localFeed = await this.findElement(homeLocators.localFeed)
    await expect.soft(localFeed).toBeVisible()

    // Verify Global Feed.
    const globalFeed = await this.findElement(homeLocators.globalFeedSec)
    await expect.soft(globalFeed).toBeVisible()

    // Verify Popular Tags section.
    const popularTagsHeading = await this.findElement(homeLocators.popularTagsHeading)
    await expect.soft(popularTagsHeading).toBeVisible()
    await expect.soft(popularTagsHeading).toHaveText("Popular Tags")

    const popularTags = await this.findElement(homeLocators.popularTags)
    await expect.soft(popularTags).toBeVisible()
    }

    // Verify application header and navigation.
    async verifyHeaderUIAfterLogin() {

        await this.verifyHeaderIcons()
        await expect.soft(await this.findElement(homeLocators.header)).toBeVisible()

        // Application logo
        const logo = await this.findElement(homeLocators.logo)
        await expect.soft(logo).toBeVisible()
        await expect.soft(logo).toHaveCSS("color", homeLocators.logoColor)

        // Verify navigation links.
        for (const link of [
            homeLocators.homeLink,
            homeLocators.newArticleLink,
            homeLocators.settingsLink
        ]) {
            await expect.soft(
                await this.findElement(PWLocators.role,PWLocators.roleTypes.link,link)
            ).toBeVisible()
        }

        // Logged-in user profile
        const userP = await this.findElement(homeLocators.profileLink)
        await expect.soft(userP.last()).toBeVisible()
    }

    // Verify application footer.
    async verifyFooterUI() {

     const footer = await this.findElement(homeLocators.footer)

    await expect.soft(footer).toBeVisible()
       // Verify footer logo.
        const footerlogo = await this.findElement(homeLocators.footerlogo)
        await expect.soft(footerlogo).toBeVisible()
        await expect.soft(footerlogo).toHaveCSS("color", homeLocators.logoColor)


    // Verify footer description.
    await expect.soft(footer)
        .toContainText("An interactive learning project")

    // Verify footer links.
    await expect.soft(await this.findElement(homeLocators.realWorldLink))
        .toBeVisible()

    await expect.soft(await this.findElement(homeLocators.bondarLink))
        .toBeVisible()
    }

    async verifyHeaderIcons() {

    // Verify New Article icon.
    const newArticle = await this.findElement(homeLocators.newArticleIcon)
    await expect.soft(newArticle).toBeVisible()

    // Verify Settings icon.
    const settings = await this.findElement(homeLocators.settingsIcon)
    await expect.soft(settings).toBeVisible()

    // Verify profile image is loaded correctly.
    const profile = await this.findElement(homeLocators.profileImage)
    await expect.soft(profile).toBeVisible()
    await expect.soft(profile).toHaveJSProperty("complete", true)
   await expect.soft.poll(() => profile.evaluate(
    (img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
}


}