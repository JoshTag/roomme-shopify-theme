window.onload = function () {
  let categoryCount = document.querySelectorAll(".product-category");
  document.getElementById("category-max").innerHTML = categoryCount.length;

  // Package product page form
  const itemSelector = document.querySelectorAll(".catalog-item-selector");

  // Category list
  let flktyProductCat = new Flickity(".product-package__category-list", {
    freeScroll: true,
    contain: true,
    pageDots: false,
    prevNextButtons: false,
  });

  // Order list
  var flkty = new Flickity(".product-package__order-carousel", {
    freeScroll: true,
    contain: true,
    pageDots: false,
    cellAlign: "left",
  });

  // Item selector
  let updateOrderList = function () {
    let orderList = document.querySelectorAll(".product-category__item.active");
    let ordersArr = Array.from(orderList).map((item) => ({
      category: item.getAttribute("data-select-category"),
      code: item.getAttribute("data-select-code"),
      image: item.getAttribute("data-select-image"),
      limit: item.getAttribute("data-select-limit"),
    }));

    console.log(ordersArr);
  };

  // Update order summary bottom bar

  let furnitureCategory = document.querySelectorAll(
    "[data-furniture-category]"
  );
  furnitureCategory.forEach((category) => {
    let furnitureItem = category.querySelectorAll(".product-category__item");
    let categoryLimit = category.getAttribute("data-furniture-limit");

    if (categoryLimit > 1) {
      furnitureItem.forEach((furniture) => {
        furniture.addEventListener("click", function (event) {
          // console.log(event.target.querySelectorAll('.product-category__quantity-selector'));
          let furnitureSelected = category.querySelectorAll(
            ".product-category__item.active"
          );
          let currentlySelectedCount = Array.from(furnitureSelected)
            .map((selected) =>
              selected
                .querySelector(".product-category__quantity")
                .getAttribute("data-value")
            )
            .reduce((sum, value) => Number(sum) + Number(value), 0);

          if (furniture.classList.contains("active")) {
            furniture.classList.remove("active");
            event.target
              .querySelector(".product-category__quantity-selector")
              .classList.remove("active");
            event.target
              .querySelector("[data-value]")
              .setAttribute("data-value", "1");
            event.target.querySelector("[data-value]").innerHTML = 1;
          } else {
            if (
              furnitureSelected.length < categoryLimit &&
              currentlySelectedCount < categoryLimit
            ) {
              furniture.classList.add("active");
              event.target
                .querySelector(".product-category__quantity-selector")
                .classList.add("active");
            }
          }
          updateOrderList();
        });
      });
    } else {
      furnitureItem.forEach((furniture) => {
        furniture.addEventListener("click", function () {
          let selectActive = new Promise((res, rej) => {
            furnitureItem.forEach((item, i, arr) => {
              item.classList.remove("active");
              if (i === arr.length - 1) res();
            });
          });
          selectActive.then(() => {
            furniture.classList.add("active");
            updateOrderList();
          });
        });
      });
    }
  });

  let quantitySelector = document.querySelectorAll(
    ".product-category__quantity-selector"
  );
  quantitySelector.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    let addQuantity = item.querySelector(
      ".product-category__quantity-selector--add"
    );
    let subtractQuantity = item.querySelector(
      ".product-category__quantity-selector--subtract"
    );
    let quantity = item.querySelector(".product-category__quantity");
    let limit = item.getAttribute("data-max-value");

    addQuantity.addEventListener("click", function (event) {
      event.stopPropagation();
      let btnCategory = event.target.getAttribute("data-category-add");
      let parentElem = document.querySelector(
        `[data-furniture-category=${btnCategory}]`
      );
      let furnitureSelected = parentElem.querySelectorAll(
        ".product-category__item.active"
      );
      let currentlySelectedCount = Array.from(furnitureSelected)
        .map((selected) =>
          selected
            .querySelector(".product-category__quantity")
            .getAttribute("data-value")
        )
        .reduce((sum, value) => Number(sum) + Number(value), 0);
      console.log(currentlySelectedCount);

      console.log("up");
      if (
        quantity.getAttribute("data-value") < limit &&
        currentlySelectedCount < limit
      ) {
        quantity.dataset.value =
          Number(quantity.getAttribute("data-value")) + 1;
        quantity.innerHTML = Number(quantity.getAttribute("data-value"));
      }
    });
    subtractQuantity.addEventListener("click", function (event) {
      event.stopPropagation();
      console.log("down");
      if (quantity.getAttribute("data-value") != 1) {
        quantity.dataset.value =
          Number(quantity.getAttribute("data-value")) - 1;
        quantity.innerHTML = Number(quantity.getAttribute("data-value"));
      }
    });
  });

  // Category Filter
  let filterBtn = document.querySelectorAll(".product-package__btn");
  filterBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      let removeActive = new Promise((res, rej) => {
        filterBtn.forEach((item, i, arr) => {
          item.classList.remove("active");
          if (i === arr.length - 1) res();
        });
      });

      removeActive.then(() => {
        btn.classList.add("active");
        let selectedCategory = btn.getAttribute("data-catalog-filter");
        let allCatagories = document.querySelectorAll(
          "[data-catalog-category]"
        );
        allCatagories.forEach((cat) => {
          cat.getAttribute("data-catalog-category") === selectedCategory
            ? (cat.style.display = "block")
            : (cat.style.display = "none");
        });
      });
    });
  });
};
