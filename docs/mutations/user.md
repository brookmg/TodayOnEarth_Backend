---
prev: ../queries/provider
next: ./post
---

# User Mutations
These are the mutations defined under the user model, there are used to fetch data from the api regarding users

## signIn
```graphql
    signIn(email: String!, password: String!) : Token
```
mutation for signing a user in and getting a token. `email` - can also be a username

## signUp
```graphql
    signUp(new_user: IUser) : Token
```
mutation for signing a user up 

## sendVerification
```graphql
    sendVerification: Boolean
```
mutation for sending an email-verification email to the user's email address

## resetPassword
```graphql
    resetPassword(email: String): Boolean
```
mutation for sending a password reset token to the user's email address

## resetPasswordWithToken
```graphql
    resetPasswordWithToken(token: String, newPassword: String): Boolean
```
mutation for modifying a password for a user given that the given reset token is correct

## makeUserAdmin
```graphql
    makeUserAdmin(uid: Int) : Boolean
```
mutation for increasing the role field of a user to level 4. Which is an admin.

## signOut
```graphql
    signOut: Boolean
```
mutation for signing the user out. It's not required for normal api use but for a frontend this helps by clearing the cookies associated with user identification.

## Graphql Schema
gql schema for this model goes 
```graphql
extend type Mutation {
    signIn(email: String!, password: String!) : Token
    signUp(new_user: IUser) : Token
    sendVerification: Boolean
    resetPassword(email: String): Boolean
    resetPasswordWithToken(token: String, newPassword: String): Boolean
    makeUserAdmin(uid: Int) : Boolean
    signOut: Boolean
}
```
