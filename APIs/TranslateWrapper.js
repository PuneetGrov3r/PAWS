const request = require('request');


const translate = require('@google-cloud/translate')({
  key: 'xxx'
});;



translate.translate(text=['mujhe bahar khana khana hai.'], 'en')
  .then((results) => {
  	console.log(results[0]);
  	console.log(results[1]['data']['translations'][0]['detectedSourceLanguage']);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });

