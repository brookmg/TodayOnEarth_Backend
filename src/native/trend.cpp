#include "includes/main.h"

void sortByCommunityInteraction(json &posts,unordered_set<string> scoreParams) {
    sort(posts.begin(), posts.end(), [scoreParams](json p1,json p2)
    {
        int scoreP1 = 0, scoreP2 = 0;

        for(auto param: scoreParams)
        {
            json p1ParamValue = p1["metadata"]["community_interaction"][param];
            json p2ParamValue = p2["metadata"]["community_interaction"][param];

            scoreP1 += p1ParamValue == nullptr ? 0 : p1ParamValue.get<int>();
            scoreP2 += p2ParamValue == nullptr ? 0 : p2ParamValue.get<int>();
        }

        return scoreP1 > scoreP2;

    } );
}

unordered_map<string, json> getPostCountAndCommunityInteractionByProvider(json &posts) {
    unordered_map<string, json> totalInteraction;

    /**
     * do first pass, storing total community interaction info and post count in json.
     */
    for(auto& p : posts) {
        string provider = p["provider"];

        auto& postCount = totalInteraction[provider]["post_count"];

        if(postCount == nullptr) postCount = 0;
        else postCount=postCount.get<int>()+1;

        for(auto& community_interaction : p["metadata"]["community_interaction"].items()) {
            string key = community_interaction.key();
            int value = community_interaction.value() == nullptr ? 0: community_interaction.value().get<int>();

            auto& interactionValue = totalInteraction[provider]["community_interaction"][key];

            if(interactionValue == nullptr) interactionValue = 0;
            else interactionValue = interactionValue.get<int>() + value;
        }

    }
    return totalInteraction;

}

void tagPostsWithRelativeCommunityInteractionScore(json &posts,unordered_set<string> scoreParams) {
    auto providerInfo = getPostCountAndCommunityInteractionByProvider(posts);

    for(auto& p: posts){
        for(auto sp: scoreParams){

            auto provider = providerInfo.at(p["provider"]);
            json& communityInteractionForCurrentParam = p["metadata"]["community_interaction"][sp];

            int avgScoreForCurrentParam = provider["community_interaction"][sp].get<int>() / provider["post_count"].get<int>();
            p["score_relative_:"+sp] = avgScoreForCurrentParam == 0 ? 0 : ((communityInteractionForCurrentParam.get<int>() - avgScoreForCurrentParam) / (double) avgScoreForCurrentParam);

        }
    }

}

void sortByRelativeCommunityInteraction(json &posts,unordered_set<string> scoreParams) {
    tagPostsWithRelativeCommunityInteractionScore(posts, scoreParams);

    sort(posts.begin(), posts.end(), [scoreParams](auto p1, auto p2) {

        double scoreP1 = 0, scoreP2 = 0;

        for(auto param: scoreParams){

            json p1ParamValue = p1["score_relative_" + param];
            json p2ParamValue = p2["score_relative_" + param];

            double p1CurrentParamScore = (p1ParamValue == nullptr ? 0 : p1ParamValue.get<double>());
            double p2CurrentParamScore = (p2ParamValue == nullptr ? 0 : p2ParamValue.get<double>());

            scoreP1 += p1CurrentParamScore;
            scoreP2 += p2CurrentParamScore;

        }

        return scoreP1 > scoreP2;
    });

}

void tagPostsWithAverageCommunityInteraction(json &posts,unordered_set<string> tagParams){
    auto providerInfo = getPostCountAndCommunityInteractionByProvider(posts);
    for(auto& p: posts) {
        for(auto tp: tagParams) {

            auto provider = providerInfo.at(p["provider"]);
            if(p["metadata"]["community_interaction"][tp] != nullptr) {
                int avg = provider["community_interaction"][tp].get<int>() / provider["post_count"].get<int>();
                p["avg_"+tp] = avg;
            }
            else {
                p["metadata"]["community_interaction"][tp] = 0;

            }

        }
    }

}

double generateSimilarityScore(PyObject *pFunc, string w1, string w2, bool checkSematicSimilarity = true) {
    transform(w1.begin(), w1.end(), w1.begin(), ::tolower);
    transform(w2.begin(), w2.end(), w2.begin(), ::tolower);

    if(w1 == w2)
        return 1;

    double semanticSimilarity = 0;

    if(checkSematicSimilarity)
    {

        PyObject *ret = PyEval_CallObject(pFunc, Py_BuildValue("(ss)", w1.c_str(), w2.c_str()));
        if (!ret)
        {
            cout << "[ERROR]: Result was NULL" << endl;
            return -1;
        }


        semanticSimilarity = PyFloat_AsDouble(ret);
    }

    //cout << "Function returned: " << PyUnicode_AsUTF8(ret) << endl;
    double similarity = max(0.d,semanticSimilarity);

    return similarity;

}

void findFrequency(PyObject* pScoreFunction, unordered_map<string,double> &frequencyMap, unordered_set<string> &currentWords, bool checkSematicSimilarity, double mergeCutOffScore = 0.8) {
    vector<string> toBeMerged = {};
    for(auto currentWord: currentWords)
    {
        bool isAssimilated = false;
        for(auto word: frequencyMap)
        {
            double currentScore = generateSimilarityScore(pScoreFunction,currentWord,word.first,checkSematicSimilarity);

            cout<<currentScore<<" score for: "<<currentWord<<" and "<<word.first<<endl;


            if(currentScore >= mergeCutOffScore)
            {
                frequencyMap[word.first] += currentScore;

                isAssimilated = true;
            }
        }

        if(!isAssimilated)
        {
            toBeMerged.push_back(currentWord);
        }
    }

    for(auto word: toBeMerged)
    {
        frequencyMap[word] += 1;
    }
}

unordered_set<string> postToKeywords(json p, unordered_set<string>& stopWords) {

    unordered_set<string> ret;
    unordered_set<string> titleSet = splitToUniqueKeywords(p["title"]);
    // unordered_set<string> bodySet = splitToUniqueKeywords(p["body"]);

    for(auto w:titleSet) {
        if(stopWords.find(w) == stopWords.end()) {
            ret.insert(w);
        }
    }

    return ret;
}

void sortByTrendingKeyword(PyObject* pScoreFunction,json &posts, unordered_set<string>& stopWords, bool checkSematicSimilarity = true) {
    if(posts.size() < 2) {
        cout<<"[ERROR]: sortByTrendingKeyword needs at least 2 posts"<<endl;
        return;
    }

    auto firstPost = posts[0];
    auto rootKeywords = postToKeywords(firstPost,stopWords);

    for(auto w: rootKeywords) {
        cout<<"Root keywords: "<<w<<endl;
    }

    unordered_map<string,double> frequencyMap;

    // initialize the frequencyMap using custom root words
    for(auto word: rootKeywords) frequencyMap[word] += 1;

    for(unsigned int i=1; i<posts.size(); i++) {
        auto p = posts[i];

        // try to find similarities between root words and currentPostWords
        unordered_set<string> currentPostWords = postToKeywords(p,stopWords);
        findFrequency(pScoreFunction,frequencyMap,currentPostWords,checkSematicSimilarity);

        cout<<"At "<<i<<endl;
    }

    vector<pair<std::string,double>> sortedFrequencyMap;

    copy(frequencyMap.begin(),
         frequencyMap.end(),
         std::back_inserter<std::vector<pair<std::string,double>>>(sortedFrequencyMap));

    sort(sortedFrequencyMap.begin(), sortedFrequencyMap.end(), [](auto m1, auto m2){
        return m1.second > m2.second;
    });

    // print frequecy of keywords that will be sorted later
    for(auto word: sortedFrequencyMap) {
        cout<<"-word: "<<word.first<<" -frequency: "<<word.second<<endl;
    }

}

void sortByUserInterest(PyObject* pScoreFunction, json &posts,unordered_set<string> &stopWords, vector< pair<std::string,double> > interests, bool checkSemanicSimilarity) {

    bool checkSematicSimilarity = true;
    unordered_map<string, double> interestScoreMap;

    for(unsigned int i=0; i<posts.size(); i++) {
        auto &p = posts[i];
        auto postKeywords = postToKeywords(p,stopWords);
        p["score_interest_total"] = 0;
        bool isUninterestingPost = false;

        for(auto interest: interests) {
            interestScoreMap[interest.first] = 0;

            for(auto currentWord: postKeywords) {
                double currentScore = generateSimilarityScore(pScoreFunction,currentWord,interest.first,checkSematicSimilarity);
                if(currentScore == 1) {
                    interestScoreMap[interest.first] += 1;

                    if(interest.second < 0 ) {
                        isUninterestingPost = true;
                        break;
                    }

                }
                else {
                    double relativeScore = currentScore / postKeywords.size();
                    interestScoreMap[interest.first] += relativeScore;
                }
            }

            p["score_interest_:"+interest.first] = interestScoreMap[interest.first];
            p["score_interest_total"] = p["score_interest_total"].get<double>() + interestScoreMap[interest.first];

            if(isUninterestingPost) {
                break;
            }

            cout<<"At: "<<i<<endl;
        }

        if(isUninterestingPost) {
            p["score_interest_total"] = -1;
        }

    }


    sort(posts.begin(), posts.end(), [](json& m1, json& m2) {
        return m1["score_interest_total"].get<double>() > m2["score_interest_total"].get<double>();
    });

}

vector<pair<string, double>> getKeywordFrequency(PyObject* pScoreFunction, json &post,unordered_set<string> &stopWords, bool checkSematicSimilarity) {
    auto postKeywords = postToKeywords(post,stopWords);
    for(auto w: postKeywords) {
        cout<<"Root keywords: "<<w<<endl;
    }

    unordered_map<string,double> frequencyMap;

    // initialize the frequencyMap using custom root words
    for(auto word: postKeywords) frequencyMap[word] += 1;

    findFrequency(pScoreFunction,frequencyMap,postKeywords,checkSematicSimilarity);
    vector<pair<std::string,double>> sortedFrequencyMap;

    copy(frequencyMap.begin(),
         frequencyMap.end(),
         std::back_inserter<std::vector<pair<std::string,double>>>(sortedFrequencyMap));

    sort(sortedFrequencyMap.begin(), sortedFrequencyMap.end(), [](auto m1, auto m2) {
        return m1.second > m2.second;
    });

//    // print frequecy of keywords that will be sorted later
//    for(auto word: sortedFrequencyMap) {
//        double adjustedFrequency = word.second/2;
//        cout<<"-word: "<<word.first<<" -frequency: "<<adjustedFrequency<<endl;
//    }

    return sortedFrequencyMap;

}
