'use strict';

const chalk = require('chalk');
const selectFieldsAndMerge = require('./utils/selectFieldsAndMerge');
const Generator = require('yeoman-generator');
const pkgMgmt = require('./constants/pkgMgmt');
const yosay = require('yosay');
const R = require('ramda');

const defaultInstalled = [
  {
    name: 'editorconfig',
    templatePath: 'dotfiles/editorconfig',
    destinationPath: '.editorconfig'
  },
  {
    name: 'gitattributes',
    templatePath: 'dotfiles/gitattributes',
    destinationPath: '.gitattributes'
  },
  {
    name: 'gitignore-sync',
    templatePath: 'dotfiles/gitignore-sync',
    destinationPath: '.gitignore-sync',
    devDependencies: {
      'ignore-sync': '^1.2.0'
    },
    scripts: {
      'ignore-sync': 'ignore-sync'
    }
  },
  {
    name: 'markdownlint',
    templatePath: 'dotfiles/markdownlint.json',
    destinationPath: '.markdownlint.json',
    devDependencies: {
      'markdownlint-cli': '^0.8.1'
    }
  },
  {
    name: 'commitlint',
    templatePath: 'dotfiles/commitlintrc.json',
    destinationPath: '.commitlintrc.json',
    devDependencies: {
      '@commitlint/cli': '^6.1.3',
      '@commitlint/config-conventional': '^6.1.3'
    },
    scripts: {
      commitmsg: 'commitlint -e $GIT_PARAMS'
    }
  },
  {
    name: 'import-sort',
    devDependencies: {
      'import-sort-cli': '^4.2.0',
      'import-sort-parser-babylon': '^4.2.0',
      'import-sort-style-module': '^4.2.0'
    },
    importSort: {
      '.js': {
        parser: 'import-sort-parser-babylon',
        style: 'import-sort-style-module'
      }
    }
  },
  {
    name: 'githooks',
    devDependencies: {
      husky: '^0.14.3',
      'lint-staged': '^7.0.0'
    },
    scripts: {
      'lint-staged': 'lint-staged',
      precommit: 'lint-staged'
    },
    'lint-staged': {
      '*.js': ['import-sort --write', 'git add'],
      '*ignore-sync': ['ignore-sync', 'git add'],
      '*.md': ['markdownlint', 'git add']
    }
  }
];

const withTplDefinition = R.filter(item => !R.isNil(item.templatePath));

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the bee's knees ${chalk.red('generator-important-misc')} generator!`
      )
    );

    const prompts = [
      {
        type: 'list',
        name: 'pkgMgmt',
        message: 'Which package manager do you use?',
        choices: Object.values(pkgMgmt)
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.copyTplFiles();
    this.extendPackageJson();
  }

  /**
   * Write to extend/create package.json
   *
   * extend/create package.json with the config of
   * - devDependencies
   * - dependencies
   * - scripts
   * if exists in defaultInstalled config
   * */
  extendPackageJson() {
    const mergeWith = selectFieldsAndMerge([
      'dependencies',
      'devDependencies',
      'importSort',
      'lint-staged',
      'scripts'
    ]);
    const pkgJson = mergeWith(defaultInstalled);
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  /**
   * Copy template files
   */
  copyTplFiles() {
    const tplFiles = withTplDefinition(defaultInstalled);
    tplFiles.forEach(file => {
      this.fs.copy(
        this.templatePath(file.templatePath),
        this.destinationPath(file.destinationPath)
      );
    });
  }

  install() {
    const install =
      this.props.pkgMgmt === pkgMgmt.YARN ? this.yarnInstall : this.npmInstall;

    install.call(this).then(() => {
      // Generate .*ignore files
      this.spawnCommand(this.props.pkgMgmt, ['ignore-sync']);
    });
  }
};
