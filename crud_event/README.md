# 🎉 EventHub -- Backend Spring Boot

**Repository : Backend_Angular**

Ce dépôt contient la partie **Backend Spring Boot** du projet
**EventHub**, une plateforme permettant la **gestion des événements**,
l'inscription des utilisateurs et une interface administrateur
sécurisée.\
Ce backend est conçu pour être consommé par le **Frontend Angular**
associé.

------------------------------------------------------------------------

## 🔐 Accès & Rôles

### ✔️ Accès Administrateur

Pour accéder à l'espace administrateur, vous devez obligatoirement
utiliser l'email suivant :

    admin@gmail.com

Le mot de passe est défini lors de la création du compte ou via la base
de données.

### ✔️ Utilisateur simple

-   Consulter les événements\
-   S'inscrire / se désinscrire\
-   Modifier son compte

------------------------------------------------------------------------

## 🏗️ Technologies utilisées

-   Java 17\
-   Spring Boot 3\
-   Spring Security + JWT\
-   Jasypt Encryption\
-   MySQL\
-   JPA / Hibernate\
-   Maven

------------------------------------------------------------------------

## ⚙️ Configuration -- `application.properties`

``` properties
spring.application.name=Event
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/event_db?createDatabaseIfNotExist=true
spring.datasource.password=
spring.datasource.username=root
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.enable_lazy_load_no_trans=true
spring.jpa.properties.hibernate.order_by.default_null_ordering=last
security.enable.csrf=false
server.port=8082
jasypt.encryptor.password=secret
cors.allowed.origins=http://localhost:4200
spring.jackson.serialization.write-dates-as-timestamps=false
```

📌 **Port Backend : 8082**\
📌 **Base MySQL : event_db**

------------------------------------------------------------------------

## 📁 Structure du projet

    src/
     └── main/
         ├── java/
         │    └── tn/esprit/spring/event/
         │          ├── auditing/
         │          └── demo/
         │                ├── Auth/
         │                ├── config/
         │                ├── Controller/
         │                ├── Model/
         │                ├── Repository/
         │                ├── Service/
         │                └── EventApplication.java
         │
         └── resources/
              └── application.properties

------------------------------------------------------------------------

## 🚀 Lancer le backend

### ✔️ Avec IntelliJ IDEA (méthode recommandée)

1.  Ouvrez le projet dans **IntelliJ IDEA**\

2.  Attendez la synchronisation Maven\

3.  Allez dans la classe :

        tn.esprit.spring.event.demo.EventApplication

4.  Cliquez sur **Run ▶**

➡️ L'API démarre sur : **http://localhost:8082**

### ✔️ Ou en ligne de commande

``` bash
mvn spring-boot:run
```

------------------------------------------------------------------------

## 📡 Principaux Endpoints API

### 🔐 Authentification

  Méthode   URL                Description
  --------- ------------------ -----------------
  POST      `/auth/register`   Créer un compte
  POST      `/auth/login`      Obtenir un JWT

------------------------------------------------------------------------

### 🎫 Gestion des événements

  Méthode   URL              Accès    Description
  --------- ---------------- -------- -----------------------
  GET       `/events`        Public   Lister les événements
  POST      `/events`        Admin    Ajouter un événement
  PUT       `/events/{id}`   Admin    Modifier
  DELETE    `/events/{id}`   Admin    Supprimer

------------------------------------------------------------------------

### 🧍 Gestion des inscriptions

  Méthode   URL                           Accès   Description
  --------- ----------------------------- ------- -----------------------
  POST      `/events/{id}/register`       User    S'inscrire
  DELETE    `/events/{id}/unregister`     User    Se désinscrire
  GET       `/events/{id}/participants`   Admin   Voir les participants

------------------------------------------------------------------------

## 🌐 Connexion avec le Frontend Angular

Dans `environment.ts` :

``` ts
export const environment = {
  apiUrl: 'http://localhost:8082'
};
```

------------------------------------------------------------------------

## 🤝 Contribution

Les contributions sont encouragées.\
Merci de créer une branche puis une Pull Request.

------------------------------------------------------------------------


## 👤 Propriétaire du projet

Ce backend a été développé par :

**Imen Bouchriha**\
📧 **Email personnel :** imenbouchriha5@gmail.com\
📧 **Email scolaire :** imen.bouchriha@esprit.tn
