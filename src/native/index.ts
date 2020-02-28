const greet  = require('bindings')('sample');

export const Native = {
    sortByCommunityInteraction: greet.sortByCommunityInteraction,
    sortByRelativeCommunityInteraction: greet.sortByRelativeCommunityInteraction
};
