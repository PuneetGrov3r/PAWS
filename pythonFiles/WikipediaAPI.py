import json
import requests
from pprint import pprint

#import wikipedia
#wikipedia.set_lang("en")




basewikiurl = 'http://en.wikipedia.org/w/api.php'
my_atts = {}
my_atts['action'] = 'query'
my_atts['prop'] = 'categories'
my_atts['format'] = 'json'
my_atts['clshow'] = '!hidden'

def findattr1(dictnoun, Noun):
	#print(Noun)
	for noun in Noun:
		my_atts['titles'] = noun
		#dictnoun[noun] = 
		temp  = requests.get(basewikiurl, params = my_atts).json()["query"]["pages"]
		#pageid = temp["pageid"]
		temp2 = temp[list(temp)[0]]["categories"]
		#print(json.dumps(temp2, indent = 8))
		for n in temp2:        # States Cities Countries x-Capital-x
			if "Cities" in n["title"]:
				#print(n["title"])
				dictnoun[noun] = "City"
				break
			if "Capitals" in n["title"]:
				#print(n["title"])
				dictnoun[noun] = "City"
				break
			elif "States" in n["title"]:
				dictnoun[noun] = "State"
				break
			elif "Countries" in n["title"]:
				dictnoun[noun] = "Country"
				break
			elif "Territories" in n["title"]:
				dictnoun[noun] = "Territory"
				break      
			#print(json.dumps(dictnoun, indent = 8))
	return dictnoun