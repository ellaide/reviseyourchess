import react, { Component } from 'react';
const KNIGHT_MOVEMENTS = [[1, 2], [-1, 2], [1, -2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];
const BISHOP_MOVEMENTS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const ROOK_MOVEMENTS = [[0, 1], [0, -1], [1, 0], [-1, 0]];
const QUEEN_MOVEMENTS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
class Piece extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        
        const source = "/assets/pieces/" + (this.props.black ? "black_" : "white_") + this.props.piece + ".svg";
        return (
            <img src={source}></img>
        )
    }
}
class Empty extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div style={{ width: "45px", height: "45px" }}>
                {this.props.attacked && <div className="circle">
                </div>}
            </div>
        )
    }
}
class Cell extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        if (this.props.empty) {
            return;
        }
        this.props.onClick(this.props.id);
    }

    render() {
        return (
            <div onClick={this.handleClick} style={this.props.style} className="col-12-1">
                { this.props.piece }
            </div>
        )
    }

}
class ChessBoard extends Component {
    constructor(props) {
        super(props);
        let board = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
        this.state = {
            board: board,
            selected: -1,
            attacked: []
        }
        this.select = this.select.bind(this);
    }
    resetDots(board) {

    }
    select(key) {
        
        let index = Number(key);
        let x = Math.floor(index / 8);
        let y = index % 8;
        let clone = this.state.board.map(arr => arr.slice());
        let attacked = [];
        if (this.state.board[x][y] === '.') {
            let selectedX = Math.floor(this.state.selected / 8);
            let selectedY = this.state.selected % 8;
            let attackingPiece = this.state.board[selectedX][selectedY];
            clone[selectedX][selectedY] = '0';
            clone[x][y] = attackingPiece;
            for (let i = 0; i < clone.length; i++) {
                for (let j = 0; j < clone[i].length; j++) {
                    if (clone[i][j] === '.') {
                        clone[i][j] = '0';
                    }
                }
            }
            this.setState({
                board: clone,
                selected: -1,
                attacked: []
            });
            return;
        }
        this.setState({
            selected: index
        })
        console.log(KNIGHT_MOVEMENTS);
        console.log(x + " " + y);
        let piece = this.state.board[x][y];
        
        for (let i = 0; i < clone.length; i++) {
            for (let j = 0; j < clone[i].length; j++) {
                if (clone[i][j] === '.') {
                    clone[i][j] = '0';
                }
            }
        }
        if (piece === 'P') {
            if (clone[x - 1][y] === '0') {
                clone[x - 1][y] = '.';
            }
        }
        else if (piece === 'p') {
            if (clone[x + 1][y] === '0') {
                clone[x + 1][y] = '.';
            }
        }
        if (piece === 'N' || piece === 'n') {
            for (let i = 0; i < KNIGHT_MOVEMENTS.length; i++) {
                let currX = x + KNIGHT_MOVEMENTS[i][0];
                let currY = y + KNIGHT_MOVEMENTS[i][1];
                if (currX < 0 || currX >= 8 || currY < 0 || currY >= 8) {
                    continue;
                }
                if (clone[currX][currY] === '0') {
                    clone[currX][currY] = '.';
                }
                else if (piece === 'n' && clone[currX][currY].toUpperCase() === clone[currX][currY]) {
                    attacked.push(currX * 8 + currY);
                }
                else if (piece === 'N' && clone[currX][currY].toUpperCase() !== clone[currX][currY]){
                    attacked.push(currX * 8 + currY);
                }
            }
        }
        if (piece === 'B' || piece === 'b') {
            for (let i = 0; i < BISHOP_MOVEMENTS.length; i++) {
                for (let j = 1; j < 8; j++) {
                    let currX = x + BISHOP_MOVEMENTS[i][0] * j;
                    let currY = y + BISHOP_MOVEMENTS[i][1] * j;
                    if (currX < 0 || currX >= 8 || currY < 0 || currY >= 8) {
                        continue;
                    }
                    if (clone[currX][currY] === '0') {
                        clone[currX][currY] = '.';
                    }
                    else
                        break;
                }
            }
        }
        if (piece === 'R' || piece === 'r') {
            for (let i = 0; i < ROOK_MOVEMENTS.length; i++) {
                for (let j = 1; j < 8; j++) {
                    let currX = x + ROOK_MOVEMENTS[i][0] * j;
                    let currY = y + ROOK_MOVEMENTS[i][1] * j;
                    if (currX < 0 || currX >= 8 || currY < 0 || currY >= 8) {
                        continue;
                    }
                    if (clone[currX][currY] === '0') {
                        clone[currX][currY] = '.';
                    }
                    else
                        break; 
                }
            }
        }
        if (piece === 'Q' || piece === 'q') {
            for (let i = 0; i < QUEEN_MOVEMENTS.length; i++) {
                for (let j = 1; j < 8; j++) {
                    let currX = x + QUEEN_MOVEMENTS[i][0] * j;
                    let currY = y + QUEEN_MOVEMENTS[i][1] * j;
                    if (currX < 0 || currX >= 8 || currY < 0 || currY >= 8) {
                        continue;
                    }
                    if (clone[currX][currY] === '0') {
                        clone[currX][currY] = '.';
                    }
                    else
                        break; 
                }
            }
        }
        if (piece === 'K' || piece === 'k') {
            for (let i = 0; i < QUEEN_MOVEMENTS.length; i++) {
                
                let currX = x + QUEEN_MOVEMENTS[i][0];
                let currY = y + QUEEN_MOVEMENTS[i][1];
                if (currX < 0 || currX >= 8 || currY < 0 || currY >= 8) {
                    continue;
                }
                if (clone[currX][currY] === '0') {
                    clone[currX][currY] = '.';
                }
            }
        }
        this.setState({
            board: clone,
            attacked: attacked
        });
        
        console.log(attacked);
    }
    renderBoard() {
        let cellBoard = this.state.board.map((row, i) => {
            return (
                <div className="row">
                    { row.map((x, j) => {
                        let color = ((i * 7) + j) % 2 == 0 ? "#f8f9fa" : "#6c757d";
                        
                        let key = i * 8 + j;
                        let style = ((i * 8 + j) === this.state.selected) ? { backgroundColor: "#17a2b8" } : { backgroundColor: color };
                        style = this.state.attacked.includes(key) ? { backgroundColor: "red" } : style;
                        if (x === '0') {
                            return <Cell empty id={ key } key={ key } style={style} piece={<Empty />} />;
                        }
                        else if (x === '.') {
                            return <Cell id={ key } onClick={ this.select } key={ key } style={style} piece={<Empty attacked/>} />;
                        }
                        return <Cell id={key} key={key} onClick={this.select} style={style} piece={<Piece black={x !== x.toUpperCase()} piece={x} />}/>
                        
                    })}
                </div>
            );
        })
        return cellBoard;
        
    }

    render() {
        const cellBoard = this.renderBoard();
        return (
            <div className="container">   
                { cellBoard }
            </div>
        )
    }
}

export default ChessBoard;