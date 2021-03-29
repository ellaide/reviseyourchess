import react, { Component } from 'react';
const KNIGHT_MOVEMENTS = [
    [1, 2],
    [-1, 2],
    [1, -2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];
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
            selected: -1
        }
        this.select = this.select.bind(this);
    }
    select(key) {
        this.setState({
            selected: Number(key)
        })
        console.log(KNIGHT_MOVEMENTS);
        let index = Number(key);
        let x = Math.floor(index / 8);
        let y = index % 8;
        console.log(x + " " + y);
        let piece = this.state.board[x][y];
        let clone = this.state.board.map(arr => arr.slice());
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
                console.log(currX + " " + currY);
                if (clone[currX][currY] === '0') {
                    clone[currX][currY] = '.';
                }
            }
        }
        this.setState({
            board: clone
        });
        console.log(clone);
    }
    renderBoard() {
        let cellBoard = this.state.board.map((row, i) => {
            return (
                <div className="row">
                    { row.map((x, j) => {
                        let color = ((i * 7) + j) % 2 == 0 ? "#f8f9fa" : "#6c757d";
                        
                        let key = i * 8 + j;
                        let style = ((i * 8 + j) === this.state.selected) ? { backgroundColor: "#17a2b8" } : { backgroundColor: color };
                        if (x === '0') {
                            return <Cell empty key={ key } style={style} piece={<Empty />} />;
                        }
                        else if (x === '.') {
                            return <Cell empty key={ key } style={style} piece={<Empty attacked/>} />;
                        }
                        return <Cell id={ key } key={ key } onClick={ this.select } style={style} piece={<Piece black={x !== x.toUpperCase()} piece={x} />}/>
                        
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