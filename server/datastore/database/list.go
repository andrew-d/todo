package database

import (
	"github.com/jmoiron/sqlx"

	"github.com/andrew-d/todo/server/model"
)

type ListStore struct {
	db *sqlx.DB
}

func NewListStore(db *sqlx.DB) *ListStore {
	return &ListStore{db}
}

func (s *ListStore) ListLists(limit, offset int) ([]*model.List, error) {
	lists := []*model.List{}
	err := s.db.Select(&lists, s.db.Rebind(listListQuery), limit, offset)
	return lists, err
}

func (s *ListStore) GetList(id int64) (*model.List, error) {
	list := &model.List{}
	err := s.db.Get(list, s.db.Rebind(listGetQuery), id)
	return list, err
}

func (s *ListStore) CreateList(list *model.List) error {
	ret, err := s.db.Exec(RebindInsert(s.db, listInsertQuery), list.Name)
	if err != nil {
		return err
	}

	list.ID, _ = ret.LastInsertId()
	return nil
}

func (s *ListStore) DeleteList(id int64) (err error) {
	var tx *sqlx.Tx

	tx, err = s.db.Beginx()
	if err != nil {
		return
	}

	// Automatically rollback/commit if there's an error.
	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	// Remove todos in this list.
	if _, err = tx.Exec(s.db.Rebind(listDeleteTodosQuery), id); err != nil {
		return
	}

	// Remove the given List
	if _, err = tx.Exec(s.db.Rebind(listDeleteQuery), id); err != nil {
		return
	}

	// Done!
	return nil
}

const listListQuery = `
SELECT *
FROM lists
ORDER BY id DESC
LIMIT ? OFFSET ?
`

const listGetQuery = `
SELECT *
FROM lists
WHERE id = ?
`

const listInsertQuery = `
INSERT
INTO lists (
     name
)
VALUES (?)
`

const listDeleteQuery = `
DELETE
FROM lists
WHERE id = ?
`

const listDeleteTodosQuery = `
DELETE
FROM todos
WHERE list_id = ?
`
