---
prev: ./user
next: ./interest
---

# Post Mutations
These are the mutations defined under post gql module, things related to post querying can be found here partially

## postOpened
```graphql
    postOpened(postId: Int): Boolean
```
Mutation to log the user interaction with a post item. This could be fired when user showed more than average interest in a post.

## postLiked
```graphql
    postLiked(postId: Int): Boolean
```
Mutation to log the user interaction with a post item. This could be fired when user showed huge interest in a post.

## postDisLiked
```graphql
    postDisLiked(postId: Int): Boolean
```
Mutation to log the user interaction with a post item. This could be fired when user shows a distaste for a content.

## postUnDisLiked
```graphql
    postUnDisLiked(postId: Int): Boolean
```
Mutation to undo the operation of the postDisLiked mutation

## postUnLiked
```graphql
    postUnLiked(postId: Int): Boolean
```
Mutation to undo the operation of the postLiked mutation

## postImpressionReceived
```graphql
    postImpressionReceived(postId: Int, ms: Int) : Boolean 
```
Mutation to log user interaction with a post item while scrolling though a list of them or at a glance

## Graphql Schema
gql schema for this model goes 
```graphql
extend type Mutation { 
    postOpened(postId: Int): Boolean,
    postLiked(postId: Int): Boolean,
    postDisLiked(postId: Int): Boolean,
    postUnDisLiked(postId: Int): Boolean,
    postUnLiked(postId: Int): Boolean,
    postImpressionReceived(postId: Int, ms: Int) : Boolean 
}
```
