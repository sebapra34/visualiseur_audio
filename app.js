const audioPlayer = document.querySelector('audio');

audioPlayer.addEventListener('play', () => {

    // constructeur qui propose des methodes liées au son :
    const contexteAudio = new AudioContext();

    // création de source audio à partir de notre fichier audio :
    const src = contexteAudio.createMediaElementSource(audioPlayer);

    // outil de representation de données audio :
    const analyseur = contexteAudio.createAnalyser();

    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    src.connect(analyseur);
    // connection de l'analyseur a la sortie audio (haut parleur)
    analyseur.connect(contexteAudio.destination);

    analyseur.fftSize = 1024;
    // nombre de fréquences de notre audio : (moitié du fftSize) :
    const frequencesAudio = analyseur.frequencyBinCount;

    const tableauFrequences = new Uint8Array(frequencesAudio);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    // largeur barre = largeur de l'écran / par nb de frequences du tab
    // le +2 supprime les aigus en aggrandissant d'avantage les barres
    const largeurBarre = (WIDTH / tableauFrequences.length) +2;
    let hauteurBarre;
    let x; // debut de position des barres dessinées

    function dessineBarres(){
        requestAnimationFrame(dessineBarres);
        x = 0;

        // valeur entre 0 et 255 : nickel pour regler le rgb des barres et leur hauteur
        analyseur.getByteFrequencyData(tableauFrequences);

        ctx.fillStyle = "#333";
        ctx.fillRect(0,0,WIDTH,HEIGHT);

        for (let i=0; i<frequencesAudio; i++){
            hauteurBarre = tableauFrequences[i];
            let r = 250;
            let g = 60;
            let b = i-60;
            Math.random() * (250 - 160) + 1;

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, HEIGHT, largeurBarre, -hauteurBarre) // - pour aller de haut en bas

            x += largeurBarre + 1; // incremente pour que les barres se créent les unes à coté des autres a chaque tour 
        }
    }
    dessineBarres();
})