const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
let options = new chrome.Options();

options.addArguments('--remote-debugging-port=8989');
options.addArguments('user-data-dir=C:/Users/hp/AppData/Local/Google/Chrome/User Data');
options.addArguments('profile-directory=Default');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function curaHealth() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        await driver.get("https://katalon-demo-cura.herokuapp.com/");

        // 1st Page: Click the "Make Appointment" button
        let makeAppointmentButton = await driver.wait(until.elementLocated(By.id("btn-make-appointment")), 10000);
        await makeAppointmentButton.click();

        // 2nd Page: Log in
        let usernameElement = await driver.wait(until.elementLocated(By.id("txt-username")), 10000);
        let passwordElement = await driver.findElement(By.id("txt-password"));
        await usernameElement.sendKeys("John Doe");
        await passwordElement.sendKeys("ThisIsNotAPassword");

        let loginButton = await driver.findElement(By.id("btn-login"));
        await loginButton.click();

        // 3rd Page: Fill out the form
        let facilitySelect = await driver.wait(until.elementLocated(By.id("combo_facility")), 10000);
        await facilitySelect.sendKeys("Seoul CURA Healthcare Center");

        let hospitalReadmissionCheckbox = await driver.findElement(By.css("label[for='chk_hospotal_readmission']"));
        await hospitalReadmissionCheckbox.click();

        let medicaidRadio = await driver.findElement(By.css("input[value='Medicaid']"));
        await medicaidRadio.click();

        let visitDateInput = await driver.findElement(By.id("txt_visit_date"));
        await visitDateInput.sendKeys("25/10/2025");

        let commentInput = await driver.findElement(By.id("txt_comment"));
        await commentInput.sendKeys("This is demo project  by Selenium Nodejs");

        let bookAppointmentButton = await driver.findElement(By.id("btn-book-appointment"));
        await bookAppointmentButton.click();

        await sleep(4000);


    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await driver.quit();
    }
}

curaHealth();
