

module.exports = app => {
    const helper = require("../services/pgn.js");

    
        
    
    app.get("/analyze", helper);

    
};