//  Ensure DOM has fully load --> Ensure document.getElementById can find all element
document.addEventListener('DOMContentLoaded', () => {

    ///////////////////A AND Y BUTTON///////////////////////////////////
    //Get screen content element --> Find element in shell.js (ensure all button element can use)
    const screenContent = document.getElementById('screenContent');

    if (!screenContent) {
        console.error('CAN\'T FIND Element(screenContent)');
        return;
    }
    console.log('Element on screenContent found');

    //  Scroll configuration --> Ensure scroll distance per click
    const clickScrollAmount = 300;

    //  Scroll function
    function clickScroll(direction) {
        if (direction === 'down') {
            screenContent.scrollBy({ top: clickScrollAmount, behavior: 'smooth' });
            console.log(`Scroll down by ${clickScrollAmount}px`);//once press, it will show in console
        } else if (direction === 'up') {
            screenContent.scrollBy({ top: -clickScrollAmount, behavior: 'smooth' });
            console.log(`Scroll up by ${clickScrollAmount}px`);
        }

        setTimeout(() => {
            document.dispatchEvent(new Event('scrollReveal'));
        }, 500);
    }

    // Key handling --> from keyboard listner
    function handleKeyPress(key) {
        let button = null;
        if (key === 'y' || key === 'up') {
            button = document.querySelector('.btn-y');
        }
        else if (key === 'a' || key === 'down') {
            button = document.querySelector('.btn-a');
        }

        if (button) {
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 150);
        }

        switch (key) {
            case 'a':
            case 'down':
                clickScroll('down');
                break;
            case 'y':
            case 'up':
                clickScroll('up');
                break;
            default:
                break;
        }
    }

    //  Keyboard event listener --> Monitor keyboard action and pass to key handle
    document.addEventListener('keydown', (e) => {
        //prevent from if enter "a" or "y" in a text box
        const tag = e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
            return;
        }
        const keyMap = {
            'a': 'a',
            'A': 'a',
            'y': 'y',
            'Y': 'y',
            'ArrowUp': 'up',
            'ArrowDown': 'down'
        };
        const key = keyMap[e.key];
        if (key) {
            e.preventDefault();
            handleKeyPress(key);
        }
    });

    //   Button click listener
    const btnY = document.querySelector('.btn-y');
    const btnA = document.querySelector('.btn-a');

    function setupButton(button, key) {
        if (!button) return;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleKeyPress(key);
        });

        //console frrdback
        console.log(`${key.toUpperCase()} button has prepared`)
    }

    //SETUP+MSG AFTER FULLY LOAD
    setupButton(btnY, 'y');
    setupButton(btnA, 'a');
    console.log('E-SPORT CLUB FULLY LOADED');
    console.log('ALL BUTTON AND KEYBOARD LISTENER FOR SCROLL READY');

    ///////////////////////TOP BUTTON/////////////////////////
    //  Return Top
    function scrollToTop() {
        const screenContent = document.getElementById('screenContent');
        if (!screenContent) return;

        screenContent.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('Top button has pressed');//once press, it will show in console
    }


    //  Prepare  the button
    const btnTop = document.getElementById('btnTop');
    if (btnTop) {
        btnTop.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToTop();

            // press feedback
            btnTop.classList.add('active');
            setTimeout(() => btnTop.classList.remove('active'), 150);
        });
        console.log('Top button ready');
    }

});

