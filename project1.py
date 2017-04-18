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
            ({"eat":0, "date":0}, {"date":0, "breakfast":0, "lunch":0, "dinner":0, "supper":0, "food":0}, { "hungry" : 0 },{"total":9, "rep":1}),         # Zomato
            ({""},{""},{""}),
            (),(),(),(),()
]


zomatoDefaultURL = "https://developers.zomato.com/api/v2.1/"
zomatoHeader = {"User-agent": "curl/7.43.0", "Accept": "application/json", "user_key": "8c566e4798eca2737581bd3c21390711"}
zomatoAPI = {"locations":"/locations?", "location_details":"/location_details?", "cuisines":"/cuisines?", "restraunt":"/restraunt?", "reviews":"/reviews?"}
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
    filtered = [ lemmatizer.lemmatize(w) for w in words if (w not in stop_words and w not in ss) ]
    tagged.append(nltk.pos_tag(filtered))
    output = {'Noun':[],
              'Verb':[]}
    for i in tagged:
        for j in i:
            if j[1] in ['NN' , 'NNS' , 'NNP' , 'NNPS']:
                output['Noun'].append(j[0])
            elif j[1] in ['VB' , 'VBD' , 'VBG' , 'VBN' , 'VBP' , 'VBZ']:
                output['Verb'].append(j[0])
    print(json.dumps(output, indent=4))
    url = fetch_location(url)
    response = requests.get(url, headers=zomatoHeader)
    pprint(response.json())

    
    cont = False
# THE END
