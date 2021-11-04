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

    // console.log(ordersArr);
  };

  let furnitureCategory = document.querySelectorAll(
    "[data-furniture-category]"
  );
  furnitureCategory.forEach((category) => {
    let furnitureItem = category.querySelectorAll(".product-category__item");
    let categoryLimit = category.getAttribute("data-furniture-limit");
    
    if (categoryLimit > 1) {
      furnitureItem.forEach((furniture) => {
        furniture.addEventListener("click", function (event) {
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

            // Order summary update
            let parentElem = category.querySelectorAll('.product-category__item.active');
            let selectedFurniture = Array.from(parentElem).map(selected => ({
              category: selected.getAttribute('data-select-category'),
              image: selected.getAttribute('data-select-image'),
              quantity: selected.querySelector('[data-value]').getAttribute('data-value')
            }))
            let currentCategory = category.getAttribute('data-furniture-category');
            let orderImages = [];
            selectedFurniture.forEach(item => {
              [...Array(Number(item.quantity))].forEach(() => orderImages.push(item.image));
            })
            let orderSummaryBoxes = document.querySelectorAll(`[data-order-summary-category="${currentCategory}"]`);
            orderSummaryBoxes.forEach((item, index) => {
              let orderImage = item.querySelector('.item-image');
              if (orderImages[index]) {
                orderImage.style.backgroundImage = `url(${orderImages[index]})`
              } else {
                orderImage.style.backgroundImage = 'unset'
              }
            })

          } else {
            if (
              furnitureSelected.length < categoryLimit &&
              currentlySelectedCount < categoryLimit
            ) {
              furniture.classList.add("active");
              event.target
                .querySelector(".product-category__quantity-selector")
                .classList.add("active");

              // Order summary update
              let parentElem = category.querySelectorAll('.product-category__item.active');
              let selectedFurniture = Array.from(parentElem).map(selected => ({
                category: selected.getAttribute('data-select-category'),
                image: selected.getAttribute('data-select-image'),
                quantity: selected.querySelector('[data-value]').getAttribute('data-value')
              }))
              let currentCategory = category.getAttribute('data-furniture-category');
              let orderImages = [];
              selectedFurniture.forEach(item => {
                [...Array(Number(item.quantity))].forEach(() => orderImages.push(item.image));
              })
              let orderSummaryBoxes = document.querySelectorAll(`[data-order-summary-category="${currentCategory}"]`);
              orderSummaryBoxes.forEach((item, index) => {
                if (orderImages[index]) {
                  let orderImage = item.querySelector('.item-image');
                  orderImage.style.backgroundImage = `url(${orderImages[index]})`
                }
              })

              }
            }
          updateOrderList();
        });
      });
    } else {
      furnitureItem.forEach((furniture) => {
        furniture.addEventListener("click", function (event) {
          let selectActive = new Promise((res, rej) => {
            furnitureItem.forEach((item, i, arr) => {
              item.classList.remove("active");
              if (i === arr.length - 1) res();
            });
          });
          selectActive.then(() => {
            furniture.classList.add("active");
            // Select furniture to image
            let currentImage = event.target.getAttribute('data-select-image');
            let currentCategory = event.target.getAttribute('data-select-category');
            let orderSummaryParent = document.querySelector(`[data-order-summary-category="${currentCategory}"]`);
            let orderBackground = orderSummaryParent.querySelector('.item-image');
            orderBackground.style.backgroundImage = `url(${currentImage})`
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
      if (
        quantity.getAttribute("data-value") < limit &&
        currentlySelectedCount < limit
      ) {
        quantity.dataset.value =
          Number(quantity.getAttribute("data-value")) + 1;
        quantity.innerHTML = Number(quantity.getAttribute("data-value"));

        // Order summary update
        let selectedFurniture = Array.from(furnitureSelected).map(selected => ({
          category: selected.getAttribute('data-select-category'),
          image: selected.getAttribute('data-select-image'),
          quantity: selected.querySelector('[data-value]').getAttribute('data-value')
        }))

        let orderImages = []
        selectedFurniture.forEach(item => {
          [...Array(Number(item.quantity))].forEach(() => orderImages.push(item.image));
        })

        let orderSummaryBoxes = document.querySelectorAll(`[data-order-summary-category="${btnCategory}"]`);
        orderSummaryBoxes.forEach((item, index) => {
          if (orderImages[index]) {
            let orderImage = item.querySelector('.item-image');
            orderImage.style.backgroundImage = `url(${orderImages[index]})`
          }
        })
      }
    });

    subtractQuantity.addEventListener("click", function (event) {
      event.stopPropagation();
      if (quantity.getAttribute("data-value") != 1) {
        quantity.dataset.value =
          Number(quantity.getAttribute("data-value")) - 1;
        quantity.innerHTML = Number(quantity.getAttribute("data-value"));

        // Order summary update
        let btnCategory = event.target.getAttribute("data-category-subtract");
        let parentElem = document.querySelector(
          `[data-furniture-category=${btnCategory}]`
        );
        let furnitureSelected = parentElem.querySelectorAll(
          ".product-category__item.active"
        );
        let selectedFurniture = Array.from(furnitureSelected).map(selected => ({
          category: selected.getAttribute('data-select-category'),
          image: selected.getAttribute('data-select-image'),
          quantity: selected.querySelector('[data-value]').getAttribute('data-value')
        }))

        let orderImages = []
        selectedFurniture.forEach(item => {
          [...Array(Number(item.quantity))].forEach(() => orderImages.push(item.image));
        })

        let orderSummaryBoxes = document.querySelectorAll(`[data-order-summary-category="${btnCategory}"]`);
        orderSummaryBoxes.forEach((item, index) => {
          let orderImage = item.querySelector('.item-image');
          if (orderImages[index]) {
            orderImage.style.backgroundImage = `url(${orderImages[index]})`
          } else {
            orderImage.style.backgroundImage = 'unset'
          }
        })
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
