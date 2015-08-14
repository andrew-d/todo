package database

import (
	"github.com/jmoiron/sqlx"

	"github.com/andrew-d/todo/server/model"
)

type TodoStore struct {
	db *sqlx.DB
}

func NewTodoStore(db *sqlx.DB) *TodoStore {
	return &TodoStore{db}
}

func (s *TodoStore) ListTodos(limit, offset int) ([]*model.Todo, error) {
	todos := []*model.Todo{}
	err := s.db.Select(&todos, s.db.Rebind(todoListQuery), limit, offset)
	return todos, err
}

func (s *TodoStore) GetTodo(id int64) (*model.Todo, error) {
	todo := &model.Todo{}
	err := s.db.Get(todo, s.db.Rebind(todoGetQuery), id)
	return todo, err
}

func (s *TodoStore) CreateTodo(todo *model.Todo) error {
	ret, err := s.db.Exec(RebindInsert(s.db, todoInsertQuery),
		todo.Text,
		false, // completed
		0,     // list id
	)
	if err != nil {
		return err
	}

	todo.ID, _ = ret.LastInsertId()

	// Get the record we just inserted in order to retrieve the order.
	inserted, err := s.GetTodo(todo.ID)
	if err == nil {
		todo.PreviousID = inserted.PreviousID
	}

	return nil
}

func (s *TodoStore) DeleteTodo(id int64) (err error) {
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

	// Get the given Todo
	todo := &model.Todo{}
	if err = tx.Get(todo, s.db.Rebind(todoGetQuery), id); err != nil {
		return
	}

	// Remove the given Todo
	if _, err = tx.Exec(s.db.Rebind(todoDeleteQuery), id); err != nil {
		return
	}

	// Fix any previous link - change any `previous_id` that points at our
	// current id to point at what we point at.
	if _, err = tx.Exec(s.db.Rebind(todoRelinkQuery),
		todo.PreviousID, // New previous_id
		id,              // Old previous_id
		todo.ListID,     // List ID
	); err != nil {
		return
	}

	// Done!
	return nil
}

const todoListQuery = `
SELECT *
FROM todos
ORDER BY id DESC
LIMIT ? OFFSET ?
`

const todoGetQuery = `
SELECT *
FROM todos
WHERE id = ?
`

const todoInsertQuery = `
INSERT
INTO todos (
     text
	,complete
	,list_id
	,previous_id
)
SELECT
	 ?
	,?
	,?
	,COALESCE(MAX(id), -1)
FROM todos
`

const todoDeleteQuery = `
DELETE
FROM todos
WHERE id = ?
`

const todoRelinkQuery = `
UPDATE todos
SET previous_id = ?
WHERE previous_id = ?
  AND list_id = ?
`
