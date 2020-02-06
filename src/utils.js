const removeRedundantWhitespace = (str) => {
    return str.replace(/\s+/g, ' ')
}

const fixNonAlphaNumeric = (str) => {
    return str.replace(/[^a-zA-Z0-9_#@./]+/g,"");
}

const utils = {
    removeRedundantWhitespace,
    fixNonAlphaNumeric
}

export default utils;