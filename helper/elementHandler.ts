import {test,expect, Page, Locator, FrameLocator} from "@playwright/test"

// Define the supported locator roles for reusable element handling.
type role = 'button' | 'textbox' | 'link' | 'heading' | 'checkbox' | 'combobox'

// Reusable handler class for browser and element interactions.
export default class ElementHandler{

     page:Page
         
     // Initialize the handler with the current Playwright page.
        constructor(tpage:Page){
    
        this.page=tpage
        
        }

    /**
     * Description: Navigates to the specified application URL and handles navigation errors.
     * @param url - The URL of the application to open.
     */
    async loadApplication(){
            await this.page.goto('/')
  
         
        
      }

    //Method to wait until the page's DOM content is fully loaded.
    async waitUntilPageLoad(){
        await this.page.waitForLoadState("domcontentloaded")
        
    }

    async waitUntilBodyLoad(){
        await this.page.locator('body').waitFor({ state: 'attached', timeout: 15000 });
      
        //await this.page.locator('#app-root, .main-layout').first().waitFor({ state: 'attached', timeout: 15000 });
    }

    async isURLHave(value:string | RegExp){
        await expect(this.page).toHaveURL(/\/article\/.+/);

    }
    
    /**
         * Description: Locates an element using the specified locator strategy and clicks it after verifying visibility.
         * @param locator - The locator strategy (e.g., getByRole, getByText, CSS, or XPath).
         * @param locMethod? - The locator value, such as role type (button/textbox), text, title, or placeholder. Optional for CSS/XPath locators.
         * @param name? - The accessible name used with getByRole. Optional for other locator strategies.
         * @param parent? - Optional parent Locator or FrameLocator used to locate the element within a specific element or frame.
    */
    async click(locator:string,locMethod?:string,name?:string,parent?:Locator | FrameLocator){
        let element
        // Check whether a parent locator or frame was provided.
        if(parent){
            // If both locator method and accessible name are provided, pass all arguments.
            if(locMethod  && name){
               // console.log("locator has getBy",locator,locMethod,name);
                
                element=  await this.findElement(locator,locMethod,name,parent)
            
            }
            // Handle locator methods that don't require an accessible name.
            else if(locMethod  && !name){
               // console.log("locator has getBy",locator,locMethod,name);
                element=  await this.findElement(locator,locMethod,undefined,parent)
            
            }
            // If no additional locator details are provided, use the locator directly.
            else{
                
                element = await this.findElement(locator,undefined,undefined,parent)
            }   
    }
    // If no parent is provided, locate the element from the current page.
    else{
        if(locMethod  && name){
           // console.log("locator has getBy",locator,locMethod,name);
            
            element=  await this.findElement(locator,locMethod,name)
          
        }
        // Handle locator methods that don't require an accessible name.
        else if(locMethod  && !name){
          //  console.log("locator has getBy",locator,locMethod,name);
            element=  await this.findElement(locator,locMethod)
           
        }
        // Use the locator directly when no additional details are provided.
        else{
            element = await this.findElement(locator)
        }

    }
        // Verify that the element becomes visible within 90 seconds.
        await element.waitFor({state : 'visible'})

        // Click the element after visibility is confirmed.
        await element.click()
        
    }

    /**
    * Waits for a specified duration based on the wait type provided.
    * 
    * @param {'minWait' | 'mediumWait' | 'maxWait'} waitType - The type of wait duration ('minWait', 'mediumWait', or 'maxWait').
    */
    async wait(waitType: 'minWait' | 'mediumWait' | 'maxWait') {
        try {
            switch (waitType) {
                case 'minWait':
                    await this.page.waitForTimeout(3000);
                    break;
                case 'mediumWait':
                    await this.page.waitForTimeout(5000);
                    break;
                case 'maxWait':
                    await this.page.waitForTimeout(10000);
                    break;
                default:
                    console.log("Invalid wait type provided.");
                    throw new Error(`Invalid wait type: ${waitType}`);
            }
        } catch (error) {
            console.error("Error during wait:", error);
        }
    }


    /**
     * Description: Locates an element using the specified locator strategy and enters the given text.
     * @param locator - The locator strategy (e.g., getByRole, getByText, CSS, or XPath).
     * @param value - The text value to enter into the element.
     * @param locMethod? - The locator value, such as role type (textbox), text, title, or placeholder. Optional for CSS/XPath locators.
     * @param name? - The accessible name used with getByRole. Optional for other locator strategies.
     * @param parent? - <<Need to be implemented in future>>
     */
    async enterText(locator:string,value:string,locMethod?:string,name?:string){
        let element:Locator
        // If both locator method and accessible name are provided, pass all arguments.
        if( locMethod  && name){
           // console.log("locator has getBy");
            element = await this.findElement(locator,locMethod,name)
           
        }
        // Handle locator methods that don't require an accessible name.
        else if(locMethod  && !name){
            element = await this.findElement(locator,locMethod)
           

        }
        // Use the locator directly when no additional details are provided.
        else{
            element = await this.findElement(locator)
        }
        
        // Fill the input field with the specified text, replacing any existing value.
         await element.fill(value)
        
    }


    
    /**
     * Description: Locates and returns an element using the specified locator strategy.
     * @param locator - The locator strategy (e.g., getByRole, getByText, CSS, or XPath).
     * @param locMethod? - The locator value, such as role type (button/textbox), text, title, or placeholder. Optional for CSS/XPath locators.
     * @param name? - The accessible name used with getByRole. Optional for other locator strategies.
     * @param parent1? - Optional parent Locator or FrameLocator used to locate the element within a specific element or frame.
     * @returns A Promise resolving to the matched Playwright Locator.
     */
    
    async findElement(locator:string,locMethod?:string,name?:string,parent1?:Locator | FrameLocator): Promise<Locator>{
        let method
        let ele:Locator 
        let parent
        

        // Locator Chaining: Uses the provided parent locator or frame to find elements within a specific scope; otherwise, searches from the current page.
        if(parent1){
             parent = parent1
        }
        else{
            parent = this.page
        }

        // Check whether the locator strategy uses a Playwright getBy method.
        if(locator.includes("getBy")){

            // Extract the method name by removing the 'getBy' prefix.
            method = locator.replace("getBy", "")
           
            switch(method){
                case "Role":
                    // Locate the element by its ARIA role and accessible name.
                    ele =   parent.getByRole(locMethod as role,{name:name})
                    /*console.log(await ele.count());
                    let count = await ele.count()
                    if(count > 1){
                        ele =  parent.getByRole(locMethod as role,{name:name, exact: true})
                    }*/
                    break
                case "Text":
                    // Locate the element using its visible text.
                    ele =  parent.getByText(locMethod as string, {exact : true})
                    break
                case "Title":
                    // Locate the element using its title attribute.
                    ele =  parent.getByTitle(locMethod as string)
                    break
                case "AltText":
                    // Locate the element using its alternative text.
                    ele =  parent.getByAltText(locMethod as string)
                    break
                case "Placeholder":
                    // Locate the input using its placeholder text.
                    ele =  parent.getByPlaceholder(locMethod as string)
                    break
                case "Label":
                    // Locate the form element associated with the specified label.
                    ele =  parent.getByLabel(locMethod as string)
                    break
                case "TestId":
                    // Locate the element using its test ID attribute.
                    ele =  parent.getByTestId(locMethod as string)
                    break
                 default:
                    // Throw an error if the requested getBy method is unsupported.
                     throw new Error(`Unsupported locator method: ${method}`);
            }
  
        }  
        else{
            // For CSS or XPath selectors, use the generic locator() method.
            ele =  parent.locator(locator)
        }  

        // Return the locator for further actions or assertions.
        return ele;
    }

    /**
     * Description: Returns a FrameLocator to locate and interact with elements inside an iframe.
     * @param locator - The CSS or XPath selector identifying the iframe.
     */
    findFrame(locator:string){
        return this.page.frameLocator(locator)
    }

    filterElement(element:Locator,text:string){
         return element.filter({hasText : text})
    }

    //Retrieves and returns the current page title.
    async returnPageTitle():Promise<string>{
        return await this.page.title()
    }

    async assertPageTitle(expectedtext:string | RegExp){
        await expect(this.page).toHaveTitle(expectedtext)
    }

    //Captures a full-page screenshot and saves it to the specified file path.
    async takeScreenshot(){
        await this.page.screenshot({
            path: '../test-results/fullPage.png',
            fullPage: true
        });
    }

    async pressEnter(){
         await this.page.keyboard.press('Enter');
    }

    async areAllVisible(locator: Locator): Promise<boolean> {
        const count = await locator.count();
        let flag = false
        if (count === 0) return false;

        for (let i = 0; i < count; i++) {
            console.log(locator,await locator.nth(i).isVisible());
            
            if ((await locator.nth(i).isVisible())) {
                flag = true
            }
        }
        return flag
       
    }
    
    
    
}