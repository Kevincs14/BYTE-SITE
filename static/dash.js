document.addEventListener("DOMContentLoaded", () => {
    let slider = document.querySelector('.slider');
    let list = document.querySelector('.list');
    let prev = document.querySelector('.prev');
    let next = document.querySelector('.next');
    let items = document.querySelectorAll('.list .item');
    let count = items.length;
    let active = 1;
    let width_item = items[0].offsetWidth;
    let SeeMore = document.querySelector('.seeButt');

    console.log(SeeMore); // Check if the button is found

    next.onclick = () => {
        active = active >= count - 1 ? count - 1 : active + 1;
        runCarousel();
    };

    prev.onclick = () => {
        active = active <= 0 ? active : active - 1;
        runCarousel();
    };

    function runCarousel() {
        prev.style.display = (active === 0) ? 'none' : 'block';
        next.style.display = (active === count - 1) ? 'none' : 'block';

        let old_active = document.querySelector('.item.active');
        if (old_active) old_active.classList.remove('active');
        items[active].classList.add('active');

        let leftTransform = width_item * (active - 1) * -1;
        list.style.transform = `translateX(${leftTransform}px)`;
    }

    runCarousel();

    if (SeeMore) { // Only set onclick if the button exists
        SeeMore.onclick = () => {
            console.log("Button clicked!"); // Debugging log
            window.location.href = '/recipes'; // Use the Flask route
        };
    } else {
        console.error("See more button not found!");
    }
});

function logout() {
    console.log("Logout function called"); // Debugging line
    window.location.href = '/logout';  // Redirect to the logout route
}

function redirectToLogin() {
    window.location.href = '/';  // Adjust as needed for your login page
}