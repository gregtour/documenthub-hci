/*
  Document Hub - React web app.
*/

import './App.css';

// import Icon from './icon.svg';

import React, { Component } from 'react';

import { Toast, Button, ButtonToolbar, InputGroup, FormControl } from 'react-bootstrap';

import Store from './Store';
import Rounds from './rounds';

/*
  Just the title
*/
class MainTitle extends Component
{
  render() {
    return (<div className="MainTitle">
      <h1>DocumentHub</h1>
    </div>)
  }
}

/*
  Make search
*/
class SearchBar extends Component
{
  constructor(props) { 
    super(props);

    this.typingHandler = (e) => {
      let searchTerms = e.target.value;
      Store.setSearchTerms(searchTerms);
    }
  }

  render() {
    return (<div className="SearchBar">
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">Search: </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          placeholder="keywords"
          onChange={this.typingHandler}
        />
      </InputGroup>
      <FiltersBar />
    </div>)
  }
}

/*
  Buttons for filtering different options
*/
class FiltersBar extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      "filters": Store.filters
    };

    Store.bind("change", () => {
      this.setState({
        "filters": Store.filters
      });
    });

    this.btnColors = ["#AA3939", "#403075", "#AA9739", "#2D882D", "#00d", "#8d8", "#8d8"];
    this.btnLabels = ["Created", "Shared", "Edited", "My Group", "Other Groups"];
    this.btnClickers = [];

    for (let label of this.btnLabels) {
      let labelLower = label.toLowerCase();
      this.btnClickers.push(() => {
        Store.toggleFilter(labelLower)
      })
    }
  }

  render() {

    if (!Store.filtersEnabled) {
      return (<div></div>);
    }

    let buttonElements = [];

    for (var idx = 0; idx < this.btnLabels.length; idx++) 
    {
      let labelLower = this.btnLabels[idx];
      let active = Store.checkFilter(labelLower.toLowerCase());

      let styling = 
      {
        color: (active ? "#fff" : "#444"),
        backgroundColor: (active ? this.btnColors[idx] : "#fff"),
        borderColor: this.btnColors[idx]
      }

      buttonElements.push(
        <Button style={styling} onClick={this.btnClickers[idx]} key={idx}>
          {this.btnLabels[idx]}
        </Button>);
    }

    let spacer = {width: "20px"};
    return (<div className="FiltersBar">
        <ButtonToolbar>
          {buttonElements.slice(0,3)}
          <span style={spacer}> </span>
          {buttonElements.slice(3)}
        </ButtonToolbar>
      </div>)
  }
}

/*
  Display results.
*/
class SearchResults extends Component
{
  constructor() {
    super();

    this.state = {
      "results": Store.getResults(),
      "target": Store.getObjective()
    };

    Store.bind("change", () => {
      this.setState({
        "results": Store.getResults()
      });
    });

    Store.bind("next", () => {
      this.setState({
        "target": Store.getObjective()
      });
    });

    this.clickSuccess = () => {
      if (Store.tryDocument(this.state.target)) {
        alert("Good job!");
      }
    }

    this.clickFailure = () => {
      alert("Try again.");
    }
  }

  render() {
    let entries = [];
    for (let idx = 0; idx < this.state.results.length; idx++)
    {
      let entry = this.state.results[idx];
      let time = entry.date.toLocaleDateString("en-US");
      
      let withTeam = ''

      if (entry.withTeam) 
      {
        withTeam = "with " + entry.withTeam;
      }

      let clickHandler = (entry.title === this.state.target) ? this.clickSuccess : this.clickFailure;

      entries.push(<div onClick={clickHandler} className="SearchResult" key={idx}>
        <div className="icon">
          <img src="icon.png" width="64px"/>
        </div>

        <div className={"excerpt"}>
          <div className={"excerpt-cover"}></div>

          <div className="excerpt-text">
            <div className={"result-info "+entry.type}>{entry.user} from {entry.group} {entry.type} this {withTeam} on {time}</div>
            <div className="result-title">{entry.title}</div>{ } 
            <div className="result-text">{entry.text}</div>
          </div>
        </div>
      </div>);
    }

    return (
      <div className="SearchResults">
        <div className="ResultsContainer">
          {entries}
        </div>
      </div>);
  }
}

/*
  Main application
*/
class MainApp extends Component
{
  constructor (props) 
  {
    super(props);
  }

  render() {
    return (<div className="MainApp">
      <MainTitle/>
      <SearchBar/>
      <SearchResults/>
    </div>)
  }
}

/*
  Guided prompts
*/
class SideBarInstructions extends Component
{
  constructor (props) 
  {
    super(props);

    this.state = {
      "prompts": Store.getPrompts()
    }

    Store.bind("next", () => {
      this.setState({
        "prompts": Store.getPrompts()
      })
    })
  }

  render() {
    let toasts = [];
    for (let idx = 0; idx < this.state.prompts.length; idx++) 
    {
      let prompt = this.state.prompts[idx];
      let mins = (this.state.prompts.length - idx) * 3.5 | 0;

      toasts.push(<Toast key={idx}>
        <Toast.Header closeButton={false}>
          <strong className="mr-auto">From Tom</strong>
          <small>{mins} mins ago</small>
        </Toast.Header>
        <Toast.Body>{prompt}</Toast.Body>
      </Toast>)
    }

    return (<div className="SideBarInstructions">
      <div className="SideBarTitle">
        <h3>Messages</h3>
      </div>
      <Toast>
        <Toast.Header closeButton={false}>
          <strong className="mr-auto">From Tom</strong>
          <small>1 week ago</small>
        </Toast.Header>
        <Toast.Body>Welcome to the Products team!</Toast.Body>
      </Toast>
      {toasts}
    </div>)
  }
}

/*
  Study participant approval.
*/
class ConsentTerms extends Component
{
  constructor (props) 
  {
    super(props);
  }

  render() {
    let buttonAction = Store.setAccepted.bind(Store);

    return (<div className="ConsentTerms">
      <p>
        This is a user interface test for the class Intro to Human-Computer Intraction. 
      </p>
      <p>
        The website will collect some measurements as you complete the given tasks to evaluate the interface.
        No personally identifying information will be collected.
      </p>
      <p>
        Your coworker Tom needs help finding documents. Follow his prompts and click on the correct document.
      </p>
      <p>
        Do you consent to participate in this study?
      </p>
      <Button variant="outline-primary" onClick={buttonAction}>Yes</Button>
    </div>);
  }
}

/*
  Study was completed.
*/
class ThankYou extends Component
{
  constructor (props) 
  {
    super(props);
  }

  render() {
    return (<div className="ConsentTerms">
      <p>
        Thank you for participating in this HCI study!
      </p>
    </div>);
  }
}

/*
  Main app.
*/
class App extends Component 
{
  constructor (props) 
  {
    super(props);

    this.state = {
      "isAccepted": Store.isAccepted(),
      "isCompleted": Store.isCompleted()
    };

    Store.bind("accept", () => {
      this.setState({
        "isAccepted": true
      });
    });

    Store.bind("thanks", () => {
      this.setState({
        "isCompleted": true
      });
    });
  }

  render() {
    if (this.state.isCompleted) 
    {
      return (<div className="App">
          <ThankYou/>
      </div>);
    } 
    else if (this.state.isAccepted)
    {
      return (<div className="App">
        <SideBarInstructions/>
        <MainApp/>
      </div>);
    } 
    else 
    {
      return (<div className="App">
          <ConsentTerms/>
      </div>);
    }
  }
}

export default App;
