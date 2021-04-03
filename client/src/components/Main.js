import react, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChessBoard from './ChessBoard';


class Main extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Header />


                            <ChessBoard />
                <Footer />
            </div>
        )
    }
}

export default Main;