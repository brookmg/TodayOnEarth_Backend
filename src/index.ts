import { start } from './server'
import {createKeywordScheme} from "./db/keyword_table";
import {createPostScheme} from "./db/post_table";
import {startIssuer} from "./queue/queue";
start();

createKeywordScheme().then(() => {
    createPostScheme().then(async () => {
        await startIssuer("0 0/10 0 ? * *")
    })
});
