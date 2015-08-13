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
		false,
	)
	if err != nil {
		return err
	}

	todo.ID, _ = ret.LastInsertId()
	return nil
}

func (s *TodoStore) DeleteTodo(id int64) error {
	_, err := s.db.Exec(s.db.Rebind(todoDeleteQuery), id)
	return err
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
)
VALUES (?, ?)
`

const todoDeleteQuery = `
DELETE
FROM todos
WHERE id = ?
`
