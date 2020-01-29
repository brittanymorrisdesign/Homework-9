// npm packages
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const fs = require("fs");
const open = require("open");


function userInfo() {
inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "What is your github username?"
    },
    {
      type: "list",
      message: "favColor",
      name: "stack",
      choices: [
        "Red", 
        "Blue", 
        "Green", 
        "Orange"
      ]
    },

      ]);
    }


function writeToFile(fileName, data) {
 
}

function init() {
userInfo()
init();
