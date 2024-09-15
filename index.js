import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db= new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"world",
  password:"5525",
  port:"5432"
});

db.connect();

app.get("/", async (req, res) => {
  const result= await db.query("SELECT country_code FROM visited_countries");
  console.log("res",result);
  let countries=[];
  result.rows.forEach((c) => {
    countries.push(c.country_code);
  });
  console.log("rows: ",result.rows);
  res.render("index.ejs",{countries: countries, total: countries.length});
  db.end();
  //Write your code here.
});


app.post("/add",async(req,res) => {
  db.connect();
  try {const country=req.body.country;
  console.log(country);
  const c=country.toLowercase();
  const code=await db.query("SELECT country_code FROM countries WHERE country_name=$1",[country]);
  console.log(code);
  // await db.query("Insert Into visited_countries (country_code) Values ($1)", [code]);
  // res.render("index.ejs",{});
  // db.end();
  }catch(error){
    console.error(error);
    res.status(500).send("Server Error");
  }finally{
    db.end();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
