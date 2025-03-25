const texts = [
    'print("I\'m <span style="color: #7633ff">Justin Lauinger</span>")',
    'System.out.println("I\'m <span style="color: #218b01">Justin Lauinger</span>");',
    'console.log("I\'m <span style="color: #d70000">Justin Lauinger</span>");',
    'printf("I\'m <span style="color: #2b55da">Justin Lauinger</span>"\\n);'
];

const textWrap = document.querySelector('.text-wrap');
let currentIndex = 0;

function typeText() {
    textWrap.innerHTML = texts[currentIndex];

    const typingDuration = 2; 
    const backspacingDuration = 1;
    const pauseDuration = 2; 
    textWrap.style.animation = `typing ${typingDuration}s steps(${texts[currentIndex].length}) forwards, 
                                cursor 0.7s step-end infinite`;

    setTimeout(() => {
        setTimeout(() => {
            textWrap.style.animation = `backspacing ${backspacingDuration}s steps(${texts[currentIndex].length}) forwards, 
                                        cursor 0.7s step-end infinite`;
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % texts.length; 
                typeText(); 
            }, backspacingDuration * 1000); 
        }, pauseDuration * 1000); 
    }, typingDuration * 1000); 
}

// Start the animation
typeText();

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');

// Set the canvas size to the window's width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 150) * (canvas.width / 150)
};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    const { clientX, clientY } = event;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const movementX = (clientX - centerX) * 0.05;
    const movementY = (clientY - centerY) * 0.05;
  
    const parallaxText = document.getElementById('parallaxText');
    parallaxText.style.transform = `translate(${movementX}px, ${movementY}px)`;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(200,200,200,0.4)';
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 4;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 4;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 4;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 4;
            }
        }
        this.x += this.directionX * 0.2;
        this.y += this.directionY * 0.2;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 12000;

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 4) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);       
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);   
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#FFFFFF';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

function connect() {
    let opacityValue = 0.1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x)
                * (particlesArray[a].x - particlesArray[b].x)) 
                + ((particlesArray[a].y - particlesArray[b].y) 
                * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(150,150,150,' + opacityValue + ')';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);       
                ctx.stroke();       
            }
        }
    }
}

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
    init();
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();