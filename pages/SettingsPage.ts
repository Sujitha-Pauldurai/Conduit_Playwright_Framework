
import { PWLocators } from "../locators/playwrightLocators"

import { settingsLocators } from "../locators/settingsLocators";
import { expect } from "@playwright/test";
import ElementHandler from "../helper/elementHandler";
import { authLocators } from "../locators/authLocators";


/** Page object for the settings page. */
export class SettingsPage extends ElementHandler{

 /**
     * Clicks Logout and confirms the app returns to the sign-in screen.
     *
     * @returns Nothing. Asserts that the Sign In link is visible.
     */
async logout(){
    await this.click(PWLocators.role,PWLocators.roleTypes.button,settingsLocators.logoutButton)
    const targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.link,authLocators.loginName)
    await expect(targetElement).toBeVisible()
}


}