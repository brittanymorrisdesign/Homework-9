// npm packages
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');
const fs = require('fs');
const gs = require('github-scraper');

// Convert to pdf packages, then open
const convertFactory = require('electron-html-to');
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
      axios
        .get(queryUrl2)
        .then(function(result) {
          console.log(result);
          const makeHTML = generateHTML(userResponse);
          return writeFileAsync(`${userInfo.name}.html`, makeHTML);
        }) // Call generateHTML to make into HTML doc
        .then(function(genHTML) {
          console.log('Successfully wrote to index.html');
          const conversion = convertFactory({
            converterPath: convertFactory.converters.PDF,
          });

          conversion({ html: genHTML }, function(err, result) {
            if (err) {
              return console.error(err);
            }

            result.stream.pipe(fs.createWriteStream(`"test.pdf"`));
            conversion.kill();
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    });
  });
