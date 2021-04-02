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
        setTimeout(() => {
            deletePGN(req, res);
        }, 60 * 60 * 60);
        Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        }).then(response => {
            const writer = fs.createWriteStream(Path.join(dir, "temp.pgn"));
            response.data.pipe(writer)
        
            writer.on('finish', () => {
                return analyze(req, res);
            })
            writer.on('error', () => {
                return;
            });
        })
            .catch(err => {
                res.status(404).send({ message: err });
        })
        
    });
    
}

function deletePGN(req, res) {
    const dir = Path.join(__dirname, req.body.username);
    fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Folder ${req.body.username} is successfully deleted`);

    })
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
        const fen = req.body.fen;
        
        for (let i = 1; i < array.length; i++) {
            
            newStr = '[Event "Live Chess"]' + array[i];
            array[i] = newStr;
            
        }
        
        let numberOfGames = 50;
        let result = 0;
        let won = 0;
        let lost = 0;
        let drawn = 0;
        for (let k = 1; k < array.length && k < numberOfGames; k++) {
            let chess = new Chess();
        
            if (chess.load_pgn(array[k])) {
                console.log(chess.header());
            }
            if (timeControl && Number(chess.header().TimeControl) !== timeControl) {
                numberOfGames++;
                continue;
            }
            let chess1 = new Chess();
            const history = chess.history();
            for (let i = 0; i < history.length && i < req.body.numOfMoves; i++) {
                chess1.move(history[i]);
                let arr = chess1.fen().split(" ");
                arr.pop();
                arr.pop();
                arr.pop();
                let compare = arr.join(" ");
                if (compare === fen) {
                    result++;
                    if (chess.header().Termination.split(" ")[0] === req.body.username)
                        won++;
                    else if (chess.header().Termination.split(" ")[0] === "Game")
                        drawn++;
                    else
                        lost++;
                
                    break;
                }
            }
            

        }

        return res.status(200).send({message: "Done", result: result, won: won, lost: lost, drawn: drawn});
    });
}
function helper(req, res) {
    downloadPGN(req, res);
}
module.exports = helper;