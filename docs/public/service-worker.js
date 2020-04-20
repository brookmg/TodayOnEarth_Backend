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
    "url": "assets/js/app.65a4e783.js",
    "revision": "ac69334aca5e37ce9a6aa59166ef7228"
  },
  {
    "url": "assets/js/vendors~docsearch.cd233421.js",
    "revision": "efb6c1bfefef83736e351e321da18598"
  },
  {
    "url": "contribution/people.html",
    "revision": "d59a319a616794be6d5de2e5d8f1cf65"
  },
  {
    "url": "contribution/tech.html",
    "revision": "90845628a6fbcc14dc4e876bc3b6a995"
  },
  {
    "url": "guide/setup.html",
    "revision": "bda47212193fd0a0aee724417745c997"
  },
  {
    "url": "index.html",
    "revision": "6be9802d1de084a7ed8ba661c6c06a33"
  },
  {
    "url": "models/interest.html",
    "revision": "48c2a32731e69f76864be1108e0fd121"
  },
  {
    "url": "models/post.html",
    "revision": "245a9fefcfe6f00d4a61e305838be853"
  },
  {
    "url": "models/provider.html",
    "revision": "240f4702ef2fd805c2a79d5c44485580"
  },
  {
    "url": "models/socials.html",
    "revision": "4504703dc261b297d6350624e9e2e58b"
  },
  {
    "url": "models/user.html",
    "revision": "9f5ae78da195f722258f93e9436c1534"
  },
  {
    "url": "mutations/interest.html",
    "revision": "c7a810041f06ac9da0b782e036063534"
  },
  {
    "url": "mutations/post.html",
    "revision": "1d1d8f5a64c60de13cc97a3195d179ac"
  },
  {
    "url": "mutations/provider.html",
    "revision": "5256e0ab6573b30feed922c15a10ab97"
  },
  {
    "url": "mutations/socials.html",
    "revision": "0cdd24e3a3d908f8432394dc2380c954"
  },
  {
    "url": "mutations/user.html",
    "revision": "76e8d3bae82245cdf2d33af22614c2e5"
  },
  {
    "url": "queries/interest.html",
    "revision": "6f5c869aba3a6ad07c8c11f4def9cbe9"
  },
  {
    "url": "queries/native.html",
    "revision": "c5a4384d7faf46581c2b1908e4b7bc93"
  },
  {
    "url": "queries/post.html",
    "revision": "fc52988bf4a32f248616305b57ff843e"
  },
  {
    "url": "queries/provider.html",
    "revision": "6c6c76a64af84bde25ee579006b8cdb2"
  },
  {
    "url": "queries/user.html",
    "revision": "4f65629e37ab13f64efd0858ce27c0d8"
  },
  {
    "url": "subscriptions/post.html",
    "revision": "34e87a2894180049352a50a9250aebbf"
  },
  {
    "url": "subscriptions/user.html",
    "revision": "017a0de5ad75b836985cf79b92c7bd7d"
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
