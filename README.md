# Knex Preview

## Usage

Small CLI utility that converts the knex query/schema builder method calls in migrations to standard sql. Has an interactive CLI that allows you to select which migration, specific the up or down migration, and whether or not to add a savepoint to the output. Transactions are added based on the knex settings inside of that project.

See `knex-preview --help` for more details.
