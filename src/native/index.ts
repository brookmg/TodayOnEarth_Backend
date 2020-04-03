const greet  = require('bindings')('sample');

export class NativeClass {
    /**
     * Static method to get a sorted list of posts by community interaction
     * @param posts - JSON array of posts to sort
     * @param workingOn - the interaction to sort by `like`, `retweet`
     */
    public static sortByCommunityInteraction(posts: string, workingOn: string) { return greet.sortByCommunityInteraction(posts, workingOn) }

    /**
     * Static method to get a sorted list of posts by relative community interaction
     * @param posts - JSON array of posts to sort
     * @param workingOn - the interaction to sort by `like`, `retweet`
     */
    public static sortByRelativeCommunityInteraction(posts: string, workingOn: string) { return greet.sortByRelativeCommunityInteraction(posts, workingOn) }

    /**
     * Static method to get a sorted list of posts by trending keywords among the posts
     * @param posts - JSON array of posts to sort
     * @param semantics - consider semantic relation
     */
    public static sortByTrendingKeyword(posts: string, semantics: boolean) { return greet.sortByTrendingKeyword(posts, semantics); }

    /**
     * Static method to get a sorted list of posts by user interest
     * @param posts - JSON array of posts to sort
     * @param userInterests - JSON array of interests
     * @param semantics - consider semantic relation
     */
    public static sortByUserInterest(posts: string, userInterests: string, semantics: boolean) { return greet.sortByUserInterest(posts, userInterests, semantics); }

    /**
     * Static method to get keyword frequency within a post
     * @param post - JSON object of the post to check
     * @param semantics - consider semantic relation
     */
    public static getKeywordFrequency(post: string, semantics: boolean) { return greet.getKeywordFrequency(post, semantics) }

    /**
     * Static method to get post count and community interaction for a provider from given posts
     * @param posts - JSON array of posts to look into
     */
    public static getPostCountAndCommunityInteractionByProvider(posts: string) {
        return greet.getPostCountAndCommunityInteractionByProvider(posts)
    }

    /**
     * Static method to get keywords present in posts
     * @param posts - JSON array of posts
     * @param semantics - consider semantic relation
     */
    public static findKeywordListForPosts(posts: string, semantics: boolean) { return greet.findKeywordListForPosts(posts, semantics) }
}
