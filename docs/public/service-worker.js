/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "assets/css/0.styles.3cfff256.css",
    "revision": "1710360655f183712741e186e6ed6162"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.263a1941.js",
    "revision": "4408184d139b26b2af061aa81091ee15"
  },
  {
    "url": "assets/js/11.e011b6c7.js",
    "revision": "3f67d8e4e27238409584dcd464c070ad"
  },
  {
    "url": "assets/js/12.e9abd3de.js",
    "revision": "5fce148eecca8ea6ef43077fae4e7038"
  },
  {
    "url": "assets/js/13.ffa9e6d5.js",
    "revision": "1c53603f64176ace764da409bf0ea97f"
  },
  {
    "url": "assets/js/14.3c1c9cb2.js",
    "revision": "a74e0e9becdcd4fff1a6269f41e336bb"
  },
  {
    "url": "assets/js/15.235ee063.js",
    "revision": "0ef3c4bc9e15043f0d330dc06d947c25"
  },
  {
    "url": "assets/js/16.d75d9986.js",
    "revision": "a7ecb1af6683563d96c0f65c0af60d0d"
  },
  {
    "url": "assets/js/17.3c6d9825.js",
    "revision": "bbb235f7d49435f1c50282316e5fb0dc"
  },
  {
    "url": "assets/js/18.ac1e0368.js",
    "revision": "7d72ff845eca83643d4a2223ec3e53d0"
  },
  {
    "url": "assets/js/19.c5d9b58b.js",
    "revision": "05e5e7a4cd65cee4746a70949fd61c0b"
  },
  {
    "url": "assets/js/20.b6859fbf.js",
    "revision": "cb633b6b13a12d2814364cf6603f4ef7"
  },
  {
    "url": "assets/js/21.303d9cf4.js",
    "revision": "050961a8aefe37807d7c381ac4edb141"
  },
  {
    "url": "assets/js/22.2df73b5d.js",
    "revision": "8e1622ca99e8bc2ca854da6a12ae6393"
  },
  {
    "url": "assets/js/23.0e799981.js",
    "revision": "5de0f3cef8a14bd65a7a922cb8bfde9d"
  },
  {
    "url": "assets/js/24.0a0c507f.js",
    "revision": "acee32ea117d61d9c5ff52ad8d3a762a"
  },
  {
    "url": "assets/js/25.05c6d9bb.js",
    "revision": "a07255f0eed9ce9b13f560583c66e2c8"
  },
  {
    "url": "assets/js/26.4c093b6b.js",
    "revision": "5025f25433a45fa9bd5a4721ad9240ce"
  },
  {
    "url": "assets/js/27.b40e53da.js",
    "revision": "6f959665a3e487d8ca9a1575ed6767c4"
  },
  {
    "url": "assets/js/28.3ca5974c.js",
    "revision": "b36a6fc94233c7a399dac396eb0c96a7"
  },
  {
    "url": "assets/js/29.11ff5066.js",
    "revision": "8ef0d87a8f7f3c2c1657d22a9758575e"
  },
  {
    "url": "assets/js/3.2e1bf017.js",
    "revision": "7d4a9ce1ba61b9423eea3553df975aa8"
  },
  {
    "url": "assets/js/4.74f1a3f6.js",
    "revision": "b9fad1d195cd003e6ce5bd754309a2b8"
  },
  {
    "url": "assets/js/5.3664bd5c.js",
    "revision": "34c0104c100a7c22e6a0f8d3ea6eb8e9"
  },
  {
    "url": "assets/js/6.5904e004.js",
    "revision": "716da8594138698bde3b76c103b9acdb"
  },
  {
    "url": "assets/js/7.ca55481c.js",
    "revision": "259251bca4e8d3fd0ebb197dc920bf49"
  },
  {
    "url": "assets/js/8.e3a94b78.js",
    "revision": "2111f714659ce88dce7a8fc0bcec8304"
  },
  {
    "url": "assets/js/9.dcaea7c3.js",
    "revision": "60b168829dc73186cf202cb2aaecee2c"
  },
  {
    "url": "assets/js/app.120da8f7.js",
    "revision": "4012c6369af822c85a70b1609d3dfb0f"
  },
  {
    "url": "assets/js/vendors~docsearch.cd233421.js",
    "revision": "efb6c1bfefef83736e351e321da18598"
  },
  {
    "url": "contribution/people.html",
    "revision": "136cf8abac60436061b76afe2187dcd0"
  },
  {
    "url": "contribution/tech.html",
    "revision": "32655d003ac2be6ad9318cb8b7b333a5"
  },
  {
    "url": "guide/setup.html",
    "revision": "3c112e89264f91ed8da93cc516e96081"
  },
  {
    "url": "index.html",
    "revision": "39202f3f5c2c2a81634ee83c3dcddd0c"
  },
  {
    "url": "models/interest.html",
    "revision": "a4acff89443def5b2b46781bd1a1b9e1"
  },
  {
    "url": "models/post.html",
    "revision": "83a96262e1f701b3a1bda25c24d192e9"
  },
  {
    "url": "models/provider.html",
    "revision": "bdbcc3be7f8a8b5efb9a028ee1e3591e"
  },
  {
    "url": "models/socials.html",
    "revision": "51efe35ed0c1697f93d9850da2594416"
  },
  {
    "url": "models/user.html",
    "revision": "eb9f1c72e57882177b4713bb54b685e5"
  },
  {
    "url": "mutations/interest.html",
    "revision": "583ad78597db31ca63ce9dadf1f984ec"
  },
  {
    "url": "mutations/post.html",
    "revision": "735f65fc90415f9a8221befbf5d8d1cc"
  },
  {
    "url": "mutations/provider.html",
    "revision": "29b3598d24e963a0b69603db19cad176"
  },
  {
    "url": "mutations/socials.html",
    "revision": "7d07def272481d2a0285432e32e432ee"
  },
  {
    "url": "mutations/user.html",
    "revision": "31531cf83efccbb88254f93fcb05c9e3"
  },
  {
    "url": "queries/interest.html",
    "revision": "19858520b33f4c98c72475dcd60e18e7"
  },
  {
    "url": "queries/native.html",
    "revision": "479c6ac448dada93bbf291fc19e2e686"
  },
  {
    "url": "queries/post.html",
    "revision": "f214f025d498fe46bf21a8dbaae52119"
  },
  {
    "url": "queries/provider.html",
    "revision": "08600ed0abd0e9c33ac166b598705472"
  },
  {
    "url": "queries/user.html",
    "revision": "420a104213cbb3e0658429e962d10c3e"
  },
  {
    "url": "subscriptions/post.html",
    "revision": "8a05d7b9b961112fc62762b88569a116"
  },
  {
    "url": "subscriptions/user.html",
    "revision": "c2d46dff5abc224db3c9b0e6c0ef1ebc"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
