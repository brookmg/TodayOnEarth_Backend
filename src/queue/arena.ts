const Arena = require('bull-arena');

const express = require('express');
const router = express.Router();

const arena = Arena({
  queues: [
    {
      name: "twitter_queue",
      hostId: "Twitter Queue",
    },
    {
        name: "facebook_queue",
        hostId: "Facebook Queue",
    },
    {
        name: "instagram_queue",
        hostId: "Instagram Queue",
    },
    {
        name: "telegram_queue",
        hostId: "Telegram Queue",
    },
    {
        name: "email_verification",
        hostId: "Email Verification"
    }
  ]
}, {
  basePath: '/c7a74dcab7e2928ca1236de34517fb94',    // md5 hash of arena_toe
  disableListen: true
});

router.use('/', arena);
export const Router = router;
