import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"5525",
  port:5432,
}); 
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
  const result=await db.query("SELECT * FROM items");
  items=result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1);",[item]);
  // items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const newValue=req.body.updatedItemTitle;
  const newId=req.body.updatedItemId;
  await db.query("UPDATE items SET title = ($1) where id =($2);",[newValue,newId]);
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  const delID=req.body.deleteItemId;
  await db.query("DELETE from items where id=($1);",[delID]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
