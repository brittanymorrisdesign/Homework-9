// npm packages
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');
const fs = require('fs');
const pdf = require('html-pdf');

const html2 = fs.readFileSync('./result.html', 'utf8'); // to your html file

// Convert to pdf packages, then open

const generateHTML = require('./generateHTML.js');

// Write the file, modify it to a promise
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
    const queryUrl = `https://api.github.com/users/${userResponse.username}`;
    const starredUrl = `https://api.github.com/users/${userResponse.username}/starred`;

    // Axios to retrieve data from Github api
    axios.get(queryUrl).then(function(userName) {
      const userInfo = userName.data;
      console.log(userInfo);

      axios.get(starredUrl).then(function(result) {
        console.log(result);

        // Generates user results in html and pdf
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
