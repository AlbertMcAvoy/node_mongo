# Présentation de l'API

Cette API offre un CRUD (Create, Read, Update, Delete) sur des restaurants.
Elle offre aussi un CRUD sur des utilisateurs, permettant ainsi d'avoir accès à la gestion des restaurants.

Les routes sont donc protégées par JWT (sauf la création d'utilisateurs dans le cadre de ce tp pour tester).

L'API respecte aussi les 5 principes RESTFUL :
- 1 : l’URI comme identifiant des ressources. Ce principe permet de régir l'identification des ressources.
Une bonne construction des URI permet de mieux les trier

![Exemple de route avec une URI RESTFUL](/docs/uri.png)

- 2 : les verbes HTTP comme identifiant des opérations. Ici, on parle d'associer la requête HTTP à son action CRUD,
comme le montre la capture précédente, `Create` correspond à `POST`, `Read` équivaut à `GET`, etc...
- 3 : les réponses HTTP comme représentation des ressources. La réponse renvoyée par l'API n'est pas une ressource,
mais une représentation de cette ressource dans divers formats : **XML**, **HTML**, **JSON**, etc.
Ainsi le client choisi le format de retour qu'il souhaite.
- 4 : les liens comme relation entre ressources. Les liens d’une ressource vers une autre ont tous une chose en commun :
ils indiquent la présence d’une relation.
- 5 : un paramètre comme jeton d’authentification. Chaque requête est envoyée avec un jeton d'authentification

![Exemple d'authentification RESTFUL](/docs/authentication_1.png)
![Exemple d'authentification RESTFUL](/docs/authentication_2.png)

Ici la vérification se fait via un middleware.

# Techno

L'API est développée avec Express `v4.18.2` et suit une architecture MVC avec pour ORM mongoose `v7.3.0` (et mongodb `v5.6.0`).

L'arborescence s'articule autour du dossier `ressources` et contient les couples controller / service des 
ressources mises à disposition (exception pour `security` qui n'est pas une ressource mais qui se base sur les utilisateurs).

# Lancement

L'installation se fait simplement grâce à la commande `npm i`.

L'application se compile avec la commande `npm run build`, puis se lance avec `npm run start`.

# Éléments de cours

[Prise de notes](docs/notes/Prise%20de%20note.md)

[Exercices 1 & 2](docs/notes/Exercices.md)