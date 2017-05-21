from nltk.parse.stanford import StanfordDependencyParser
from nltk.corpus import wordnet
import nltk
import json
import requests
import time
import sys
import os
from sys import argv


class Parser():

    def __init__(self):
        cwd = os.getcwd()
        cwd = os.path.dirname(cwd)
        self.cwd = cwd


    def __ifNV(self, string):
        if string in ['NN' , 'NNS' , 'NNP' , 'NNPS']:
            return 1
        elif string in ['VB' , 'VBD' , 'VBG' , 'VBN' , 'VBP' , 'VBZ']:
            return 2
        else:
            return 0

    def __check(self, output, j):
        if self.__ifNV(j[1]) == 1:
            if j[0] not in output['Noun']:
                output['Noun'].append(j[0])
        elif self.__ifNV(j[1]) == 2:
            if j[0] not in output['Verb']:
                output['Verb'].append(j[0])
        else:
            if j[0] not in output['Other']:
                output['Other'].append(j[0])
        return output

    def stanParse(self, sent):
        os.environ['STANFORD_PARSER'] = self.cwd + '/stanford-parser'
        os.environ['CLASSPATH'] = self.cwd + '/stanford-parser/stanford-parser-3.7.0-models.jar'
        dep_parser = StanfordDependencyParser(model_path="edu/stanford/nlp/models/lexparser/englishPCFG.ser.gz")
        return [list(parse.triples()) for parse in dep_parser.raw_parse(sent)][0]

    def extractNV(self, sent):
        depGraph= self.stanParse(sent)
        output = {'Noun':[],
                  'Verb':[],
                  'Other':[]}
        for data in depGraph:
            self.__check(output, data[0])
            self.__check(output, data[2])
        return json.dumps(output)




class Synonym():

    def getSynonyms(self, word):
        synonyms = []
        for syn in wordnet.synsets(word):
            for l in syn.lemmas():
                synonyms.append(l.name())
        return synonyms

class Tokenizer():

    def tokenize(self, sent):
        return nltk.word_tokenize(sent)

if __name__ == '__main__':
    
    name, type, input = argv
    if type == 'p':
        parser = Parser()
        print(parser.stanParse(input))
    elif type == 's':
        synonym = Synonym()
        print(synonym.getSynonyms(input))
    elif type == 't':
        tokenizer = Tokenizer()
        print(tokenizer.tokenize(input))
    elif type == 'n':
        nv = Parser()
        print(nv.extractNV(input))