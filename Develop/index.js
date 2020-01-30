// npm packages
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');
const fs = require('fs');
const pdf = require('html-pdf');

const html2 = fs.readFileSync('./result.html', 'utf8'); // to your html file

// Convert to pdf packages, then open
const open = require('open');
const generateHTML = require('./generateHTML.js');

const writeFileAsync = util.promisify(fs.writeFile);

// Prompt user for Github username and favorite color

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
      name: 'color',
      choices: ['Red', 'Blue', 'Green', 'Orange'],
    },
  ])
  .then(function(userResponse) {
    // Urls for axios requests
    const queryUrl = `https://api.github.com/users/${userResponse.username}/repos?per_page=100`;
    const queryUrl2 = `https://api.github.com/users/${userResponse.username}/repos`;
    const starredUrl = `https://api.github.com/users/${userResponse.username}/starred?per_page=100`;

    // Axios to retrieve data from Github api
    axios.get(queryUrl).then(function(userName) {
      const userInfo = userName.data;
      console.log(userInfo);
      axios.get(queryUrl2).then(function(result) {
        console.log(result);
        const html = generateHTML(userResponse);
        const options = { format: 'Letter' };

        fs.writeFileSync('result.html', html);
        pdf.create(html2, options).toFile('result.pdf', function(err, res) {
          if (err) return console.log(err);
          console.log(res);
        });
        console.log('Successfully wrote to result.html');
      });
    });
  });
