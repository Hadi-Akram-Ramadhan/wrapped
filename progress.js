document.addEventListener("DOMContentLoaded", function() {
    const progress = document.getElementById("progress");
    progress.style.width = "0%";
    setTimeout(() => {
        progress.style.width = "100%";
    }, 100);
    setTimeout(() => {
        const currentPage = window.location.pathname.split("/").pop();
        if (currentPage === "page1.html") {
            window.location.href = "page2.html";
        } else if (currentPage === "page2.html") {
            window.location.href = "page3.html";
        } else if (currentPage === "page3.html") {
            window.location.href = "index.html";
        }
    }, 3000);
});