'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const brosay = require('@brootal/brosay');

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(
      brosay(`Oki-doki lets create some brootal ${chalk.red('Service')}!`)
    );

    const prompts = [
      {
        type: "input",
        name: "name",
        message: "Service name?"
      },
      {
        type: "confirm",
        name: "isExtendByService",
        message: "Extend by basic Service class?",
        default: true
      },
      {
        type: "confirm",
        name: "hasModel",
        message: "Add connection to DB?",
        default: true
      }
    ];
    let props = await this.prompt(prompts);

    const schema = [];
    let datasource;
    if (props.hasModel) {

      let datasources = require(this.destinationPath('./server/datasources.json'));
      let datasourceNames = Object.keys(datasources);

      if (datasourceNames.length > 1) {
        datasource = await this.prompt({
          type: 'list',
          name: 'datasource',
          message: 'Datasource:',
          choices: datasourceNames.map((name) => ({
            name,
            value: name
          }))
        });
      } else {
        datasource = {datasource: datasourceNames[0]};
      }

      

      this.log(
        `Lets create schema. \n${chalk.italic('When you finish with schema just left field name empty')}`
      )
      while(true) {
        let fieldNamePrompt = [
          {
            type: "input",
            name: "name",
            message: "Field name:"
          }
        ];
        let fieldNameProp = await this.prompt(fieldNamePrompt);
        if (!fieldNameProp.name) break;

        let fieldTypePrompt =[
          {
            type: 'list',
            name: 'type',
            message: 'Field type:',
            choices: [
              {
                name: 'String',
                value: 'String',
              }, {
                name: 'Buffer',
                value: 'Buffer'
              }, {
                name: 'Boolean',
                value: 'Boolean'
              }, {
                name: 'Date',
                value: 'Date'
              }, {
                name: 'Number',
                value: 'Number'
              }, {
                name: 'Mixed',
                value: 'Schema.Types.Mixed'
              }, {
                name: 'ObjectId',
                value: 'Schema.Types.ObjectId'
              }, {
                name: 'Array',
                value: 'Array'
              }
            ]
          }
        ];
        let fieldTypeProp = await this.prompt(fieldTypePrompt);

        if (fieldTypeProp.type === 'Array') {
          let arrayTypePrompt =[
            {
              type: 'list',
              name: 'type',
              message: 'Array Of?',
              choices: [
                {
                  name: '[] (just array)',
                  value: '[]',
                },
                {
                  name: 'String',
                  value: '[String]',
                }, {
                  name: 'Buffer',
                  value: '[Buffer]'
                }, {
                  name: 'Boolean',
                  value: '[Boolean]'
                }, {
                  name: 'Date',
                  value: '[Date]'
                }, {
                  name: 'Number',
                  value: '[Number]'
                }, {
                  name: 'Mixed',
                  value: '[Schema.Types.Mixed]'
                }, {
                  name: 'ObjectId',
                  value: '[Schema.Types.ObjectId]'
                }
              ]
            }
          ];
          fieldTypeProp = await this.prompt(arrayTypePrompt);
        }


        let fieldDefaultPrompt = [
          {
            type: "input",
            name: "default",
            message: "Field default:"
          }
        ];
        let fieldDefaultProp = await this.prompt(fieldDefaultPrompt);
        schema.push({
          name: fieldNameProp.name,
          type: fieldTypeProp.type,
          default: fieldDefaultProp.default
        })
      };
    }

    return this.props = {
      ...props,
      ...datasource,
      schema
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('class.template.ejs'),
      this.destinationPath(`./services/${this.props.name}/${this.props.name}.class.js`),
      {
        ...this.props
      }
    );
    this.fs.copyTpl(
      this.templatePath('remote.template.ejs'),
      this.destinationPath(`./services/${this.props.name}/${this.props.name}.remote.js`),
      {
        ...this.props
      }
    );
    this.fs.copyTpl(
      this.templatePath('test.template.ejs'),
      this.destinationPath(`./test/${this.props.name}/${this.props.name}.spec.js`),
      {
        ...this.props
      }
    );
    if (this.props.hasModel) {
      this.fs.copyTpl(
        this.templatePath('model.template.ejs'),
        this.destinationPath(`./services/${this.props.name}/${this.props.name}.model.js`),
        {
          ...this.props
        }
      );
      this.fs.copyTpl(
        this.templatePath('seed.template.ejs'),
        this.destinationPath(`./seeder/seeds/${this.props.name}.seed.js`),
        {
          ...this.props
        }
      );
    }
  }
};