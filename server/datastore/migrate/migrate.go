package migrate

import (
	"github.com/BurntSushi/migration"
	"github.com/jmoiron/sqlx"
)

type Migrator struct {
	DbType string
}

func (m Migrator) rebind(s string) string {
	return sqlx.Rebind(sqlx.BindType(m.DbType), s)
}

// Setup will create all necessary tables and indexes in the database.
func (m Migrator) Setup(tx migration.LimitedTx) error {
	stmts := []string{
		listsTable,
		todosTable,
	}

	for _, stmt := range stmts {
		if _, err := tx.Exec(stmt); err != nil {
			return err
		}
	}

	return nil
}

const listsTable = `
CREATE TABLE IF NOT EXISTS lists (
	 id   INTEGER PRIMARY KEY AUTOINCREMENT
	,name TEXT NOT NULL
)
`

const todosTable = `
CREATE TABLE IF NOT EXISTS todos (
	 id          INTEGER PRIMARY KEY AUTOINCREMENT
	,text        TEXT NOT NULL
	,complete    BOOLEAN NOT NULL
	,previous_id INTEGER NOT NULL       -- First item will be -1
	,list_id     INTEGER NOT NULL

	-- Previous IDs must be in this table
	,FOREIGN KEY (previous_id) REFERENCES todos(id)
	,FOREIGN KEY (list_id) REFERENCES lists(id)

	-- Previous IDs must be unique - i.e. can't have two items with the same
	-- previous ID in the same list.
	,UNIQUE (list_id, previous_id)
)
`
