// npm packages
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');
const fs = require('fs');
const open = require('open');
const pdfTemplate = require('./generateHTML.js');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'username',
      message: 'What is your github username?',
    },
    {
      type: 'list',
      message: 'favColor',
      name: 'stack',
      choices: ['Red', 'Blue', 'Green', 'Orange'],
    },
  ])
  .then(function(res) {
    // Urls for axios requests
    const githubUrl = `https://api.github.com/users/${res.username}`;
    const githubRepos = `https://api.github.com/users/${res.username}/repos`;
    // Axios to retrieve data from Github api
    axios.get(githubUrl).then(function(res) {
      console.log(res.data);
    });
  });
