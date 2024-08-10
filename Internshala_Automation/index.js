const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { elementLocated } = require('selenium-webdriver/lib/until');

// Set up Chrome options
let options = new chrome.Options();
options.addArguments('--remote-debugging-port=8989'); // Adjust the port if needed
options.addArguments('user-data-dir=C:/Users/hp/AppData/Local/Google/Chrome/User Data'); // Specify the path to your Chrome profile
options.addArguments('profile-directory=Default'); // Specify the profile directory (e.g., 'Default' or any other profile name)
let driver;

async function navigateToInternshala() {

    if (!driver) 
    {
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    }

    await driver.get("https://internshala.com/internships/matching-preferences/");
}

async function clickFirstInternship() {
    let internshipCardXPath = "//div[@id='internship_list_container']//div[contains(@class, 'internship_meta')][1]";
    let internshipCard = await driver.wait(until.elementLocated(By.xpath(internshipCardXPath)), 10000);

    // Wait for the card to be visible before clicking
    await driver.wait(until.elementIsVisible(internshipCard), 10000);

    // Scroll into view and click
    await driver.executeScript("arguments[0].scrollIntoView(true);", internshipCard);
    await internshipCard.click();
}

async function clickContinueButton() {
    let buttonXPath = "//div[@class='modal-dialog']/div[@class='modal-content easy-apply']/div[@class='modal-body easy-apply']/div[@id='content-container']/div[@id='job-description-container']/div[@class='continue_container']/button[@id='continue_button']";
    let continueButton = await driver.wait(until.elementLocated(By.xpath(buttonXPath)), 10000);
    await driver.executeScript("arguments[0].scrollIntoView(true);", continueButton);
    await driver.wait(until.elementIsVisible(continueButton), 10000);
    await continueButton.click();
}
async function Login(email,password) 
{
    try{
        let emailField = await driver.wait(until.elementLocated(By.name("email")), 1000);
        await emailField.sendKeys("nishantmanocha05@gmail.com");

        let passwordField = await driver.wait(until.elementLocated(By.name("password")), 1000);
        await passwordField.sendKeys("nishantmanocha05@");

        let submitButton = await driver.wait(until.elementLocated(By.xpath('//button[@type="submit"]')), 1000);
        await submitButton.submit();
    }catch(error)
    {
        console.log("Login Page not Present or Error came");
    }
    
}


async function fillCoverLetter(messages) {
    let coverLetterXPath = '//div[@id="cover_letter_container"]//div[@id="cover_letter_holder"]//p';
    let coverLetterDiv = await driver.findElement(By.xpath(coverLetterXPath));
    await coverLetterDiv.sendKeys(messages);
}
async function checkAndFillInputBox(messages) {
        try {
            let inputBoxes = await driver.findElements(By.xpath('//div[@class="form-group additional_question"]//textarea')); // Corrected XPath to find all matching textareas
            if (inputBoxes.length > 0) {
                for (let inputBox of inputBoxes) {
                    await inputBox.sendKeys("YES");
                }
            } else {
                console.log('No input boxes found.');
            }
        } catch (error) {
            console.log('Error while filling input boxes:', error);
        }
}
    

async function submitForm() {
    let submitButtonXPath = "//input[@type='submit' and @id='submit']";
    let submitButton = await driver.findElement(By.xpath(submitButtonXPath));
    await submitButton.submit();
}

async function FilterdropDown()
{
    let matchCheckBox = await driver.findElements(By.xpath("//div[@class='matching_preference_container form-group checkbox checkbox_group']//label[@for='matching_preference']"));
    await matchCheckBox.click();
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function internshalaAutomation(email,password,messages,no_of_internship) 
{
    try {
            
            await navigateToInternshala();

            await Login(email,password);


            for(let j=0;j<no_of_internship;j++)
            {
                await clickFirstInternship();
                await clickContinueButton();
                await fillCoverLetter(messages);
                
                await checkAndFillInputBox("Yes");
                
                await submitForm();

                await driver.navigate().refresh();
            }
            // Refresh the page after submission
            
        

    } catch (error) {
        console.error('Error:', error);
    } finally {
        console.log("Work Done");
        await driver.quit();
    }
}
internshalaAutomation("demo05@gmail.com","demopass","demo message for message box",2);
