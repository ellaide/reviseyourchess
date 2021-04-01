import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import react, {Component} from "react";
import Main from "./components/Main";

import { BrowserRouter } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    )
  }
}

export default App;
