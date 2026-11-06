import {test} from "../helper/customeFixture"

test("Create a new User",async({signUp,home,fileReader})=>{

    await home.loadApplication()
    await home.clickOnSignUp()

    const username =   fileReader.readData("users", "USERNAME1")
    const email =   fileReader.readData("users", "EMAIL1")
    const password =   fileReader.readData("users", "PASSWORD1")

    console.log(username,email,password);
    
    await signUp.signUp(username, email, password)

})