// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
});

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Initialize Three.js Scene for Background Network Animation
const canvas = document.getElementById('bg-canvas');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x121212, 0.001);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x121212, 1);

// Particles & Lines Setup
const particlesData = [];
const particleCount = 200;
const r = 1600;
const rHalf = r / 2;

const pMaterial = new THREE.PointsMaterial({
    color: 0x444455,
    size: 4,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: false
});

const particles = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * r - r / 2;
    const y = Math.random() * r - r / 2;
    const z = Math.random() * r - r / 2;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    // add to particlesData for animation
    particlesData.push({
        velocity: new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, -1 + Math.random() * 2).normalize().multiplyScalar(0.5),
        numConnections: 0
    });
}

particles.setDrawRange(0, particleCount);
particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

const pointCloud = new THREE.Points(particles, pMaterial);
scene.add(pointCloud);

// Lines Setup
const maxConnections = 2;
const minDistance = 150;
const maxDistance = 250;
let vertexCount = 0;
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x333344,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.3
});

const segments = particleCount * particleCount;
const positions = new Float32Array(segments * 3);
const colors = new Float32Array(segments * 3);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
// Use vertex colors
lineMaterial.vertexColors = true;

const linesMesh = new THREE.LineSegments(geometry, lineMaterial);
scene.add(linesMesh);

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
}

// Window Resize
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Update particle positions based on velocity
    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    for (let i = 0; i < particleCount; i++)
        particlesData[i].numConnections = 0;

    for (let i = 0; i < particleCount; i++) {
        const particleData = particlesData[i];

        particlePositions[i * 3] += particleData.velocity.x;
        particlePositions[i * 3 + 1] += particleData.velocity.y;
        particlePositions[i * 3 + 2] += particleData.velocity.z;

        if (particlePositions[i * 3 + 1] < -rHalf || particlePositions[i * 3 + 1] > rHalf)
            particleData.velocity.y = -particleData.velocity.y;

        if (particlePositions[i * 3] < -rHalf || particlePositions[i * 3] > rHalf)
            particleData.velocity.x = -particleData.velocity.x;

        if (particlePositions[i * 3 + 2] < -rHalf || particlePositions[i * 3 + 2] > rHalf)
            particleData.velocity.z = -particleData.velocity.z;
        
        // Check connections
        for (let j = i + 1; j < particleCount; j++) {
            const particleDataB = particlesData[j];
            
            const dx = particlePositions[i * 3] - particlePositions[j * 3];
            const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
            const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDistance) {
                const alpha = 1.0 - dist / maxDistance;
                
                positions[vertexpos++] = particlePositions[i * 3];
                positions[vertexpos++] = particlePositions[i * 3 + 1];
                positions[vertexpos++] = particlePositions[i * 3 + 2];

                positions[vertexpos++] = particlePositions[j * 3];
                positions[vertexpos++] = particlePositions[j * 3 + 1];
                positions[vertexpos++] = particlePositions[j * 3 + 2];

                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;

                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                
                numConnected++;
            }
        }
    }

    linesMesh.geometry.setDrawRange(0, numConnected * 2);
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;
    pointCloud.geometry.attributes.position.needsUpdate = true;

    // Gentle camera rotation based on mouse
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    scene.rotation.x += 0.05 * (targetY - scene.rotation.x);
    scene.rotation.y += 0.05 * (targetX - scene.rotation.y);

    renderer.render(scene, camera);
}

// GSAP Tech Stack Animation
gsap.registerPlugin(ScrollTrigger);

// 1. Subtle floating animation (replaces CSS float)
gsap.utils.toArray('.tech-capsule').forEach((capsule, index) => {
    const randomY = 10 + Math.random() * 15;
    const duration = 2.5 + Math.random() * 1.5;
    const delay = Math.random() * 2;
    
    gsap.to(capsule, {
        y: `-=${randomY}`,
        duration: duration,
        delay: delay,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
});

// 2. Main Scroll Zoom Portal Timeline
const techTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#tech-stack",
        start: "top top",
        end: "+=1500", // The amount of scroll distance to complete the portal effect
        pin: true,
        scrub: 1,
    }
});

// Layer 1 (Outer) - flies past camera quickly
techTl.to('.layer-1', {
    scale: 4,
    opacity: 0,
    ease: "power2.in",
    duration: 1
}, 0);

// Layer 2 (Middle) - scales up, becomes fully opaque, then flies past
techTl.to('.layer-2', {
    scale: 1.8,
    opacity: 1,
    ease: "none",
    duration: 1
}, 0);
techTl.to('.layer-2', {
    scale: 4,
    opacity: 0,
    ease: "power2.in",
    duration: 1
}, 1);

// Layer 3 (Inner) - scales up and fades in, then flies past
techTl.to('.layer-3', {
    scale: 1.5,
    opacity: 1,
    ease: "none",
    duration: 1.5
}, 0);
techTl.to('.layer-3', {
    scale: 4,
    opacity: 0,
    ease: "power2.in",
    duration: 1
}, 1.5);

// Fade out header text during the zoom
techTl.to('.tech-stack-header', {
    opacity: 0,
    y: -50,
    duration: 0.5
}, 1.5);

// Generic Section Scroll Reveal Animation
gsap.utils.toArray('.gs-reveal').forEach(function(elem) {
    gsap.fromTo(elem, 
        { y: 50, opacity: 0 }, 
        {
            y: 0, 
            opacity: 1, 
            duration: 1, 
            ease: "power3.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%", // Triggers when the top of the element hits 85% from the top of the viewport
                toggleActions: "play none none reverse" // Reverses when scrolling back up
            }
        }
    );
});

// Typing Effect for Hero Subtitle
const typingTextElement = document.querySelector('.typing-text');
const wordsToType = ['frontend designer', 'AI/ML Enthusiast', '3D UI/UX Designer'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
    if (!typingTextElement) return;
    
    const currentWord = wordsToType[wordIndex];
    
    if (isDeleting) {
        // Remove a character
        typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Deleting speed
    } else {
        // Add a character
        typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100; // Typing speed
    }

    // Change color based on word to match original design
    if (wordIndex === 0) typingTextElement.className = 'highlight-blue typing-text';
    else if (wordIndex === 1) typingTextElement.className = 'highlight-purple typing-text';
    else typingTextElement.className = 'highlight-blue typing-text';

    // If word is complete
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % wordsToType.length; // Move to next word
        typeSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect
setTimeout(typeEffect, 1000);

// Modal Logic
const modal = document.getElementById("shingaku-modal");
const btn = document.getElementById("open-shingaku-modal");
const span = document.getElementsByClassName("close-modal")[0];

if (btn && modal && span) {
    btn.onclick = function(e) {
        e.preventDefault();
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

animate();
