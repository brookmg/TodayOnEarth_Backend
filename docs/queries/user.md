---
prev: ../models/provider
next: ./post
---

# User Queries
These are the queries defined under the user model, there are used to fetch data from the api regarding users

## getUserWithId
```graphql
    getUserWithId(uid: Int) : User
```
used to get user using just their id

## me
```graphql
    me: User
```
used to get user data for currently logged in user

## getUser
```graphql
    getUser: User
```
name alias for `me` query

## getAllUsers
```graphql
    getAllUsers(page: Int, range: Int): [User]
```
used to get all the users as array. only admin users has access to this query

## isUserNameTaken
```graphql
    isUserNameTaken(username: String) : Boolean
```
Query to check if a username is taken not.

## isEmailUsed
```graphql
    isEmailUsed(email: String) : Boolean
```
Query to check if an email is taken not.

## isPasswordResetTokenValid
```graphql
    isPasswordResetTokenValid(token: String) : Boolean
```
Query to check if a password reset token is valid

## isEmailVerified
```graphql
    isEmailVerified: Boolean
```
Query to check if the user's email address is verified.

## getCurrentUserToken
```graphql
    getCurrentUserToken: Token
```
Query to get the current used token

## Graphql Schema
gql schema for this model goes 
```graphql
extend type Query {
    getUserWithId(uid: Int) : User  # ONLY FOR ADMIN ROLE USERS!
    me: User
    getUser: User   # The same as the above query but more explainatory naming
    getAllUsers(page: Int, range: Int): [User]
    isUserNameTaken(username: String) : Boolean
    isEmailUsed(email: String) : Boolean
    isPasswordResetTokenValid(token: String) : Boolean
    isEmailVerified: Boolean
    getCurrentUserToken: Token
}
```
