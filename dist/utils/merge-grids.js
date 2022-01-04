import { createGrid } from './create-grid.js';
export const mergeGrids = (width, height, ...grids) => {
    const merged = createGrid(width, height);
    if (grids && grids.length) {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                grids.forEach((grid) => {
                    const value = (grid[x] || [])[y];
                    // feature: ignores falsey values (will not be merged)
                    merged[x][y] = value || merged[x][y];
                });
            }
        }
    }
    return merged;
};
