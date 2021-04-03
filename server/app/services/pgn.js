const fs = require('fs')  
const Path = require('path')  
const Axios = require('axios');
const { resolve } = require('path');


const { Chess } = require('chess.js')


function downloadPGN(req, res) {  

    /**
     * Format date
     * req.body.date should be yyyy-mm
     * Transform to yyyy/mm
     */

    let date = req.body.date.split("-").join("/");
    
    const url = `https://api.chess.com/pub/player/${req.body.username}/games/${date}/pgn`;

    let dir = Path.join(__dirname, req.body.username);
    fs.mkdir(dir, async (err) => {
        dir = Path.join(dir, req.body.date);
        fs.mkdir(dir, async (err) => {
            if (err) {
                return analyze(req, res);
            }
            setTimeout(() => {
                deletePGN(req, res);
            }, 1000 * 60 * 60);
            Axios({
                url,
                method: 'GET',
                responseType: 'stream'
            }).then(response => {
                const writer = fs.createWriteStream(Path.join(dir, `temp.pgn`));
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
    })
    
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
    var readStream = fs.createReadStream(Path.join(__dirname, req.body.username, req.body.date, "temp.pgn"));
    
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
        
        let numberOfGames = 100;
        
        
        let resData = { stats: { numberOfGames: 0, won: 0, drawn: 0, lost: 0 } };
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
            for (let i = 0; i < history.length && i < 20; i++) {
                chess1.move(history[i]);
                let arr = chess1.fen().split(" ");
                let game = "Game " + (resData.stats.numberOfGames + 1);
                arr.pop();
                arr.pop();
                arr.pop();
                let compare = arr.join(" ");
                if (compare === fen) {

                    resData = { ...resData, [game]: { result: chess.header().Termination, link: chess.header().Link }};
                    resData.stats.numberOfGames++;
                    if (chess.header().Termination.split(" ")[0] === req.body.username) {
                        resData.stats.won++;
                    }
                    else if (chess.header().Termination.split(" ")[0] === "Game") {
                        resData.stats.drawn++;
                    }
                    else {
                        resData.stats.lost++;
                    }
                    break;
                }
            }
            

        }

        return res.status(200).send(resData);
    });
}
function helper(req, res) {
    downloadPGN(req, res);
}
module.exports = helper;