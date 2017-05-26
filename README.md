CoreNLP : 
http://nlp.stanford.edu/software/stanford-corenlp-full-2016-10-31.zip
Model : 
http://nlp.stanford.edu/software/stanford-english-kbp-corenlp-2016-10-31-models.jar 
or 
http://nlp.stanford.edu/software/stanford-english-corenlp-2016-10-31-models.jar 

Set the paths for the corresponding files

Put the stanford files outside the git directory


For starting the server

1. Install nodemon if not installed 
2. Run the command  - \#nodemon server.js
3. Download ngrok
4. In a different terminal run the instruction - \#./ngrok http 3000
5. Use postman to send POST request to the url shown in ngrok terminal
6. /startSession and /requestMessage  are working
