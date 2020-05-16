import { start } from './server'
import {createKeywordScheme} from "./db/keyword_table";
import {createPostScheme} from "./db/post_table";
import {startIssuer} from "./queue/queue";
start();

/**
* Start the queue handler that gets fired every 10 minutes to
* scrape the web and find posts from all the providers mentioned
* by any user.
**/
createKeywordScheme().then(() => {
    createPostScheme().then(async () => {
        await startIssuer("0 */10 * * * *")
    })
});
