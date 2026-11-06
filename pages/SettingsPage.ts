
import { PWLocators } from "../locators/playwrightLocators"

import { settingsLocators } from "../locators/settingsLocators";
import { expect } from "@playwright/test";
import ElementHandler from "../helper/elementHandler";
import { homeLocators } from "../locators/homeLocators";
import { authLocators } from "../locators/authLocators";



export class SettingsPage extends ElementHandler{


async logout(){
    await this.click(PWLocators.role,PWLocators.roleTypes.button,settingsLocators.logoutButton)
    const targetElement = await this.findElement(PWLocators.role,PWLocators.roleTypes.link,authLocators.loginName)
    await expect(targetElement).toBeVisible()
}


}