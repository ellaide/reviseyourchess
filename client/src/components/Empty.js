import react, { Component } from 'react';

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

export default Empty;