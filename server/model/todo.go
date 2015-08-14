package model

type Todo struct {
	ID         int64  `db:"id"          json:"id"`
	Text       string `db:"text"        json:"text"`
	Complete   bool   `db:"complete"    json:"complete"`
	PreviousID int64  `db:"previous_id" json:"previous_id"`
	ListID     int64  `db:"list_id"     json:"list_id"`
}
