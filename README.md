# Go Todo
A demo Golang Todo list, using Martini, React, Flux

Requires the following libraries to be imported:
- github.com/jinzhu/gorm
- github.com/go-martini/martini
- github.com/codegangsta/martini-contrib/render
- github.com/lib/pq

This project is set up with a Postgres backend (can be easily adjusted using GORM). 
- Database name: 'todolist'
- User name: 'todolist'
- Password: 'todolist'

From the directory, run

    go run server.go

If making changes to the JavaScript files, in a terminal window cd'd to the todo directory:

    npm install
    npm start
    
Read more about Flux & React at https://github.com/facebook/flux
