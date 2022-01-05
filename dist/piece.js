import { isFn } from './utils/is-fn.js';
import { createId } from './utils/create-id.js';
import { Collision } from './error/collision.js';
import { GAME_EVENT } from './constants.js';
import { Atom } from './atom.js';
export class Piece {
    static DIRECTION = {
        NORTH: 'N',
        EAST: 'E',
        SOUTH: 'S',
        WEST: 'W',
    };
    static MOVE_STRATEGY = {
        // head moves first respecting direction, other atoms follow (snake like movement)
        SNAKE: 'snake',
        // head and the rest moves by same x/y offset respecting direction
        FIXED: 'fixed',
    };
    board;
    _atoms;
    _preUpdateSortOrder = 0;
    moveStrategy = Piece.MOVE_STRATEGY.FIXED;
    // "cells distance" per tick update (zero means no movement)
    speed = 0;
    // current MOVE (!) direction (will be ignored if zero speed)
    direction = null;
    _nextDirectionStack = [];
    id = createId('piece-');
    _postMoveActionStack = [];
    // for arbitrary custom needs (in UI maybe)...
    label;
    custom = {};
    constructor() { }
    _assertAtoms() {
        if (!this._atoms || !this._atoms.length) {
            throw new Error('Piece must have at least one atom');
        }
        return this;
    }
    get preUpdateSortOrder() {
        return this._preUpdateSortOrder;
    }
    get atoms() {
        return this._atoms;
    }
    get mainAtom() {
        this._assertAtoms();
        return this._atoms[0];
    }
    set x(x) {
        this._assertAtoms();
        this._atoms.forEach((atom) => (atom.x = x));
    }
    set y(y) {
        this._assertAtoms();
        this._atoms.forEach((atom) => (atom.y = y));
    }
    get x() {
        return this.mainAtom.x;
    }
    get y() {
        return this.mainAtom.y;
    }
    get xy() {
        return [this.x, this.y];
    }
    get isMoving() {
        return this.speed && this.direction;
    }
    _reindexAtoms() {
        this._assertAtoms();
        this._atoms.forEach((atom, index) => (atom.index = index));
        return this;
    }
    update() {
        this._reindexAtoms();
        if (this._nextDirectionStack.length) {
            const direction = this._nextDirectionStack.shift();
            if (direction === Piece.DIRECTION.NORTH)
                this.turnNorth();
            else if (direction === Piece.DIRECTION.EAST)
                this.turnEast();
            else if (direction === Piece.DIRECTION.SOUTH)
                this.turnSouth();
            else if (direction === Piece.DIRECTION.WEST)
                this.turnWest();
        }
        const preUpdateAtomsGrid = this.board.atomize();
        const [oldX, oldY] = this.xy;
        const oldAtomsCoords = this._atoms.map((atom) => ({
            xy: atom.xy,
            offsetXY: atom.offsetXY,
        }));
        // console.log('piece.update', oldAtomsCoords);
        this._atoms.forEach((atom) => atom.update(oldAtomsCoords));
        // has position been updated? (could have updated some other props as well...)
        if (oldX !== this.x || oldY !== this.y) {
            this._mayberHandleCollision(preUpdateAtomsGrid, oldX, oldY);
            this.board.setPiece(oldX, oldY, null);
            this.board.setPiece(this.x, this.y, this);
            if (this._postMoveActionStack.length) {
                const action = this._postMoveActionStack[0];
                if (action(this, oldAtomsCoords) !== false) {
                    this._postMoveActionStack.shift();
                    this._reindexAtoms();
                }
            }
        }
        return this;
    }
    atomize() {
        const atoms = this.board.createGrid();
        this._atoms.forEach((a) => (atoms[a.x][a.y] = a));
        return atoms;
    }
    // extend/overwrite for custom piece logic...
    _customCollisionHandler(atom) {
        return false;
    }
    _mayberHandleCollision(preUpdateAtomsGrid, oldX, oldY) {
        const collidingAtom = preUpdateAtomsGrid[this.x][this.y];
        // noop if nothing collides
        if (!collidingAtom)
            return;
        // special case (snake tail will move away)
        // todo: is this really ok?
        if (collidingAtom.piece.isMoving &&
            collidingAtom.isLast &&
            collidingAtom.piece === this)
            return;
        // if custom handler returns explicit false, continue with general Collision
        if (this._customCollisionHandler(collidingAtom) === false) {
            // game event publish
            const collidingPieces = [this];
            // special case snake-head vs snake-head: both loose
            if (collidingAtom.type === Atom.TYPE.SNAKE_HEAD) {
                collidingPieces.push(collidingAtom.piece);
            }
            // prettier-ignore
            const message = `[${this.label || this.id}] Collision: ${this.mainAtom.type} vs ${collidingAtom.type} [${this.xy}]!`;
            // this.board.pubsub.publish(Game.EVENT.COLLISION, collidingPieces);
            // WTF? ReferenceError...
            this.board.pubsub.publish(GAME_EVENT.COLLISION, {
                collidingPieces,
                collidingAtom,
                message,
            });
            throw new Collision(message);
        }
    }
    postMoveActionStackPush(fn) {
        isFn(fn) && this._postMoveActionStack.push(fn);
        return this;
    }
    turnNorth() {
        if (this.direction !== Piece.DIRECTION.SOUTH) {
            this.direction = Piece.DIRECTION.NORTH;
        }
        return this;
    }
    turnEast() {
        if (this.direction !== Piece.DIRECTION.WEST) {
            this.direction = Piece.DIRECTION.EAST;
        }
        return this;
    }
    turnSouth() {
        if (this.direction !== Piece.DIRECTION.NORTH) {
            this.direction = Piece.DIRECTION.SOUTH;
        }
        return this;
    }
    turnWest() {
        if (this.direction !== Piece.DIRECTION.EAST) {
            this.direction = Piece.DIRECTION.WEST;
        }
        return this;
    }
    // "next" direction changes below solvs problem of quick direction changes within
    // one update cycle... allow max 2 in stack
    nextNorth() {
        if (this._nextDirectionStack.length < 2) {
            this._nextDirectionStack.push(Piece.DIRECTION.NORTH);
        }
    }
    nextEast() {
        if (this._nextDirectionStack.length < 2) {
            this._nextDirectionStack.push(Piece.DIRECTION.EAST);
        }
    }
    nextSouth() {
        if (this._nextDirectionStack.length < 2) {
            this._nextDirectionStack.push(Piece.DIRECTION.SOUTH);
        }
    }
    nextWest() {
        if (this._nextDirectionStack.length < 2) {
            this._nextDirectionStack.push(Piece.DIRECTION.WEST);
        }
    }
}
