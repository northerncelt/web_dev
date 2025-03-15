// The scrollBy() method is used to scroll the content by a specified number of pixels. The behavior option is set to 'smooth' to enable smooth scrolling. The scrollLeft() function scrolls the content to the left, while the scrollRight() function scrolls the content to the right. The value of the left property in the scrollBy() method determines the amount of scrolling that occurs. You can adjust this value as needed to control the scrolling speed.
function scrollLeft() {
    const container = document.querySelector('.scrollable-content');
    container.scrollBy({
        left: -200, // Adjust the value as needed
        behavior: 'smooth'
    });
}

function scrollRight() {
    const container = document.querySelector('.scrollable-content');
    container.scrollBy({
        left: 200, // Adjust the value as needed
        behavior: 'smooth'
    });
}