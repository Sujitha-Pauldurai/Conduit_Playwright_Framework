import {test} from "../helper/customeFixture"

/**
 * Registers a new user through the Sign Up form.
 * Credentials are read from the environment (.env locally, GitHub secrets in CI).
 */
test("Create a new User",async({signUp,home,fileReader})=>{

    // Open the app and navigate to the Sign Up page
    await home.loadApplication()
    await home.clickOnSignUp()

    // Read the new user's details from the environment
    const username =   fileReader.readData("users", "USERNAME1")
    const email =   fileReader.readData("users", "EMAIL1")
    const password =   fileReader.readData("users", "PASSWORD1")
    
    // Fill in the form and submit it
    await signUp.signUp(username, email, password)


})