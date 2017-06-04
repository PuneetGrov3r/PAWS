How to set up:

1. Download Stanford Parser from https://nlp.stanford.edu/software/stanford-parser-full-2016-10-31.zip, unzip it in one folder above the repo and rename it to 'stanford-parser',
2. Go to the main directory and run command `npm install`,
3. Install nodemon too by command `npm install nodemon`,
4. Run Neo4j database if not already running,
5. Set up keys for APIs in the 'APIs' directory, 
6. Run the command  - `\#nodemon server.js` from main directory,
7. Download ngrok,
8. In a different terminal run the instruction - `\#./ngrok http 3000`,
9. Use Postman to send POST request to the url shown in ngrok terminal,
10. /startSession and /requestMessage  are working.
