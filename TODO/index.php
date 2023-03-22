<?php

function connectToDatabase() {
  // Connexion à la base de données
  $db = new PDO('mysql:host=db.3wa.io;dbname=juleslemercier_API_TODO', 'juleslemercier', '670ceb7ff781c48a3c904eee72672a40');
  return $db;
}

//CREATE
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['id']) && !isset($_POST['action'])) {
  $tache = $_POST['tache'];
  $echeance = $_POST['echeance'];
  $etat = 'à faire';

   // Connexion à la base de données
  $db = connectToDatabase();

  // Préparation et exécution de la requête SQL pour CREATE un nouveau todo
  $query = $db->prepare('INSERT INTO TODO (tache, echeance, etat) VALUES (:tache, :echeance, :etat)');
  $query->bindParam(':tache', $tache);
  $query->bindParam(':echeance', $echeance);
  $query->bindParam(':etat', $etat);
  $query->execute();
}

//UPDATE
  if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id']) && isset($_POST['etat'])) {
  $id = $_POST['id'];
  $etat = $_POST['etat'];

   // Connexion à la base de données
  $db = connectToDatabase();

  // Préparation et exécution de la requête SQL pour mettre à jour l'état du todo
  $query = $db->prepare('UPDATE TODO SET etat = :etat WHERE id = :id');
  $query->bindParam(':id', $id);
  $query->bindParam(':etat', $etat);
  $query->execute();
}

//SELECT
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
   // Connexion à la base de données
  $db = connectToDatabase();

  // Préparation et exécution de la requête SQL pour récupérer tous les todos
  $query = $db->query('SELECT * FROM TODO');
  $todos = $query->fetchAll(PDO::FETCH_ASSOC);

  // Envoi de la réponse au format JSON
  header('Content-Type: application/json');
  echo json_encode($todos);
}

//DELETE 
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
  header('Content-Type: application/json');
    
  $id = intval($_POST['id']);

   // Connexion à la base de données
  $db = connectToDatabase();

  // Préparation et exécution de la requête SQL pour supprimer le todo
  $query = $db->prepare('DELETE FROM TODO WHERE id = :id');
  $query->bindParam(':id', $id);
  $query->execute();
}