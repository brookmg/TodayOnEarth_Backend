---
prev: ./provider
next: ./native
---

# Native Queries
These are the queries defined under the native module, there are used to do some NLP related tasks that are CPU intensive

### getPostsSortedByCommunityInteraction
```graphql
    getPostsSortedByCommunityInteraction(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, workingOn: [String]): [Post]
```
Query to return sorted posts by community interactions ( retweets , views , likes .... ). filters will be array of query items such as 
`{ provider: "bbcworld", connector: "AND" } ` or `{ source: "twitter", connector: "AND" }` and concatenating these items will create a filter for the db.
- jsonQuery: is an array of query items composed of field and a connector
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC
- semantics: consider semantic relation between words
- workingOn: the specific interaction to sort by `like` , `retweet`

### getPostsSortedByRelativeCommunityInteraction
```graphql
    getPostsSortedByRelativeCommunityInteraction(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, workingOn: [String]): [Post]
```
Query to return sorted posts by community interactions ( retweets , views , likes .... ) relative to the other posts in the query. filters will be array of query items such as 
`{ provider: "bbcworld", connector: "AND" } ` or `{ source: "twitter", connector: "AND" }` and concatenating these items will create a filter for the db.
- jsonQuery: is an array of query items composed of field and a connector
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC
- workingOn: the specific interaction to sort by `like` , `retweet`

### getPostsSortedByCustomKeywords
```graphql
    getPostsSortedByCustomKeywords(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, keywords: [String]): [Post]
```
Query to sort posts by the value they have against list of keyword. filters will be array of query items such as 
`{ provider: "bbcworld", connector: "AND" } ` or `{ source: "twitter", connector: "AND" }` and concatenating these items will create a filter for the db.
- jsonQuery: is an array of query items composed of field and a connector
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC
- semantics - consider semantics relationship between words
- keywords - the keywords to sort the post by

### getPostsSortedByTrendingKeyword
```graphql
    getPostsSortedByTrendingKeyword(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean): [Post]
```
Query to sort posts by the most frequent keyword in the posts. filters will be array of query items such as 
`{ provider: "bbcworld", connector: "AND" } ` or `{ source: "twitter", connector: "AND" }` and concatenating these items will create a filter for the db.
- jsonQuery: is an array of query items composed of field and a connector
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC
- semantics - consider semantics relationship between words

### getPostTopics
```graphql
    getPostTopics(postId: Int, semantics: Boolean) : [Interest]
```
Query to get list of topics mentioned in a post.
- postId: id of the post
- semantics: consider semantic relation between words in the post 

### getTodaysTrendingKeywords
```graphql
    getTodaysTrendingKeywords(semantics: Boolean, page: Int, range: Int) : [Interest]
```
Query to get list of topics that are trending in today's posts from different sources
- semantics: consider semantic relation between words in the post 
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1


### getPostRelevance
```graphql
    getPostRelevance(postId: Int!, keywords: [String]!, semantics: Boolean) : [Interest]
```
Query to get post relevance against a list of keywords
- postId: id of the post
- semantics: consider semantic relation between words in the post 
- keywords: list of keywords to check post relevance

### getPostRelevancePerUserInterests
```graphql
    getPostRelevancePerUserInterests(postId: Int!, semantics: Boolean) : [Interest]
```
Query to get post relevance against a list of interests found for the current logged in user
- postId: id of the post
- semantics: consider semantic relation between words in the post 

### getPostsSortedByUserInterest
```graphql
    getPostsSortedByUserInterest(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean): [Post]
```
Query to sort posts by the value they have against list of interest from a user. filters will be array of query items such as 
`{ provider: "bbcworld", connector: "AND" } ` or `{ source: "twitter", connector: "AND" }` and concatenating these items will create a filter for the db.
- jsonQuery: is an array of query items composed of field and a connector
- page: what page to fetch. starts from 0
- range: number of items per page. starts from 1
- orderBy: the number of the field to sort by
- order: ASC or DESC
- semantics - consider semantics relationship between words


## Graphql Schema
gql schema for this model goes 
```graphql
type Query {
    getPostsSortedByCommunityInteraction(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, workingOn: [String]): [Post]
    getPostsSortedByRelativeCommunityInteraction(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, workingOn: [String]): [Post]
    getPostsSortedByCustomKeywords(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean, keywords: [String]): [Post]
    getPostsSortedByTrendingKeyword(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean): [Post]
    getPostTopics(postId: Int, semantics: Boolean) : [Interest]
    getTodaysTrendingKeywords(semantics: Boolean, page: Int, range: Int) : [Interest]
    getPostRelevance(postId: Int!, keywords: [String]!, semantics: Boolean) : [Interest]
    getPostRelevancePerUserInterests(postId: Int!, semantics: Boolean) : [Interest]
    getPostsSortedByUserInterest(jsonQuery: [FilterQuery!]!, page: Int, range: Int, orderBy: String, order: String, semantics: Boolean): [Post]
}
```
