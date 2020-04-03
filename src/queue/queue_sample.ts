import {startGistSender, startIssuer} from './queue'
import { createKeywordScheme } from '../db/keyword_table';
import { createPostScheme } from '../db/post_table';

// create the tables beforehand
createKeywordScheme().then(value => {
    createPostScheme().then(async () => {
        await startGistSender()
    })
});
