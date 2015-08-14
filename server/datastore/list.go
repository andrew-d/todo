package datastore

import (
	"golang.org/x/net/context"

	"github.com/andrew-d/todo/server/model"
)

type ListStore interface {
	// ListLists retrieves all lists from the database, possibly with an
	// offset or limit provided.
	ListLists(limit, offset int) ([]*model.List, error)

	// GetList retrieves a list from the datastore for the given ID.
	GetList(id int64) (*model.List, error)

	// CreateList saves a new list in the datastore.
	CreateList(list *model.List) error

	// DeleteList removes a list from the datastore.
	DeleteList(id int64) error
}

func ListLists(c context.Context, limit, offset int) ([]*model.List, error) {
	return FromContext(c).ListLists(limit, offset)
}

func GetList(c context.Context, id int64) (*model.List, error) {
	return FromContext(c).GetList(id)
}

func CreateList(c context.Context, list *model.List) error {
	return FromContext(c).CreateList(list)
}

func DeleteList(c context.Context, id int64) error {
	return FromContext(c).DeleteList(id)
}
