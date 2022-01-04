import { GAME_EVENT } from './constants.js';
import { createGrid } from './utils/create-grid.js';
import { normalizeCoordinate } from './utils/normalize-coordinate.js';
import { gridForEach } from './utils/grid-foreach.js';
import { mergeGrids } from './utils/merge-grids.js';
import { isFn } from './utils/is-fn.js';
import { renderGridPlainText } from './renderer/plain-text.js';
import { createPubSub } from './utils/create-pub-sub.js';
import { getRandomIntInclusive } from './utils/get-random-int.js';
import { Snake } from './piece/snake.js';
export class Board {
    x;
    y;
    _cells = [];
    pubsub = createPubSub();
    _updateCounter = 0;
    static renderer;
    constructor(x, y, cellFactory = null) {
        this.x = x;
        this.y = y;
        this._cells = this.createGrid(cellFactory);
    }
    get updateCounter() {
        return this._updateCounter;
    }
    createGrid(cellFactory = null) {
        return createGrid(this.x, this.y, cellFactory);
    }
    mergeGrids(...grids) {
        return mergeGrids(this.x, this.y, ...grids);
    }
    forEachXY(cb) {
        gridForEach(this._cells, cb);
        return this;
    }
    normalizeX(x) {
        return normalizeCoordinate(x, this.x);
    }
    normalizeY(y) {
        return normalizeCoordinate(y, this.y);
    }
    cell(x, y, assert = true) {
        x = this.normalizeX(x);
        y = this.normalizeY(y);
        let cell = this._cells[x] ? this._cells[x][y] : void 0;
        if (assert && cell === void 0) {
            throw new Error(`Invalid cell coordinates [${x}, ${y}]`);
        }
        return cell;
    }
    emptyCoords() {
        const out = [];
        const atomsGrid = this.atomize();
        gridForEach(atomsGrid, (x, y) => {
            if (!atomsGrid[x][y]) {
                out.push([x, y]);
            }
        });
        return out;
    }
    randomEmptyYX() {
        const coords = this.emptyCoords();
        if (coords.length) {
            return coords[getRandomIntInclusive(0, coords.length - 1)];
        }
        return null;
    }
    setPieceAtRandomEmptyXY(piece) {
        const rnd = this.randomEmptyYX();
        if (rnd) {
            this.setPiece(rnd[0], rnd[1], piece);
            return rnd;
        }
        return false;
    }
    hasPiece(ctor) {
        for (let x = 0; x < this.x; x++) {
            for (let y = 0; y < this.y; y++) {
                const cell = this.cell(x, y);
                if (cell && cell instanceof ctor) {
                    return true;
                }
            }
        }
        return false;
    }
    setPiece(x, y, piece) {
        x = this.normalizeX(x);
        y = this.normalizeY(y);
        if (piece) {
            piece.board = this;
            piece.x = x;
            piece.y = y;
        }
        this._cells[x][y] = piece;
        return this;
    }
    // NOTE that this is not a game tick update stuff, just manual move...
    movePiece(originX, originY, targetX, targetY, assert = true) {
        const originPiece = this.cell(originX, originY);
        if (assert && !originPiece) {
            throw new Error(`Piece not found at [${originX}, ${originY}]`);
        }
        if (originPiece) {
            this.setPiece(originX, originY, null);
            this.setPiece(targetX, targetY, originPiece);
        }
        return this;
    }
    // "explodes" piece into atoms and puts them on fresh grid
    atomize() {
        let atoms = this.createGrid();
        this.forEachXY((x, y) => {
            const piece = this.cell(x, y);
            if (piece && isFn(piece.atomize)) {
                atoms = this.mergeGrids(atoms, piece.atomize());
            }
        });
        return this.mergeGrids(this.createGrid((x, y) => this.cell(x, y)), atoms);
    }
    // main game loop tick update
    update() {
        const pieces = [];
        // pick pieces first, so we dont update already updated (e.g. moved pieces)
        this.forEachXY((x, y) => {
            const piece = this.cell(x, y);
            if (piece && isFn(piece.update)) {
                pieces.push(piece);
            }
        });
        // idea is to update snakes last in order - will help in collision detection
        pieces.sort((a, b) => a.preUpdateSortOrder - b.preUpdateSortOrder);
        // now update all
        pieces.forEach((piece) => piece.update());
        this._updateCounter++;
        this.pubsub.publish(GAME_EVENT.TICK_UPDATE, this);
        return this;
    }
    resetScores() {
        this.forEachXY((x, y) => {
            const cell = this.cell(x, y);
            if (cell && cell instanceof Snake)
                cell.score.set(0);
        });
    }
    render() {
        return isFn(Board.renderer) ? Board.renderer(this) : this.toString();
    }
    toString() {
        return renderGridPlainText(this.atomize());
    }
}
