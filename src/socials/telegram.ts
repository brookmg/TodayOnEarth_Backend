import Bot from "../bot/bot";
import {getUser} from "../db/user_table";

export async function sendMessageOnTelegram(uid: number, text: string) {
    if (!text) throw new Error('Text cannot be empty');
    let userTelegramId = (await getUser(uid)).telegram_id;
    if (!userTelegramId) throw new Error('User doesn\'t have a linked telegram account');
    return await Bot.telegram.sendMessage(userTelegramId, text);
}
