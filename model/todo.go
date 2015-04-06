package model

//	"database/sql"
import (
	"time"
	_ "fmt"
    _ "github.com/lib/pq"
    _ "database/sql"
)
///				`sql:"AUTO_INCREMENT"`
type Element struct {
	ID				int64			`sql:"AUTO_INCREMENT"`
	Item			string			`sql:"size:255"`
	Complete		bool			`sql:DEFAULT:false`
    CreatedAt		time.Time		`sql:"TIMESTAMP"`
    UpdatedAt		time.Time
    DeletedAt		time.Time
}
