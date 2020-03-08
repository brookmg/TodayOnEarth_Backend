import Telegraf from "telegraf";

const Bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
export default Bot;
