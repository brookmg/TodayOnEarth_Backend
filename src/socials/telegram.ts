import { Bot } from "../bot/bot";
import {getUser} from "../db/user_table";
import * as fs from "fs";
import Telegraph from 'telegraph-node'
import {getAllPostsBetweenPublishedDate, getAllPostsSincePublishedDate} from "../db/post_table";

export async function sendMessageOnTelegram(uid: number, text: string) {
    if (!text) throw new Error('Text cannot be empty');
    let userTelegramId = (await getUser(uid)).telegram_id;
    if (!userTelegramId) throw new Error('User doesn\'t have a linked telegram account');
    return await Bot.telegram.sendMessage(userTelegramId, text);
}

async function userIsAdminOfChannel(channel: string, uid: number) : Promise<boolean> {
    if (!channel) throw new Error('channel identifier cannot be null');
    let user = await getUser(uid);
    let admins = await Bot.telegram.getChatAdministrators(channel);
    let ids = admins.map(users => users.user).map(user => user.id);
    return ids.includes(Number(user.telegram_id));
}

/* ** Today On Earth ... Telegraph Author
    {
        "ok":true,
        "result": {
            "short_name":"TOE",
            "author_name":"TodayOnEarth",
            "author_url":"http:\/\/t.me\/todayonearthbot",
            "access_token":"---",
            "auth_url":"---"
        }
    }
*/

function titleNormalize(title: string) {
    return title.substring(0 , (title.length <= 50) ? title.length : title.indexOf(' ', 50)) + ((title.length <= 50) ? '' : '...');
}

export async function prepareGistForUser(uid: number) : Promise<string> {
    let posts = await getAllPostsSincePublishedDate(
        (new Date().getTime() - (24 * 60 * 60 * 1000)) / 1000,
        0, 10, uid
    );

    let previousProvider = '';
    let seenPostsFromProvider = 0;

    let nodes = [];
    for (const post of posts) {
        if (post.provider === previousProvider) seenPostsFromProvider++;    // increment number of posts seen from the provider
        else seenPostsFromProvider = 0;     // reset counter

        if (seenPostsFromProvider > 4) continue;    // Show 4 post from each provider.

        if (post.source == 'instagram')
            nodes.push(
                { tag: 'blockquote' , children: [post.provider + ' - Instagram']},
                { tag: 'img' , attrs: { src: post['metadata']['post']['full_size_image'] }},
                { tag: 'figcaption', children: [post.title]},
                { tag: 'a' , attrs: { href: post.source_link }},
                { tag: 'br'});
        else if (post.source == 'facebook') {
            nodes.push(
                { tag: 'h4', children: [titleNormalize(post.title)]},
                { tag: 'blockquote', children: [post.provider + ' - Facebook']},
                { tag: 'p', children: [post.body]},
                { tag: 'a', attrs: {href: post.source_link}},
                { tag: 'br' });
        } else if (post.source == 'twitter')
            nodes.push(
                { tag: 'h4', children: [post.provider + ' @ Twitter'] },
                { tag: 'br' },
                { tag: 'p' , children: [post.title]},
                { tag: 'a' , attrs: { href: post.source_link }},
                { tag: 'br' });
        else if (post.source == 'telegram')
            nodes.push(
                { tag: 'p', children: [titleNormalize(post.title)] },
                { tag: 'blockquote' , children: [post.provider + ' - Telegram']},
                { tag: 'img' , attrs: { src: post['metadata']['message']['image']['src'] }},
                { tag: 'a' , attrs: { href: post.source_link }},
                { tag: 'br' });

        previousProvider = post.provider;   // previous post provider is 👆🏾 provider that just got processed
    }
    const telegraph = new Telegraph();

    let result = await telegraph.createPage(process.env.TELEGRAPH_ACCESS_TOKEN , `Daily Gist ${new Date().toDateString()}`, nodes, { return_content: true });
    return result?.url
}

export async function sendMessageToChannel(uid: number, channel: string, photo: string = "", text: string, includeAuthor: boolean = false) {
    if (!await userIsAdminOfChannel(channel, uid)) throw new Error('You are no admin of this telegram channel');
    if (includeAuthor) text += '\n\nauthor: ' + (await getUser(uid)).first_name;

    if (photo)
        return Bot.telegram.sendPhoto(channel , { source: fs.readFileSync(photo) }, {
            caption: text
        });
    else
        return await Bot.telegram.sendMessage(channel, text)
}
