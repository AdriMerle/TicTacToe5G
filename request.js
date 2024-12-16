// URL de base de l'API Quuppa
const baseUrl = "http://172.24.153.108:8080/qpe/getTagData";

// Paramètres de la requête
const params = new URLSearchParams({
    mode: "json",
    tag: "a4da22e16cda"
});

// Envoyer la requête GET à l'API
fetch(`${baseUrl}?${params.toString()}`)
    .then(response => {
        console.log(response)
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Erreur: ${response.status}`);
        }
    })
    .then(data => {
        // Si la requête est réussie, afficher les données JSON
        console.log(JSON.stringify(data, null, 4));
    })
    .catch(error => {
        // Si la requête échoue, afficher le code d'erreur et le message
        console.log("erreur")
        console.error(error.message);
    });