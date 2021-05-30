'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const brosay = require('@brootal/brosay');

module.exports = class extends Generator {

  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      brosay(`Oki-doki lets create some brootal ${chalk.red('App')}!`)
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "App name? (lowecase only)"
      },
      {
        type: "input",
        name: "description",
        message: "Describe your app:"
      },
      {
        type: "input",
        name: "imageUrl",
        message: "What path to your registry? (<registry domain>/<path in registry>:latest)",
      },
      {
        type: "input",
        name: "port",
        message: "What port your app gonna listen for?"
      },
      {
        type: "input",
        name: "mongoHost",
        message: "What host of your db?",
        default: "mongo"
      },
      {
        type: "input",
        name: "mongoPort",
        message: "What port of your db?",
        default: "27017"
      },
      {
        type: "input",
        name: "mongoDB",
        message: "What is name of your db?",
        default: "project_lego"
      },
      {
        type: "input",
        name: "mongoUser",
        message: "What username to acces to your db?",
        default: "user"
      },
      {
        type: "input",
        name: "mongoPassword",
        message: "What password of user to access to your db?"
      }
    ];
    let props = await this.prompt(prompts);


    return this.props = {
      ...props
    }
  }

  writing() {
    let copyManyTpls = (files) => {
      files.forEach((file) => {
          this.fs.copyTpl(
              this.templatePath(file+'.ejs'),
              this.destinationPath(`./${file}`),
              {
                  ...this.props
              }
          )
      });
    }

    copyManyTpls([
        'README.md',
        'patch_version.sh',
        'patch_version_with_commit.sh',
        'Dockerfile.prod',
        'Dockerfile.dev',
        'Dockerfile',
        'docker-compose.yml',
        'docker-compose.dev.yml',
        '.mocharc.yml',
        '.yo-rc.json',
        '.gitlab-ci.yml',
        '.gitignore',
        '.eslintrc',
        '.babelrc',
        'test/.template.spec.js',
        'test/init.js',
        'server/app.js',
        'server/datasources.json',
        'server/server.js',
        'seeder/index.js',
        'package.json',
        'lib/.remove-me-if-u-add-any-lib'
    ])
  }
  install() {
    this.npmInstall();
  }
};