import nltk
import json
import requests
from pprint import pprint
from WikipediaAPI import *
from zomatoAPI import *
import time
import sys
import os
from nltk.parse.stanford import StanfordParser
from nltk.parse.stanford import StanfordDependencyParser


def ifnv(string):
    if string in ['NN' , 'NNS' , 'NNP' , 'NNPS']:
        return 1
    elif string in ['VB' , 'VBD' , 'VBG' , 'VBN' , 'VBP' , 'VBZ']:
        return 2
    else:
        return 0

def getNodes(parent, abc):
    named_entity = []
    ROOT = 'ROOT'
    for node in parent:
        if type(node) is nltk.Tree:
            '''
            if node.label() == ROOT:
                print("======== Sentence =========")
                print("Sentence:", " ".join(node.leaves()))
            else:
                print("Label:", node.label())
                print("Leaves:", node.leaves())
            '''
            if node.label() == 'NP' :
                named_entity.append(node.leaves())
            if ifnv(node.label()) == 1:
                abc['Noun'].append(node.leaves()[0])
            elif ifnv(node.label()) == 2:
                abc['Verb'].append(node.leaves()[0])
            getNodes(node, abc)
        #else:
            #print("Word:", node)

def stanfordparser(cwd, sent, parser):
    abc = {'Noun':[],
              'Verb':[],
              'Other':[]}
    tree = list(parser.raw_parse(sent))
    #print(tree)
    getNodes(tree, abc)
    return abc
    







def psleep(n, t = 0.1):
    for i in range(n):
        sys.stdout.write(".")
        time.sleep(t)

def filterword(tagged):
    output = {'Noun':[],
              'Verb':[],
              'Other':[]}
    print("\n\nFiltering the words...\n")
    for i in tagged:
        for j in i:
            if ifnv(j[1]) == 1:
                output['Noun'].append(j[0])
            elif ifnv(j[1]) == 2:
                output['Verb'].append(j[0])
            else:
                output['Other'].append(j[0])
    print(json.dumps(output, indent=4))
    return output



javahome = os.getenv("JAVA_HOME")           # Getting java home from system  (Java installation required)
os.environ["JAVAHOME"] = javahome + '/bin/java'  
psleep(3)
print("JAVA_HOME found...")

from nltk.tag.stanford import StanfordPOSTagger

cwd = os.getcwd()
cwd = os.path.dirname(cwd)
cwd = os.path.dirname(cwd)
os.environ["STANFORD_MODELS"] = cwd + '/stanford-postagger-full/models'  # For English Bidirectional model file
psleep(3)
print("   Got models  ...")

_path_to_jar = cwd + '/stanford-postagger-full/stanford-postagger.jar'   # For Stanford Tagger
psleep(3)
print("Got Tagger file...")

st = StanfordPOSTagger('english-bidirectional-distsim.tagger', path_to_jar=_path_to_jar)  # Stanford Tagger
psleep(3)
print("  Tagger ready ...")

psleep(21, 0.01)
print("\n\n")



os.environ['STANFORD_PARSER'] = cwd + '/stanford-parser'
os.environ['CLASSPATH'] = cwd + '/stanford-parser/stanford-parser-3.7.0-models.jar'
parser=StanfordParser(model_path="edu/stanford/nlp/models/lexparser/englishPCFG.ser.gz")





cont = True
while(cont):
    sent = input(ques["default"][0])
    #output2 = stanfordparser(cwd, sent, parser)
    print("\n\nTokenizing the words...\n")
    words = nltk.word_tokenize(sent)
    print(words)

    print("\n\nTagging the words...\n")
    tagged = []
    tagged.append(st.tag(words))
    print(tagged)
    
    #output = filterword(tagged)
    '''
    for w in words:
        if w not in output2['Noun']:
            if w not in output2['Verb']:
                output2['Other'].append(w) 
    print(json.dumps(output2, indent=4))
    '''


    dep_parser = StanfordDependencyParser(model_path="edu/stanford/nlp/models/lexparser/englishPCFG.ser.gz")
    dependencyGraph = [list(parse.triples()) for parse in dep_parser.raw_parse(sent)][0]
    
    print(json.dumps(dependencyGraph, indent=4))


    dictnoun = {}
    print("\n\nFinding attributes of some nouns...\n")
    ##dictnoun = findattr1(dictnoun, output2['Noun'])
    print(json.dumps(dictnoun, indent = 4))

    cont = False
# THE END
