const KNIGHT_MOVEMENTS = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];
const BISHOP_MOVEMENTS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ROOK_MOVEMENTS = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const QUEEN_MOVEMENTS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const PAWN_MOVEMENTS = [[1, 0], [2, 0], [1, 1], [1, -1]];
const KING_MOVEMENTS = QUEEN_MOVEMENTS;
const CASTLING_MOVEMENTS = [[0, 2]];
/* For castling privileges */
const LEFT_ROOK = 4;
const KING = 2;
const RIGHT_ROOK = 1;


const matching = { 'q': QUEEN_MOVEMENTS, 'r': ROOK_MOVEMENTS, 'b': BISHOP_MOVEMENTS };

const main = (board, attacked, prevSelected, currSelected, whiteToMove, castling) => {
    let x = Math.floor(currSelected / 8);
    let y = currSelected % 8;
    let piece = board[x][y];
    let moved = false;
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
        moved = true;
        if (attackingPiece.toLowerCase() === 'k') {
            castling = castle(board, y, selectedY, whiteToMove, castling);
        }
        else if (attackingPiece.toLowerCase() === 'r') {
            let start = whiteToMove ? 8 : 1;
            let isLeft = selectedY == 0 ? true : false;
            if (isLeft) {
                if (castling & (start << 2))
                    castling -= start << 2;
            }
            else {
                if (castling & start)
                    castling -= start;
            }
        }
        removeDots(board);
    }
    else if ((isBlack(piece) && whiteToMove) || (!isBlack(piece) && !whiteToMove)) {
        currSelected = prevSelected;
    }
    else {
        removeDots(board);
        attacked = functionMatching[piece.toLowerCase()](piece, board, x, y, castling);
    }

    return [{attacked: attacked, board: board, selected: currSelected, castling: castling}, moved];

}
const castle = (board, currPosKing, prevPosKing, whiteToMove, castling) => {
    if (Math.abs(prevPosKing - currPosKing) == 1) {
        return castling;
    }
    if (prevPosKing - currPosKing == 2) {
        let rookX = whiteToMove ? 7 : 0;
        let rookY = 0;
        board[rookX][rookY] = '0';
        board[rookX][currPosKing + 1] = whiteToMove ? 'R' : 'r';
    }
    else if (currPosKing - prevPosKing == 2) {
        let rookX = whiteToMove ? 7 : 0;
        let rookY = 7;
        board[rookX][rookY] = '0';
        board[rookX][currPosKing - 1] = whiteToMove ? 'R' : 'r';
    }
    castling -= whiteToMove ? 1 << 4 : 1 << 1;
    return castling;

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

const getCastling = (board, x, y, castling) => {
    let black = isBlack(board[x][y]);
    if (black) {
        castling <<= 3;
        castling >>= 3;
    }
    else {
        castling >>= 3;
    }
    return castling;

}

const king = (piece, board, x, y, castling) => {
    let attacked = [];


    castling = getCastling(board, x, y, castling);
    console.log(castling);
    /* Castle to the left */
    if ((castling & KING) && (castling & LEFT_ROOK)) {
        let i = 1;
        for (i; i < 4; i++) {
            if (board[x][y - i] !== '0')
                break;
        }
        if (i == 4)
            board[x][y - CASTLING_MOVEMENTS[0][1]] = '.';
    }
    /* Castle to the right */
    if ((castling & KING) && (castling & RIGHT_ROOK)) {
        let i = 1;
        for (i = 1; i < 3; i++) {
            if (board[x][y + i] !== '0') {
                break;
            }
        }
        
        if (i == 3)
            board[x][y + CASTLING_MOVEMENTS[0][1]] = '.';
        
    }

    
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