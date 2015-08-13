package database

import (
	"sort"
	"testing"

	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/suite"

	"github.com/andrew-d/todo/server/model"
)

type TodoStoreSuite struct {
	suite.Suite

	db *sqlx.DB
	ts *TodoStore
}

func TestTodoStore(t *testing.T) {
	db := MustConnect("sqlite3", ":memory:")
	ts := NewTodoStore(db)

	suite.Run(t, &TodoStoreSuite{
		db: db,
		ts: ts,
	})
}

func (s *TodoStoreSuite) SetupTest() {
	s.db.Exec(`DELETE FROM todos`)
}

func (s *TodoStoreSuite) TestCreateTodo() {
	r := model.Todo{
		Text: "foo",
	}
	err := s.ts.CreateTodo(&r)

	s.NoError(err)
	s.NotEqual(0, r.ID)
}

func (s *TodoStoreSuite) TestDeleteOneTodo() {
	r := model.Todo{
		Text: "foo",
	}
	err := s.ts.CreateTodo(&r)
	s.NoError(err)

	todos, err := s.ts.ListTodos(10, 0)
	s.NoError(err)
	s.Equal(1, len(todos))

	err = s.ts.DeleteTodo(r.ID)
	s.NoError(err)

	todos, err = s.ts.ListTodos(10, 0)
	s.NoError(err)
	s.Equal(0, len(todos))
}

func (s *TodoStoreSuite) insertTestData() []int64 {
	var ids []int64

	for _, txt := range []string{"foo", "bar", "baz"} {
		t := model.Todo{
			Text: txt,
		}
		err := s.ts.CreateTodo(&t)
		s.NoError(err)

		ids = append(ids, t.ID)
	}

	return ids
}

func (s *TodoStoreSuite) TestDeleteMiddleTodo() {
	ids := s.insertTestData()
	todos, err := s.ts.ListTodos(10, 0)
	s.NoError(err)
	s.Equal(3, len(todos))

	// Delete the 'middle' Todo...
	err = s.ts.DeleteTodo(ids[1])
	s.NoError(err)

	// ... and assert that the previous ID links still work
	todos, err = s.ts.ListTodos(10, 0)
	s.NoError(err)
	s.Equal(2, len(todos))

	sort.Sort(ByPreviousID(todos))
	s.Equal(-1, todos[0].PreviousID)
	s.Equal(todos[0].ID, todos[1].PreviousID)
}

func (s *TodoStoreSuite) TestDeleteFirstTodo() {
	ids := s.insertTestData()
	todos, err := s.ts.ListTodos(10, 0)
	s.NoError(err)
	s.Equal(3, len(todos))

	// Delete the 'first' Todo...
	err = s.ts.DeleteTodo(ids[0])
	s.NoError(err)

	// ... and assert that the previous ID links still work
	todos, err = s.ts.ListTodos(10, 0)
	s.NoError(err)
	s.Equal(2, len(todos))

	sort.Sort(ByPreviousID(todos))
	s.Equal(-1, todos[0].PreviousID)
	s.Equal(todos[0].ID, todos[1].PreviousID)
}

type ByPreviousID []*model.Todo

func (w ByPreviousID) Len() int           { return len(w) }
func (w ByPreviousID) Swap(i, j int)      { w[i], w[j] = w[j], w[i] }
func (w ByPreviousID) Less(i, j int) bool { return w[i].PreviousID < w[j].PreviousID }

/*
func (s *TodoStoreSuite) TestUpdateTodo() {
	r1 := model.Todo{
		Text: "foo",
	}
	err := s.ts.CreateTodo(&r1)

	todo, err := s.ts.GetTodo(r1.ID)
	s.NoError(err)
	s.Equal("foo", todo.Text)

	err = s.ts.UpdateTodo(&model.Todo{
		ID:   r1.ID,
		Text: "bar",
	})
	s.NoError(err)

	todo, err = s.ts.GetTodo(r1.ID)
	s.NoError(err)
	s.Equal("bar", todo.Text)
}
*/
