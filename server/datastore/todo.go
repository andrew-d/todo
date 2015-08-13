package datastore

import (
	"golang.org/x/net/context"

	"github.com/andrew-d/todo/server/model"
)

type TodoStore interface {
	// ListTodos retrieves all todos from the database, possibly with an
	// offset or limit provided.
	ListTodos(limit, offset int) ([]*model.Todo, error)

	// GetTodo retrieves a todo from the datastore for the given ID.
	GetTodo(id int64) (*model.Todo, error)

	// CreateTodo saves a new todo in the datastore.
	CreateTodo(todo *model.Todo) error

	// DeleteTodo removes a todo from the datastore.
	DeleteTodo(id int64) error
}

func ListTodos(c context.Context, limit, offset int) ([]*model.Todo, error) {
	return FromContext(c).ListTodos(limit, offset)
}

func GetTodo(c context.Context, id int64) (*model.Todo, error) {
	return FromContext(c).GetTodo(id)
}

func CreateTodo(c context.Context, todo *model.Todo) error {
	return FromContext(c).CreateTodo(todo)
}

func DeleteTodo(c context.Context, id int64) error {
	return FromContext(c).DeleteTodo(id)
}
