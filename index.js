#!/usr/bin/env node

require("dotenv").config();
const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const program = require("commander");
const sqlFormatter = require("sql-formatter");
const clipboardy = require("clipboardy");
const chalk = require("chalk");
const { get, isArray } = require("lodash");

const cwd = process.cwd();
const pkg = require("./package.json");

program
  .version(pkg.version)
  .option("--knex-config <path>", "knex config location")
  .parse(process.argv);

const knexConfigPath = program.knexConfig
  ? path.join(cwd, program.knexConfig)
  : path.join(cwd, "knexfile");
let knexConfig = require(knexConfigPath.toString());
if (knexConfig.development) {
  knexConfig = knexConfig[process.env.NODE_ENV || "development"];
}
knexConfig.connection = null;
delete knexConfig.connection;

const mockDb = require("mock-knex");
const knex = require("knex")(knexConfig);
mockDb.mock(knex);
const migrationsPath = path.join(
  cwd,
  get(knexConfig, "migrations.directory", "./migrations")
);
const useTransactions = !get(
  knexConfig,
  "migrations.disableTransactions",
  false
);

const migrations = fs.readdirSync(migrationsPath);
let allQueries = [];

knex.on("query", query => {
  if (query.sql.includes("create table")) {
    allQueries.push(sqlFormatter.format(query.sql));
  } else {
    allQueries.push(query.sql);
  }
});

inquirer
  .prompt([
    {
      type: "list",
      name: "migrationSelected",
      message: "Please select the migration you would like to preview",
      choices: migrations.map(migration => {
        return {
          name: migration,
          value: migration
        };
      })
    },
    {
      type: "list",
      name: "migrationType",
      message: "Please select either the down or the up migration to preview",
      choices: [
        {
          name: "Up",
          value: "up"
        },
        {
          name: "Down",
          value: "down"
        }
      ]
    },
    {
      type: "list",
      name: "useSavepoint",
      message:
        "Please select whether or not to add a savepoint around the query",
      choices: [
        {
          name: "Yes",
          value: true
        },
        {
          name: "No",
          value: false
        }
      ]
    },
    {
      type: "list",
      name: "saveToClipboard",
      message: "Save to clipboard?",
      choices: [
        {
          name: "Yes",
          value: true
        },
        {
          name: "No",
          value: false
        }
      ]
    }
  ])
  .then(
    async ({
      migrationSelected,
      migrationType,
      useSavepoint,
      saveToClipboard
    }) => {
      let queries = require(`${migrationsPath}/${migrationSelected}`)[
        migrationType
      ](knex, Promise);
      await queries;

      let sql = allQueries
        .map(query => {
          let sql = query.toString();
          if (sql.substr(-1) !== ";") {
            sql += ";";
          }
          return sql;
        })
        .join("\n\n");

      if (useSavepoint) {
        sql = `SAVEPOINT knex_preview;\n\n${sql}\n\nROLLBACK TO SAVEPOINT knex_preview;`;
      }

      if (useTransactions) {
        sql = `BEGIN;\n\n${sql}\n\nCOMMIT;`;
      }

      if (saveToClipboard) {
        clipboardy.writeSync(sql);
        console.log(chalk.green("Query copied to clipboard!"));
      } else {
        console.log("");
        console.log(sql);
        console.log("");
      }
    }
  );
