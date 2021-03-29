import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import react, {Component} from "react";
import Main from "./components/Main";

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Main/>
    )
  }
}

export default App;
