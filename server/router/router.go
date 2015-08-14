package router

import (
	"github.com/zenazn/goji/web"

	"github.com/andrew-d/todo/server/handler"
)

func New() *web.Mux {
	mux := web.New()

	mux.Get("/api/lists", handler.ListLists)
	mux.Post("/api/lists", handler.CreateList)
	mux.Get("/api/lists/:list", handler.GetList)
	mux.Delete("/api/lists/:list", handler.DeleteList)

	mux.Get("/api/todos", handler.ListTodos)
	mux.Post("/api/todos", handler.CreateTodo)
	mux.Get("/api/todos/:todo", handler.GetTodo)
	mux.Delete("/api/todos/:todo", handler.DeleteTodo)

	return mux
}
