package controllers 

import (
	_ "fmt"
    "github.com/jinzhu/gorm"
	"github.com/iamjono/todo/model"
	"net/http"
)

type (
	// UserController represents the controller for operating on the Item resource
	ItemController struct {
		
	}
)

// NewItemController provides a reference to a ItemController
func NewItemController() *ItemController {
	return &ItemController{}
}

func (uc ItemController) AllItems(db gorm.DB) []model.Element {
	var o []model.Element
	db.Order("id desc").Find(&o)
	return o
}
func (uc ItemController) GetItem(r *http.Request,db gorm.DB,id string) model.Element {
	o := model.Element{}
	db.First(&o,id)
	return o
}

func (uc ItemController) NewItem(db gorm.DB,item string) model.Element {
	obj := model.Element{Item: item}
	db.Create(&obj)
	return obj
}

func (uc ItemController) UpdateItem(db gorm.DB,id int64,item string) {
	o := model.Element{}
	db.First(&o, id).Update("item", item)
}

func (uc ItemController) UpdateItemStatus(db gorm.DB,id int64,complete bool) {
	o := model.Element{}
	db.First(&o, id).Update("complete", complete)
}

func (uc ItemController) DeleteItem(db gorm.DB,id int64) string {
	obj := model.Element{ID: id}
	db.Delete(&obj)
	return ""
}
