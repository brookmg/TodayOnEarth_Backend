import {postTweet} from "../socials/twitter";
import {postOnToLinkedIn} from "../socials/linkedin";
import {createWriteStream, unlink} from "fs";

const { gql } = require('apollo-server-express');

export const typeDef = gql`
    type PublishedPost {
        text: String,
        filename: String
        mimetype: String
        encoding: String
    }
    
    extend type Mutation {
        postOnToSocials(text: String!, upload: Upload, telegram: Boolean, linkedin: Boolean, twitter: Boolean, channel: String) : PublishedPost
    }
`;

export const resolvers = {
    Mutation: {
        postOnToSocials: async (_, {text, file, telegram, linkedin, twitter, channel}, {user}) => {
            let u = await user.getUser();
            if (!u) throw new Error('You must be logged in.');

            if (file) {
                const {createReadStream, filename, mimetype, encoding} = await file;
                const stream = createReadStream();

                // Store the file in the filesystem.
                await new Promise((resolve, reject) => {
                    stream.on('error', error => {
                        unlink(`./medias/${filename}`, () => {
                            reject(error);
                        });
                    }).pipe(createWriteStream(`./medias/${filename}`))
                        .on('error', reject)
                        .on('finish', resolve)
                });
                console.log('-----------file written');

                const { sendMessageToChannel } = require("../socials/telegram");
                if (telegram && channel) {
                    let send = await sendMessageToChannel(u.uid, channel, `./medias/${filename}` , text, false);
                    return { filename, encoding, mimetype, send }
                } else if (linkedin) {
                    let send = await postOnToLinkedIn(u.uid , text, text);
                    return { filename, encoding, mimetype, send }
                } else if (twitter) {
                    let send = await postTweet({ status: text} , [`./medias/${filename}`], u.uid);
                    return { filename, encoding, mimetype, send }
                }

                return await file;
            }

            const { sendMessageToChannel } = require("../socials/telegram");
            if (telegram && channel) {
                let send = await sendMessageToChannel(u.uid, channel, "" , text, false);
                return { send }
            }

            if (linkedin) {
                let send = await postOnToLinkedIn(u.uid , text, text);
                return { send }
            }

            if (twitter) {
                let send = await postTweet({ status: text} ,[] ,u.uid);
                return { send }
            }

            return await file;

        }
    }
};
