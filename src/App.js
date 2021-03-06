import React, { Component } from 'react';
import './App.css';
import PlayBar from './components/PlayBar';
import Board from './components/Board';
import GenerationBar from './components/GenerationBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new Array(50).fill(undefined).map(v => new Array(70).fill(false)),
      start: undefined,
      generation: 0
    }
    this.change = this.change.bind(this);
    this.livingNeighbours = this.livingNeighbours.bind(this);
    this.generateNeighbours = this.generateNeighbours.bind(this);
    this.generateNext = this.generateNext.bind(this);
    this.startGame = this.startGame.bind(this);
    this.pauseGame = this.pauseGame.bind(this);
    this.randomBoard = this.randomBoard.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
  }

  change(id) {
    const loc = id.split(',');
    const row = Number(loc[0]);
    const col = Number(loc[1]);
    const newBoard = this.state.board.slice();
    newBoard[row][col] = 
      newBoard[row][col] ? false : true;
    this.setState({
      board: newBoard
    })
  }

  livingNeighbours(row, col) {
    const neighbours = this.generateNeighbours(row, col);
    const n = neighbours.reduce((acc, val) =>
      this.state.board[val[0]][val[1]] ? acc+1 : acc, 0);
    return n;
  }

  generateNeighbours(row, col) {
    const
      topleft = [row-1, col-1],
      topmid = [row-1, col],
      topright = [row-1, col+1],
      midleft = [row, col-1],
      midright = [row, col+1],
      botleft = [row+1, col-1],
      botmid = [row+1, col],
      botright = [row+1, col+1];
    
    let neighbours = []
    if (row > 0) {
      neighbours.push(topmid);
      if (col > 0) {
        neighbours.push(topleft);
      }
      if (col < 69) {
        neighbours.push(topright);
      }
    }
    if (row < 49) {
      neighbours.push(botmid);
      if (col > 0) {
        neighbours.push(botleft);
      }
      if (col < 69) {
        neighbours.push(botright);
      }
    }
    if (col > 0) {
      neighbours.push(midleft);
    }
    if (col < 69) {
      neighbours.push(midright);
    }
    return neighbours;

  }

  generateNext() {
    const newBoard = this.state.board.map((row, i) =>
      row.map((v, j) => {
        const n = this.livingNeighbours(i, j);
        if (v && (n === 2 || n === 3)) {
          return true;
        }
        else if (!v && n === 3) {
          return true;
        }
        return false;
      }))
    this.setState({
      board: newBoard,
      generation: this.state.generation + 1
    })
  }

  startGame() {
    const interval = setInterval(this.generateNext, 100);
    this.setState({
      start: interval
    })
  }

  pauseGame() {
    clearInterval(this.state.start);
    this.setState({
      start: undefined
    })
  }

  randomBoard() {
    const newBoard = this.state.board.map(row =>
      row.map(v => Math.random() > 0.75 ? true : false));
    this.pauseGame();
    this.setState({
      board: newBoard,
      generation: 0
    })
  }

  clearBoard() {
    const newBoard = this.state.board.map(row =>
      row.map(v => false));
    this.pauseGame();
    this.setState({
      board: newBoard,
      generation: 0
    })
  }

  componentWillMount() {
    this.randomBoard();
  }

  render() {
    
    return (
      <div className="App">
        <h1 className="heading">Conway's Game of Life</h1>
        <PlayBar 
          start={this.startGame} 
          pause={this.pauseGame} 
          clear={this.clearBoard}
          random={this.randomBoard}
        />
        <Board board={this.state.board} change={this.change} />
        <GenerationBar gen={this.state.generation} />
      </div>
    );
  }
}

export default App;
