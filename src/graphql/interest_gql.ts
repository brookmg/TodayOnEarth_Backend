const { gql } = require('apollo-server-express');
import {
    addInterestForUser,
    addInterestListForUser,
    getInterestsForUser, muteInterestForUser, removeInterestForUser, unMuteOrResetInterestForUser,
    updateInterestForUser
} from "../db/interest_table";

export const typeDef = gql`
    # Interest type for a user
    type Interest {
        interest: String,
        score: Float,
        uid: Int
    }

    input IInterest {
        interest: String!,
        score: Float!
    }

    input UInterest {
        interest: String,
        score: Float!
    }
    
    extend type Query {
        getInterestsOfUser(page: Int, range: Int): [Interest]
    }
    
    type Mutation {
        addInterest(interest: IInterest!) : Boolean
        updateInterestList(interests: [IInterest]!) : Boolean
        cleanUpdateInterestList(interests: [IInterest]!) : Boolean
        updateInterest(interest: String!, update: UInterest!) : Boolean
        muteInterest(interest: String!) : Boolean
        unMuteOrResetInterest(interest: String!) : Boolean
        removeInterest(interest: String!) : Boolean
    }
    
`;

export const resolvers = {
    Query: {
        getInterestsOfUser: async ( _ , { page, range } , { user }) => {
            user = await user.getUser();
            if (!user) throw new Error('You must be authenticated to access this');
            return getInterestsForUser(user.uid, page, range);
        },
    },

    Mutation: {
        addInterest: async (_ , {interest} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return !!await addInterestForUser(interest.interest , interest.score, userObj.uid);
        },

        updateInterest: async (_ , { interest , update } , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return !!await updateInterestForUser(interest , update , userObj.uid);
        },

        updateInterestList: async (_ , {interests} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return addInterestListForUser(interests , userObj.uid)
        },

        cleanUpdateInterestList: async (_ , {interests} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return addInterestListForUser(interests , userObj.uid , true)
        },

        muteInterest: async (_ , {interest} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return !!await muteInterestForUser(interest, userObj.uid)
        },

        unMuteOrResetInterest: async (_ , {interest} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return !!await unMuteOrResetInterestForUser(interest, userObj.uid)
        },

        removeInterest: async (_ , {interest} , {user}) => {
            let userObj = await user.getUser();
            if (!userObj) throw new Error('You must be authenticated to access this');
            return removeInterestForUser(interest , userObj.uid)
        }
    }
};
