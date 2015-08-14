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

// ListLists accepts a request to retrieve a list of lists.
//
//     GET /api/lists
//
func ListLists(c web.C, w http.ResponseWriter, r *http.Request) {
	var (
		ctx    = context.FromC(c)
		limit  = ToLimit(r)
		offset = ToOffset(r)
	)

	lists, err := datastore.ListLists(ctx, limit, offset)
	if err != nil {
		log.FromContext(ctx).WithField("err", err).Error("Error listing lists")
		w.WriteHeader(http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(lists)
}

// GetList accepts a request to retrieve information about a particular list.
//
//     GET /api/lists/:list
//
func GetList(c web.C, w http.ResponseWriter, r *http.Request) {
	var (
		ctx   = context.FromC(c)
		idStr = c.URLParams["list"]
	)

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	list, err := datastore.GetList(ctx, id)
	if err != nil {
		log.FromContext(ctx).WithField("err", err).Error("Error getting list")
		w.WriteHeader(http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(list)
}

// DeleteList accepts a request to delete a list.
//
//     DELETE /api/lists/:list
//
func DeleteList(c web.C, w http.ResponseWriter, r *http.Request) {
	var (
		ctx   = context.FromC(c)
		idStr = c.URLParams["list"]
	)

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	err = datastore.DeleteList(ctx, id)
	if err != nil {
		log.FromContext(ctx).WithField("err", err).Error("Error deleting list")
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// CreateList accepts a request to add a new list.
//
//     POST /api/lists
//
func CreateList(c web.C, w http.ResponseWriter, r *http.Request) {
	var (
		ctx = context.FromC(c)
	)

	// Unmarshal the list from the payload
	defer r.Body.Close()
	in := struct {
		Name string `json:"name"`
	}{}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate input
	if len(in.Name) < 1 {
		http.Error(w, "no name given", http.StatusBadRequest)
		return
	}

	// Create our 'normal' model.
	list := &model.List{Name: in.Name}
	err := datastore.CreateList(ctx, list)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(list)
}
