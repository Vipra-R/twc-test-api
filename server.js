const express = require("express");
const { collection, collection2 } = require("./mongo");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = 3500


app.get("/",cors(),(req,res)=>{

})


app.post("/",async(req,res)=>{
    const{email,password}=req.body

    try {
        const user = await collection.findOne({ email: email });

        if (!user) {
            // If email doesn't exist in the database
            res.json("notexist");
        } else {
            // If email exists, check the password
            if (user.password === password) {
                // Password matches the corresponding email
                res.json("passwordmatch");
            } else {
                // Password doesn't match
                res.json("passwordnotmatch");
            }
        }
    } catch (e) {
        res.json("fail");
    }

})



app.post("/signup",async(req,res)=>{
    const{email,password}=req.body

    const data={
        email:email,
        password:password
    }

    try{
        const check=await collection.findOne({email:email})

        if(check){
            res.json("exist")
        }
        else{
            res.json("notexist")
            await collection.insertMany([data])
        }
    }
    catch(e){
        res.json("fail")
    }

})

app.post("/contacts/new", async (req, res) => {
    const { fullname, email, gender, phone_number } = req.body;

    const newContact = {
        fullname: fullname,
        email: email,
        gender: gender,
        phone_number: phone_number
    };

    try {
        const check = await collection2.findOne({ email: email });

        if (check) {
            res.json("exist");
        } 
        else {
            res.json("notexist");
            await collection2.insertMany([newContact]);
        }
    } 
    catch (e) {
        res.json("fail");
    }
});

app.get("/contacts", async (req, res) => {
    try {
        const contacts = await collection2.find();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch contacts", error: error.message });
    }
});

app.delete("/contacts/:email", async (req, res) => {
    const email = req.params.email;
  
    try {
      const deletedContact = await collection2.deleteOne({ email: email });
  
      if (deletedContact.deletedCount > 0) {
        res.json("deleted");
      } else {
        res.json("notfound");
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact", error: error.message });
    }
  });

app.put("/contacts/:email", async (req, res) => {
    const email = req.params.email;
    const { fullname, gender, phone_number } = req.body;
  
    try {
      const updatedContact = await collection2.findOneAndUpdate(
        { email: email },
        { $set: { fullname, gender, phone_number } },
        { new: true }
      );
  
      if (updatedContact) {
        res.json("updated");
      } else {
        res.json("notfound");
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact", error: error.message });
    }
  });

  app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if(req.accepts('json')){
        res.json({message: '404 Not Found'})
    }
    else{
        res.type('txt').send('404 Not Foumd')
    }
})

  
app.listen(PORT,()=>{
    console.log(`port connected on http://localhost:${PORT}/`);
})

