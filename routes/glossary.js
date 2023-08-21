const  express = require('express')
    , router = express.Router();


router.get('/', function(req,res){
    res.sendFile(__dirname.replace('routes', '') + '/static/html/glossary.html')
    // res.sendFile('/images/a.png')
});



module.exports = router;