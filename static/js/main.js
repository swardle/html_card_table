/**
 Copyright 2019 Itay Grudev
 License: MIT
 jQuery version: https://jsfiddle.net/ItayGrudev/3jqryc1m/1
 */

 window.addEventListener('load', function () {
    document.querySelectorAll( '.ciclegraph' ).forEach( ( ciclegraph )=>{
        let circles = ciclegraph.querySelectorAll( '.circle' )
        let angle = 90, dangle = 360 / circles.length
        for( let i = 0; i < circles.length; ++i ){
            let circle = circles[i]
            circle.style.transform = `rotate(${angle}deg) translate(${ciclegraph.clientWidth / 2}px) rotate(-${angle}deg)`
            angle += dangle
        }
    })  
    myFunction();
})


