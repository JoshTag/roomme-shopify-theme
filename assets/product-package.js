window.onload = function () {
  // Total furniture
  let dataLimits = document.querySelectorAll("[data-furniture-limit]");
  let totalFurnitureNeeded = Array.from(dataLimits)
    .map((item) => item.getAttribute("data-furniture-limit"))
    .reduce((sum, value) => Number(sum) + Number(value), 0);
  document.getElementById("category-max").innerHTML = totalFurnitureNeeded;

  // Category list
  let flktyProductCat = new Flickity(".product-package__category-list", {
    freeScroll: true,
    contain: true,
    pageDots: false,
    prevNextButtons: false,
    watchCSS: true,
  });

  // Order list
  var flkty = new Flickity(".product-package__order-carousel", {
    freeScroll: true,
    contain: true,
    pageDots: false,
    cellAlign: "left",
  });

  // Updates order list
  let inputContainer = document.getElementById(
    "product-inputs--visually-hidden"
  );
  let updateOrderList = function () {
    let orderList = document.querySelectorAll(".product-category__item.active");
    let ordersArr = Array.from(orderList).map((item) => ({
      category: item.getAttribute("data-select-category"),
      code: item.getAttribute("data-select-code"),
      image: item.getAttribute("data-select-image"),
      quantity: item.querySelector("[data-value]").getAttribute("data-value"),
    }));

    ordersArr.forEach((order) => {
      // let count = order.quantity > 1 ? ` x ${order.quantity}` : "";
      let newInput = document.createElement("input");
      inputContainer.appendChild(newInput);
      newInput.setAttribute(
        "name",
        `properties[${order.category} - ${order.code}]`
      );
      newInput.type = "text";
      newInput.value = `${order.quantity}`;
    });

    let itemImagesReview = document.querySelector(".order-modal__items-ctn");
    itemImagesReview.innerHTML = "";
    let itemImage = document.querySelectorAll(".item-image");
    itemImage.forEach((item) => {
      let imageBlock = document.createElement("div");
      itemImagesReview.appendChild(imageBlock);
      imageBlock.style.backgroundImage = item.style.backgroundImage;
      imageBlock.classList.add("order-modal__item-image");
    });
  };

  // Updates furniture counter
  let updateCounter = function () {
    let currentCount = document.querySelectorAll(
      '[data-category-filled="true"]'
    );
    document.getElementById("order-count").innerHTML = currentCount.length;

    if (currentCount.length === totalFurnitureNeeded) {
      document.querySelector(
        ".product-package__add-to-cart-btn"
      ).disabled = false;
    } else if (currentCount.length < totalFurnitureNeeded) {
      document.querySelector(
        ".product-package__add-to-cart-btn"
      ).disabled = true;
    }
  };

  // Order Review Modal
  let orderReviewBtn = document.querySelector(
    ".product-package__add-to-cart-btn"
  );
  let orderReviewModalBG = document.getElementById("order-modal__background");
  let orderReviewModal = document.getElementById("order-modal__modal");

  orderReviewBtn.addEventListener("click", function () {
    document.body.style.overflow = "hidden";
    orderReviewModalBG.classList.add("active");
    updateOrderList();
  });

  orderReviewModalBG.addEventListener("click", function () {
    document.body.style.overflow = "unset";
    orderReviewModalBG.classList.remove("active");
  });

  orderReviewModal.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document
    .getElementById("order-modal__close")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.body.style.overflow = "unset";
      orderReviewModalBG.classList.remove("active");
    });

  // Select furniture
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
            let currentTarget = event.target;
            if (event.target == this) {
              event.target
                .querySelector(".product-category__quantity-selector")
                .classList.add("active");
            } else if (
              event.target.classList.contains("product-category__checkmark")
            ) {
              currentTarget = event.target.parentElement;
            }
            currentTarget
              .querySelector(".product-category__quantity-selector")
              .classList.remove("active");
            currentTarget
              .querySelector("[data-value]")
              .setAttribute("data-value", "1");
            currentTarget.querySelector("[data-value]").innerHTML = 1;

            // Order summary update
            let parentElem = category.querySelectorAll(
              ".product-category__item.active"
            );
            let selectedFurniture = Array.from(parentElem).map((selected) => ({
              category: selected.getAttribute("data-select-category"),
              image: selected.getAttribute("data-select-image"),
              quantity: selected
                .querySelector("[data-value]")
                .getAttribute("data-value"),
            }));
            let currentCategory = category.getAttribute(
              "data-furniture-category"
            );
            let orderImages = [];
            selectedFurniture.forEach((item) => {
              [...Array(Number(item.quantity))].forEach(() =>
                orderImages.push(item.image)
              );
            });
            let orderSummaryBoxes = document.querySelectorAll(
              `[data-order-summary-category="${currentCategory}"]`
            );
            orderSummaryBoxes.forEach((item, index) => {
              let orderImage = item.querySelector(".item-image");
              if (orderImages[index]) {
                orderImage.style.backgroundImage = `url(${orderImages[index]})`;
                item.setAttribute("data-category-filled", true);
              } else {
                orderImage.style.backgroundImage = "unset";
                item.setAttribute("data-category-filled", false);
              }
            });
            updateCounter();
          } else {
            if (
              furnitureSelected.length < categoryLimit &&
              currentlySelectedCount < categoryLimit
            ) {
              furniture.classList.add("active");
              if (event.target == this) {
                event.target
                  .querySelector(".product-category__quantity-selector")
                  .classList.add("active");
              } else if (
                event.target.classList.contains("product-category__checkmark")
              ) {
                event.target.parentElement
                  .querySelector(".product-category__quantity-selector")
                  .classList.add("active");
              }

              // Order summary update
              let parentElem = category.querySelectorAll(
                ".product-category__item.active"
              );
              let selectedFurniture = Array.from(parentElem).map(
                (selected) => ({
                  category: selected.getAttribute("data-select-category"),
                  image: selected.getAttribute("data-select-image"),
                  quantity: selected
                    .querySelector("[data-value]")
                    .getAttribute("data-value"),
                })
              );
              let currentCategory = category.getAttribute(
                "data-furniture-category"
              );
              let orderImages = [];
              selectedFurniture.forEach((item) => {
                [...Array(Number(item.quantity))].forEach(() =>
                  orderImages.push(item.image)
                );
              });
              let orderSummaryBoxes = document.querySelectorAll(
                `[data-order-summary-category="${currentCategory}"]`
              );
              orderSummaryBoxes.forEach((item, index) => {
                if (orderImages[index]) {
                  let orderImage = item.querySelector(".item-image");
                  orderImage.style.backgroundImage = `url(${orderImages[index]})`;
                  item.setAttribute("data-category-filled", true);
                }
              });
              updateCounter();
            }
          }
        });
      });
    } else {
      furnitureItem.forEach((furniture) => {
        furniture.addEventListener("click", function (event) {
          let selectActive = new Promise((res) => {
            furnitureItem.forEach((item, i, arr) => {
              item.classList.remove("active");
              if (i === arr.length - 1) res();
            });
          });
          selectActive.then(() => {
            furniture.classList.add("active");
            // Select furniture to image
            let currentImage = event.target.getAttribute("data-select-image");
            let currentCategory = event.target.getAttribute(
              "data-select-category"
            );
            let orderSummaryParent = document.querySelector(
              `[data-order-summary-category="${currentCategory}"]`
            );
            let orderBackground =
              orderSummaryParent.querySelector(".item-image");
            orderBackground.style.backgroundImage = `url(${currentImage})`;
            orderSummaryParent.setAttribute("data-category-filled", true);

            updateCounter();
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
        let selectedFurniture = Array.from(furnitureSelected).map(
          (selected) => ({
            category: selected.getAttribute("data-select-category"),
            image: selected.getAttribute("data-select-image"),
            quantity: selected
              .querySelector("[data-value]")
              .getAttribute("data-value"),
          })
        );

        let orderImages = [];
        selectedFurniture.forEach((item) => {
          [...Array(Number(item.quantity))].forEach(() =>
            orderImages.push(item.image)
          );
        });

        let orderSummaryBoxes = document.querySelectorAll(
          `[data-order-summary-category="${btnCategory}"]`
        );
        orderSummaryBoxes.forEach((item, index) => {
          if (orderImages[index]) {
            let orderImage = item.querySelector(".item-image");
            orderImage.style.backgroundImage = `url(${orderImages[index]})`;
            item.setAttribute("data-category-filled", true);
          }
        });
        updateCounter();
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
        let selectedFurniture = Array.from(furnitureSelected).map(
          (selected) => ({
            category: selected.getAttribute("data-select-category"),
            image: selected.getAttribute("data-select-image"),
            quantity: selected
              .querySelector("[data-value]")
              .getAttribute("data-value"),
          })
        );

        let orderImages = [];
        selectedFurniture.forEach((item) => {
          [...Array(Number(item.quantity))].forEach(() =>
            orderImages.push(item.image)
          );
        });

        let orderSummaryBoxes = document.querySelectorAll(
          `[data-order-summary-category="${btnCategory}"]`
        );
        orderSummaryBoxes.forEach((item, index) => {
          let orderImage = item.querySelector(".item-image");
          if (orderImages[index]) {
            orderImage.style.backgroundImage = `url(${orderImages[index]})`;
          } else {
            orderImage.style.backgroundImage = "unset";
            item.setAttribute("data-category-filled", false);
          }
        });
        updateCounter();
      }
    });
  });

  // Category Filter
  let filterBtn = document.querySelectorAll(".product-package__btn");
  filterBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      let removeActive = new Promise((res) => {
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

  // orders expand
  let expandBtn = document.querySelector(".product-package__order-expand");
  let orderSummaryBar = document.querySelector(
    ".product-package__order-preview"
  );
  expandBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let translateHeight = document.querySelector(
      ".product-package__carousel-ctn"
    ).offsetHeight;

    if (orderSummaryBar.classList.contains("hide")) {
      orderSummaryBar.style.transform = `translateY(0px)`;
      orderSummaryBar.classList.remove("hide");
    } else {
      orderSummaryBar.style.transform = `translateY(${translateHeight + 1}px)`;
      orderSummaryBar.classList.add("hide");
    }
  });

  // furniture info popup
  let infoButtons = document.querySelectorAll(
    ".product-category__info.info-btn--mobile"
  );
  infoButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      let popupCode = e.target.parentElement.getAttribute(
        "data-popup-btn-code"
      );
      let popupBox = document.querySelector(`[data-popup-code=${popupCode}]`);
      popupBox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });
  let infoButtonsDesktop = document.querySelectorAll(
    ".product-category__info.info-btn--desktop"
  );
  infoButtonsDesktop.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });
  let popUp = document.querySelectorAll(".product-category__info-popup");
  popUp.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });

  let closeBtn = document.querySelectorAll("#product-category__info-close");
  closeBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.target.parentElement.classList.remove("active");
      document.body.style.overflow = "unset";
    });
  });

  // Furniture enlarge
  document.querySelectorAll(".magnify-wrapper.zoom").forEach(zoom => {
    zoom.addEventListener("mousemove",function (e) {
        let original = zoom.querySelector(".main-img"),
          magnified = zoom.querySelector(".large-img"),
          style = magnified.style,
          x = e.pageX - this.offsetLeft,
          y = e.pageY - this.offsetTop,
          imgWidth = original.width,
          imgHeight = original.height,
          xperc = (x / imgWidth) * 100,
          yperc = (y / imgHeight) * 100;
        // Add some margin for right edge
        if (x > 0.01 * imgWidth) {
          xperc += 0.15 * xperc;
        }
        // Add some margin for bottom edge
        if (y >= 0.01 * imgHeight) {
          yperc += 0.15 * yperc;
        }
        // Set the background of the magnified image horizontal
        style.backgroundPositionX = xperc - 8 + "%";
        // Set the background of the magnified image vertical
        style.backgroundPositionY = yperc - 8 + "%";
        // Move the magnifying glass with the mouse movement.
        style.left = x - 100 + "px";
        style.top = y - 100 + "px";
      },
      false
    );
  })

  let enlargeBtn = document.querySelectorAll('.product-category__enlarge-btn');
  enlargeBtn.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.target.nextElementSibling.classList.add('active');
      document.body.style.overflow = "hidden";
    });
  });

  let closeEnlarge = document.querySelectorAll('.product-category__enlarge-close');
  closeEnlarge.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      e.target.parentElement.classList.remove('active');
      document.body.style.overflow = "unset";
    });
  });

  let enlargePopup = document.querySelectorAll('.product-category__enlarge');
  enlargePopup.forEach(popup => {
    popup.addEventListener('click', function(e) {
      e.stopPropagation();
    })
  })

  // Repopulate data when coming back from cart page
  fetch('/cart.js')
    .then(response => response.json())
    .then(data => {
      if (data.items.length >= 1 ) {
        Object.entries(data.items[0].properties).forEach(([key, value]) => {
          let itemCode = key.split('- ')[1];

          if (value == 1) {
            document.querySelector(`[data-select-code=${itemCode}]`).click();
          } else {
            let itemSelect = document.querySelector(`[data-select-code=${itemCode}]`);
            itemSelect.click();
            for ( i = 0 ; i < value - 1 ; i++ ) {
              itemSelect.querySelector('.product-category__quantity-selector--add').click();
            }
          }
        })
      }
    });

    // only allows 1 item per checkout
    let packageSubmit = document.querySelector('.order-modal__checkout-btn');
    packageSubmit.addEventListener('click', function(e) {
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: '/cart/clear.js',
        data: '',
        dataType: 'json',
        success: function() {
          $.ajax({
            type: 'POST',
            url: '/cart/add.js',
            dataType: 'json',
            data: $('.product-package__form').serialize(),
            success: function() {
              window.location.href = `${window.location.origin}/cart`;
            }
         });
        }
      })
      return false;
    })
};
