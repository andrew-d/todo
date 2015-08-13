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
		todosTable,
	}

	for _, stmt := range stmts {
		if _, err := tx.Exec(stmt); err != nil {
			return err
		}
	}

	return nil
}

const todosTable = `
CREATE TABLE IF NOT EXISTS todos (
	 id         INTEGER PRIMARY KEY AUTOINCREMENT
	,text       TEXT NOT NULL
	,complete   BOOLEAN NOT NULL
)
`
