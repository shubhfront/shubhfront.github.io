document.addEventListener('DOMContentLoaded', () => {
    // 1. Typing Effect in Hero Section
    const typedOutput = document.getElementById('typed-output');
    const skills = ["Python", "Web Development", "C/C++", "Data Structures", "Full-Stack"];
    let skillIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenSkills = 1500;

    function type() {
        const currentSkill = skills[skillIndex];

        if (isDeleting) {
            // Deleting text
            typedOutput.textContent = currentSkill.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Typing text
            typedOutput.textContent = currentSkill.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentSkill.length) {
            // Pause at the end of the word
            speed = delayBetweenSkills;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to the next word
            isDeleting = false;
            skillIndex = (skillIndex + 1) % skills.length;
        }

        setTimeout(type, speed);
    }

    // Start the typing effect
    type();
    
    // 2. Set Current Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
});
