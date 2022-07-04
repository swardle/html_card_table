
 window.addEventListener('load', function () {
    document.querySelectorAll( '.CircularTable' ).forEach( ( circularTable )=>{
        let players = circularTable.querySelectorAll( '.PlayerContainer' )
        let angle = 0, dangle = 360 / players.length
        for( let i = 0; i < players.length; ++i ){
            let player = players[i]

            // Parametric Equation of an Ellipse
            // x,y are the coordinates of any point on the ellipse,
            // a, b are the radius on the x and y axes respectively, 
            // t is the parameter, which ranges from 0 to 2π radians.
            const t = angle * (Math.PI / 180);
            const a = circularTable.clientWidth/2;
            const b = circularTable.clientHeight/2;
            const x = a * Math.sin(t);
            const y = b * Math.cos(t);
            player.style.transform = `translate(${x}px, ${y}px)`
            angle += dangle
        }
    })  
    myFunction();
})


