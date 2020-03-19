const Arena = require('bull-arena');

const express = require('express');
const router = express.Router();

const arena = Arena({
  queues: [
      { name: "twitter_queue", hostId: "Twitter Queue" , redis:  process.env.REDIS_URL },
      { name: "facebook_queue", hostId: "Facebook Queue", redis:  process.env.REDIS_URL },
      { name: "instagram_queue", hostId: "Instagram Queue", redis:  process.env.REDIS_URL },
      { name: "telegram_queue", hostId: "Telegram Queue", redis:  process.env.REDIS_URL },
      { name: "email_verification", hostId: "Email Verification", redis:  process.env.REDIS_URL },
      { name: "provider_fetch_issuer", hostId: "Provider Fetch Issuer", redis:  process.env.REDIS_URL }
  ]
}, {
  basePath: '/c7a74dcab7e2928ca1236de34517fb94',    // md5 hash of arena_toe
  disableListen: true
});

router.use('/', arena);
export const Router = router;
