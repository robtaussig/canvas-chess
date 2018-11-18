import Board from './board';

export default class Game {
  constructor(element, onMove) {
    this.canvas = element;
    this.ctx = this.canvas.getContext('2d');
    this.onMove = onMove;
  }

  updateBoard(board) {
    if (this.board) {
      this.board.update(board);
    } else {
      const boardSide = Math.min(this.canvas.clientHeight, this.canvas.clientWidth);
      const horizontalOffset = this.canvas.clientHeight < this.canvas.clientWidth ? Math.floor((this.canvas.clientWidth - this.canvas.clientHeight) / 2) : 0;
      const verticalOffset = this.canvas.clientHeight > this.canvas.clientWidth ? Math.floor((this.canvas.clientHeight - this.canvas.clientWidth) / 2) : 0;
      this.board = new Board(board, this.ctx, this.onMove, boardSide, horizontalOffset, verticalOffset);
    }
    this.draw();
  }

  registerDragStart(x, y) {
    this.board.dragStart(x, y);
    this.startAnimation();
  }

  registerDragEnd() {
    this.stopAnimation();
    this.board.drop();
  }

  startAnimation() {
    this.animationStop = setInterval(this.step.bind(this), 30);
  }

  stopAnimation() {
    if (this.animationStop) {
      clearInterval(this.animationStop);
    }
  }

  registerDrag(x, y) {
    this.board.drag(x, y);
  }

  updateLegalMoves(moves) {
    this.board.setLegalMoves(moves);
  }

  updateValidPieces(pieces) {
    this.board.setValidPieces(pieces);
  }

  draw() {
    this.board.draw();
  }

  step() {
    this.board.clear();
    this.board.draw();
  }
}