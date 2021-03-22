const fs = require('fs')  
const Path = require('path')  
const Axios = require('axios')

async function downloadPGN(req, res) {  
    
    const url = `https://api.chess.com/pub/player/${req.body.username}/games/2021/03/pgn`;
    let dir = __dirname + "/../pgns/" + req.body.username;
    fs.mkdir(dir, { recursive: true }, async (err) => {
        if (err) throw err;

        const path = Path.resolve(dir, 'temp.pgn');
        const writer = fs.createWriteStream(path)
    
        const response = await Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
    
        response.data.pipe(writer)
    
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve)
            writer.on('error', reject)
        })
    });
    
}

function helper(req, res) {
    downloadPGN(req, res).then(() => {
        res.status(200).send({ message: "Done" });
    })
        .catch(err => {
            res.status(500).send({ message: "Damn" });
    })
}
module.exports = helper;