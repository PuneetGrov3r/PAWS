![Logo](static/logo1.png "Personal Assitant for Web Services")
> Personal Assistant for exploiting web services

![PAWS Overview](PAWS2.gif)

### How to set up:

1. Download Stanford Parser from https://nlp.stanford.edu/software/stanford-parser-full-2016-10-31.zip, unzip it in one folder above the main directory and rename it to 'stanford-parser',
2. Install nltk package for 'python 3' by `pip install nltk` or `pip3 install nltk` and download all the data files by command `nltk.download()` after importing nltk in python terminal,
3. Go to the main directory and run command `npm install`,
4. Install nodemon too by command `npm install nodemon`,
5. Run Neo4j database if not already running,
6. Set up keys for APIs in the 'APIs' directory, 
7. Run the command  - \#`nodemon server.js` from main directory,
8. Download ngrok,
9. In a different terminal run the instruction - \#`./ngrok http 3000`,
10. Use Postman to send POST request to the url shown in ngrok terminal,
11. /startSession and /requestMessage  are working.


<object data="001 Report.pdf" type="application/pdf" width="700px" height="700px">
    <embed src="001 Report.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="001 Report.pdf">Download PDF</a>.</p>
    </embed>
</object>
