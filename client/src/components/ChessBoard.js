import react, { Component } from 'react';
import Piece from "./Piece";
import Empty from "./Empty";
import main from "../services/logic";
import { Button, ListGroupItem, ListGroup, ListGroupItemHeading, ListGroupItemText, NavLink } from "reactstrap";
import axios from "axios";
class Cell extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.props.onClick(this.props.id);
    }

    render() {
        return (
            <div onClick={this.handleClick} style={{...this.props.style, cursor: "pointer"}} className="col-12-1">
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
            attacked: [],
            whiteToMove: true,
            castling: 63,
            lastMove: "-",
            numOfMovesWithoutPawn: 0,
            whichMove: 0,
            enPassant: "-",
            analysis: <div/>,
            analysisExist: false
        }
        this.select = this.select.bind(this);
        this.generateFEN = this.generateFEN.bind(this);
    }
    select(key) {
        
        let index = Number(key);

        let board = this.state.board.map(arr => arr.slice());
        let attacked = this.state.attacked.slice();
        
        console.log(board);
        let [result, moved] = main(board, attacked, this.state.selected, index, this.state.whiteToMove, this.state.castling, this.state.lastMove, this.state.numOfMovesWithoutPawn, this.state.whichMove);

        this.setState({...result,  whiteToMove: (moved) ? !this.state.whiteToMove : this.state.whiteToMove});
        
        
    }
    renderBoard() {
        let cellBoard = this.state.board.map((row, i) => {
            return (
                <div className="row">
                    { row.map((x, j) => {
                        let color = ((i * 7) + j) % 2 == 0 ? "#f8f9fa" : "#6c757d";
                        
                        let key = i * 8 + j;
                        let style = ((i * 8 + j) === this.state.selected) ? { backgroundColor: "#87a2b8" } : { backgroundColor: color };
                        style = this.state.attacked.includes(key) ? { backgroundColor: "#b8f9fb" } : style;
                        if (x === '0') {
                            return <Cell empty id={key} onClick={this.select} key={ key } style={style} piece={<Empty />} />;
                        }
                        else if (x === '.') {
                            return <Cell id={ key } onClick={this.select } key={ key } style={style} piece={<Empty attacked/>} />;
                        }
                        return <Cell id={key} key={key} onClick={this.select} style={style} piece={<Piece black={x !== x.toUpperCase()} piece={x} />}/>
                        
                    })}
                </div>
            );
        })
        return cellBoard;
        
    }

    renderResults(response) {
        let data = response.data
        let games = [];
        for (let game in data) {
            if (game === "stats") {
                games.push(
                    <ListGroupItem>
                        <ListGroup horizontal className="ml-10">
                            <ListGroupItem color="success" style={{ fontWeight: "bold" }}>
                                Wins <span class="badge badge-success badge-pill">{data[game].won}</span>
                            </ListGroupItem>
                            <ListGroupItem color="danger" style={{ fontWeight: "bold" }}>
                                Losses <span class="badge badge-danger badge-pill">{data[game].lost}</span>
                            </ListGroupItem>
                            <ListGroupItem color="warning" style={{ fontWeight: "bold" }}>
                                Draws <span class="badge badge-warning badge-pill">{data[game].drawn}</span>
                            </ListGroupItem>
                        </ListGroup>
                    </ListGroupItem>
                )
            }
            else {
                games.push(
                    <ListGroupItem>
                        <ListGroupItemHeading> { game } </ListGroupItemHeading>
                        <ListGroupItemText>
                            <ListGroup flush horizontal>
                                <ListGroupItem>
                                    {data[game].result}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <a href={data[game].link}>{data[game].link}</a>
                                </ListGroupItem>    
                            </ListGroup>
                        </ListGroupItemText>
                    </ListGroupItem>
                )    
            }
        }
        this.setState({
            analysis: games,
            analysisExist: true
        })
    }
    async generateFEN() {
        let fen = "";
        let empty = 0;
        for (let i = 0; i < this.state.board.length; i++) {
            for (let j = 0; j < this.state.board[i].length; j++) {
                if (this.state.board[i][j] !== '0') { 
                    if (empty != 0) {
                        fen += empty;
                        empty = 0;
                    }
                    fen += this.state.board[i][j];
                }
                else {
                    empty++;
                }
            }
            if (empty != 0) {
                fen += empty;
                empty = 0;
            }
            if (i != this.state.board.length - 1)
                fen += "/";
        }

        fen += this.state.whiteToMove ? " w " : " b ";

        let castling = this.state.castling;
        if (castling & 16) {
            if (castling & 8) {
                fen += "K";
            }
            if (castling & 32) {
                fen += "Q";
            }
        }
        if (castling & 2) {
            if (castling & 1) {
                fen += "k";
            }
            if (castling & 4) {
                fen += "q";
            }
        }

        

        
        console.log(fen);

        var data = {
            username: "notGMArnur",
            numOfMoves: this.state.whichMove,
            timeControl: 600,
            fen: fen
        }
        var config = {
            method: 'post',
            url: 'http://localhost:8080/analyze',
            data: data
        };

        const res = await axios(config)
        
        const display = this.renderResults(res);



    }
    render() {
        const cellBoard = this.renderBoard();
        return (
            <div className="container m-4">   
                <div className="row justify-content-center">
                    <div className="col-12-6 m-2">
                        {cellBoard}
                    </div>
                    <div className="col-12-6 ml-4 mt-2 mr-2" style={{maxHeight: '480px', overflowY: 'auto'}}>
                        {this.state.analysisExist && 
                            <ListGroup>
                                {this.state.analysis}
                            </ListGroup>
                        }
                    </div>
                </div>
                <div className="row justify-content-center mt-1">
                    <Button onClick={this.generateFEN} className="primary">FEN</Button>
                </div>
            </div>
        )
    }
}

export default ChessBoard;