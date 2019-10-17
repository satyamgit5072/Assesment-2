const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(express.json())
const async = require('async');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port =3000;
app.listen(port, ()=>{console.log('Server started on '+port)});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req,res)=> {
    res.send('Welcome to deltal school')})
var trainees = [
    {id: 101, name: "sai", year: 2018, overall_rating: 7.1},
    {id: 102, name: "vneky", year: 2019, overall_rating: 8.7},
    {id: 103, name: "leela", year: 2018, overall_rating: 9},
    {id: 104, name: "chinhu", year: 2019, overall_rating: 7.9}
 ];
app.get('/trainees',(req,res)=> {
    res.send(trainees)
});
app.get('/trainees/:id([0-9]{3,})', function(req, res){
   var dtrainee = trainees.filter(function(trainee){
      if(trainee.id == req.params.id){
         return true;
      }
   });
   if(dtrainee.length == 1){
      res.json(dtrainee[0])
   } else {
      res.status(404);
      res.json({message: "Not Found"});
   }
});
app.post('/trainees', function(req, res){
    if(!req.body.name  ||
       !req.body.year.toString().match(/^[0-9]{4}$/g) ||
      !req.body.overall_rating.toString().match(/^[0-9]\.[0-9]$/g)){
       res.status(400);
       res.json({message: "Bad Request"});
    } else {
       var newId = trainees[trainees.length-1].id+1;
       trainees.push({
          id: newId,
          name: req.body.name,
          year: req.body.year,
          overall_rating: req.body.overall_rating
       });
       res.json({message: "New trainee created.", location: "/trainees/" + newId});
    }
 });
 app.put('/trainees/:id', function(req, res){
   if(!req.body.name ||
      !req.body.year.toString().match(/^[0-9]{4}$/g) ||
      !req.body.overall_rating.toString().match(/^[0-9]\.[0-9]$/g) ||
      !req.params.id.toString().match(/^[0-9]{3,}$/g)){
      res.status(400);
      res.json({message: "Bad Request"});
   } else {
      var updateIndex = trainees.map(function(trainee){
         return trainee.id;
      }).indexOf(parseInt(req.params.id));
      if(updateIndex === -1){
         trainees.push({
            id: parseInt(req.params.id),
            name: req.body.name,
            year: req.body.year,
            overall_rating: req.body.overall_rating
         });
         res.json({message: "New trainee created.", location: "/trainees/" + req.params.id});
      } else {
         trainees[updateIndex] = {
            id: parseInt(req.params.id),
            name: req.body.name,
            year: req.body.year,
            overall_rating: req.body.overall_rating
         };
         res.json({message: "trainee id " + req.params.id + " updated.", 
            location: "/trainees/" + req.params.id});
      }
   }
});
app.delete('/trainees/:id', function(req, res){
   var removeIndex = trainees.map(function(trainee){
      return trainee.id;
   }).indexOf(parseInt(req.params.id));
   if(removeIndex === -1){
      res.json({message: "Not found"});
   } else {
      trainees.splice(removeIndex, 1);
      res.send({message: "trainee id " + req.params.id + "removed."});
   }
});
app.get('/oldtrainees/',(req,res)=>{
async.auto({
   one : function(callback)
   {
      callback(null,trainees[0])
   },
   two : function(callback)
   {
      callback(null,trainees[1])
   },
   three : function(callback)
   {
      callback(null,trainees[2])
   },
   four  : function(callback)
   {
      callback(null,trainees[3])
   }
},
function(err,results)
{
   if(err)
   {
      res.send('Bad request');
   }
   else
   console.log(results);
   res.send(results);
})
})





