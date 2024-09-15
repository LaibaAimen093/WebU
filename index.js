import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app= express();
const port=3000;

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"booknotes",
    password:"5525",
    port:5432,
});
db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let book=[
    // {
    //     id:1,
    //     isbn: 1234,
    //     title: "murder",
    //     author: "bill",
    //     dated: new Date(),
    //     coverUrl: "http",
    //     notes: "i have nothing to note so far"
    // }
];

app.get("/", async(req,res)=> {
    let result=await db.query("SELECT * from bookinfo");
    book = result.rows;
    console.log(book);
    // let isbn='https://covers.openlibrary.org/b/';
    // const url='https://covers.openlibrary.org/b/id/12547191-L.jpg';
    // const img = await fetchImage('https://covers.openlibrary.org/b/id/12547191-L.jpg');
    res.render("index.ejs", {books: book});
});

app.post("/submit" ,async(req,res)=> {
    try{const title=req.body.title;
    console.log(req.body.title);
    const author=req.body.author;
    const isbn=req.body.isbn;
    console.log(req.body.isbn);
    const isbnString = BigInt(isbn).toString(); // Convert to BigInt and then to string

    const url=`https://covers.openlibrary.org/b/isbn/${isbnString}-L.jpg`;
    console.log(url);
    const notes=req.body.notes;
    db.query("INSERT INTO bookinfo (notes, isbn, title, author, coverurl) VALUES ($1,$2,$3,$4,$5);",[notes,isbn,title,author,url]);

    res.redirect("/");
}catch(err){
    console.error('error',err);
    res.status(500).send('An error occurred while adding the book.');
}
});

app.get("/add", async(req,res)=>{
    res.render("addBooks.ejs");
})

app.get("/register",(req,res) =>{
    res.render("addBooks.ejs");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});