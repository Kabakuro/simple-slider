const slider = document.querySelector('.slider-container');
const slides = Array.from(document.querySelectorAll('.slide'));

let isDragging = false;
let startPosition = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationId = 0;
let currentIndex = 0;

slides.forEach((slide, index) => {
    const slideImg = slide.querySelector('img');
    slideImg.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    // Touch events
    slide.addEventListener('touchstart', touchStart(index));
    slide.addEventListener('touchend', touchEnd);
    slide.addEventListener('touchmove', touchMove);

    // Mouse events
    slide.addEventListener('mousedown', touchStart(index));
    slide.addEventListener('mouseup', touchEnd);
    slide.addEventListener('mouseleave', touchEnd);
    slide.addEventListener('mousemove', touchMove); 
})

// Key 
window.addEventListener('keydown', (e) => {

    if(e.code == 'ArrowRight' && currentIndex < slides.length -1) {
        currentIndex ++;
    } 

    if(e.code == 'ArrowLeft' && currentIndex > 0) {
        currentIndex --;
    }
   

    
    setPositionByIndex();
});

// Prevent default behaviour mobile
window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
}


function touchStart(index) {
    return function(event) {
        currentIndex = index;
        startPosition = getPositionX(event);
        isDragging = true;

        animationId = requestAnimationFrame(animation)
        slider.classList.add('grabbing');
    }
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationId);

    const movedBy = currentTranslate - prevTranslate;

    if(movedBy < -100 && currentIndex < slides.length -1) {
        currentIndex += 1;
    }

    if(movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
    }

    setPositionByIndex();

    slider.classList.remove('grabbing');
}

function touchMove(event) {
    if(isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPosition;
    } 
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    setSliderPosition();
    if (isDragging) {
        requestAnimationFrame(animation)
    }
}

function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)`;
}

function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
}