document.addEventListener("DOMContentLoaded", function () {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let wishlistContainer = document.getElementById("wishlistContainer");

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<h1>Aucun film ou série dans la wishlist.</h1>";
    } else {
        wishlist.forEach(item => {
            let movieItem = document.createElement("div");
            movieItem.classList.add("movie-item");

            let img = document.createElement("img");
            img.src = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'images/no-image.jpg';
            img.alt = item.title;

            let title = document.createElement("h2");
            title.classList.add("movie-title");
            title.textContent = item.title;

            let removeBtn = document.createElement("button");
            removeBtn.classList.add("remove-button");
            removeBtn.innerHTML = '<img src="public/x.png" alt="Supprimer" />';
            removeBtn.onclick = function () {
                wishlist = wishlist.filter(wishlistItem => wishlistItem.id !== item.id);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                movieItem.remove();
            };

            movieItem.appendChild(img);
            movieItem.appendChild(removeBtn);
            movieItem.appendChild(title);
            wishlistContainer.appendChild(movieItem);
        });
    }
});
