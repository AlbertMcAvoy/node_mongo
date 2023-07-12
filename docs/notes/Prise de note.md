# Node

Projet open-source sur Github.

# Express
## Mettre en place un projet

Suite de commande pour initialiser un projet avec une archi basique :
```console
$ npm init

$ npm install express

$ npm install express-generator -g

$ express --view=twig myapp

$ cd myapp

$ npm install

$ npm start
```

Voir la [Doc d'Express](https://expressjs.com/fr/starter/installing.html) jusqu'à "Générateur Express" pour plus de précision.

Dans le fichier `app.js` on setup le serveur express en lui spécifiant ce qu'il va utiliser grâce à sa méthode `use()` :
```js
// view engine setup  
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'twig');

[...]

app.use('/', indexRouter);  
app.use('/animals', animalsRouter);
```

On initialisera aussi la connexion à la base de données :
```js
const mongoose = require("mongoose");

[...]
 
mongoose.connect('mongodb://localhost:27017/animals');
```


## Routes :

```javascript
const router = express.Router();

// respond with "hello world" when a GET request is made to the homepage
router.get('/', function(req, res) {
  res.send('hello world');
});
```

Ici `get` correspond à la méthode HTTP, on a aussi `post`, `put`, `delete`.
`req` représente la requête reçu par le serveur et `res` la réponse à cette requête que le serveur renvoie.


## Lancement du serveur

Pour lancer le serveur, on exécute la commande `node ./bin/www` (au travers de la commande `npm start` grâce au scripts dans le fichier package.json).
Dans le fichier `www`, on créer le serveur grâce à cette portion de code :
```js
/**  
 * Get port from environment and store in Express. */const port = normalizePort(process.env.PORT || '3000');  
app.set('port', port);  
  
/**  
 * Create HTTP server. */const server = http.createServer(app);  
  
/**  
 * Listen on provided port, on all network interfaces. */  
server.listen(port);  
server.on('error', onError);  
server.on('listening', onListening);
```

# Mongodb
## Docker

Pour utiliser le fichier docker-compose.yml: 
``` sh
docker-compose up -d
```

### La notation JSON 

MongoDB stocke une représentation binaire du format JSON dans un format spécialement créé par ses concepteurs : le BSON (pour binary JSON). Lorsque vous interagissez avec la base de données, MongoDB transforme le code JSON que vous lui fournissez en BSON, comme il transformera le BSON qu’il a stocké en JSON avant de vous le présenter. La taille maximale d’un document au format BSON est fixée à 16 Mo

Les types de données pris en charge de façon native par JSON sont au nombre de six :

    booléen
    numérique
    chaîne de caractères
    tableau
    objet
    null (le marqueur d’absence de valeur)

À ces types prédéfinis dans JSON, MongoDB vient ajouter les siens :

`le type Date` : stocké sous la forme d’un entier signé de 8 octets représentant le nombre de secondes écoulées depuis l’époque Unix (01/01/1970 à minuit). Attention, le fuseau horaire (timezone) n’est pas stocké !

Le type `ObjectId` : stocké sur 12 octets, ce type est utilisé en interne pour garantir l’unicité des identifiants générés par la base de données, son importance est donc capitale !

Les types entiers `NumberLong et NumberInt` : par défaut, MongoDB considère tout numérique comme étant un nombre à virgule codé sur 8 octets. Ces types servent à représenter des nombres entiers signés dont la représentation interne se fait respectivement sur 8 et 4 octets.

Le type `flottant NumberDecimal` : codé sur 16 octets, ce type décimal d’une grande précision est en général privilégié pour des applications effectuant des calculs mathématiques requérant une très grande exactitude.

Le type `BinData` : pour stocker des chaînes de caractères ne pouvant pas être représentées en codage UTF-8 ou n’importe quel contenu binaire (nous le retrouverons dans la partie consacrée à GridFS).

D’autres types sont disponibles, nous avons listé ici les plus fréquemment utilisés, mais vous trouverez une liste bien plus exhaustive à l’URL suivante : https://docs.mongodb.com/manual/reference/bson-types/

### MongoDB en ligne de commande

Pour lancer mongoDB : 
``` sh
mongod
```

Pour se connecter a mongodb: 
``` sh
mongo --port 27777 
```

Pour savoir sur quelle db on se trouve : 
```
db
```

Pour changer de base de donnnees : 
```
use dbName
```

Concernant les bases installees par defaut :

    Ces bases de données servent à gérer les rôles et autorisations, la gestion interne de MongoDB ou des informations sur le démarrage de vos instances. À de très rares exceptions près, vous n’aurez pas l’occasion d’y faire quelque modification que ce soit, ce sont généralement les administrateurs qui y effectuent des opérations.

On peut par exemple : 
``` js
use admin 
db.createUser( 
 { 
   "user": "mongosensei", 
   "pwd": "M0ng0d3!", 
   "roles":[ 
       {"role":"userAdminAnyDatabase","db":"admin"}, 
       "readWriteAnyDatabase" 
   ] 
 } 
) 

```

## La gestion des collections 

Les collations servent à définir des règles pour la comparaison des chaînes de caractères, notamment en ce qui concerne l’accentuation des caractères ou leur casse dans un langage donné. Les collations peuvent être utilisées avec les collections, les vues ou encore les index.

Voici la forme d’un document contenant les informations liées à une collation: 
```
{ 
  locale: < chaîne de caractères >, 
  caseLevel: < booléen >, 
  caseFirst: < chaîne de caractères >, 
  strength: < entier >, 
  numericOrdering: < booléen >, 
  alternate: < chaîne de caractères >, 
  maxVariable: < chaîne de caractères >, 
  backwards: < booléen > 
} 
```

Seul le champ locale est obligatoire, et c'est le seul que nous allons utiliser cet après-midi,

Pour créer une collection : 
```
use madB
db.createCollection('maCollection', {"collation": { "locale": "fr" }})

db.maCollection.drop()
```

### Gestion des documents : 

Pour créer un document : 
```
db.collection.insert(< document OU tableau de documents >) 
```

Pour insérer des données dans une collection :
```js
use test;
db.etudiants.insertMany([ {"nom": "COBLENTZ", "prenom": "Robin"}, {"nom": "FAUVET", "prenom": "Laura"} ])
```

Les méthodes `insertMany` et `insertOne` gèrent les insertions non ordonnées : ce type d'insertion garantit que si une erreur se produit durant l'insertion de plusieurs documents, l'opération n'est pas interrompue et les documents restants sont insérés. L'insertion non ordonnées est réalisée en passant en paramètre un second document contenant le booléen `false` à la clef `ordered`, comme suit :

```js
use test;
db.etudiants.insertMany([ {"nom": "HALLOULI", "prenom": "Walid"}, {"nom": "Lattier", "prenom": "Innocent"}, {"ordered": false} ])
```

### Modification de document

Syntaxe générale :
```js
db.collection.updateOne(< filtre >, < modifications >)
```

En pratique :
```js
db.collection.updateOne({
	"nom": "FAUVETT"
}, {
	$set: {"nom": "FAUVET"}
})
```

### Effectuer des requêtes avec `find` et `findOne`
Les méthodes find et findOne ont la même signature et permettent d'effectuer des requêtes mongo

Syntaxe générale :
```js
db.collection.find({ prop: filtre }, < projection >)
```

En pratique :
```js
db.personnes.find({"age": {$eq: 76}}, {"prenom": true})
```

Différents opérateurs pour le filtre :
`$eq` : équivalent à
`$ne` : différent de
`$gt` : supérieur à | `$gte` supérieur égal
`$lt` : ... | `$lte`
`$in` : présent
`$nin` : absence

```
DBQuery.shellBatchSize = 40
```

mongorc.js est un fichier de config qui se trouve a la racine du repertoire utilisateur: `/home/userName`

``` js
    db.maCollection.find().limit(12)
    db.maCollection.find().limit(12).pretty()
```

On peut utiliser des operateur afin d'affiner la rechecher :
``` js
db.maCollection.find({"age": {$eq: 76} })
db.maCollection.find({"age": 76 }, {"prenom": true})
```

On peut combiner ces operateurs pour effectuer des recherches sur des intervalles :

``` js
    db.maCollection.find({"age": { $lt: 50, $gt: 20 }})
    db.maCollection.find({"age": { $nin: [23, 45, 78] }})
    db.maCollection.find({"age": { $exists: true }})
```

Les operateurs logiques

```js
db.personnes.find(
	{
		$and: [
			{
				"age": {
					$exists: 1
				}
			},
			{
				"age": {
					$nin: [23, 45, 234, 100]
				}
			}
	]},
	{
		"_id": 0,
		"nom": "1",
		"prenom": "1"
	}
)
```

```js
db.p.find({
	"age": {$gte: 70}
})

db.p.find({
	"age": {
		$not: {
			$lt: 70
		}
	}
})
```

L'operateur $where fait intervenir une syntaxe particulière :
```js
db.personnes.find({ $where: function() {
    return this.nom.length > 4
} })
```

`db.personnes.find({$where: "obj.nom.length\*11 == obj.age"})`

L'indexation simple:
```js
db.collection.createIndex(<champ_et_type>, <options>)

db.personnes.createIndex({"age": -1})
```

Il existe un moyen de consulter la liste des index d'une collection :
```js
db.personnes.getIndexes()
```

Pour supprimer un index il suffit d'effectuer la commande suivante:
```js
db.personnes.dropIndex("age_-1")

db.personnes.createIndex({"age": -1}, {"name": "unSuperNom"})

db.personnes.createIndex({"prenom": 1}, {"background": true})
```

Les operateurs de tableaux
```js
 { $push: {<champ>: <valeur>, ...} }
```

L'operateur `push` permet d'ajouter une ou plusieurs valeurs au sein d'un tableau.
```js
db.hobbies.updateOne({"_id": 1}, {$push : {"passions": "Le roller!"}})
```

```js
db.hobbies.updateOne({
	"_id": 2
	},
	$push : {
		"passions": {
			$each: ["Minecraft", "Rise of Kingdom"]
		}
	}
})

db.hobbies.updateOne({
		"_id": 2
	},
	$addToSet : {
		"passions": {
			$each: ["Minecraft", "Rise of Kingdom"]
		}
	}
})

db.personnes.find({"interets.1": "jardinage"})

db.personnes.find({"interets": {$all: ["jardinage", "bridge"]})

db.personnes.find({"interets": {$size: 2}})

db.personnes.find({"interets.1": {$exists: 1}})

db.salles.find({
	$expr : { 
		$gt: [ { $mutliply: ["$\_id", 100] }, "$capacite" ]
	},
	"\_id": 0,
	"nom": 1,
	"capacite": 1
})
```

Les requêtes géospatiales:
```
 { type: <type d'objet GeoJSON>, coordinates: <coordonnees>}
```

Le type Point:
```js
{
    "type": "Point",
    "cooordinates": [13.0, 1.0]
}
```

Le type multipoint:
```js
    {
        "type": "MultiPoint",
        "coordinates": [
            [13.0, 1.0] , [13.0, 3.0]
        ]
    }
```

Le type LineString:
```js
    {
        "type": "LineString",
        "coordinates": [
            [13.0, 1.0] , [13.0, 3.0]
        ]
    }
```

Le type Polyon:
```js
    {
        "type": "Polygon",
        "coordinates": [
         [
            [13.0, 1.0] , [13.0, 3.0]
        ],
        [
            [13.0, 1.0] , [13.0, 3.0]
        ]
        ]
    }
```

Creation d'index:
```js
db.avignon.createIndex({"localisation": "2dsphere"})

db.avignon2d.createIndex({"localisation": "2d"})
```

L'operateur $nearSphere:
```js
{
    $nearSphere: {
        $geometry: {
            type: "Point",
            coordinates: [<longitude>, <latitude>]
        },
        $minDistance: <distance en metres>,
        $maxDistance: <distance en metres>
    }
}

{
    $nearSphere: [ <x>, <y> ],
    $minDistance: <distance en radians>,
    $maxDistance: <distance en radians>
}
	
var opera = { type: "Point", coordinates: [43.949749, 4.805325] }
```

Effectuer une requete sur la collection avignon :
```js
db.avignon.find(
    {
        "localisation": {
            $nearSphere: {
                $geometry: opera
            }
        }
    }, {"_id": 0, "nom": 1}
).explain()
```

### L'operateur $geoWithin

Cet operateur n'effectue aucun tri et ne necessite pas la creation
d'un index geospatiale, on l'utilise de la maniere suivante:

```
{
    <champ des documents contenant les coordonnees> : {
        $geoWithin: {
            <operateur de forme>: <coordonnees>
        }
    }
}
```

Creation d'un polygone pour notre exemple :
```javascript
var polygone = [
  [43.9548, 4.80143],
  [43.95475, 4.80779],
  [43.95045, 4.81097],
  [43.4657, 4.80449],
];
```

La requête suivante utilise ce polygone :
```js
db.avignon2d.find(
  {
    "localisation": {
        $geoWithin: {
            $polygon: polygone
        }
    }
  },
  {"_id":0, "nom":1}
)
```

Signature pour le cas d'utilisation d'objets GeoJSON:
```
{
    <champ des documents contenant les coordonnees> : {
        $geoWithin: {
            type: < "Polygon" ou bien ""MultiPolygon">,
            coordinates:  [<coordonnees>]
        }
    }
}
```

```js
var polygone = [
	[43.9548, 4.80143],
	[43.95475, 4.80779],
	[43.95045, 4.81097],
	[43.4657, 4.80449],
	[43.9548, 4.80143],
]

db.avignon.find({
	"localisation": {
		$geoWithin: {
			$geometry : {
				type: "Polygon",
				coordinates: [polygone]
			}
		}
	}, {
	"\_id": 0,
	"nom":1
})
```
Le framework d'agregation

MongoDB met a disposition un puissant outil d'analyse et de
traitement de l'information: le pipeline d'agrégation (ou framework)

Métaphore du tapis roulant d'usine.

Méthode utilisée:
```js
    db.collection.aggregate(pipeline, options)
```

- pipeline: designe un tableau d'etapes
- options: designe un document

Parmi les options, nous retiendrons:

- `collation` : permet d'affecter une collation a l'opération d'aggrégation
- `bypassDocumentValidation` : fonctionne avec un operateur appelé $out et permet de passer au travers de la validation des documents.
- `allowDiskUse` : donne la possibilité de faire déborder les opérations d'écriture sur le disque

Vous pouvez appeler `aggregate` sans argument:
```js
    db.personnes.aggregate()
```

Au sein du shell, nous allons créer une variable pipeline :
```js
 var pipeline = []
 db.personnes.aggregate(pipeline)
 db.personnes.aggregate(
    pipeline,
     {
        "collation": {
            "locale": "fr"
        }
     }
     )
```

#### Le filtrage avec $match

Cela permet d'obtenir des pipelines performants avec des temps d'execution courts.
Normalement $match doit intervenir le plus en amont possible dans le pipeline car $match agit comme un filtre en reduisant le nombre de documents a traiter plus en aval dans le pipeline. (Dans l'ideal on devrait le trouver comme premier operateur).

La syntaxe est la suivante :
```
    { $match : {<requete>} }
```

Commencons par la première étape
```javascript
var pipeline = [
  {
    $match: {
      interets: "jardinage",
    },
  },
];

db.personnes.aggregate(pipeline);
```

Cela correspond a la requête:
```js
    db.personnes.find({ "interets": "jardinage" })
```

```javascript
var pipeline = [
  {
    $match: {
      interets: "jardinage",
    },
    $match: {
      nom: /^L/,
      age: { $gt: 70 },
    },
  },
];

db.personnes.aggregate(pipeline);
```

#### Selection/modification de champs : $project

syntaxe:
```javascript
    { $project: { <spec> } }
```

```javascript
var pipeline = [
  {
    $match: {
      interets: "jardinage",
    },
  },
  {},
  {
    $project: {
      _id: 0,
      nom: 1,
      prenom: 1,
      super_senior: { $gte: ["$age", 70] },
    },
  },
  {
    $match: {
      super_senior: true,
    },
  },
];

db.personnes.aggregate(pipeline);
```

```javascript
var pipeline = [
  {
    $match: {
      interets: "jardinage",
    },
  },
  {
    $project: {
      id: 0,
      nom: 1,
      prenom: 1,
      ville: "$adresse.ville",
    },
  },
  {
    $match: {
      ville: { $exists: true },
    },
  },
];
```
