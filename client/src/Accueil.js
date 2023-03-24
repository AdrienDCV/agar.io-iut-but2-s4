
export default class Accueil{
    constructor(){
    console.log('Accueil');


    const title='nom du jeu';
    let pseudo='pseudo';
    let couleur='red';

    pseudo=document.getElementById('pseudo').value;
    couleur=document.getElementById('color').value;

    console.log(pseudo);
    console.log(couleur);
    }
}

