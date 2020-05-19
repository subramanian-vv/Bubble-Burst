//Initialises canvas
var canvas = document.querySelector('canvas');
canvas.width=window.innerWidth-25;
canvas.height=window.innerHeight-25;
var c=canvas.getContext('2d');

//Initialises all audio files
var bubblePop = new Audio('Audios/bubble_pop.mp3');
var snap = new Audio('Audios/snap.mp3');
var felixFelicis = new Audio('Audios/felix_felicis.mp3');
var warning = new Audio('Audios/warning.mp3');
var gameOverSound = new Audio('Audios/game_over.mp3');

//Initialises array for best scores
var bestScore = 0, scoreArray = [];

//Resizes the window automatically based on screen resolution
window.addEventListener('resize', function() {
    canvas.width=window.innerWidth-25;
    canvas.height=window.innerHeight-25;
});

init();

function init() {
    
    var currScore = 0, checkPause = 0, gameOver = 0, ffcount=0, time = 1000, gauntCount = 0, ffdisappear = 0;
    var totalArea = (canvas.width-100) * canvas.height;

    var colors = [
        "#D98880", "#F1948A", "#F5B7B1"
    ];


    function borderResize() {
        c.beginPath();
        c.strokeStyle = '#000000';
        c.moveTo(canvas.width-100, 0);
        c.lineTo(canvas.width-100, canvas.height);
        c.stroke();
    }
    

class Bubble {

    constructor(x,y,radius) {
    
        this.x = x;
        this.y = y;
        this.velocity = {
            x: Math.random()*4 - 2,
            y: Math.random()*4 - 2
        };
        this.radius = radius;
        this.flag = 0;
    }

    draw = function() {
        var grad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0.7, "seagreen");
        grad.addColorStop(1, colors[Math.floor(Math.random()*colors.length)]);
        c.fillStyle = grad;

        c.beginPath();
        c.arc(this.x , this.y , this.radius , 0 ,Math.PI*2 , false);
        c.fill();
        c.closePath();
        c.beginPath();
        c.font = '15px Arial';
        c.fillStyle = '#FFFFFF';
        c.fillText("1", this.x-2, this.y+2);
    }

    update = function(bubbleArray) {

        for(let i=0; i<bubbleArray.length; i++)
        {
            if(this === bubbleArray[i])
            continue;
            if(getDistance(this.x, this.y, bubbleArray[i].x, bubbleArray[i].y) <= this.radius + bubbleArray[i].radius)
            {
                resolveCollision(this, bubbleArray[i]);
            }
        }

        if(this.x + this.radius > canvas.width-100 || this.x - this.radius < 0)
        {
            this.velocity.x = -this.velocity.x;
        }
        if(this.y + this.radius > canvas.height || this.y - this.radius < 0)
        {
            this.velocity.y = -this.velocity.y;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;

       this.draw();
    }
}

class rockBubble {

    constructor(x,y,radius) {
    
        this.x = x;
        this.y = y;
        this.velocity = {
            x: Math.random()*4 - 2,
            y: Math.random()*4 - 2
        };
        this.radius = radius;
        this.flag = 0;
        this.click = 0;
    }

    draw = function() {
        var grad = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(2*(this.click/10), "seagreen");
        grad.addColorStop(1, colors[Math.floor(Math.random()*colors.length)]);
        c.fillStyle = grad;

        c.beginPath();
        c.arc(this.x , this.y , this.radius , 0 ,Math.PI*2 , false);
        c.fill();
        c.closePath();
        c.beginPath();
        c.font = '15px Arial';
        c.fillStyle = '#FFFFFF';
        c.fillText(5-this.click, this.x-2, this.y+2);
    }

    update = function(bubbleArray) {

        for(let i=0; i<bubbleArray.length; i++)
        {
            if(this === bubbleArray[i])
            continue;
            if(getDistance(this.x, this.y, bubbleArray[i].x, bubbleArray[i].y) <= this.radius + bubbleArray[i].radius)
            {
                resolveCollision(this, bubbleArray[i]);
            }
        }

        if(this.x + this.radius > canvas.width - 100 || this.x - this.radius < 0)
        {
            this.velocity.x = -this.velocity.x;
        }
        if(this.y + this.radius > canvas.height || this.y - this.radius < 0)
        {
            this.velocity.y = -this.velocity.y;
        }
        this.x += this.velocity.x;
        this.y += this.velocity.y;

       this.draw();
    }
}
    

var bubbleArray = [];  //Array to contain the bubbles

var creation = function() {
    
    if(checkPause==0 && gameOver==0)
    {
        generateBubble();
        if(time>400)
        {
            time-=10;
        }
        if(currScore > 2000)
        {
            time = 300;
        }
    }
    setTimeout(creation, time);
}
setTimeout(creation, time);

//Gets the distance between two points
function getDistance(x1,y1,x2,y2) {
    const xd = x2 - x1;
    const yd = y2 - y1;
     
    return Math.sqrt(Math.pow(xd,2) + Math.pow(yd,2));
}

//Generates bubbles and rock bubbles
function generateBubble()
{
    var radius = Math.floor(Math.random()*30 + 20);   //Radius from 20 to 50
    var x = Math.random() * ((canvas.width-100) - radius*2) + radius;
    var y = Math.random() * (canvas.height - radius*2) + radius;

    if(bubbleArray.length > 0)
    {
        var j = 0;
        while(j < bubbleArray.length)
        {
            if(getDistance(x, y, bubbleArray[j].x, bubbleArray[j].y) <= (radius + bubbleArray[j].radius))
            {
                x = Math.random() * ((canvas.width-100) - radius*2) + radius;
                y = Math.random() * (canvas.height - radius*2) + radius;
                j = -1;
            }
            j++;
        }
    }
    if(currScore > 50)
    {
        if(Math.floor(Math.random()*10) == 1)
        {
            bubbleArray.push(new rockBubble(x,y,radius));
        }
    }
    bubbleArray.push(new Bubble(x,y,radius));
}

//Events to happen onclick
function click(event) {
    if(checkPause==0) {
        for(var k=0;k<bubbleArray.length;k++)
        {
            //Checks bubble click event
            if(getDistance(event.offsetX, event.offsetY, bubbleArray[k].x, bubbleArray[k].y) <= bubbleArray[k].radius)
            {
                if(bubbleArray[k] instanceof Bubble)
                {
                bubbleArray[k].flag = 1;
                scoreUpdate(bubbleArray[k]); 
                bubbleArray.splice(k,1);
                if(gameOver == 0)
                {
                    bubblePop.play();
                }
                }
                
                else if(bubbleArray[k] instanceof rockBubble)
                {
                    if(bubbleArray[k].click < 4)
                    {
                        bubbleArray[k].click++;
                        if(gameOver == 0)
                        {
                        bubblePop.play();
                        }
                    }
                    else 
                    {
                    bubbleArray[k].flag = 1;
                    scoreUpdate(bubbleArray[k]); 
                    bubbleArray.splice(k,1);
                    if(gameOver == 0)
                    {
                        bubblePop.play();
                    }
                    }
                }
            }
            

        }

        //Checks Felix Felicis click event
        if(event.offsetX > canvas.width - 80  && event.offsetX < canvas.width - 20 && event.offsetY > 10 && event.offsetY < 130)
        {
            if(ffcount<2 && ffdisappear==0)
            {
                ffcount++;
                let tempTime = time;
                time = 5000;
                ffdisappear++;
                if(gameOver==0)
                {
                    felixFelicis.play();
                }
                setTimeout(function() {
                time = tempTime;
                ffdisappear = 0;
            },5000);
            }
        }

        //Checks gauntlet click event
        if(event.offsetX > canvas.width - 80 && event.offsetY > canvas.height - 100)
        {
            if(gauntCount < 1)
            {
            bubbleArray.splice(0,bubbleArray.length/2);
            gauntCount++;
            if(gameOver==0)
            {
                snap.play();
            }
            setTimeout(function() {
                gauntCount = 0;
            },20000);
            }
        }

    }

    //Checks pause and play click events
    if(event.offsetX > canvas.width-65 && event.offsetX < canvas.width-35 && event.offsetY > 220 && event.offsetY < 260) 
        {
            if(checkPause == 0)
            {
                checkPause = 1;
            }
            else if(checkPause == 1) {
                checkPause = 0;
                animate();
            }
        }
    
    //Checks restart click event
    if(event.offsetX > canvas.width-90 && event.offsetX < canvas.width-10 && event.offsetY > 360 && event.offsetY < 435)
    {
        window.location.reload();
    }

}

//Calculates scores and best score
function scoreUpdate(event) {
    if(gameOver == 0)
    {
    currScore += Math.floor(200/Math.floor(event.radius));
    }

    if(gameOver == 1)
    {
       if(currScore > Math.max(...scoreArray))
       {
           scoreArray.push(currScore);
           bestScore = Math.max(...scoreArray);
           if((window.localStorage.getItem('highScore') == null) || (bestScore > window.localStorage.getItem('highScore')))
           {
               window.localStorage.setItem('highScore', JSON.stringify(bestScore));
           }
       } 

    }
}

//Draws various features onto canvas
function drawFeatures() {

    //Felix Felicis
    if(ffcount<2 && ffdisappear==0)
    {
        var img = new Image();
        img.src = 'Images/ff.png';
        c.drawImage(img, canvas.width - 100, -5, 100, 150);
    }

        //Restart button
        var restart = new Image();
        restart.src = 'Images/restart.png';
        c.drawImage(restart, canvas.width-90, (canvas.height/2)+45, 80, 80);

    //Pause and play button
    if(checkPause == 0)
    {
        c.beginPath();
        c.strokeStyle='#FFFF00';
        c.fillStyle='#FFFF00';
        c.fillRect(canvas.width-65, 220, 10, 40);
        c.fillRect(canvas.width-45, 220, 10, 40);
        c.stroke();
        c.fill();
        c.closePath();
        
    }
    if(checkPause == 1)
    {
        c.beginPath();
        c.strokeStyle='#FFFF00';
        c.fillStyle='#FFFF00';
        c.moveTo(canvas.width-65, 220);
        c.lineTo(canvas.width-65, 260);
        c.lineTo(canvas.width-35, 240);
        c.stroke();
        c.fill();
        c.closePath();
    }
}

//Draws scores onto the canvas
function drawScores() {
    c.beginPath();
    c.font = "30px Algerian";
    c.strokeStyle = '#000000';
    c.fillStyle = '#000000';
    c.fillText("SCORE : ", 20, 50);
    c.fillText(currScore, 135, 50);
    c.fillText("BEST ", 20, 100);
    c.fillText(":", 117, 100);
    c.strokeText("SCORE : ", 20, 50);
    c.strokeText(currScore, 135, 50);
    c.strokeText("BEST ", 20, 100);
    c.strokeText(":", 117, 100);

    if(window.localStorage.getItem('highScore') == null)
    {
        c.fillText('0', 135, 100);
        c.strokeText('0', 135, 100);
    }
    else
    {
        c.fillText(window.localStorage.getItem('highScore'), 135, 100);
        c.strokeText(window.localStorage.getItem('highScore'), 135, 100);
    }
    c.closePath();

    if(gameOver == 1) 
    {
        c.beginPath();
        c.font = '50px Arial';
        c.textAlign = 'center';
        c.fillStyle = '#000000';
        c.strokeStyle = '#000000';
        c.fillText('GAME OVER!', canvas.width/2, canvas.height/2);
        c.strokeText('GAME OVER!', canvas.width/2, canvas.height/2);
        c.closePath();
    }
}

//Checks the area covered by the bubbles and compares it with the total area
function checkArea () {
    var area = 0;
    for(var m=0; m<bubbleArray.length; m++)
    {
        area += Math.PI * (Math.pow(bubbleArray[m].radius, 2));
    }
    var fractionArea = area/totalArea;

    if(gauntCount < 1 && fractionArea > 0.15 && currScore > 100)
    {
        var thanos = new Image();
        thanos.src = 'Images/gauntlet.png';
        c.drawImage(thanos, canvas.width-100, canvas.height-100, 100, 100);
    }

    if(fractionArea > 0.25 && gameOver == 0 && fractionArea < 0.3)
    {
        warning.play();
    }

    if(fractionArea > 0.35)
    {
        c.font = "30px Algerian";
        if(currScore > Math.max(...scoreArray))
       {
           scoreArray.push(currScore);
           bestScore = Math.max(...scoreArray);
           if((window.localStorage.getItem('highScore') == null) || (bestScore > window.localStorage.getItem('highScore')))
           {
               window.localStorage.setItem('highScore', JSON.stringify(bestScore));
           }
       } 
        if(window.localStorage.getItem('highScore') == null)
        {
            c.fillText('0', 135, 100);
            c.strokeText('0', 135, 100);
        }
        else
        {
            c.fillText(window.localStorage.getItem('highScore'), 135, 100);
            c.strokeText(window.localStorage.getItem('highScore'), 135, 100);
        }
        gameOver = 1;
        gameOverSound.play();
    }
}


// Function to rotate the coordinates to convert oblique collision into a linear collision

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

// Function to change the velocities after an elastic collision

function resolveCollision(bubble1, bubble2) {
    const xVelocityDiff = bubble1.velocity.x - bubble2.velocity.x;
    const yVelocityDiff = bubble1.velocity.y - bubble2.velocity.y;

    const xDist = bubble2.x - bubble1.x;
    const yDist = bubble2.y - bubble1.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Calculate angle between the two colliding particles
        const angle = -Math.atan2(bubble2.y - bubble1.y, bubble2.x - bubble1.x);

        // Velocity before equation
        const u1 = rotate(bubble1.velocity, angle);
        const u2 = rotate(bubble2.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u2.x, y: u1.y };
        const v2 = { x: u1.x, y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        bubble1.velocity.x = vFinal1.x;
        bubble1.velocity.y = vFinal1.y;

        bubble2.velocity.x = vFinal2.x;
        bubble2.velocity.y = vFinal2.y;
    }
}

//Function to animate the canvas
function animate() {
    if(gameOver == 0) {
        if(checkPause == 0) {
            window.requestAnimationFrame(animate);
        }
        c.clearRect(0,0,innerWidth,innerHeight);
        bubbleArray.forEach(function(event) {
            if(event.flag == 0)
            {
                event.update(bubbleArray);
            }
        });
        checkArea();
        drawScores();
        borderResize();
        drawFeatures();
    }

    canvas.addEventListener('mousedown', click);
    
}

animate();

}