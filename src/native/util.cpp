#include "includes/main.h"
#include <string>
#include <limits.h>
#include <unistd.h>

json getPosts() {
    std::ifstream i(string("sample_data/") + "serverOut.json");
    json j;
    i >> j;

    return j["data"]["getPosts"];
}

json fromString(string str) {
    return json::parse(str);
}

string toString(json j) {
    return j.dump();
}

unordered_set<string> splitToUniqueKeywords(string str) {
    unordered_set<string> ret;

    regex r("\b*#?[a-zA-Z]+\b*");

    stringstream ss(str);
    string temp;
    while (ss >> temp) {
        transform(temp.begin(), temp.end(), temp.begin(), ::tolower);
        smatch m;
        regex_search(temp, m, r);

        for (auto x : m) ret.insert(x);
    }

    return ret;
}

void printPrettyJson(json j, string filename) {
    std::ofstream o(string("script_outputs/") + filename);
    o << std::setw(4) << j << std::endl;
}


unordered_set<string> getStopWords(){
    unordered_set<string> res;

    std::ifstream i(string("dependencies/") + "common-english-words.txt");

    string output;

    while (!i.eof())
        i >> output;

    replace(output.begin(), output.end(), ',', ' '); // replace ',' by ' '

    return splitToUniqueKeywords(output);
}

PyObject * initializePythonInterpreter() {
    // TODO: Discuss with Brook how to initialize/finalize the python interepreter when node starts/exits

    wstring programName = L"my python interface";

    Py_SetProgramName((wchar_t *)programName.c_str()); /* optional but recommended */

    // cout << "starting" << endl;

    Py_Initialize();

    // cout << "initialized" << endl;

    PyObject *sys = PyImport_ImportModule("sys");
    PyObject *sys_path = PyObject_GetAttrString(sys, "path");
    PyObject *folder_path = PyUnicode_FromString(".");
    PyList_Append(sys_path, folder_path);

    PyObject *pModule = PyImport_Import(PyUnicode_FromString("/home/wade/JSProjects/TodayOnEarth_Backend/src/native/extra/similarity_score_generator"));
    if (pModule == NULL) {
          char result[ PATH_MAX ];
  ssize_t count = readlink( "/proc/self/exe", result, PATH_MAX );
  cout<< std::string( result, (count > 0) ? count : 0 ) << endl;

        cout << "[ERROR]: Module was NULL" << endl;
        return NULL;
    }

    PyObject *pFunc = PyObject_GetAttrString(pModule, "getSimilarityScore");
    if (!pFunc) {
        cout << "[ERROR]: Function was NULL" << endl;
        return NULL;
    }

    return pFunc;

}

void finalizePythonInterpreter() {
    Py_Finalize();
}
