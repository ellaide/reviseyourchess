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
                <div className="container m-4">
                    <div className="row justify-content-center">
                        <div className="col-12-8">
                            <ChessBoard />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }
}

export default Main;