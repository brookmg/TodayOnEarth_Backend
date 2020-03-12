import Bot from "../bot/bot";
import {getUser} from "../db/user_table";
import * as fs from "fs";

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

export async function sendMessageToChannel(uid: number, channel: string, photo: string, text: string, includeAuthor: boolean = false) {
    if (!await userIsAdminOfChannel(channel, uid)) throw new Error('You are no admin of this telegram channel');
    if (includeAuthor) text += '\n\nauthor: ' + (await getUser(uid)).first_name;

    if (photo)
        return Bot.telegram.sendPhoto(channel , { source: fs.readFileSync(photo) }, {
            caption: text,
            parse_mode: "MarkdownV2"
        });
    else
        return await Bot.telegram.sendMessage(channel, text)
}
