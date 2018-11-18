# CanvasChess
[Live Demo](https://robtaussig.com/chess/)

HTML5 Canvas UI for chess.

## Getting Started
It does not depend on React, but as I personally use it within a React Component, I will demonstrate that implementation.

```
import React from 'react';
import Game from './canvasChess/game';
import debounce from 'lodash/debounce';

export default class CanvasChess extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.refreshBoard = this.refreshBoard.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
  }

  componentDidMount() {
    this.canvas.current.onselectstart = function () { return false; }; //Prevents selection of outside text when user double taps on canvas element
    this.game = new Game(this.canvas.current, this.props.onMove);
    this.game.updateBoard(this.props.board);
    const debouncedResize = debounce(this.refreshBoard, 100);
    window.addEventListener('resize', debouncedResize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.board !== this.props.board) {
      this.receiveBoardUpdate(this.props.board);
    }
    if (prevProps.legalMoves !== this.props.legalMoves) {
      this.receiveLegalMoves(this.props.legalMoves);
    }
    if (prevProps.validPiecesToMove !== this.props.validPiecesToMove) {
      this.receiveValidPiecesToMove(this.props.validPiecesToMove);
    }
  }

  getCanvasWidth() {
    return `${window.innerWidth}px`;
  }

  getCanvasHeight() {
    return `${window.innerHeight}px`;
  }

  handlePointerDown(e) {
    const target = e.target;
    const { clientX, clientY } = e;
    this.game.registerDragStart(clientX, clientY);
  
    const removeMouseMoveEventListener = () => {
      target.removeEventListener('pointermove', this.handleMouseMove);
      target.removeEventListener('pointerup', removeMouseMoveEventListener);
      target.removeEventListener('pointerleave', removeMouseMoveEventListener);
      this.game.registerDragEnd();
    };
  
    target.addEventListener('pointerup', removeMouseMoveEventListener);
    target.addEventListener('pointermove', this.handleMouseMove);
    target.addEventListener('pointerleave', removeMouseMoveEventListener);
  }

  handleMouseMove(e) {
    const { clientX, clientY } = e;
  
    this.game.registerDrag(clientX, clientY);
  }

  receiveBoardUpdate() {
    this.game.updateBoard(this.props.board);
  }

  receiveLegalMoves(moves) {
    this.game.updateLegalMoves(moves);
  }

  receiveValidPiecesToMove(pieces) {
    this.game.updateValidPieces(pieces);
  }

  refreshBoard() {
    this.forceUpdate(); //Clears canvas board
    this.game = new Game(this.canvas.current, this.props.onMove);
    this.game.updateBoard(this.props.board);
    this.game.updateLegalMoves(this.props.legalMoves);
    this.game.updateValidPieces(this.props.validPiecesToMove);
  }

  render() {
    return (
      <canvas
        width={this.getCanvasWidth()}
        height={this.getCanvasHeight()} 
        ref={this.canvas} 
        style={{ flex: 1 }}
        onPointerDown={this.handlePointerDown}
      />
    );
  }
}

```

The game should be playable so long as the following 6 methods are used:

### new Game(canvasElement, moveHandler)
`moveHandler` is a callback that will be invoked when the user either drops a piece onto a valid square, or clicks on a valid target with a valid piece selected.

### Game#updateBoard
Canvas Chess will not automatically update itself when a user moves a piece. It will update the parent of this event, and it is up to the parent to determine whether to make the move or not. Calling Game#updateBoard (with the new board value) will update the board position. See [my chess engine](https://github.com/robtaussig/chess#Getting-Started) for information on board representation.

### Game#registerDragStart
Click management is handled by parent container. This should be called whenever the user clicks on the canvas element (and the parent container wishes for the canvas element to react to this action).

### Game#registerDragEnd
Should be called on mouseUp or touchEnd (or pointerUp to capture both).

### Game#registerDrag
Should be called while the user is 'dragging' over the canvas element.

### Game#updateLegalMoves
Providing this when available will allow canvasChess to indicate legal moves by highlighting squares based on the current selected piece.

### Game#updateValidPieces
Providing this when available will allow canvasChess to determine which pieces will trigger an onMove callback when dropped. Passing it an array of all pieces will allow user to drag and drop any piece.

## Installing
No dependencies.

## Plans
