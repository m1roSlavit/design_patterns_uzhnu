enum ChessFigureType {
  King = 0,
  Queen = 1,
  Rook = 2,
  Bishop = 3,
  Knight = 4,
  Pawn = 5,
}

enum ChessFigureColor {
  Black = 0,
  White = 1,
}

class ChessFigure {
  type: ChessFigureType;
  color: ChessFigureColor;

  constructor(type: ChessFigureType, color: ChessFigureColor) {
    this.type = type;
    this.color = color;
  }

  getText() {
    // do some high IQ stuff
    return ';/';
  }
}

class KingChessFigure extends ChessFigure {
  constructor(...params: ConstructorParameters<typeof ChessFigure>) {
    super(...params);
  }

  getText() {
    return '♔';
  }
}

class KnightChessFigure extends ChessFigure {
  constructor(...params: ConstructorParameters<typeof ChessFigure>) {
    super(...params);
  }

  getText() {
    return '♘';
  }
}

type InputChessFigure = {
  type: ChessFigureType;
  vertIdx: number;
  horIdx: number;
  color: ChessFigureColor;
};

const CHESS_BOARD_SIZE = 8;

class ChessBoard {
  field: ChessFigure[][];

  constructor() {
    this.field = Array.from({ length: CHESS_BOARD_SIZE }).map(() =>
      Array.from({ length: CHESS_BOARD_SIZE })
    );
  }

  createFigure(inputFigure: InputChessFigure) {
    switch (inputFigure.type) {
      case ChessFigureType.King:
        return new KingChessFigure(inputFigure.type, inputFigure.color);
      case ChessFigureType.Knight:
        return new KnightChessFigure(inputFigure.type, inputFigure.color);
      default:
        return new ChessFigure(inputFigure.type, inputFigure.color);
    }
  }

  setFigures(inputFigures: InputChessFigure[]) {
    for (const inputFigure of inputFigures) {
      const { horIdx, vertIdx } = inputFigure;

      this.field[vertIdx][horIdx] = this.createFigure(inputFigure);
    }
  }

  public toString() {
    let board = '';
    for (let i = 0; i < CHESS_BOARD_SIZE; i++) {
      let row = '';
      for (let j = 0; j < CHESS_BOARD_SIZE; j++) {
        const figure = this.field[i][j];
        if (figure) {
          row += `[${figure.getText()}]`;
        } else {
          row += '[ ]';
        }
      }
      board += `${row}\n`;
    }
    return board;
  }
}

const testChessBoard = new ChessBoard();

testChessBoard.setFigures([
  {
    type: ChessFigureType.Bishop,
    color: ChessFigureColor.Black,
    vertIdx: 0,
    horIdx: 0,
  },
  {
    type: ChessFigureType.Knight,
    color: ChessFigureColor.Black,
    vertIdx: 5,
    horIdx: 4,
  },
]);

console.log(testChessBoard.toString());
