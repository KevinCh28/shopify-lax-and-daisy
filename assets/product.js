if (!customElements.get('variant-selects')) {

  /**
   *  @class
   *  @function VariantSelects
   */
  class VariantSelects extends HTMLElement {
    constructor() {
      super();
      this.isDisabledFeature = this.dataset.isDisabled;
      this.addEventListener('change', this.onVariantChange);
    }

    connectedCallback() {
      this.updateOptions();
      this.redirectToVariant();// Calls the custom function
      this.updateMasterId();
      this.setDisabled();
    }

    // CUSTOM FUNCTIONS START //
    // Handles redirect for backpack and blanket variations
    redirectToVariant() {
      const colorInputs = document.querySelectorAll('input[type="radio"][name^="Color"]');
      let productType = '';
      const backpackUrl = {
        "Desert Daze": 'https://www.laxanddaisy.com/products/the-perfect-picnic-companion-in-desert-daze?variant=44903990886683',
        "Moody Mushies": 'https://www.laxanddaisy.com/products/the-perfect-picnic-companion-in-moody-mushies?variant=45716562805019',
        "Disco Daisies": 'https://www.laxanddaisy.com/products/the-perfect-picnic-companion-in-disco-daisies?variant=45202440290587',
        "Sunny Snakes": 'https://www.laxanddaisy.com/products/the-perfect-picnic-companion-in-sunny-snakes?variant=45716971192603',
        "Starry Sea": 'https://www.laxanddaisy.com/products/the-perfect-picnic-companion-in-starry-seas?variant=45716708360475'
      }
      const blanketUrl = {
        "Desert Daze": 'https://www.laxanddaisy.com/products/the-anywhere-picnic-blanket-in-desert-daze?variant=45113693864219',
        "Moody Mushies": 'https://www.laxanddaisy.com/products/the-anywhere-picnic-blanket-in-moody-mushies?variant=45717504065819',
        "Disco Daisies": 'https://www.laxanddaisy.com/products/the-anywhere-picnic-blanket-in-disco-daisies?variant=45717330297115',
        "Sunny Snakes": 'https://www.laxanddaisy.com/products/the-anywhere-picnic-blanket-in-sunny-snakes?variant=45717627633947',
        "Starry Sea": 'https://www.laxanddaisy.com/products/the-anywhere-picnic-blanket-in-starry-seas?variant=45717565538587'
      }

      // Extract product type from the URL string
      const urlParams = new URLSearchParams(window.location.search);
      const urlWithoutVariant = window.location.href.split('?')[0]; // Extract URL without query parameters

      const productPathSegments = urlWithoutVariant.split('/');
      if (productPathSegments.length >= 2) {
        productType = productPathSegments[productPathSegments.length - 1]; // Get the last segment of the URL
      }


      colorInputs.forEach((input) => {
        input.addEventListener('click', function () {
          let color = this.value;
          // PICNIC BACKPACK
          if (color !== 'Desert Daze' && productType === 'the-perfect-picnic-companion-in-desert-daze') {
            window.location.href = backpackUrl[color];
          } else if (color !== 'Moody Mushies' && productType === 'the-perfect-picnic-companion-in-moody-mushies') {
            window.location.href = backpackUrl[color];
          } else if (color !== 'Disco Daisies' && productType === 'the-perfect-picnic-companion-in-disco-daisies') {
            window.location.href = backpackUrl[color];
          } else if (color !== 'Sunny Snakes' && productType === 'the-perfect-picnic-companion-in-sunny-snakes') {
            window.location.href = backpackUrl[color];
          } else if (color !== 'Starry Sea' && productType === 'the-perfect-picnic-companion-in-starry-seas') {
            window.location.href = backpackUrl[color];
            // PICNIC BLANKET
          } else if (color !== 'Desert Daze' && productType === 'the-anywhere-picnic-blanket-in-desert-daze') {
            window.location.href = blanketUrl[color];
          } else if (color !== 'Moody Mushies' && productType === 'the-anywhere-picnic-blanket-in-moody-mushies') {
            window.location.href = blanketUrl[color];
          } else if (color !== 'Disco Daisies' && productType === 'the-anywhere-picnic-blanket-in-disco-daisies') {
            window.location.href = blanketUrl[color];
          } else if (color !== 'Sunny Snakes' && productType === 'the-anywhere-picnic-blanket-in-sunny-snakes') {
            window.location.href = blanketUrl[color];
          } else if (color !== 'Starry Sea' && productType === 'the-anywhere-picnic-blanket-in-starry-seas') {
            window.location.href = blanketUrl[color];
          }
        });
      });
    }
    // CUSTOM FUNCTIONS END //

    onVariantChange() {
      this.updateOptions();
      this.updateMasterId();
      this.toggleAddButton(true, '', false);
      this.updatePickupAvailability();
      this.removeErrorMessage();
      this.updateVariantText();
      this.setDisabled();
      if (!this.currentVariant) {
        this.toggleAddButton(true, '', true);
        this.setUnavailable();
      } else {
        this.updateMedia();
        this.updateURL();
        this.updateVariantInput();

        this.renderProductInfo();
        //this.updateShareUrl();
      }
      dispatchCustomEvent('product:variant-change', {
        variant: this.currentVariant,
        sectionId: this.dataset.section
      });
    }

    updateOptions() {
      this.fieldsets = Array.from(this.querySelectorAll('fieldset'));
      this.options = [];
      this.fieldsets.forEach((fieldset, i) => {
        if (fieldset.querySelector('select')) {
          this.options.push(fieldset.querySelector('select').value);
        } else if (fieldset.querySelectorAll('input').length) {
          this.options.push(fieldset.querySelector('input:checked').value);
        }
      });
    }
    updateVariantText() {
      const fieldsets = Array.from(this.querySelectorAll('fieldset'));
      fieldsets.forEach((item, i) => {
        let label = item.querySelector('.form__label__value');
        if (label) {
          label.innerHTML = this.options[i];
        }
      });
    }
    updateMasterId() {
      this.currentVariant = this.getVariantData().find((variant) => {
        return !variant.options.map((option, index) => {
          return this.options[index] === option;
        }).includes(false);
      });
    }

    updateMedia() {
      if (!this.currentVariant) return;
      if (!this.currentVariant.featured_media) return;

      let productSlider = this.closest('.thb-product-detail').querySelector('.product-images'),
        thumbnails = this.closest('.thb-product-detail').querySelector('#Product-Thumbnails');

      if (!productSlider) {
        productSlider = document.getElementById('Product-Quick-Slider');
      }

      this.setActiveMedia(`#Slide-${this.dataset.section}-${this.currentVariant.featured_media.id}`, `#Thumb-${this.dataset.section}-${this.currentVariant.featured_media.id}`, productSlider, thumbnails);
    }
    setActiveMedia(mediaId, thumbId, productSlider, thumbnails) {
      var hide_variants = productSlider.dataset.hideVariants == 'true',
        flkty = Flickity.data(productSlider),
        images = productSlider.querySelectorAll('.product-images__slide');

      if (flkty && hide_variants) {
        [].forEach.call(images, function (el) {
          el.classList.remove('is-selected');
        });
        productSlider.querySelector(mediaId).classList.add('is-selected');
        productSlider.reInit();
        productSlider.selectCell(mediaId);

        if (thumbnails) {
          let activeThumb = thumbnails.querySelector(thumbId);

          thumbnails.prepend(activeThumb);
        }
      } else if (flkty) {
        productSlider.selectCell(mediaId);
      }

    }

    updateURL() {
      if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
      window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateShareUrl() {
      const shareButton = document.getElementById(`Share-${this.dataset.section}`);
      if (!shareButton) return;
      shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
    }

    updateVariantInput() {
      const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
      productForms.forEach((productForm) => {
        const input = productForm.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', {
          bubbles: true
        }));
      });
    }

    updatePickupAvailability() {
      const pickUpAvailability = document.querySelector('.pickup-availability-wrapper');

      if (!pickUpAvailability) return;

      if (this.currentVariant && this.currentVariant.available) {
        pickUpAvailability.fetchAvailability(this.currentVariant.id);
      } else {
        pickUpAvailability.removeAttribute('available');
        pickUpAvailability.innerHTML = '';
      }
    }

    removeErrorMessage() {
      const section = this.closest('section');
      if (!section) return;

      const productForm = section.querySelector('product-form');
      if (productForm) productForm.handleErrorMessage();
    }

    getSectionsToRender() {
      return [`price-${this.dataset.section}`, `inventory-${this.dataset.section}`, `sku-${this.dataset.section}`];
    }

    renderProductInfo() {
      let sections = this.getSectionsToRender();
      fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          sections.forEach((id) => {
            const destination = document.getElementById(id);
            const source = html.getElementById(id);

            if (source && destination) destination.innerHTML = source.innerHTML;

            const price = document.getElementById(id);

            if (price) price.classList.remove('visibility-hidden');
          });
          this.toggleAddButton(!this.currentVariant.available, window.theme.variantStrings.soldOut);
        });
    }

    toggleAddButton(disable = true, text = false, modifyClass = true) {
      const productForm = document.getElementById(`product-form-${this.dataset.section}`);
      if (!productForm) return;
      const addButton = productForm.querySelector('[name="add"]');
      const addButtonText = productForm.querySelector('[name="add"] > span');

      if (!addButton) return;

      if (disable) {
        addButton.setAttribute('disabled', 'disabled');
        if (text) addButtonText.textContent = text;
      } else {
        addButton.removeAttribute('disabled');
        addButton.classList.remove('loading');
        addButtonText.textContent = window.theme.variantStrings.addToCart;
      }

      if (!modifyClass) return;
    }

    setUnavailable() {
      const button = document.getElementById(`product-form-${this.dataset.section}`);
      const addButton = button.querySelector('[name="add"]');
      const addButtonText = button.querySelector('[name="add"] > span');
      const price = document.getElementById(`price-${this.dataset.section}`);
      if (!addButton) return;
      addButtonText.textContent = window.theme.variantStrings.unavailable;
      addButton.classList.add('sold-out');
      if (price) price.classList.add('visibility-hidden');
    }

    setDisabled() {
      if (this.isDisabledFeature != 'true') {
        return;
      }
      const variant_data = this.getVariantData();

      if (variant_data) {
        const selected_options = this.currentVariant.options.map((value, index) => {
          return {
            value,
            index: `option${index + 1}`
          };
        });
        const available_options = this.createAvailableOptionsTree(variant_data, selected_options);

        this.fieldsets.forEach((fieldset, i) => {
          const fieldset_options = Object.values(available_options)[i];

          if (fieldset_options) {
            if (fieldset.querySelector('select')) {
              fieldset_options.forEach((option, option_i) => {
                if (option.isUnavailable) {
                  fieldset.querySelector('option[value=' + JSON.stringify(option.value) + ']').disabled = true;
                } else {
                  fieldset.querySelector('option[value=' + JSON.stringify(option.value) + ']').disabled = false;
                }
              });
            } else if (fieldset.querySelectorAll('input').length) {
              fieldset.querySelectorAll('input').forEach((input, input_i) => {
                input.classList.toggle('is-disabled', fieldset_options[input_i].isUnavailable);
              });
            }
          }
        });

      }
    }
    createAvailableOptionsTree(variant_data, selected_options) {
      // Reduce variant array into option availability tree
      return variant_data.reduce((options, variant) => {

        // Check each option group (e.g. option1, option2, option3) of the variant
        Object.keys(options).forEach(index => {

          if (variant[index] === null) return;

          let entry = options[index].find(option => option.value === variant[index]);

          if (typeof entry === 'undefined') {
            // If option has yet to be added to the options tree, add it
            entry = {
              value: variant[index],
              isUnavailable: true
            };
            options[index].push(entry);
          }

          // Check how many selected option values match a variant
          const countVariantOptionsThatMatchCurrent = selected_options.reduce((count, {
            value,
            index
          }) => {
            return variant[index] === value ? count + 1 : count;
          }, 0);

          // Only enable an option if an available variant matches all but one current selected value
          if (countVariantOptionsThatMatchCurrent >= selected_options.length - 1) {
            entry.isUnavailable = entry.isUnavailable && variant.available ? false : entry.isUnavailable;
          }

          // Make sure if a variant is unavailable, disable currently selected option
          if ((!this.currentVariant || !this.currentVariant.available) && selected_options.find((option) => option.value === entry.value && index === option.index)) {
            entry.isUnavailable = true;
          }

          // First option is always enabled
          if (index === 'option1') {
            entry.isUnavailable = entry.isUnavailable && variant.available ? false : entry.isUnavailable;
          }
        });

        return options;
      }, {
        option1: [],
        option2: [],
        option3: []
      });
    }

    getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
      return this.variantData;
    }
  }
  customElements.define('variant-selects', VariantSelects);

  /**
   *  @class
   *  @function VariantRadios
   */
  class VariantRadios extends VariantSelects {
    constructor() {
      super();
    }

    updateOptions() {
      const fieldsets = Array.from(this.querySelectorAll('fieldset'));
      this.options = fieldsets.map((fieldset) => {
        return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
      });
    }
    updateVariantText() {


    }
  }

  customElements.define('variant-radios', VariantRadios);
}
if (!customElements.get('product-slider')) {
  /**
   *  @class
   *  @function ProductSlider
   */
  class ProductSlider extends HTMLElement {
    constructor() {
      super();

      this.addEventListener('change', this.setupProductGallery);
    }
    connectedCallback() {
      const product_container = this.closest('.thb-product-detail');
      const thumbnail_container = product_container.querySelector('.product-thumbnail-container');

      this.hide_variants = this.dataset.hideVariants == 'true';
      this.selectedIndex = 0;
      this.thumbnails = thumbnail_container.querySelectorAll('.product-thumbnail');
      this.prev_button = this.querySelector('.flickity-prev');
      this.next_button = this.querySelector('.flickity-next');
      this.options = {
        wrapAround: true,
        pageDots: true,
        contain: true,
        adaptiveHeight: true,
        initialIndex: '.is-initial-selected',
        prevNextButtons: false,
        fade: false,
        cellSelector: '.product-images__slide'
      };

      if (this.hide_variants) {
        this.options.cellSelector = '.product-images__slide-item, .product-images__slide-item--variant.is-selected';
      }

      // Start Slider
      this.init();
    }
    init() {
      this.flkty = new Flickity(this, this.options);

      this.selectedIndex = this.flkty.selectedIndex;

      // Setup Events
      this.setupEvents();

      // Start Gallery
      this.setupProductGallery();
    }
    reInit() {
      this.flkty.destroy();

      this.flkty = new Flickity(this, this.options);

      // Setup Events
      this.setupEvents();

      this.selectedIndex = this.flkty.selectedIndex;
    }
    setupEvents() {
      const _this = this;
      if (this.prev_button) {
        this.prev_button.addEventListener('click', (event) => {
          this.flkty.previous();
        });
        this.prev_button.addEventListener('keyup', (event) => {
          this.flkty.previous();
          event.preventDefault();
        });
      }
      if (this.next_button) {
        this.next_button.addEventListener('click', (event) => {
          this.flkty.next();
        });
        this.next_button.addEventListener('keyup', (event) => {
          this.flkty.next();
          event.preventDefault();
        });
      }
      this.flkty.on('settle', function (index) {
        this.selectedIndex = index;
      });
      this.flkty.on('change', (index) => {
        let previous_slide = this.flkty.cells[this.selectedIndex].element,
          previous_media = previous_slide.querySelector('.product-single__media'),
          slide = this.flkty.cells[index].element,
          media = slide.querySelector('.product-single__media'),
          active_thumb = this.thumbnails[index];

        this.thumbnails.forEach((item, i) => {
          item.classList.remove('is-initial-selected');
        });
        active_thumb.classList.add('is-initial-selected');
        requestAnimationFrame(() => {
          if (active_thumb.offsetParent === null) {
            return;
          }
          const windowHalfHeight = active_thumb.offsetParent.clientHeight / 2,
            windowHalfWidth = active_thumb.offsetParent.clientWidth / 2;
          active_thumb.parentElement.scrollTo({
            left: 0,
            top: active_thumb.offsetTop - windowHalfHeight + active_thumb.clientHeight / 2,
            behavior: 'smooth'
          });
        });
        // Stop previous video
        if (previous_media.classList.contains('product-single__media-external-video')) {
          if (previous_media.dataset.provider === 'youtube') {
            previous_media.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
              event: "command",
              func: "pauseVideo",
              args: ""
            }), "*");
          } else if (previous_media.dataset.provider === 'vimeo') {
            previous_media.querySelector('iframe').contentWindow.postMessage(JSON.stringify({
              method: "pause"
            }), "*");
          }
        } else if (previous_media.classList.contains('product-single__media-native-video')) {
          previous_media.querySelector("video").pause();
        }

        // Draggable.
        if (media.classList.contains('product-single__media-model')) {
          this.setDraggable(false);
        } else {
          this.setDraggable(true);
        }
      });

      this.thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
          this.thumbnailClick(thumbnail, index);
        });
      });
    }
    thumbnailClick(thumbnail, index) {
      [].forEach.call(this.thumbnails, function (el) {
        el.classList.remove('is-initial-selected');
      });
      thumbnail.classList.add('is-initial-selected');
      this.flkty.select(index);
    }
    setDraggable(draggable) {
      this.flkty.options.draggable = draggable;
      this.flkty.updateDraggable();
    }
    selectCell(mediaId) {
      this.flkty.selectCell(mediaId);
    }
    setupProductGallery() {
      if (!this.querySelectorAll('.product-single__media-zoom').length) {
        return;
      }
      this.setEventListeners();
    }
    buildItems() {
      this.activeImages = Array.from(this.querySelectorAll('.product-images__slide-item .product-single__media-image, .product-images__slide-item--variant.is-selected .product-single__media-image'));
      return this.activeImages.map((item) => {
        let index = [].indexOf.call(item.parentNode.parentNode.children, item.parentNode);

        let activelink = item.querySelector('.product-single__media-zoom');

        activelink.dataset.index = index;
        return {
          src: activelink.getAttribute('href'),
          msrc: activelink.dataset.msrc,
          w: activelink.dataset.w,
          h: activelink.dataset.h
        };
      });
    }
    setEventListeners() {
      this.links = this.querySelectorAll('.product-single__media-zoom');
      this.pswpElement = document.querySelectorAll('.pswp')[0];
      this.pswpOptions = {
        maxSpreadZoom: 2,
        loop: false,
        allowPanToNext: false,
        closeOnScroll: false,
        showHideOpacity: false,
        arrowKeys: true,
        history: false,
        captionEl: false,
        fullscreenEl: false,
        zoomEl: false,
        shareEl: false,
        counterEl: false,
        arrowEl: true,
        preloaderEl: true,
        getThumbBoundsFn: () => {
          const thumbnail = this.querySelector('.product-images__slide.is-selected'),
            pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect();
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          };
        }
      };


      this.links.forEach((link => {
        link.addEventListener('click', (e) => this.zoomClick(e, link));
      }));
    }
    zoomClick(e, link) {
      this.items = this.buildItems();
      this.pswpOptions.index = parseInt(link.dataset.index, 10);
      if (typeof PhotoSwipe !== 'undefined') {
        let pswp = new PhotoSwipe(this.pswpElement, PhotoSwipeUI_Default, this.items, this.pswpOptions);
        pswp.listen('firstUpdate', function () {
          pswp.listen('parseVerticalMargin', function (item) {
            item.vGap = {
              top: 50,
              bottom: 50
            };
          });
        });
        pswp.init();
      }
      e.preventDefault();
    }
  }
  customElements.define('product-slider', ProductSlider);
}

/**
 *  @class
 *  @function ProductForm
 */
if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cartNotification = document.querySelector('cart-notification');
      this.body = document.body;

      this.hideErrors = this.dataset.hideErrors === 'true';
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      const submitButton = this.querySelector('[type="submit"]');
      if (submitButton.classList.contains('loading')) return;

      this.handleErrorMessage();

      submitButton.setAttribute('aria-disabled', true);
      submitButton.classList.add('loading');

      const config = {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/javascript'
        }
      };
      const formData = new FormData(this.form);
      formData.append('sections', this.getSectionsToRender().map((section) => section.section));
      formData.append('sections_url', window.location.pathname);
      config.body = formData;

      fetch(`${theme.routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            dispatchCustomEvent('product:variant-error', {
              source: 'product-form',
              productVariantId: formData.get('id'),
              errors: response.description,
              message: response.message
            });
            this.handleErrorMessage(response.description);
            return;
          }

          this.renderContents(response);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('aria-disabled');
        });
    }

    getSectionsToRender() {
      return [{
        id: 'Cart',
        section: 'main-cart',
        selector: '.thb-cart-form'
      },
      {
        id: 'Cart-Drawer',
        section: 'cart-drawer',
        selector: '.cart-drawer'
      },
      {
        id: 'cart-drawer-toggle',
        section: 'cart-bubble',
        selector: '.thb-item-count'
      }];
    }
    renderContents(parsedState) {
      this.getSectionsToRender().forEach((section => {
        if (!document.getElementById(section.id)) {
          return;
        }
        const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
        elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
        if (typeof CartDrawer !== 'undefined') {
          new CartDrawer();
        }
        if (typeof Cart !== 'undefined') {
          new Cart().renderContents(parsedState);
        }
      }));


      if (document.getElementById('Cart-Drawer')) {
        this.body.classList.add('open-cc');
        document.getElementById('Cart-Drawer').classList.add('active');

        dispatchCustomEvent('cart-drawer:open');
      }

      let product_drawer = document.getElementById('Product-Drawer');
      if (product_drawer && product_drawer.contains(this)) {
        product_drawer.classList.remove('active');

        if (!document.getElementById('Cart-Drawer')) {
          this.body.classList.remove('open-cc');
        }
      }
    }
    getSectionInnerHTML(html, selector = '.shopify-section') {
      return new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector(selector).innerHTML;
    }
    handleErrorMessage(errorMessage = false) {
      if (this.hideErrors) return;
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}