import {test} from "../helper/customeFixture"

test("Create a new User",async({signIn,home,fileReader})=>{

    await home.loadApplication()
    await home.clickOnSignIn()

    const email =   fileReader.readData("users", "EMAIL1")
    const password =   fileReader.readData("users", "PASSWORD1")

    console.log(email,password);
    
    await signIn.login( email, password)

})