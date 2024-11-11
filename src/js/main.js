function checkSize() {
    if (window.innerWidth <= 670) {
        updateSize('min');
    } else if (window.innerWidth <= 996) {
        updateSize('mob');
    } else if (window.innerWidth <= 1320) {
        updateSize('tab');
    } else {
        updateSize('max');
    }
}  

function updateSize(pos) {
    if (set.innerWidth === pos) return;
    set.innerWidth = pos;
}

const set = {
    innerWidth: false,
    min: [2, -1, -1, 4, 3, -1], 
    mob: [1, 2, 4, 5, 3, -1], 
    tab: [1, 2, 4, 5, 3, -1], 
    max: [1, 2, 3, 4, 5, -1],
    burger: [-1, -1, -1, -1, -1, 1]
}

document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('.offer .swiper')) {
        const catalogSwiper = new Swiper('.offer .swiper', {
            slidesPerGroup: 3,
            slidesPerView: 2,
            spaceBetween: 32,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                renderBullet: function(index, className) {
                    return '<button class="page__item ' + className + '" aria-label="Слайд ' + (index + 1) + '">' + (index + 1) + '</button>';
                },
            },
            grid: {
                rows: 3,
            },
            breakpoints: {
                0: {
                    slidesPerView: 2,
                    spaceBetween: 16,
                },
                670: {
                    slidesPerView: 2,
                    spaceBetween: 32,
                },
                996: {
                    slidesPerView: 3,
                    spaceBetween: 32,
                }
            },
        });
    }

    const burgerMenu = document.querySelector('.burger');

    document.querySelector('[data-burger-open]').addEventListener('click', () => {
        updateSize('burger');
        burgerMenu.classList.remove('hidden');
    });
    
    burgerMenu.querySelector('[data-burger-close]').addEventListener('click', () => {
        checkSize();
        burgerMenu.classList.add('hidden');
    });

    document.addEventListener('keydown', e => {
        const key = e.key;
        if (key === "Escape") {
            checkSize();
            burgerMenu.classList.add('hidden');
        }
    }); 

    checkSize();
    window.addEventListener('resize', checkSize);

});

