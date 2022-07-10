const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static(__dirname+"/Static"));

app.set("view engine","ejs");

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://VivekRathod:VRMongoDB@cluster0.drsxapy.mongodb.net/todoList?retryWrites=true&w=majority");

const listSchema = mongoose.Schema({
    listname: String,
    list: [String]
});
const List = mongoose.model("List",listSchema);


var defaultList = ["wake up","brush"];

app.get("/",function (req,res){

    List.findOne({listname: "Today"},function (err,foundList){

        

        if(foundList != null) {

            res.render("ToDoListHomePage",{ListName:"Today",L:foundList});

        } else {
            
            let list1 = new List({
                listname: "Today",
                list: defaultList
            });
            list1.save();
            res.redirect("/");

        }

    });

});

app.post("/",function (req,res){

    let newItem = req.body.newEvent;
    let lstName = req.body.list;
    List.findOne({listname:lstName}, function(err,doc){
        doc.list.push(newItem);
        doc.save();
        if(lstName === "Today") {
            res.redirect("/");
        } else {
            res.redirect("/"+lstName);
        }
    });
});

app.post("/delete",function (req,res){
    let dItem = req.body.checkboxItem;
    let listOfcheckboxItem = req.body.listNameOfItem;

    List.findOneAndUpdate({listname:listOfcheckboxItem},{$pull: {list:dItem}}, function(err,foundList){
        if(!err) {
            if(listOfcheckboxItem === "Today") {
                res.redirect("/");
            } else {
                res.redirect("/"+listOfcheckboxItem);
            }
        }
    });

});

app.get("/:customList", function (req,res){   

    let customListName = req.params.customList;
    List.findOne({listname: customListName}, function (err2,foundList2){

        if(foundList2 != null) {

            res.render("ToDoListHomePage",{ListName: customListName, L: foundList2});

        } else {
            
            let customList1 = new List({
                listname: customListName,
                list: defaultList
            });
            customList1.save();
            res.redirect("/"+ customListName);

        }
    });

});

app.listen(process.env.PORT || 3000, function (){
    console.log("Server is started at port 3000 !!");
})