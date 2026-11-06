import { expect } from "@playwright/test";
import ElementHandler from "../helper/elementHandler";
import { authLocators } from "../locators/authLocators";
import { PWLocators } from "../locators/playwrightLocators"
import { homeLocators } from "../locators/homeLocators";



export class SignInPage extends ElementHandler{


    /**
     * Description: Logs in to the application by entering the username and password, then clicking the login button.
     * @param username - The username used to log in.
     * @param password - The password used to log in.
     */
   async login(email:string,password:string){

     
      await this.enterText(PWLocators.role,email,PWLocators.roleTypes.textbox,authLocators.emailName)
      await this.enterText(PWLocators.role,password,PWLocators.roleTypes.textbox,authLocators.passwordName)
      await this.click(PWLocators.role,PWLocators.roleTypes.button,authLocators.loginName)

      const targetElement = await this.findElement(homeLocators.homeDiv)
      await expect(targetElement).toBeVisible()

}

}