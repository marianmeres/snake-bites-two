let _counter = 0;

// app wide client side unique id
export const createId = (prefix = 'id-') => `${prefix}${++_counter}`;
