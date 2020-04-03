---
prev: ./user
next: ./interest
---

# Post Queries
These are the queries defined under post gql module, things related to post querying can be found here partially

### getPosts
```graphql
    getPosts(page: Int, range: Int, orderBy: String, order: String): [Post]
```
used for querying list of post paginated and in specific order
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC

### getPost
```graphql
    getPost(id: Int) : Post
```
used for querying a post item using the post id.

### getPostFromProvider
```graphql
    getPostFromProvider(provider: String, page: Int, range: Int): [Post]
```
used for querying list of posts from a specific provider
- provider: the name of the account. for example: `ElonMusk`
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1

### getPostFromSource
```graphql
    getPostFromSource(source: String, page: Int, range: Int): [Post]
```
used for querying list of posts from a specific provider
- source: the name of the platform. for example: `facebook`
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1

### getPostScrapedSince
```graphql
    getPostScrapedSince(time: Int, page: Int, range: Int): [Post]
```
used for querying list of posts that are scraped after the specified time

### getPostFrom
```graphql
    getPostFrom(time: Int, page: Int, range: Int): [Post]
```
used for querying list of posts that are published after the specified time

### getPostPublishedOn
```graphql
    getPostPublishedOn(time: Int, page: Int, range: Int): [Post]
```
used for querying list of posts that are published on the specified time

### getPostCustomized
```graphql
    getPostCustomized(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String): [Post]
```
this is the most powerful query of them all. It allows to fetch a list of posts that satisfy some type of filters.
- jsonQuery: is an array of query items composed of field and a connector, i.e `{ provider: "ludaxia", connector: "AND" }` or `{ title: "COVID19", connector: "AND" }`. 
             these can be used to concatenate queries and leverage the power of SQL based dbs instead of doing them on client side.
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC

### getPostsScrapedBetween
```graphql
    getPostsScrapedBetween(startTime: Int, endTime: Int, page: Int, range: Int, orderBy: String, order: String): [Post]
```
used for querying list of posts that are scraped between the startTime and endTime provided
- startTime: the start of the range where the post should be scraped in
- endTime: the end of the range where the post should be scraped in
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC

### getPostsPublishedBetween
```graphql
    getPostsPublishedBetween(startTime: Int, endTime: Int, page: Int, range: Int, orderBy: String, order: String): [Post]  
```
used for querying list of posts that are published between the startTime and endTime provided
- startTime: the start of the range where the post should be published in
- endTime: the end of the range where the post should be published in
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC


## Graphql Schema
gql schema for this model goes 
```graphql
extend type Query {
    getPosts(page: Int, range: Int, orderBy: String, order: String): [Post]
    getPost(id: Int) : Post
    getPostFromProvider(provider: String, page: Int, range: Int): [Post]
    getPostFromSource(source: String, page: Int, range: Int): [Post]

    getPostScrapedSince(time: Int, page: Int, range: Int): [Post]
    getPostFrom(time: Int, page: Int, range: Int): [Post]
    getPostPublishedOn(time: Int, page: Int, range: Int): [Post]

    getPostWithKeyword(keyword: String, page: Int, range: Int): [Post]  @depricated
    getPostCustomized(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String): [Post]

    getPostsScrapedBetween(startTime: Int, endTime: Int, page: Int, range: Int, orderBy: String, order: String): [Post]
    getPostsPublishedBetween(startTime: Int, endTime: Int, page: Int, range: Int, orderBy: String, order: String): [Post]    
}
```
