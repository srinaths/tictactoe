import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick= {()=>props.onClick()} >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)} 
            />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history : [
        {
          squares:Array(9).fill(null)
        },
      ],
      stepNumber:0,
      xIsnext:true,
    }
  }

  handleClick(i) {
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]){
          return;
      }
      squares[i] = this.state.xIsnext ? 'X' : 'O' ;
      this.setState({
          history: history.concat([{
            squares:squares
          }]),
          stepNumber:history.length,
          xIsnext : !this.state.xIsnext,
      },function(){
        if(!this.state.xIsnext)
          playOturn(this);
      });

      sleep(100);

  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsnext:(step%2)===0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move)=>{
      const desc = move ?
        'Move #' + move :
        'Game start';
      return(
        <li key={move}>
          <a href="#" onClick={()=>this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let status;

    if(winner) {
        status = 'Winner is '+winner;
    }else {
        status = 'Next player: ' + (this.state.xIsnext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function playOturn(game){
  const history = game.state.history;
  const current = history[history.length-1];
  const squares = current.squares.slice();
  if(calculateWinner(squares)){
    return;
  }
  const vacantPlaces = squares.reduce((acc, val, idx) => {
    if (!val) acc.push(idx);
    return acc;
  }, new Array());
  game.setState((prevState)=> {
    return {xIsnext : true}
  });
  game.forceUpdate();
  game.handleClick(vacantPlaces[getRandomInt(0, vacantPlaces.length)]);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

function calculateWinner(squares) {
    let cases  = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    for(let i=0; i< cases.length; i++){
        const [a,b,c] = cases[i];
        if(squares[a] && squares[a]===squares[b] && 
        squares[c] && squares[a]===squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);