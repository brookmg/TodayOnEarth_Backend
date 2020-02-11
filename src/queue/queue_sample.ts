import { addToFacebook , addToInstagram , addToTwitter , addToTelegram } from './queue'

addToFacebook({from: -1, source: 'G12MatrickApp'} , '30 * * * * *');
addToTwitter({from: -1, source: 'TheTweetOfGod'} , '30 * * * * *');
addToInstagram({from: -1, source: 'lindashitaye'} , '30 * * * * *');
addToTelegram({from: -1, source: 'memes'} , '30 * * * * *');
