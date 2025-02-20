Feature: Invalid login to Saucedemo website

  Scenario Outline: User cannot login to the Saucedemo website with invalid credentials
    Given User is located on the main page of saucedemo website
    When User enters data to the username: <username>, password: <password> fields
    When User clicks “Login” button
    Then User should see error message: <message>

    Examples:
      | username      | password        | message                                                                   |
      |               |                 | Epic sadface: Username is required                                        |
      |               | secret_sauce    | Epic sadface: Username is required                                        |
      | random_user   |                 | Epic sadface: Password is required                                        |
      | random_user   | secret_sauce    | Epic sadface: Username and password do not match any user in this service |
      | standard_user | random_password | Epic sadface: Username and password do not match any user in this service |
