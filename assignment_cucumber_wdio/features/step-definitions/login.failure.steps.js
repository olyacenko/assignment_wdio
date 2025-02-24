import { Given, When, Then } from '@wdio/cucumber-framework';
import loginPage from '../pageobjects/login.page.js';
const pages = {
    main: loginPage
}

Given(/^User is located on the (.*) page of saucedemo website$/, async (page) => {
    await pages[page].open();
});

When(/^User enters data to the username: (.*), password: (.*) fields$/, async (username, password) => {
    await loginPage.fillLoginPasswordFields(username, password);
});

When(/^User clicks (.*) button$/, async (buttonText) => {
    await loginPage.clickButtonByText(buttonText);
});

Then(/^User should see error message: (.*)$/, async (message) => {
    await expect(await loginPage.getErrorText()).toBe(message);
    await expect(loginPage.errorMsg).toBeDisplayed();
});
