
 window.addEventListener('load', function () {
    document.querySelectorAll( '.ciclegraph' ).forEach( ( ciclegraph )=>{
        let circles = ciclegraph.querySelectorAll( '.circle' )
        let angle = 0, dangle = 360 / circles.length
        for( let i = 0; i < circles.length; ++i ){
            let circle = circles[i]

            // Parametric Equation of an Ellipse
            // x,y are the coordinates of any point on the ellipse,
            // a, b are the radius on the x and y axes respectively, 
            // t is the parameter, which ranges from 0 to 2π radians.
            const t = angle * (Math.PI / 180);
            const a = ciclegraph.clientWidth/2;
            const b = ciclegraph.clientHeight/2;
            const x = a * Math.sin(t);
            const y = b * Math.cos(t);
            circle.style.transform = `translate(${x}px, ${y}px)`
            angle += dangle
        }
    })  
    myFunction();
})


