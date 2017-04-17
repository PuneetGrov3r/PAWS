import nltk
from nltk.corpus import state_union
from nltk.tokenize import PunktSentenceTokenizer
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
stop_words = set(stopwords.words("english"))
from nltk.stem.snowball import SnowballStemmer
stemmer = SnowballStemmer("english")
import json
import requests
from pprint import pprint


########################## Stanford ################################################
from os.path import expanduser
import os
from nltk.tag.stanford import StanfordPOSTagger
home = expanduser("~")
os.environ["STANFORD_MODELS"] = home + '/AppData/Roaming/nltk_data/stanford-postagger-full/models'
#os.environ["STANFORD_CLASSIFIERS"] = home + '/AppData/Roaming/nltk_data/stanford-ner/classifiers'
os.environ["JAVAHOME"] = 'C:/Program Files/Java/jdk1.8.0_121/bin/java.exe'
#_path_to_model = home + '/stanford-postagger-full/models/english-bidirectional-distsim.tagger'
_path_to_jar = home + '/AppData/Roaming/nltk_data/stanford-postagger-full/stanford-postagger.jar'
_path_to_ner_jar = home + '/AppData/Roaming/nltk_data/stanford-ner/stanford-ner.jar'
st = StanfordPOSTagger('english-bidirectional-distsim.tagger', path_to_jar=_path_to_jar)


####################################################################################
lemmatizer = WordNetLemmatizer()
ss= [",", "."]
#sent = input()
sent = "Bell, based in Los Angeles, makes and distributes electronic, computer and building products."

tagged = []
words = nltk.word_tokenize(sent)
#filtered = [ lemmatizer.lemmatize(w) for w in words if (w not in stop_words and w not in ss) ]
#filtered = [ lemmatizer.lemmatize(w) for w in words]
filtered = [ w for w in words if w not in ss]
tagged.append(st.tag(filtered))
#tagged.append(nltk.pos_tag(filtered))
#print(tagged)
output = {'Noun':[],
          'Verb':[]}

for i in tagged:
    for j in i:
        if j[1] in ['NN' , 'NNS' , 'NNP' , 'NNPS']:
            output['Noun'].append(lemmatizer.lemmatize(j[0]))
        elif j[1] in ['VB' , 'VBD' , 'VBG' , 'VBN' , 'VBP' , 'VBZ']:
            output['Verb'].append(lemmatizer.lemmatize(j[0]))

#print(json.dumps(output, indent=4))



######################################### NER ##################################################
from nltk.tag import StanfordNERTagger
os.environ["STANFORD_MODELS"] = home + '/AppData/Roaming/nltk_data/stanford-ner/classifiers'
ner = StanfordNERTagger('english.all.3class.distsim.crf.ser.gz', path_to_jar=_path_to_ner_jar)
tagner = []
#print(ner.tag(filtered))
################################################################################################





######################################## Parser #################################################
from nltk.parse.stanford import StanfordParser
os.environ['STANFORD_PARSER'] = home + '/AppData/Roaming/nltk_data/stanford-parser'
os.environ['CLASSPATH'] = home + '/AppData/Roaming/nltk_data/stanford-parser/stanford-parser-3.7.0-models.jar'
parser=StanfordParser(model_path="edu/stanford/nlp/models/lexparser/englishPCFG.ser.gz")


named_entity = []
ROOT = 'ROOT'
tree = list(parser.raw_parse("Bell, based in Los Angeles, makes and distributes electronic, computer and building products."))
#print(tree)
def getNodes(parent):
    for node in parent:
        if type(node) is nltk.Tree:
            if node.label() == ROOT:
                print("======== Sentence =========")
                print("Sentence:", " ".join(node.leaves()))
            else:
                print("Label:", node.label())
                print("Leaves:", node.leaves())
            if(node.label() == 'NP'):
                named_entity.append(node.leaves())

            getNodes(node)
        else:
            print("Word:", node)

#getNodes(tree)
#print(named_entity)


        

#print(named_entity)
#################################################################################################
#print("1")
#
#from xmlrpc import server
#from xmlrpc.server import SimpleXMLRPCServer
##import jsonrpclib, json
#from nltk.parse import DependencyGraph
#
#print("2")
#server = SimpleXMLRPCServer(("localhost", 8000))
#parses = json.loads(
#    server.parse(
#        'I saw a man with a telescope. '
#        'Ballmer has been vocal in the past warning that Linux is a threat to Microsoft.'
#        ))['sentences']
#print("3")
#
#def transform(sentence):
#    for rel, _, head, word, n in sentence['dependencies']:
#        n = int(n)
#        word_info = sentence['words'][n - 1][1]
#        tag = word_info['PartOfSpeech']
#        lemma = word_info['Lemma']
#        if rel == 'root':
#            # NLTK expects that the root relation is labelled as ROOT!
#            rel = 'ROOT'
#        # Hack: Return values we don't know as '_'.
#        #       Also, consider tag and ctag to be equal.
#        # n is used to sort words as they appear in the sentence.
#        yield n, '_', word, lemma, tag, tag, '_', head, rel, '_', '_'
#
#dgs = [
#    DependencyGraph(
#        ' '.join(items)  # NLTK expects an iterable of strings...
#        for n, *items in sorted(transform(parse))
#    )
#    for parse in parses
#]
#print("4")
#
#pprint(list(dgs))



#####################################################################################
from nltk.parse.stanford import StanfordNeuralDependencyParser
os.environ['CLASSPATH'] = 'C:/Users/PuneetGrover/AppData/Roaming/nltk_data/stanford-corenlp/stanford-corenlp-3.7.0.jar'
_path_to_models_jar = 'C:/Users/PuneetGrover/Downloads/stanfordNLP/stanford-english-kbp-corenlp-2016-10-31-models.jar'
dep_parser = StanfordNeuralDependencyParser(path_to_models_jar=_path_to_models_jar, java_options='-mx4g')
print([parse.tree() for parse in dep_parser.raw_parse("The quick brown fox jumps over the lazy dog.")])
print([list(parse.triples()) for parse in dep_parser.raw_parse("The quick brown fox jumps over the lazy dog.")])
sum([[parse.tree() for parse in dep_graphs] for dep_graphs in dep_parser.raw_parse_sents((
    "The quick brown fox jumps over the lazy dog.",
    "The quick grey wolf jumps over the lazy fox."))], [])
sum([[parse.tree() for parse in dep_graphs] for dep_graphs in dep_parser.parse_sents((
    "I 'm a dog".split(),
    "This is my friends ' cat ( the tabby )".split(),))], [])
