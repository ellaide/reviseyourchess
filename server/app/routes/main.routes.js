

module.exports = app => {
    const helper = require("../services/pgn.js");

    app.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Accept"
        );
        next();
    });
        
    
    app.post("/analyze", helper);

    
};