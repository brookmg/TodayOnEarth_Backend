#include <napi.h>
#include "json.hpp"
#include <Python.h>
#include <bits/stdc++.h>
#include <string>


using namespace Napi;
using namespace std;
using json = nlohmann::json;

/** UTILS.cpp **/
void printPrettyJson(json j, string filename);
PyObject * initializePythonInterpreter();
void finalizePythonInterpreter();
unordered_set<string> getStopWords();
json getPosts();
unordered_set<string> splitToUniqueKeywords(string str);
json fromString(string);
string toString(json j);
string getEnvVar( string key ,string defaultValue);

/** TREND.cpp **/
vector<pair<string, double>> getKeywordFrequency(PyObject* pScoreFunction, json &post,unordered_set<string> &stopWords, bool checkSemanticSimilarity);
void sortByUserInterest(PyObject* pScoreFunction, json &posts,unordered_set<string> &stopWords, vector< pair<std::string,double> > interests, bool checkSemanticSimilarity);
void sortByTrendingKeyword(PyObject* pScoreFunction,json &posts, unordered_set<string>& stopWords, bool checkSemanticSimilarity);
void tagPostsWithAverageCommunityInteraction(json &posts,unordered_set<string> tagParams);  // not worthy
void sortByRelativeCommunityInteraction(json &posts,unordered_set<string> scoreParams);
void tagPostsWithRelativeCommunityInteractionScore(json &posts,unordered_set<string> scoreParams); // not worthy
unordered_map<string, json> getPostCountAndCommunityInteractionByProvider(json &posts);
void sortByCommunityInteraction(json &posts,unordered_set<string> scoreParams);

/** SAMPLE.cpp **/



