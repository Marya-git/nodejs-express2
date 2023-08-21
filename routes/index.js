var express = require('express')
  ,  router = express.Router();
let client, db_test
const fs = require('fs')
    , webDevGlossary= []
    , {MongoClient, ObjectId} = require('mongodb')
    , MongoLocalURI = 'mongodb://localhost:27017';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});

router.post('/service', function(res,req){
  savetoMongodb()
  function savetoMongodb(){
    const makeGlassory= () => {
      fs.readFile(__dirname.replace('routes', '') + '/static/html/glossary.html', (error, data) => {
      if (error) {
          throw error
      } 
      const items = data.toString().split("\n"); 
      let glossary;
      let id = 0;
      for (var i=4; i<items.length ; ++i) {
        const item = items[i].trim();
        if((item.indexOf('<li><strong>') == 0 )) {
            const termDef =item.substring(12).split(':');
            id++;
            glossary= {};
            glossary.term = termDef[0].trim();
            const def = termDef[1].split('</strong>');
            const defi = def[1].split('</li>');
            glossary.definition = defi[0].trim();
            glossary.id = id;
            webDevGlossary.push(glossary)
        }
      }
    });
    }
    makeGlassory();
    // create a MongoClient class
    client = new MongoClient(MongoLocalURI,{ useUnifiedTopology: true, useNewUrlParser: true });
    client.connect((error)=> {
        if (error) {
            console.log("Error connecting to mongo local: " + error);
        } else {
            console.log("Successfully connected to the mongo local" );
            db_test = client.db('db_test41');
            insertDatatoGlassory();
            // deletDatafromGlassory();
        }
    })
    const insertDatatoGlassory = () => {
        webDevGlossary.forEach(item => {
            db_test.collection('glossary').insertOne(item, function (err, doc) {
                if (err) {
                  console.log("error writing to the database: " + err);
                } else {
                  console.log("Record has been added to Mongodb");
                }
            });
        });  
    }
    const deletDatafromGlassory = () => {
        webDevGlossary.forEach(item =>{
            db_test.collection('glossary').deleteOne(getObjId(item.id), function(error, doc){
                if (error) {
                    console.log("error deleting to the database: " + error);
                  } else {
                    console.log("Record has been deleted from Mongodb");
                  }
            });
        });
    }
    const getObjId = (id) => {
        return {_id: new ObjectId(id)}
    } 
  }
})

module.exports = router;
