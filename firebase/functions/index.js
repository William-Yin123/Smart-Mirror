// Run the following cmd-line cmd
// set FIREBASE_CONFIG=269c761da4cc4d4694db98f30d1d2dd1

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function nameHandler(agent) {
    agent.add(`My name is DialogFlow!`);
  }

  function languageHandler(agent) {
  	const language = agent.parameters.language;
    const programmingLanguage = agent.parameters.ProgrammingLanguage;
    if (language) {
      agent.add(`From fulfillment: Wow! I didn't know you knew ${language}`);
      agent.setContext({
        name: 'languages-followup',
        lifespan: 2,
        parameters: {language: language}
      });
    } else if (programmingLanguage) {
      agent.add(`From fulfillment: ${programmingLanguage} is cool`);
      agent.setContext({
        name: 'languages-followup',
        lifespan: 2,
        parameters: {ProgrammingLanguage: programmingLanguage}
      });
    } else {
      agent.add(`From fulfillment: What language do you know?`);
    }
  }

  function languagesCustomHandler(agent) {
    const context = agent.getContext('languages-followup');
    const allContexts = agent.contexts;
    const language = context.parameters.language || context.parameters.ProgrammingLanguage;
    const duration = agent.parameters.duration;
    agent.add(`I can't believe you've known ${language} for ${duration}!`);
  }

  function addingHandler(agent) {
    const num = agent.parameters.number;
    const num1 = agent.parameters.number1;
    agent.add(`The sum of ${num} and ${num1} is ${num + num1}`);
  }
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Name', nameHandler);
  intentMap.set('Languages', languageHandler);
  intentMap.set('Languages - custom', languagesCustomHandler);
  intentMap.set('Adding', addingHandler);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
