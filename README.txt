Auteur : Samuel Maltais
Guide pour utilisation et modification des choix

La fonction handlePostback est celle qui contient tout les chemins après la décision originale
Les messages sont envoyés au Facebook API en format Json, je vais mentionner comment modifier les différents 'paths'
Le code d'identification et connection n'est que partiellement codé par moi, essentiellement il permet
a l'application de facebook qui est liée à la page de s'abonner a mon Appli, qui donnera le droit d'envoyer des messages
à partir de la page et de les reçevoir avec les methodes classiques HTTP get et post.

le les Json requests sont formulé comme suivant :

let request_body = {
        "recipient": {
          "id": // le id est obtenu après le premier message
        },
        "message": message
      }
      // Send the HTTP request to the Messenger Platform
      request({
        "uri": "https://graph.facebook.com/v2.6/me/messages", // ce lien est le Facebook API qui acceptera les POST requests.
        "qs": { "access_token": PAGE_ACCESS_TOKEN }, // le PAGE_ACCESS_TOKEN est une variable qui est obtenue en étant admin de la page
        "method": "POST",
        "json": request_body // le request_body sera la majorité du temps quelques choix qui créerons des payloads

Pour chaque payload différent, j'ai créé un énorme switch case qui permettrade gerer tous les choix
de conversation avec le robot pour chaque étape. Chaque choix menera à un 'path', qui sont numérotés.

