print("python script importing started")
import sys

try:
    import os
    from ctypes import PyDLL
    print("env: ",os.environ)

    print("Python versionL",sys.version)
    print("Version info:",sys.version_info)


    from nltk.corpus import wordnet as wn

    getAllMeaningsCACHE = {}
    getSimilarityScoreCACHE = {}

    def getAllMeanings(word):
        if(hasattr(getAllMeaningsCACHE,word)):
            return getAllMeaningsCACHE[word]
        getAllMeaningsCACHE[word] = wn.synsets(word, 'a') + wn.synsets(word, 's') + wn.synsets(word, 'r') + wn.synsets(word, 'n') + wn.synsets(word, 'v')
        return getAllMeaningsCACHE[word]

    def getSimilarityScore(word1, word2):
        key = word1+"-"+word2
        if(hasattr(getSimilarityScoreCACHE,key)):
            return getSimilarityScoreCACHE[key]

        w1AllSenses = getAllMeanings(word1)
        w2AllSenses = getAllMeanings(word2)

        highestSimilarity = -1
        for w1Sense in w1AllSenses:
            for w2Sense in w2AllSenses:
                wup = w1Sense.wup_similarity(w2Sense)
                currentSimilarity = wup
                if(currentSimilarity != None):
                    highestSimilarity = max(highestSimilarity, currentSimilarity)

        getSimilarityScoreCACHE[key] = highestSimilarity
        return getSimilarityScoreCACHE[key]

    print("python script importing successful")
except:
    print("[ERROR] can not import script:", sys.exc_info())

