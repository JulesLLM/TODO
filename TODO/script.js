window.addEventListener("DOMContentLoaded", (event) => {

// Récupérer la liste des todos depuis le serveur en utilisant l'API fetch
    fetch('index.php')
       .then(response => response.json())
      .then(todos => {
        // Afficher la liste des todo dans la page HTML
        afficherListeTodos(todos);
      });
 
// Capturer l'événement de soumission du formulaire pour ajouter une nouvelle tâche  
    const form = document.querySelector('#ajouter-todo-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      
      // Cette constante permet de récupérer les données du formulaire
      const formData = new FormData(form);
      // Cette requête fetch envoie les données du formulaire à la page index.php en méthode POST
      fetch('index.php', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        // Rafraîchir la liste des todo dans la page HTML
        return response.json();
      })
      .then(todos => {
         // Appelle la fonction afficherListeTodos avec la liste de tâches à jour.
        afficherListeTodos(todos);
      });
    });

function addActionsTodo() {
  // Cette constante permet de récupérer la tâche et sa checkbox
      const todo = document.querySelector('.todo');
      const checkbox = todo.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', event => {
        const id = todo.dataset.id;
        const etat = checkbox.checked ? 'fait' : 'à faire';
      
        fetch('index.php', {
          method: 'POST',
          body: new URLSearchParams({id, etat})
        })
        .then(response => {
          // Rafraîchir la liste des todo dans la page HTML
          return response.json();
        })
        .then(todos => {
          afficherListeTodos(todos);
        });
      });
  
     // Récupérer le bouton de suppression pour chaque tâche
  const deleteButton = todo.querySelectorAll('.delete-button');
  /*deleteButton.addEventListener('click', event => {
    // Récupérer l'ID de la tâche à supprimer
    const id = todo.dataset.id;
  
    // Envoyer une requête POST à index.php avec l'ID de la tâche à supprimer
    fetch('index.php', {
      method: 'POST',
      body: {"id": id}
    })
    .then(response => {
      // Si la suppression a réussi, rafraîchir la liste des tâches dans la page HTML
      return response.json();
    })
    .then(todos => {
      afficherListeTodos(todos);
    });
  });*/
}

// Récupérer la liste de tâches et les afficher dans la page HTML
const ul = document.querySelector('#todos-list');
fetch('index.php')
  .then(response => response.json())
  .then(todos => {
    todos.forEach(todo => {
      // Créer un élément li pour chaque tâche
      const li = document.createElement('li');
      li.classList.add('todo');
      li.dataset.id = todo.id;

      // Ajouter une checkbox pour indiquer l'état de la tâche (à faire ou faite)
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.etat === 'fait';
      li.appendChild(checkbox);

      // Ajouter le texte de la tâche dans un span
      const span = document.createElement('span');
      span.textContent = todo.tache;
      li.appendChild(span);

      // Ajouter un bouton de suppression pour chaque tâche
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-button');
      deleteButton.textContent = 'Supprimer';
      li.appendChild(deleteButton);

      // Ajouter l'élément li à la liste ul
      ul.appendChild(li);
    });
  });
  
// Lorsqu'une checkbox est cochée ou décochée, envoyer une requête pour mettre à jour l'état de la tâche
ul.addEventListener('change', event => {
  const todoId = event.target.closest('.todo').dataset.id;
  const isChecked = event.target.checked;

  fetch(`index.php?action=update&id=${todoId}&etat=${isChecked ? 'fait' : 'a_faire'}`)
    .then(response => {
      // Si la mise à jour a réussi, mettre à jour le texte de la tâche dans la liste
      return response.json();
    })
    .then(todo => {
      const li = ul.querySelector(`li[data-id="${todo.id}"]`);
      const span = li.querySelector('span');
      span.textContent = todo.tache;
    });
});

// Lorsqu'un bouton de suppression est cliqué, envoyer une requête pour supprimer la tâche correspondante
ul.addEventListener('click', event => {
  if (event.target.matches('.delete-button')) {
    const todoId = event.target.closest('.todo').dataset.id;

    /*fetch(`index.php?action=delete&id=${todoId}`)
      .then(response => {
        // Si la suppression a réussi, rafraîchir la liste des tâches dans la page HTML
        return response.json();
      })
      .then(todos => {
        afficherListeTodos(todos);
      });*/
    fetch('index.php', {
      method: 'POST',
      headers: { 'Content-Type':'application/x-www-form-urlencoded'},
      body: "id="+todoId,
    });
  }
});

// Fonction pour afficher la liste des tâches dans la page HTML
function afficherListeTodos(todos) {
  document.querySelector('#todos-list').innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.classList.add('todo');
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.etat === 'fait';
    li.appendChild(checkbox);

    const texte = document.createElement('span');
    texte.textContent = todo.tache;
    li.appendChild(texte);

    const boutonSupprimer = document.createElement('button');
    boutonSupprimer.classList.add('delete-button');
    boutonSupprimer.textContent = 'Supprimer';
    li.appendChild(boutonSupprimer);

    ul.appendChild(li);
  });
  
  addActionsTodo();
}

});