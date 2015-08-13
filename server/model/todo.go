package model

type Todo struct {
	ID       int64  `db:"id"       json:"id"`
	Text     string `db:"text"     json:"text"`
	Complete bool   `db:"complete" json:"complete"`
}
