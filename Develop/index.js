// npm packages
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');
const fs = require('fs');
const pdf = require('html-pdf');
const generateHTML = require('./generateHTML');

const questions = [
  {
    type: 'input',
    message: 'What is your user name?',
    name: 'username',
  },
  {
    type: 'list',
    name: 'color',
    message: 'What is your favorite color?',
    choices: ['red', 'blue', 'pink', 'green'],
  },
];
// Prompt user for Github username and favorite color
inquirer.prompt(questions).then(({ username, color }) => {
  console.log(username, color);
  const queryUrl = `https://api.github.com/users/${username}`;

  // Axios to retrieve data from Github api
  axios.get(queryUrl).then(response => {
    console.log(response.data);
    // Generates user results in html and pdf
    const queryUrl2 = `https://api.github.com/users/${username}/starred`;
    let stars = axios.get(queryUrl2).then(function(resStar) {
      const starCount = resStar.data[0].stargazers_count;
      stars = starCount;

      const html = generateHTML(response, color, stars);
      pdf.create(html).toFile('./profile.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res);
      });
    });
  });
});
