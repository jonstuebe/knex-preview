# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.2.6] - 2018-06-01

### Added

* Added the ability to type and get autocomplete options when selecting the migration you want to output.

## [0.2.5] - 2018-06-01

### Changed

* Fixed folder path bug
* Updated readme

## [0.2.4] - 2018-06-01

### Changed

* Updated peer dependencies

## [0.2.3] - 2018-06-01

### Changed

* Fixed bug with path directory being duped in certain situtations.
* Filtered out all files in the migrations directory that aren't knex migrations

## [0.2.2] - 2018-06-01

### Changed

* Updated the readme

## [0.2.1] - 2018-06-01

### Changed

* Fixed bug with trailing semicolon & whitespace
* Updated package.json for npm purposes

## [0.2.0] - 2018-06-01

### Added

* Added ability to copy to clipboard via choice from inquirer
* Added Changelog

### Changed

* Changed sql formatter to only run on table creations so as to not output invalid sql for functions, etc.

## [0.1.1] - 2018-05-31

### Added

* Fixed peer dependencies to allow for last two minor release of knex.

## [0.1.0] - 2018-05-31

### Added

* Initial Release
