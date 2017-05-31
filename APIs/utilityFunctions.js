
/*
	options = 
	{
		string:"", string to shorten
		charLimit:, Integer for how much to shorten
		prependString:, adding a string before
		appendString:,adding a string after
	}	
*/
exports.stringShortner = function(options,callback)
{
	var resultString = options["string"].slice(0,options["charLimit"]);
	if(options["prependString"])
		resultString = options["prependString"]+resultString;
	if(options["appendString"])
		resultString = resultString+options["appendString"];
	callback(null,resultString);

}	