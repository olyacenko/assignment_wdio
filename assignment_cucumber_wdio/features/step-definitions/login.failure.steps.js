import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import loginPage from '../pageobjects/login.page.js';

Given(/^User is located on the main page of saucedemo website$/, async () => {
    await loginPage.open();
});

When(/^User enters data to the username: (.*), password: (.*) fields$/, async (username, password) => {
    await loginPage.fillLoginPasswordFields(username, password);
    await expect(loginPage.inputUserName).toHaveValue(username);
    await expect(loginPage.inputPassword).toHaveValue(password);
    await expect(loginPage.inputPassword).toHaveAttribute("type", "password");
});

When(/^User clicks “Login” button$/, async () => {
    await loginPage.btnLoginClick();
});

Then(/^User should see error message: (.*)$/, async (message) => {
    await expect(await loginPage.getErrorText()).toBe(message);
    await expect(loginPage.errorMsg).toBeDisplayed();
    await loginPage.loginPasswordFieldsToBeRed();
    await loginPage.errorIconsToBeDisplayed();
});
