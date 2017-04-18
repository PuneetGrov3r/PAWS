from nltk.parse.stanford import StanfordNeuralDependencyParser
from os.path import expanduser
import os
import json

os.environ["JAVAHOME"] = 'C:/Program Files/Java/jdk1.8.0_121/bin/java.exe'
os.environ['CLASSPATH'] = 'C:/Users/PuneetGrover/AppData/Roaming/nltk_data/stanford-corenlp/stanford-corenlp-3.7.0.jar'
_path_to_models_jar = 'C:/Users/PuneetGrover/Downloads/stanfordNLP/stanford-english-corenlp-2016-10-31-models.jar'


dep_parser = StanfordNeuralDependencyParser(path_to_models_jar=_path_to_models_jar, java_options='-mx4g')


#print([parse.tree() for parse in dep_parser.raw_parse("The quick brown fox jumps over the lazy dog.")])
print(json.dumps([list(parse.triples()) for parse in dep_parser.raw_parse("Bell, based in Los Angeles, makes and distributes electronic, computer and building products.")], indent=4))

