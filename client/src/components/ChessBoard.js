import react, { Component } from 'react';
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
    }
    renderBoard() {
        let cellBoard = this.state.board.map((row, i) => {
            return (
                <div className="row">
                    { row.map((x, j) => {
                        let color = ((i * 7) + j) % 2 == 0 ? "#f8f9fa" : "#6c757d";
                        console.log(this.state.selected);
                        let key = i * 8 + j;
                        let style = ((i * 8 + j) === this.state.selected) ? { backgroundColor: "#17a2b8" } : { backgroundColor: color };
                        if (x === '0') {
                            return <Cell empty key={ key } style={style} piece={<Empty />} />;
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