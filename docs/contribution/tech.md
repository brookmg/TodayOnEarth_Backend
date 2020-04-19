---
prev: ../subscriptions/user
next: ./people
---

# Technologies Used
Here we will see the technologies used in this project *At the backend*

## [NodeJS](https://nodejs.org)
Node. js is a platform built on Chrome's JavaScript runtime for easily building fast and scalable network applications. Node. js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

## [PostgresSQL](https://www.postgresql.org)
PostgreSQL is a powerful, open source object-relational database system that uses and extends the SQL language combined with many features that safely store and scale the most complicated data workloads. The origins of PostgreSQL date back to 1986 as part of the POSTGRES project at the University of California at Berkeley and has more than 30 years of active development on the core platform.

## [ObjectionJS](https://vincit.github.io/objection.js/)
Objection.js is an ORM for Node.js that aims to stay out of your way and make it as easy as possible to use the full power of SQL and the underlying database engine while still making the common stuff easy and enjoyable.
- We used this module as ORM for our postgresSQL database. Equipped with many solid features out of the box, it made the job of making a robust API really easy.

## [N-API](https://nodejs.org/api/n-api.html#n_api_n_api)
N-API (pronounced N as in the letter, followed by API) is an API for building native Addons. It is independent from the underlying JavaScript runtime (for example, V8) and is maintained as part of Node.js itself. This API will be Application Binary Interface (ABI) stable across versions of Node.js. It is intended to insulate Addons from changes in the underlying JavaScript engine and allow modules compiled for one major version to run on later major versions of Node.js without recompilation. The ABI Stability guide provides a more in-depth explanation.
- Due to the fact that JS is not ideal for CPU intensive processes and the lack of libraries for handling linguistic analysis in the language, we used a C++ module to do the heavy lifting.

## [Passport](https://Passportjs.org)
Passport is authentication middleware for Node. It is designed to serve a singular purpose: authenticate requests. When writing modules, encapsulation is a virtue, so Passport delegates all other functionality to the application. This separation of concerns keeps code clean and maintainable, and makes Passport extremely easy to integrate into an application.

## [TypeScript](https://www.typescriptlang.org)
TypeScript is an open-source language which builds on JavaScript, one of the world’s most used tools, by adding static type definitions.

Types provide a way to describe the shape of an object, providing better documentation, and allowing TypeScript to validate that your code is working correctly.

## [Python](https://www.python.org)
Python is an interpreted, object-oriented, high-level programming language with dynamic semantics. Its high-level built in data structures, combined with dynamic typing and dynamic binding, make it very attractive for Rapid Application Development, as well as for use as a scripting or glue language to connect existing components together. 
- This is not an ideal programming language to use honestly speaking. The best lexical relation database for English language ( [WordNet](https://wordnet.princeton.edu) ) is only available for this particular language. This has cost as a lot in terms of performance but there is no better option for it.

## [WordNet](https://wordnet.princeton.edu)
WordNet® is a large lexical database of English. Nouns, verbs, adjectives and adverbs are grouped into sets of cognitive synonyms (synsets), each expressing a distinct concept. Synsets are interlinked by means of conceptual-semantic and lexical relations. The resulting network of meaningfully related words and concepts can be navigated with the browser. WordNet is also freely and publicly available for download. WordNet's structure makes it a useful tool for computational linguistics and natural language processing.

## [GraphQL](https://graphql.org)
GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.
- We used most of the features inside GraphQL from queries and mutations to subscriptions. 

## [Redis](https://redis.io)
Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries and streams. Redis has built-in replication, Lua scripting, LRU eviction, transactions and different levels of on-disk persistence, and provides high availability via Redis Sentinel and automatic partitioning with Redis Cluster.

## [Bull](https://github.com/OptimalBits/bull)
Bull is a powerful queue based on redis for Node. Although it is possible to implement queues directly using Redis commands, this library provides an API that takes care of all the low-level details and enriches Redis basic functionality so that more complex use-cases can be handled easily.

## [Arena](https://github.com/bee-queue/arena)
An intuitive Web GUI for Bee Queue and Bull. Built on Express so you can run Arena standalone, or mounted in another app as middleware.

Features
- Check the health of a queue and its jobs at a glance
- Paginate and filter jobs by their state
- View details and stacktraces of jobs with permalinks
- Restart and retry jobs with one click

## [NodeMailer](https://nodemailer.com/about/)
Nodemailer is a module for Node.js applications to allow easy as cake email sending. The project got started back in 2010 when there was no sane option to send email messages, today it is the solution most Node.js users turn to by default.


