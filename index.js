'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express().use(bodyParser.json()); // creates express http server
const PAGE_ACCESS_TOKEN = "EAALwWARh1bQBAGPfB0Lhz8YZCd9xGFmfxufxikXkPgdCKXqv9XgAOQtfu89fqKEbyDfkiNu7Hsb6VWZCL6Vgsqo8yI6ZAIKd0LHyaTrP5jZAiy7EfCgxb71KrPte5ayLOSPRZCGLl3otxnl82BVcN3MdzuedjWvpQ9LfZARIgMFWFpbkPZACNvq";
// Sets server port and logs message on success
app.listen(process.env.PORT || 52534, () => console.log('webhook is listening'));

app.get('/', (req,res) => {
    console.log("Path normal, pas necessaire")
    res.send("hello !");
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
    let body = req.body;
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        let sender_psid = webhook_event.sender.id;
        
        console.log('Sender PSID: ' + sender_psid);
        console.log(webhook_event);
        if (webhook_event.message) {
            handleMessage(sender_psid, webhook_event.message);        
          } else if (webhook_event.postback) {
            
            handlePostback(sender_psid, webhook_event.postback);
          }
    
    });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      console.log(req);
      res.sendStatus(404);
    }
  
  });
  // Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "Samuel_Maltais_Is_The_Best"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });
  
  //cette fonction me permettre de lire les messages obtenu
  function handleMessage(sender_psid, recieved_message){
    let response;
    console.log(recieved_message);
    if(recieved_message.text){
      response = {
        "text":"Bonjour ! Je suis l'assistant virtuel de Grame !"
      }
      sendMessage(response, sender_psid);
      response = {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Souhaitez-vous vous impliquer dans votre communauté en tant que bénévole ou en participant à des opérations de nétoyages ?",
              "subtitle": "Appuie un bouton pour répondre !",
              "buttons": [
                {
                  "type": "postback",
                  "title": "Oui !",
                  "payload": "Path1",
                },
                {
                  "type": "postback",
                  "title": "non :(",
                  "payload": "Path2",
                }
              ],
            }]
          }
        }
      }
      sendMessage(response, sender_psid);
    }
    
    
  }
  
  //cette fonction est celle qui envoie les messages
  function sendMessage(message, recipient){
    let request_body = {
        "recipient": {
          "id": recipient
        },
        "message": message
      }
      // Send the HTTP request to the Messenger Platform
      request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": request_body
      }, (err, res, body) => {
        if (!err) {
          console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
      }); 
    }
    function handlePostback(sender_psid, received_postback) {
        //switch case qui contient les reponses pour chaque payload
        let response;
        switch(received_postback.payload){
          case "Path1":
          response = {
            "text":"Le Grame cherche constamment des bénévoles pour \nses activités et missions à travers le Québec. "
          }
          sendMessage(response, sender_psid);  
          response = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements": [{
                  "title": "Participeriez-vous à notre cause ?",
                    "buttons": [
                      {
                        "type": "postback",
                        "title": "Devenir benevole!",
                        "payload": "Path3",
                      },
                      {
                        "type": "postback",
                        "title": "Participer à une collecte!",
                        "payload": "Path4",
                      }
                    ],
                  }]
                }
              }
            }
            break;
          case "Path2":
          response = {
            "text": "Pas de problème, n'hésite pas à changer d'avis,\n je serai la, après tout, je suis un robot !"
          }  
          sendMessage(response, sender_psid);
          response = {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements": [{
                    "title": ":D",
                    "buttons": [
                      {
                        "type": "postback",
                        "title": "Changer d'avis",
                        "payload": "Path1",
                      }
                    ],
                  }]
                }
              }
            }
            break;
          case "Path3":
            response = {
              "text":"Rejoint-nous sur notre site ! https://grame.org/carriere-et-benevolat/"
            }
            break;
          case "Path4":
            response = {
              "text":"Rejoignez l'événement sur notre page ! Vous serez aussi notifié lorsqu'un nouvel évenement aura lieu"
            }
          }
        // Envoie le message
        sendMessage(response, sender_psid);
      }
