require('dotenv').config();
const express=require('express');
const server=express();
const cors=require('cors');
const { default: axios } = require('axios');
server.use(cors());
server.use(express.json());
const PORT=process.env.PORT;
const mongoose = require('mongoose');

main().catch(err => console.log(err));

let Fruit;
async function main() {
//   await mongoose.connect('mongodb://localhost:27017/fruit');
  await mongoose.connect(process.env.MONGO_URL);

  const FruitSchema = new mongoose.Schema({
    name: String,
    image:String,
    price:String,
    email:String
  });
   Fruit = mongoose.model('fruit', FruitSchema);

//    testFunction()
}
async function testFunction(){
    const sample = new Fruit({ name: 'Bananna' });
    await sample.save()
}

//Servers
//http://localhost:3010/fruit
server.get('/fruit',gettingDataHandler)
//http://localhost:3010/addfruit
server.post('/addfruit',addDataHandler)
//http://localhost:3010/getmongodata?email=${email}
server.get('/getmongodata',getMongoDataHandler)
//http://localhost:3010/updatedata/${:id}
server.put('/updatedata/:id',updateDataHandler)
//http://localhost:3010/deletedata/${:id}?email=${email}
server.delete('/deletedata/:id',deleteDataHandler)


//Functions Handlers
function gettingDataHandler(req,res){
    let dataArray=[];
    axios
    .get("https://fruit-api-301.herokuapp.com/getFruit")
    .then(result=>{
        dataArray=result.data.fruits.map(item=>{
            return item;
        })
        res.send(dataArray)
    })
    .catch(err=>{
        console.log(err);
    })
}
function addDataHandler(req,res){
    const {email,name,image,price}=req.body

    Fruit.create({
        name:name,
        image:image,
        price:price,
        email:email
    })
    Fruit.find({email:email},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
        }
    })
}

function getMongoDataHandler(req,res){
    console.log("hello");
    const email=req.query.email
    Fruit.find({email:email},(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result)
            console.log(result);
        }
    })
}

function updateDataHandler(req,res){
    const id=req.params.id
    const{email,photo,name,price}=req.body

    Fruit.findByIdAndUpdate(id,{photo,name,price},(err,result)=>{
        Fruit.find({email:email},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send(result)
            }
        })
    })


}

function deleteDataHandler(req,res){
    const id=req.params.id
    const email=req.query.email

    Fruit.deleteOne({_id:id},(err,result)=>{
        Fruit.find({email:email},(err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send(result)
            }
        })
    })
}


server.listen(PORT,()=>{
    console.log("listening on port "+PORT);
})