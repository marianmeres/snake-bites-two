export const trimLines = (v) => `${v}`
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .join('\n');
