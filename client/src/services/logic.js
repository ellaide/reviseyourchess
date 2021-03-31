const KNIGHT_MOVEMENTS = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];
const BISHOP_MOVEMENTS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ROOK_MOVEMENTS = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const QUEEN_MOVEMENTS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const PAWN_MOVEMENTS = [[1, 0], [2, 0], [1, 1], [1, -1]];
const KING_MOVEMENTS = QUEEN_MOVEMENTS;

const matching = { 'q': QUEEN_MOVEMENTS, 'r': ROOK_MOVEMENTS, 'b': BISHOP_MOVEMENTS };

const main = (board, attacked, prevSelected, currSelected) => {
    let x = Math.floor(currSelected / 8);
    let y = currSelected % 8;
    let piece = board[x][y];
    if (piece === '0') {
        removeDots(board);
        currSelected = -1;
        attacked = [];
    }
    else if (piece === '.' || attacked.includes(x * 8 + y)) {
        let selectedX = Math.floor(prevSelected / 8);
        let selectedY = prevSelected % 8;
        let attackingPiece = board[selectedX][selectedY];
        board[selectedX][selectedY] = '0';
        board[x][y] = attackingPiece;
        currSelected = -1;
        attacked = [];
        removeDots(board);
    }
    else {
        removeDots(board);
        attacked = functionMatching[piece.toLowerCase()](piece, board, x, y);
    }

    return {attacked: attacked, board: board, selected: currSelected};

}
const move = () => {

}

const isBlack = (piece) => {
    return piece.toUpperCase() !== piece;
}
const boundaries = (x, y) => {
    return x < 0 || x >= 8 || y < 0 || y >= 8;
}
const removeDots = (board) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === '.') {
                board[i][j] = '0';
            }
        }
    }
}

const infinitePieces = (piece, board, x, y) => {
    let attacked = [];
    for (let i = 0; i < matching[piece.toLowerCase()].length; i++) {
        for (let j = 1; j < 8; j++) {
            let currX = x + matching[piece.toLowerCase()][i][0] * j;
            let currY = y + matching[piece.toLowerCase()][i][1] * j;
            if (boundaries(currX, currY)) {
                continue;
            }
            if (board[currX][currY] === '0') {
                board[currX][currY] = '.';
            }
            else if (!isBlack(piece) && isBlack(board[currX][currY])) {
                attacked.push(currX * 8 + currY);
                break;
            }
            else if (isBlack(piece) && !isBlack(board[currX][currY])){
                attacked.push(currX * 8 + currY);
                break;
            }
            else
                break;
        }
    }
    return attacked;
}

const king = (piece, board, x, y) => {
    let attacked = [];
    for (let i = 0; i < KING_MOVEMENTS.length; i++) {
        
        let currX = x + KING_MOVEMENTS[i][0];
        let currY = y + KING_MOVEMENTS[i][1];
        if (boundaries(currX, currY)) {
            continue;
        }
        if (board[currX][currY] === '0') {
            board[currX][currY] = '.';
        }
        else if (!isBlack(piece) && isBlack(board[currX][currY])) {
            attacked.push(currX * 8 + currY);
            
        }
        else if (isBlack(piece) && !isBlack(board[currX][currY])){
            attacked.push(currX * 8 + currY);
            
        }
    }

    return attacked;
}

const pawn = (piece, board, x, y) => {
    let attacked = [];
    let rank = isBlack(piece) ? 1 : 6;
    for (let i = 0; i < PAWN_MOVEMENTS.length; i++) {
        let currX = x + PAWN_MOVEMENTS[i][0] * (isBlack(piece) ? 1 : -1);
        let currY = y + PAWN_MOVEMENTS[i][1];
        if (boundaries(currX, currY)) {
            continue;
        }
        if (board[currX][currY] === '0') {
            if (i == 0 || (i == 1 && x == rank))
                board[currX][currY] = '.';
        }
        else if (i >= 2 && (isBlack(piece) && !isBlack(board[currX][currY]))) {
            attacked.push(currX * 8 + currY);
        } 
        else if (i >= 2 && (!isBlack(piece) && isBlack(board[currX][currY]))) {
            attacked.push(currX * 8 + currY);
        }
    }
    return attacked;
}

const knight = (piece, board, x, y) => {
    let attacked = [];
    for (let i = 0; i < KNIGHT_MOVEMENTS.length; i++) {
        let currX = x + KNIGHT_MOVEMENTS[i][0];
        let currY = y + KNIGHT_MOVEMENTS[i][1];
        if (boundaries(currX, currY)) {
            continue;
        }
        if (board[currX][currY] === '0') {
            board[currX][currY] = '.';
        }
        else if (!isBlack(piece) && isBlack(board[currX][currY])) {
            attacked.push(currX * 8 + currY);
        }
        else if (isBlack(piece) && !isBlack(board[currX][currY])){
            attacked.push(currX * 8 + currY);
        }
    }
    return attacked;
}

const functionMatching = { 'p': pawn, 'n': knight, 'q': infinitePieces, 'r': infinitePieces, 'b': infinitePieces, 'k': king };

export default main;