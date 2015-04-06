package main

import (
	"github.com/go-martini/martini"
	"github.com/codegangsta/martini-contrib/render"
	"github.com/iamjono/todo/controllers"
	"github.com/iamjono/todo/model"
    "github.com/jinzhu/gorm"
    "fmt"
	"net/http"
	"encoding/json"
	"strconv"
)

func main() {
    // initialize the DbMap
    db := initDb()
    defer db.Close()
	
	// Get a UserController instance
	uc := controllers.NewItemController()
	
	m := martini.Classic()
	m.Use(martini.Static("public"))
	m.Use(render.Renderer())
	
	m.Group("/", func(r martini.Router) {
	    r.Get("", func(re render.Render) {
	    		re.HTML(200, "base", "xx")
	    		})
	    r.Get("api/get/:id", func(w http.ResponseWriter,r *http.Request,params martini.Params) string {
		        w.Header().Set("Content-Type", "application/json")
		        w.WriteHeader(200)
	    		i := uc.GetItem(r,db,params["id"])
	    		b, err := json.Marshal(i)
	    		if err != nil { checkErrSmall(err) }
	    		return string(b)
	    		})
	    r.Get("api/list", func(w http.ResponseWriter) string {
		        w.Header().Set("Content-Type", "application/json")
		        w.WriteHeader(200)
	    		i := uc.AllItems(db)
	    		b, err := json.Marshal(i)
	    		if err != nil { checkErrSmall(err) }
	    		if string(b) == "null" { return "{}" }
	    		return string(b)
	    		})
	    r.Put("api/new", func(w http.ResponseWriter,r *http.Request) string {
		        w.Header().Set("Content-Type", "application/json")
		        w.WriteHeader(200)
	    		i := uc.NewItem(db,r.FormValue("Item"))
	    		b, err := json.Marshal(i)
	    		if err != nil { checkErrSmall(err) }
	    		return string(b)
	    		})
	    r.Post("api/update", func(w http.ResponseWriter,r *http.Request) string {
		        w.Header().Set("Content-Type", "application/json")
		        w.WriteHeader(200)
		        id,_ := strconv.ParseInt(r.FormValue("ID"),0,32)
				uc.UpdateItem(db,id,r.FormValue("Item"))
	    		return "{}"
	    		})
	    r.Post("api/status", func(w http.ResponseWriter,r *http.Request) string {
		        w.Header().Set("Content-Type", "application/json")
		        w.WriteHeader(200)
		        id,_ := strconv.ParseInt(r.FormValue("ID"),0,32)
		        complete,_ := strconv.ParseBool(r.FormValue("Complete"))
		        uc.UpdateItemStatus(db,id,complete)
	    		return "{}"
	    		})
	    r.Delete("api/delete/:id", func(w http.ResponseWriter,r *http.Request,params martini.Params) string {
		        w.Header().Set("Content-Type", "application/json")
		        w.WriteHeader(200)
		        id,_ := strconv.ParseInt(params["id"],0,32)
	    		i := uc.DeleteItem(db,id)
	    		b, err := json.Marshal(i)
	    		if err != nil { checkErrSmall(err) }
	    		return string(b)
	    		})
	})
	m.Run()
}

func initDb() gorm.DB {
	db, err := gorm.Open("postgres", "user=todolist password=todolist dbname=todolist sslmode=disable")
    checkErr(err, "sql.Open failed")
    
	// Get database connection handle [*sql.DB](http://golang.org/pkg/database/sql/#DB)
	db.DB()
	
	// Enable Logger
	//db.LogMode(true)
	
//	db.DB().Ping()
	db.DB().SetMaxIdleConns(10)
	db.DB().SetMaxOpenConns(100)
	
	// Disable table name's pluralization
	db.SingularTable(true)
    
//    db.CreateTable(&model.Element{})
    
	db.AutoMigrate(&model.Element{})
	return db
}

func checkErr(err error, msg string) {
    if err != nil {
        fmt.Println(msg, err)
    }
}
func checkErrSmall(err error) {
    if err != nil {
        fmt.Println(err)
    }
}

