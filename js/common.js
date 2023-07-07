/**
 * Inicializanod WOW para las animaciones
*/
new WOW().init();
/**
 * Fecha dinamica del Copyright 
 */
copyright = new Date();
update = copyright.getFullYear();
document.getElementById('year').innerHTML = update;
/**
 * Video Modal Control
 */
$(".js-video-button").modalVideo({
    youtube: {
        controls: 0,
        nocookie: true
    }
});