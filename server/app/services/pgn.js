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
            return analyze(req, res);
        }
        const writer = fs.createWriteStream(Path.join(dir, "temp.pgn"));
        const response = await Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        })
    
        response.data.pipe(writer)
    
        
        writer.on('finish', () => {
            return analyze(req, res);
        })
        writer.on('error', reject)
        
    });
    
}
function analyze(req, res) {
    var readStream = fs.createReadStream(Path.join(__dirname, req.body.username, "temp.pgn"));
    
    let data = ''
    
    readStream.on('data', function (chunk) {
        data += chunk.toString();
        console.log(chunk.length);
    })
    
    
    readStream.on('end', function () {
        const pgnParser = require('pgn-parser');
        let array = data.split('[Event "Live Chess"]');
        const timeControl = req.body.timeControl;
        console.log(timeControl);
        for (let i = 1; i < array.length; i++) {
            
            newStr = '[Event "Live Chess"]' + array[i];
            array[i] = newStr;
            
        }
        console.log(array[1]);
        let numberOfGames = 50;

        for (let k = 1; k < array.length && k < numberOfGames; k++) {
            let chess = new Chess();
            
            if (chess.load_pgn(array[k])) {
                console.log(chess.header());
                console.log(`Final position of game ${k} is `, chess.fen());
            }
            if (timeControl && Number(chess.header().TimeControl) !== timeControl) {
                numberOfGames++;
                continue;
            }
            let chess1 = new Chess();
            const history = chess.history();
            for (let i = 0; i < history.length && i < req.body.numOfMoves; i++) {
                chess1.move(history[i]);
            }
            console.log(`Position of game ${k} at move 10 is `, chess1.fen());

        }

        return res.status(200).send({message: "Done"});
    });
}
function helper(req, res) {
    downloadPGN(req, res);
}
module.exports = helper;