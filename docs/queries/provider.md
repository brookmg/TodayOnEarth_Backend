---
prev: ./post
next: ./provider
---

# Provider Queries
These are the queries defined under the provider gql module, used for setting up what the user what's to follow

### getProviders
```graphql
    getProviders(filters: [ProviderQuery]!, page: Int, range: Int, order: String, orderBy: String): [Provider]
```
used to fetch list of provider the same way one would fetch posts. filters will be array of query items such as 
`{ provider: "bbcworld", connector: "AND" } ` or `{ source: "twitter", connector: "AND" }` and concatenating these items will create a filter for the db.
- filters: is an array of query items composed of field and a connector
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC

### getProvidersForUser
```graphql
    getProvidersForUser: [Provider]
```
used to get list of providers the user set out to follow

### getPostsForUser
```graphql
    getPostsForUser(page: Int, range: Int, fruitPunch: Boolean, fruitLimit: Int): [Post]
```
used to get list of posts for the user filtered out only by providers they are following

### getPostScrapedSinceForUser
```graphql
    getPostScrapedSinceForUser(time: Int, page: Int, range: Int): [Post]
```
used to get list of posts for the user filtered out only by providers they are following and scraped after the specified time

### getPostFromForUser
```graphql
    getPostFromForUser(time: Int, page: Int, range: Int): [Post]
```
used to get list of posts for the user filtered out only by providers they are following and published after the specified time

### getPostPublishedOnForUser
```graphql
    getPostPublishedOnForUser(time: Int, page: Int, range: Int): [Post]
```
used to get list of posts for the user filtered out only by providers they are following and published on the specified time

### getPostCustomizedForUser
```graphql
    getPostCustomizedForUser(jsonQuery: [FilterQuery!]!, page: Int, range: Int): [Post]
```
used to get list of posts for the user filtered out only by providers they are following and 
filtered by custom query. 
- jsonQuery: is an array of query items composed of field and a connector, i.e `{ provider: "ludaxia", connector: "AND" }` or `{ title: "COVID19", connector: "AND" }`. 
             these can be used to concatenate queries and leverage the power of SQL based dbs instead of doing them on client side.
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC

## Graphql Schema
gql schema for this model goes 
```graphql
extend type Query {
    getProviders(filters: [ProviderQuery]!, page: Int, range: Int, order: String, orderBy: String): [Provider]
    getProvidersForUser: [Provider]
    getPostsForUser(page: Int, range: Int, fruitPunch: Boolean, fruitLimit: Int): [Post]
    getPostScrapedSinceForUser(time: Int, page: Int, range: Int): [Post]
    getPostFromForUser(time: Int, page: Int, range: Int): [Post]
    getPostPublishedOnForUser(time: Int, page: Int, range: Int): [Post]
    getPostCustomizedForUser(jsonQuery: [FilterQuery!]!, page: Int, range: Int): [Post]
}
```
