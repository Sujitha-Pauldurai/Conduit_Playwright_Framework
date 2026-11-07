import {test} from "../helper/customeFixture"

/**
 * Logs in an existing user through the Sign In form.
 * Credentials are read from the environment (.env locally, GitHub secrets in CI).
 */
test("Sign in to the application",async({signIn,home,fileReader})=>{

    // Open the app and navigate to the Sign In page
    await home.loadApplication()
    await home.clickOnSignIn()

    // Read the user's credentials from the environment
    const email =   fileReader.readData("users", "EMAIL1")
    const password =   fileReader.readData("users", "PASSWORD1")
    const username =   fileReader.readData("users", "USERNAME1")

    // Fill in the form and submit it
    await signIn.login( email, password)
    console.log();
    
    await home.verifyLoggedInUsername(username)



})