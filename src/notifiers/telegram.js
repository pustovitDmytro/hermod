import { fill } from 'myrmidon';
import Api from '../api/TelegramAPI';
import conf from '../etc/config';

const c = conf.telegram;

function stripHtmlTagsFromResult(str) {
    return str.replace(/<[^>]+>/g, tag => {
        const allowed = [ '<b>', '</b>', '<i>', '</i>', '<u>', '</u>', '<s>', '</s>',
            '<code>', '</code>', '<pre>', '</pre>', '<a ', '</a>' ];

        return allowed.some(allowedTag => tag.startsWith(allowedTag)) ? tag : '';
    });
}

export default class TelegramNotifier {
    constructor(config) {
        this.api = new Api(c.botId, c.botToken);
        this.config = config;
    }

    send(item) {
        const html = fill(this.config.template, item);

        return this.api.sendMessage(this.config.channel, stripHtmlTagsFromResult(html));
    }
}
