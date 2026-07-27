

/* BAGBAG One-Time Preloader Control */
(function(){
    function navigationType(){
        const nav = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
        return nav ? nav.type : "navigate";
    }

    document.addEventListener("DOMContentLoaded", function(){
        const preloader = document.getElementById("preloader") || document.getElementById("sitePreloader");
        if(!preloader) return;

        const navType = navigationType();
        const alreadyShown = sessionStorage.getItem("bagbagPreloaderShown") === "yes";

        if(navType === "reload" || !alreadyShown){
            sessionStorage.setItem("bagbagPreloaderShown", "yes");
            return;
        }

        preloader.classList.add("preloader-skip");
        preloader.style.display = "none";
        preloader.style.opacity = "0";
        preloader.style.visibility = "hidden";
        preloader.style.pointerEvents = "none";
    });
})();


(function(){
    'use strict';
    document.body.classList.add('loading');
    var preloader = document.getElementById('preloader');
    var start = Date.now();
    function hidePreloader(){
        var elapsed = Date.now() - start;
        var wait = Math.max(3600 - elapsed, 0);
        window.setTimeout(function(){
            if(preloader) preloader.classList.add('hidden');
            document.body.classList.remove('loading');
        }, wait);
    }
    window.addEventListener('load', hidePreloader);
    window.setTimeout(function(){
        if(preloader) preloader.classList.add('hidden');
        document.body.classList.remove('loading');
    }, 5000);

    var header = document.getElementById('site-header');
    function onScroll(){
        if(!header) return;
        if(window.scrollY > 30) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});

    var reveals = document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
        var revealObserver = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {threshold:0.14});
        reveals.forEach(function(el){ revealObserver.observe(el); });
    } else {
        reveals.forEach(function(el){ el.classList.add('visible'); });
    }

    function validateField(field){
        var input = field.querySelector('input, textarea, select');
        var error = field.querySelector('.error');
        if(!input) return true;
        var valid = input.checkValidity();
        var message = '';
        if(!valid){
            if(input.validity.valueMissing) message = 'This field is required.';
            else if(input.validity.typeMismatch) message = 'Please enter a valid email address.';
            else if(input.validity.tooShort) message = 'Please write a little more detail.';
            else message = 'Please check this field.';
        }
        field.classList.toggle('invalid', !valid);
        if(error) error.textContent = message;
        return valid;
    }

    document.querySelectorAll('.lux-form').forEach(function(form){
        form.querySelectorAll('.field input, .field textarea, .field select').forEach(function(input){
            input.addEventListener('input', function(){ validateField(input.closest('.field')); });
            input.addEventListener('change', function(){ validateField(input.closest('.field')); });
        });
        form.addEventListener('submit', function(e){
            e.preventDefault();
            var ok = true;
            form.querySelectorAll('.field').forEach(function(field){
                if(!validateField(field)) ok = false;
            });
            var success = form.querySelector('.form-success');
            if(ok){
                if(success) success.textContent = 'Thank you. Your message has been received successfully.';
                form.reset();
                form.querySelectorAll('.field').forEach(function(field){ field.classList.remove('invalid'); });
                form.querySelectorAll('.error').forEach(function(error){ error.textContent = ''; });
            } else {
                if(success) success.textContent = '';
                var firstInvalid = form.querySelector('.invalid input, .invalid textarea, .invalid select');
                if(firstInvalid) firstInvalid.focus();
            }
        });
    });

    document.querySelectorAll('.newsletter-form').forEach(function(form){
        form.addEventListener('submit', function(e){
            e.preventDefault();
            var input = form.querySelector('input[type="email"]');
            var note = form.querySelector('.form-note');
            if(input && input.checkValidity()){
                if(note) note.textContent = 'Subscribed successfully.';
                form.reset();
            } else {
                if(note) note.textContent = 'Please enter a valid email.';
                if(input) input.focus();
            }
        });
    });

    var lightbox = document.getElementById('lightbox');
    var lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    document.querySelectorAll('.gallery-item').forEach(function(item){
        item.addEventListener('click', function(){
            if(!lightbox || !lightboxImg) return;
            lightboxImg.src = item.getAttribute('data-full') || '';
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden','false');
        });
    });
    function closeLightbox(){
        if(!lightbox || !lightboxImg) return;
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden','true');
        lightboxImg.src = '';
    }
    if(lightbox){
        lightbox.addEventListener('click', function(e){
            if(e.target === lightbox) closeLightbox();
        });
        var closeBtn = lightbox.querySelector('.lightbox-close');
        if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
    }
    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape') closeLightbox();
    });
})();




/* Prada-inspired side menu controls from reference video */
(function(){
    'use strict';
    var toggle = document.querySelector('.prada-menu-toggle');
    var panel = document.getElementById('nav-panel');
    var backdrop = document.getElementById('nav-backdrop');
    var closeBtn = document.querySelector('.side-close');
    var searchTrigger = document.querySelector('.nav-search-trigger');
    var searchInput = panel ? panel.querySelector('.menu-search input') : null;
    if(!toggle || !panel) return;
    function setMenu(open){
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.classList.toggle('open', open);
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
        document.body.classList.toggle('menu-open', open);
        if(backdrop){
            backdrop.classList.toggle('open', open);
            backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
        }
        if(open && searchInput){
            window.setTimeout(function(){ searchInput.focus(); }, 320);
        }
    }
    toggle.addEventListener('click', function(e){
        e.preventDefault();
        setMenu(!panel.classList.contains('open'));
    });
    if(closeBtn) closeBtn.addEventListener('click', function(){ setMenu(false); });
    if(backdrop) backdrop.addEventListener('click', function(){ setMenu(false); });
    document.querySelectorAll('.side-menu-links .nav-link').forEach(function(link){
        link.addEventListener('click', function(){ setMenu(false); });
    });
    if(searchTrigger){
        searchTrigger.addEventListener('click', function(){ setMenu(true); });
    }
    document.addEventListener('keydown', function(e){
        if(e.key === 'Escape' && panel.classList.contains('open')) setMenu(false);
    });
})();


/* User revision: category images and flip cards open the correct pages */
(function(){
    'use strict';
    var storyRoutes = {
        'mens-bags':'men.html', 'office-bags':'men.html', 'wallet-essentials':'men.html', 'laptop-bags':'men.html',
        'womens-bags':'women.html', 'hand-bags':'women.html',
        'kids-bags':'kids.html',
        'sling-bags':'sling-bags.html',
        'backpacks':'backpacks.html',
        'travel-bags':'travel-bags.html'
    };
    document.querySelectorAll('.category-story .story-image').forEach(function(frame){
        frame.setAttribute('role','link');
        frame.setAttribute('tabindex','0');
        var story = frame.closest('.category-story');
        var href = story ? storyRoutes[story.id] : null;
        if(!href) return;
        function go(){ window.location.href = href; }
        frame.addEventListener('click', go);
        frame.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); }});
    });
    document.querySelectorAll('.flip-product-card[data-target]').forEach(function(card){
        card.addEventListener('dblclick', function(){ window.location.href = card.getAttribute('data-target'); });
    });
})();



/* BAGBAG Add-to-Cart System - HTML/CSS/JavaScript only */
(function(){
    const CART_KEY = "bagbagCartItems";

    function readCart(){
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch(e){ return []; }
    }

    function saveCart(items){
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }

    function getProductFromCard(card){
        const titleEl = card.querySelector(".flip-front h3, h3");
        const imgEl = card.querySelector(".flip-front img, img");
        const category = document.body.getAttribute("data-page") || window.location.pathname.split("/").pop() || "index.html";
        const title = titleEl ? titleEl.textContent.trim() : "BAGBAG Product";
        const image = imgEl ? imgEl.getAttribute("src") : "";
        return {
            id: (category + "::" + title + "::" + image).toLowerCase().replace(/\s+/g, "-"),
            title,
            image,
            category: category.replace(".html","").replace(/-/g," ") || "home",
            qty: 1
        };
    }

    function cartCount(items){
        return items.reduce((sum,item)=>sum + (Number(item.qty) || 1), 0);
    }

    function updateCartCount(){
        const items = readCart();
        document.querySelectorAll(".cart-count").forEach(el => el.textContent = cartCount(items));
    }

    function addToCart(product){
        const items = readCart();
        const existing = items.find(item => item.id === product.id);
        if(existing){
            existing.qty = (Number(existing.qty) || 1) + 1;
        }else{
            items.push(product);
        }
        saveCart(items);
        updateCartCount();
        renderCart();
        showToast(product.title + " added to cart");
    }

    function changeQty(id, delta){
        const items = readCart();
        const item = items.find(x => x.id === id);
        if(!item) return;
        item.qty = (Number(item.qty) || 1) + delta;
        const filtered = items.filter(x => (Number(x.qty) || 1) > 0);
        saveCart(filtered);
        updateCartCount();
        renderCart();
    }

    function removeItem(id){
        saveCart(readCart().filter(x => x.id !== id));
        updateCartCount();
        renderCart();
    }

    function clearCart(){
        saveCart([]);
        updateCartCount();
        renderCart();
    }

    function renderCart(){
        const container = document.querySelector(".cart-items");
        const summary = document.querySelector(".cart-summary-total");
        if(!container) return;

        const items = readCart();
        if(summary) summary.textContent = cartCount(items) + " item" + (cartCount(items) === 1 ? "" : "s");

        if(items.length === 0){
            container.innerHTML = '<div class="cart-empty"><div><strong>Your cart is empty.</strong><br><span>Select any BAGBAG product to add it here.</span></div></div>';
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${escapeHtml(item.id)}">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
                <div>
                    <h4>${escapeHtml(item.title)}</h4>
                    <p>${escapeHtml(item.category)}</p>
                    <div class="cart-qty">
                        <button type="button" class="cart-minus" aria-label="Decrease quantity">−</button>
                        <span>${Number(item.qty) || 1}</span>
                        <button type="button" class="cart-plus" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button type="button" class="cart-remove" aria-label="Remove item">×</button>
            </div>
        `).join("");
    }

    function escapeHtml(value){
        return String(value || "")
            .replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;")
            .replace(/'/g,"&#039;");
    }

    function openCart(){
        document.querySelector(".cart-drawer")?.classList.add("active");
        document.querySelector(".cart-drawer-backdrop")?.classList.add("active");
        document.body.style.overflow = "hidden";
        renderCart();
    }

    function closeCart(){
        document.querySelector(".cart-drawer")?.classList.remove("active");
        document.querySelector(".cart-drawer-backdrop")?.classList.remove("active");
        document.body.style.overflow = "";
    }

    let toastTimer;
    function showToast(message){
        let toast = document.querySelector(".cart-toast");
        if(!toast){
            toast = document.createElement("div");
            toast.className = "cart-toast";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(()=>toast.classList.remove("show"), 1800);
    }

    function injectCartShell(){
        if(document.querySelector(".cart-drawer")) return;
        const shell = document.createElement("div");
        shell.innerHTML = `
            <button type="button" class="cart-floating-btn" aria-label="Open shopping cart">
                <i class="fa-solid fa-bag-shopping"></i>
                <span class="label">Cart</span>
                <span class="cart-count">0</span>
            </button>
            <div class="cart-drawer-backdrop"></div>
            <aside class="cart-drawer" aria-label="BAGBAG shopping cart">
                <div class="cart-drawer-header">
                    <h3>Shopping Cart</h3>
                    <button type="button" class="cart-close" aria-label="Close cart">×</button>
                </div>
                <div class="cart-items"></div>
                <div class="cart-drawer-footer">
                    <div class="cart-summary"><span>Total selected</span><span class="cart-summary-total">0 items</span></div>
                    <button type="button" class="cart-action">Checkout Preview</button>
                    <button type="button" class="cart-action cart-clear">Clear Cart</button>
                </div>
            </aside>
        `;
        document.body.appendChild(shell);
    }

    function injectButtons(){
        document.querySelectorAll(".flip-product-card").forEach(card => {
            if(card.querySelector(".add-cart-btn")) return;

            const frontCaption = card.querySelector(".flip-caption");
            const backOverlay = card.querySelector(".flip-back-overlay");

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "add-cart-btn card-cart-action";
            btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
            card.appendChild(btn);
        });
    }

    function bindEvents(){
        document.addEventListener("click", function(e){
            const addBtn = e.target.closest(".add-cart-btn");
            if(addBtn){
                e.preventDefault();
                e.stopPropagation();
                const card = addBtn.closest(".flip-product-card");
                if(card){
                    addToCart(getProductFromCard(card));
                    addBtn.classList.add("added");
                    addBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
                    setTimeout(()=>{
                        addBtn.classList.remove("added");
                        addBtn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Add to Cart';
                    }, 1200);
                }
                return;
            }

            if(e.target.closest(".cart-floating-btn")){
                openCart();
                return;
            }

            if(e.target.closest(".cart-close") || e.target.closest(".cart-drawer-backdrop")){
                closeCart();
                return;
            }

            const item = e.target.closest(".cart-item");
            if(item){
                const id = item.getAttribute("data-id");
                if(e.target.closest(".cart-plus")) changeQty(id, 1);
                if(e.target.closest(".cart-minus")) changeQty(id, -1);
                if(e.target.closest(".cart-remove")) removeItem(id);
                return;
            }

            if(e.target.closest(".cart-clear")){
                clearCart();
                return;
            }

            if(e.target.closest(".cart-action:not(.cart-clear)")){
                showToast("Checkout preview only. Cart saved in this browser.");
                return;
            }
        });

        document.addEventListener("keydown", function(e){
            if(e.key === "Escape") closeCart();
        });
    }

    document.addEventListener("DOMContentLoaded", function(){
        injectCartShell();
        injectButtons();
        bindEvents();
        updateCartCount();
        renderCart();
    });
})();
