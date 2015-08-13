package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/goji/context"
	"github.com/zenazn/goji/web"

	"github.com/andrew-d/todo/server/datastore"
	"github.com/andrew-d/todo/server/log"
	"github.com/andrew-d/todo/server/model"
)

// ListTodos accepts a request to retrieve a list of todos.
//
//     GET /api/todos
//
func ListTodos(c web.C, w http.ResponseWriter, r *http.Request) {
	var (
		ctx    = context.FromC(c)
		limit  = ToLimit(r)
		offset = ToOffset(r)
	)

	todos, err := datastore.ListTodos(ctx, limit, offset)
	if err != nil {
		log.FromContext(ctx).WithField("err", err).Error("Error listing todos")
		w.WriteHeader(http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(todos)
}

// GetTodo accepts a request to retrieve information about a particular todo.
//
//     GET /api/todos/:todo
//
func GetTodo(c web.C, w http.ResponseWriter, r *http.Request) {
	var (
		ctx   = context.FromC(c)
		idStr = c.URLParams["todo"]
	)

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	todo, err := datastore.GetTodo(ctx, id)
	if err != nil {
		log.FromContext(ctx).WithField("err", err).Error("Error getting todo")
		w.WriteHeader(http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(todo)
}

// DeleteTodo accepts a request to delete a todo.
//
//     DELETE /api/todos/:todo
//
func DeleteTodo(c web.C, w http.ResponseWriter, r *http.Request) {
	var (
		ctx   = context.FromC(c)
		idStr = c.URLParams["todo"]
	)

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = datastore.DeleteTodo(ctx, id)
	if err != nil {
		log.FromContext(ctx).WithField("err", err).Error("Error deleting todo")
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// CreateTodo accepts a request to add a new todo.
//
//     POST /api/todos
//
func CreateTodo(c web.C, w http.ResponseWriter, r *http.Request) {
	var (
		ctx = context.FromC(c)
	)

	// Unmarshal the todo from the payload
	defer r.Body.Close()
	in := struct {
		Text string `json:"text"`
	}{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Validate input
	if len(in.Text) < 1 {
		http.Error(w, "no text given", http.StatusBadRequest)
		return
	}

	// Create our 'normal' model.
	todo := new(model.Todo)
	todo.Text = in.Text

	err := datastore.CreateTodo(ctx, todo)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(todo)
}
