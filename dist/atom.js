import { createId } from './utils/create-id.js';
import { renderAtomPlainText } from './renderer/plain-text.js';
import { isFn } from './utils/is-fn.js';
import { Piece } from './piece.js';
import { gridRelativeDirection } from './utils/grid-relative-direction.js';
export class Atom {
    piece;
    type;
    _offsetX;
    _offsetY;
    static TYPE = {
        SNAKE_HEAD: 'snake-head',
        SNAKE_BODY: 'snake-body',
        APPLE: 'apple',
        OBSTACLE: 'obstacle',
        BONUS: 'bonus',
    };
    _x;
    _y;
    // atom's index in piece.atoms stack
    index;
    id = createId('atom-');
    static renderer;
    constructor(piece, type, _offsetX = 0, _offsetY = 0) {
        this.piece = piece;
        this.type = type;
        this._offsetX = _offsetX;
        this._offsetY = _offsetY;
        if (!this.piece) {
            throw new Error('Missing atom._piece instance');
        }
    }
    get isLast() {
        return this.index === this.piece.atoms.length - 1;
    }
    get offsetX() {
        return this._offsetX;
    }
    get offsetY() {
        return this._offsetY;
    }
    get offsetXY() {
        return [this._offsetX, this._offsetY];
    }
    set x(x) {
        this._x = this.piece.board.normalizeX(x);
    }
    get x() {
        return this.piece.board.normalizeX(this._x + this._offsetX);
    }
    set y(y) {
        this._y = this.piece.board.normalizeY(y);
    }
    get y() {
        return this.piece.board.normalizeY(this._y + this._offsetY);
    }
    get xy() {
        return [this.x, this.y];
    }
    get _xy() {
        return [this._x, this._y];
    }
    get hasPrevious() {
        return !!this.index;
    }
    get hasNext() {
        return this.index < this.piece.atoms.length - 1;
    }
    get previous() {
        return this.hasPrevious ? this.piece.atoms[this.index - 1] : null;
    }
    get next() {
        return this.hasNext ? this.piece.atoms[this.index + 1] : null;
    }
    // gets relative direction to previous atom in stack
    get dirToPrevious() {
        if (!this.hasPrevious)
            return null;
        return gridRelativeDirection(this.xy, this.previous.xy);
    }
    // gets relative direction to next atom in stack
    get dirToNext() {
        if (!this.hasNext)
            return null;
        return gridRelativeDirection(this.xy, this.next.xy);
    }
    _updateCoordinates(oldAtomsCoords) {
        // ?
        const step = this.piece.speed;
        switch (this.piece.direction) {
            case Piece.DIRECTION.NORTH:
                this._y += -1 * step;
                break;
            case Piece.DIRECTION.SOUTH:
                this._y += step;
                break;
            case Piece.DIRECTION.WEST:
                this._x += -1 * step;
                break;
            case Piece.DIRECTION.EAST:
                this._x += step;
                break;
        }
        return this;
    }
    _updateOffsets(oldAtomsCoords) {
        if (this.piece.moveStrategy === Piece.MOVE_STRATEGY.SNAKE) {
            // sanity check - zero  atom has no offset
            if (this.index === 0) {
                this._offsetX = 0;
                this._offsetY = 0;
            }
            else {
                // IMPORTANT: use UNnormalized _x and _y below
                const [prevX, prevY] = oldAtomsCoords[this.index - 1].xy;
                if (this.x !== prevX) {
                    this._offsetX = prevX - this._x;
                }
                if (this.y !== prevY) {
                    this._offsetY = prevY - this._y;
                }
            }
        }
        else {
            // noop
        }
        return this;
    }
    update(oldAtomsCoords) {
        if (this.piece.isMoving) {
            this._updateCoordinates(oldAtomsCoords)._updateOffsets(oldAtomsCoords);
        }
        return this;
    }
    render() {
        return isFn(Atom.renderer) ? Atom.renderer(this) : this.toString();
    }
    toString() {
        return renderAtomPlainText(this);
    }
}
