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

import pyowm
owm = pyowm.OWM('219cda475ab3a9c0a17abe166b25a239') 

import wikipedia
wikipedia.set_lang("en")



########################## Stanford ################################################
from os.path import expanduser
import os
from nltk.tag.stanford import StanfordPOSTagger
home = expanduser("~")
os.environ["STANFORD_MODELS"] = home + '/AppData/Roaming/nltk_data/stanford-postagger-full/models'
#os.environ["STANFORD_CLASSIFIERS"] = home + '/AppData/Roaming/nltk_data/stanford-ner/classifiers'
os.environ["JAVAHOME"] = 'C:/Program Files/Java/jdk1.8.0_131/bin/java.exe'
#_path_to_model = home + '/stanford-postagger-full/models/english-bidirectional-distsim.tagger'
_path_to_jar = home + '/AppData/Roaming/nltk_data/stanford-postagger-full/stanford-postagger.jar'
_path_to_ner_jar = home + '/AppData/Roaming/nltk_data/stanford-ner/stanford-ner.jar'
st = StanfordPOSTagger('english-bidirectional-distsim.tagger', path_to_jar=_path_to_jar)


####################################################################################


lemmatizer = WordNetLemmatizer()
ss= [",", "."]
ques = {"default":[
					"How may I help you?\n",
					"What's going on ",
					"You should try something new!\n",
					"Get a life, for christ's sake."
                ],
        "Where":[
        			(" do you want to go?", " to?", " would you like to go?", " would you like to sit?"), # Travel based
        			(" do you want to eat?", "Would you like something fancy or easy on pocket?", "?"), # For restraunt     {1st position does not need where}
        			(" do you want "),
        ],
        "When":[
        			(" do you want to go?", " do you want to leave?", " would you like to schedule your ", "At what time?","?"), #Travel based    {2nd "departure", "return"}
        			(" do you want to eat?", " would you like it?", "?"), #Restraunt based
        			("","")
        ],
        "What":[
        			(" would you like?"),       # Default
        			(" ")
        ],
        "How":[
        			(" do you want to go?"),       # Default
        			(" would you like to go?", "So, through air or by road?")     # Travel
        ],
        "Which":[
        			(" one would you like?"),   #Default
        			(" seat would you like?", ) #Travel
        ]
}

services = ["Zomato", "IndianRail", "Wikipedia", "Goibibo", "DarkSky", "Uber", "Ebay"]
probArray = ['0','0','0','0','0','0','0']
words = [    #   verbs                                     nouns                                             others
            ({"eat":0, "date":0}, {"date":0, "breakfast":0, "lunch":0, "dinner":0, "supper":0, "food":0}, { "hungry" : 0 }, {"total":9, "rep":1}),         # Zomato
            ({"go":0, "book":0, "reserve":0}, {"train":0, "railway":0, "ticket":0, "seat":0, "sleeper":0, "beaSrth":0}, {"total":9, "rep":0}),         # IndianRail
            ({}, {"define":0, "meaning":0}, {"what":0, "who":0}, {"total":4,"rep":0}),         # Wikipedia
            ({"go":0, "book":0, "reserve":0, "fly":0}, {"train":0, "ticket":0, "seat":0, "bus":0, "sleeper":0, "air":0, "airplane":0, "flight":0}, {"total":12,"rep":0}),         # Goibibo
            ({"raining":0}, {"weather":0}, {"sunny":0, "cloudy":0, "windy":0, "stormy":0}, {"total":6, "rep":0}),         # darksky
            ({"go":0, "book":0}, {"cab":0, "taxi":0, "ride":0, "uber":0}, {}, {"total":6, "rep":0}),         # uber
            ({"buy":0, "shop":0}, {"online":0, "ebay":0}, {}, {"total":4, "rep":0})          # ebay
]


zomatoDefaultURL = "https://developers.zomato.com/api/v2.1/"
zomatoHeader = {"User-agent": "curl/7.43.0", "Accept": "application/json", "user_key": "8c566e4798eca2737581bd3c21390711"}
zomatoAPI = {"locations":"/locations?", "location_details":"/location_details?", "cuisines":"/cuisines?", "restaurant":"/restaurant?", "reviews":"/reviews?"}
zomatoBack = {"query":"query=", "entity_id":"entity_id=", "entity_type":"entity_type=", "rest_id":"rest_id="}
zomatoFore = {'city':0, 'time':0, 'rest':0, 'number':1}
zomatoFormulate = {"query":"", "entity_id":"", "entity_type":"", "rest":""}


def fetch_location(url):
    zomatoFormulate["query"] = "delhi"
    location = url + zomatoFormulate["query"]
    return location

def fetch_cuisine(obj):
    cuisine  = 0
    return cuisine

def fetch_rest(obj):
    rest = 0
    return rest

def fetch_number(obj):
    number = 0
    return number


cont = True
url = zomatoDefaultURL + zomatoAPI["locations"] + zomatoBack["query"]


while(cont):
    sent = input(ques["default"][0])
    tagged = []
    words = nltk.word_tokenize(sent)
    filtered = [ w for w in words if w]
    tagged.append(st.tag(filtered))
    print(tagged)
    output = {'Noun':[],
              'Verb':[],
              'Other':[]}
    for i in tagged:
        for j in i:
            if j[1] in ['NN' , 'NNS' , 'NNP' , 'NNPS']:
                output['Noun'].append(j[0])
            elif j[1] in ['VB' , 'VBD' , 'VBG' , 'VBN' , 'VBP' , 'VBZ']:
                output['Verb'].append(j[0])
            else:
                output['Other'].append(j[0])
    print(json.dumps(output, indent=4))
    #url = fetch_location(url)
    #response = requests.get(url, headers=zomatoHeader)
    #pprint(response.json())




    for noun in output['Noun']:
        print(wikipedia.summary(noun,  sentences=1).encode('ascii', 'xmlcharrefreplace'))
    
    cont = False
# THE END
