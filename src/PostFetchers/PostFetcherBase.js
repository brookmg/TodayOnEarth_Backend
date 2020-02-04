const axios = require('axios');

export default class PostFetcherBase {
    constructor(from, source) {
        this.from = from;
        this.source = source;
    }

    downloadWebPage = async ({ url }) => {
        const res = await axios.get(url);

        return res;
    }

    getPosts = async () => {
        return [{}];
    }

}