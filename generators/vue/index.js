'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const brosay = require('@brootal/brosay');

const fetch = require('node-fetch')

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      brosay(`Oki-doki lets create some brootal staff for ${chalk.green('Vue')}!`)
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Service name?"
      }
    ];
    let props = await this.prompt(prompts);
    
    let remotes = await fetch(`http://localhost:${this.config.get('port') || 3000}/remotes/${props.name}`);
    remotes = await remotes.json();

    this.props = {
      ...props,
      remoteNames: Object.keys(remotes),
      remotes,
      instanceName: this.config.get('instanceName')
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('service.template.ejs'),
      this.destinationPath(`./generated/${this.props.name}/${this.props.name}.service.js`),
      {
        ...this.props
      }
    );
    this.fs.copyTpl(
      this.templatePath('store.template.ejs'),
      this.destinationPath(`./generated/${this.props.name}/${this.props.name}.store.js`),
      {
        ...this.props
      }
    );
  }
};