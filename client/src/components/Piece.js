import react, { Component } from 'react';
class Piece extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        
        const source = "/assets/pieces/" + (this.props.black ? "black_" : "white_") + this.props.piece + ".svg";
        return (
            <img style={{width: 60}} src={source}></img>
        )
    }
}

export default Piece;