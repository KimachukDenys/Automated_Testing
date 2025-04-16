export const asinh = a => Math.asinh(a)
export const acosh = a => Math.acosh(a)
export const atanh = a => Math.atanh(a)

export const arrayProcessor = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error("Input must be an array");
    }

    return arr.map(item => {
        if (typeof item === 'number') {
            return item + 1;
        }
        if (typeof item === 'string') {
            return item.toUpperCase();
        }
        return item;
    });
};
