import { addToFacebook , addToInstagram , addToTwitter , addToTelegram } from './queue'
import { createKeywordScheme } from '../db/keyword_table';
import { createPostScheme } from '../db/post_table';

// create the tables beforehand 
createKeywordScheme().then(value => {
    createPostScheme().then(() => {
        addToFacebook({from: -1, source: 'G12MatrickApp'} , '30 * * * * *');
        addToTwitter({from: -1, source: 'TheTweetOfGod'} , '30 * * * * *');
        addToInstagram({from: -1, source: 'lindashitaye'} , '30 * * * * *');
        addToTelegram({from: -1, source: 'memes'} , '30 * * * * *');
    })
});
