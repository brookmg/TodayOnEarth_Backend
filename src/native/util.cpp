#include "includes/main.h"
#include <string>
#include <limits.h>
#include <unistd.h>
#include <dlfcn.h>

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

string getEnvVar( string key ,string defaultValue) {
    char * val = getenv( key.c_str() );
    return val == NULL ? string(defaultValue) : string(val);
}


PyObject * initializePythonInterpreter() {
    // TODO: Discuss with Brook how to initialize/finalize the python interepreter when node starts/exits

    dlopen(getEnvVar("LIBPYTHON_PATH",".").c_str(), RTLD_LAZY | RTLD_GLOBAL);

    wstring programName = L"my python interface";
    Py_SetProgramName((wchar_t *)programName.c_str()); /* optional but recommended */

    Py_Initialize();

    PyObject *sys = PyImport_ImportModule("sys");

    PyObject *sys_path = PyObject_GetAttrString(sys, "path");

    PyObject *folder_path = PyUnicode_FromString(getEnvVar("SIMILARITY_SCORE_GENERATOR_PY_FOLDER",".").c_str());
    PyList_Insert(sys_path,0, folder_path);

    int listSize = PyList_Size(sys_path);
    cout<<"Paths to scan for modules:"<<endl;
    for(int i=0;i<listSize;i++){
        PyObject *li = PyList_GetItem(sys_path,i);
        cout<<PyUnicode_AsUTF8(li)<<endl;
    }
    cout<<endl;

    PyObject *pModule = PyImport_Import(PyUnicode_FromString("similarity_score_generator"));
    if (pModule == NULL) {
        cout << "[ERROR]: Module was NULL" << endl;
        PyErr_Print();
        return NULL;
    }

    PyObject *pFunc = PyObject_GetAttrString(pModule, "getSimilarityScore");
    if (!pFunc) {
        cout << "[ERROR]: Function was NULL" << endl;
        PyErr_Print();
        return NULL;
    }
    return pFunc;

}

void finalizePythonInterpreter() {
    Py_Finalize();
}
