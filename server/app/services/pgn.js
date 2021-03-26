const fs = require('fs')  
const Path = require('path')  
const Axios = require('axios');
const { resolve } = require('path');


const { Chess } = require('chess.js')


function downloadPGN(req, res) {  
    
    const url = `https://api.chess.com/pub/player/${req.body.username}/games/2021/03/pgn`;
    let dir = Path.join(__dirname, req.body.username);
    fs.mkdir(dir, async (err) => {
        if (err) {
            return new Promise((resolve, _) => {
                resolve();
            })
        }
        const writer = fs.createWriteStream(Path.join(dir, "temp.pgn"));
        const response = await Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
    
        response.data.pipe(writer)
    
        
        writer.on('finish', () => {
            var readStream = fs.createReadStream(Path.join(__dirname, req.body.username, "temp.pgn"));
            
            let data = ''
            
            readStream.on('data', function (chunk) {
                data += chunk.toString();
                console.log(chunk.length);
            })
            
            
            readStream.on('end', function () {
                const pgnParser = require('pgn-parser');
                let array = data.split('[Event "Live Chess"]');
                console.log(array.length);
                for (let i = 1; i < array.length; i++) {
                    
                    newStr = '[Event "Live Chess"]' + array[i];
                    array[i] = newStr;
                    
                }
                console.log(array[1]);
                const chess = new Chess();
                if (chess.load_pgn(array[1])) {
                    console.log("Final position is ", chess.fen());
                }

                const chess1 = new Chess();
                const history = chess.history();
                for (let i = 0; i < history.length && i < 10; i++) {
                    chess1.move(history[i]);
                }
                console.log("Position at move 10 is ", chess1.fen());

                return res.status(200).send({message: "Done"});
            });
        })
        writer.on('error', reject)
        
    });
    
}

function helper(req, res) {
    downloadPGN(req, res);
}
module.exports = helper;