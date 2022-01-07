export const gridRelativeDirection = (normalizedFromXY, normalizedToXY) => {
    const [ax, ay] = normalizedFromXY;
    const [bx, by] = normalizedToXY;
    // [N W] [NNW] [ N ] [NNE] [N E]
    // [NWW] [N W] [ N ] [N E] [NEE]
    // [ W ] [ W ] null  [ E ] [ E ]
    // [SWW] [S W] [ S ] [S E] [SEE]
    // [S W] [SSW] [ S ] [SSE] [S E]
    const dx = bx - ax;
    const dy = by - ay;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (!dx && !dy)
        return null;
    if (dx < 0) {
        if (dy < 0) {
            if (adx === ady)
                return 'NW';
            else if (adx < ady)
                return 'NNW';
            else
                return 'NWW';
        }
        else if (dy === 0)
            return 'W';
        else {
            if (adx === ady)
                return 'SW';
            else if (adx < ady)
                return 'SSW';
            else
                return 'SWW';
        }
    }
    else if (dx === 0) {
        if (dy < 0)
            return 'N';
        else if (dy === 0)
            return null;
        else
            return 'S';
    }
    else if (dx > 0) {
        if (dy < 0) {
            if (adx === ady)
                return 'NE';
            else if (adx < ady)
                return 'NNE';
            else
                return 'NEE';
        }
        else if (dy === 0)
            return 'E';
        else {
            if (adx === ady)
                return 'SE';
            else if (adx < ady)
                return 'SSE';
            else
                return 'SEE';
        }
    }
    throw new Error('Unexpected case');
};
