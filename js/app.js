const conf = window.AppConfig;
let currentSlide = 0;
let slideInterval;
let selectedColor = conf.product.colors[0].name;
let selectedSize = null;
let cart = []; // জাদুর ঝুড়ি

document.addEventListener("DOMContentLoaded", () => {
    // সাইটে ঢুকলেই যেকোনো একটি র‍্যান্ডম রঙ থেকে স্লাইড শুরু হবে
    currentSlide = Math.floor(Math.random() * conf.product.colors.length);
    
    initUI();
    startAutoSlide();
    calculateTotal();
});

function initUI() {
    document.getElementById("brand-name").innerText = conf.brand.name;
    document.getElementById("brand-tagline").innerText = conf.brand.tagline;
    document.getElementById("product-name").innerText = conf.product.name;
    document.getElementById("offer-price").innerText = `৳${conf.product.offerPrice}`;
    document.getElementById("regular-price").innerText = `৳${conf.product.regularPrice}`;
    
    document.getElementById("footer-address").innerText = conf.contact.address;
    
    // WhatsApp Button Dynamic Link
    document.getElementById("wa-link").href = `https://wa.me/88${conf.contact.whatsapp}`;
    
    document.getElementById("footer-fb").href = conf.contact.facebook;
    document.getElementById("footer-web").href = conf.contact.website;
    document.getElementById("footer-web").innerText = conf.contact.website.replace("https://", "");


    document.getElementById("size-chart-frame").src = conf.product.sizeChartUrl;
    const featureList = document.getElementById("product-features");
    conf.product.features.forEach(f => featureList.innerHTML += `<li>✨ ${f}</li>`);

    // Setup Colors
    const thumbContainer = document.getElementById("color-thumbnails");
    conf.product.colors.forEach((color, index) => {
        thumbContainer.innerHTML += `<img src="${color.img}" class="color-thumb ${index === 0 ? 'active' : ''}" onclick="selectColor(${index})" title="${color.name}">`;
    });
    
    // Setup Sizes
    const sizeContainer = document.getElementById("size-buttons");
    conf.product.sizes.forEach((s, i) => {
        sizeContainer.innerHTML += `<button type="button" class="size-btn" onclick="selectSize(${i})">${s.label}</button>`;
    });

    updateSlideView();
}

// Gallery Logic
function updateSlideView() {
    const colorObj = conf.product.colors[currentSlide];
    document.getElementById("main-product-image").src = colorObj.img;
    document.getElementById("active-color-name").innerText = colorObj.name;
}
function nextSlide() { currentSlide = (currentSlide + 1) % conf.product.colors.length; updateSlideView(); resetAutoSlide(); }
function prevSlide() { currentSlide = (currentSlide - 1 + conf.product.colors.length) % conf.product.colors.length; updateSlideView(); resetAutoSlide(); }
function startAutoSlide() { slideInterval = setInterval(nextSlide, 3500); }
function resetAutoSlide() { clearInterval(slideInterval); startAutoSlide(); }

// Selection Logic
function selectColor(index) {
    currentSlide = index;
    updateSlideView();
    resetAutoSlide();
    
    document.querySelectorAll(".color-thumb").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".color-thumb")[index].classList.add("active");
    
    selectedColor = conf.product.colors[index].name;
    document.getElementById("selected-color-text").innerText = selectedColor;
}

function selectSize(index) {
    selectedSize = conf.product.sizes[index];
    document.querySelectorAll(".size-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".size-btn")[index].classList.add("active");
    
    const display = document.getElementById("measurement-display");
    display.innerHTML = `📏 লম্বা: ${selectedSize.length} ইঞ্চি &nbsp;|&nbsp; 👕 বডির মাপ: ${selectedSize.chest} ইঞ্চি`;
    display.style.display = "block";
}

function changeQty(val) {
    const input = document.getElementById("item-qty");
    let newQty = parseInt(input.value) + val;
    if (newQty >= 1) {
        input.value = newQty;
    }
}

// Cart Logic
function addToCart() {
    if(!selectedSize) return alert("দয়া করে ফতুয়ার একটি সাইজ (বছর) নির্বাচন করুন।");
    
    const qty = parseInt(document.getElementById("item-qty").value);
    const item = {
        color: selectedColor,
        size: selectedSize.label,
        qty: qty,
        price: conf.product.offerPrice,
        total: qty * conf.product.offerPrice
    };
    
    cart.push(item);
    updateCartUI();
    
    if(typeof trackAddToCart === "function") trackAddToCart(); // Neuromarketing signal
    
    // Reset Qty visually
    document.getElementById("item-qty").value = 1;
    alert(`অসাধারণ! ${selectedColor} রঙের ফতুয়াটি কার্টে যোগ হয়েছে। আপনি চাইলে আরও ফতুয়া বাছাই করতে পারেন।`);
}

function updateCartUI() {
    const cartSection = document.getElementById("cart-section");
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = "";
    
    if(cart.length === 0) {
        cartSection.style.display = "none";
    } else {
        cartSection.style.display = "block";
        cart.forEach((item, index) => {
            cartList.innerHTML += `<li class="cart-item">
                <span>${item.color} (${item.size} বছর) x ${item.qty} টি</span>
                <span>৳${item.total} <button type="button" class="remove-btn" onclick="removeFromCart(${index})" title="বাদ দিন">X</button></span>
            </li>`;
        });
    }
    calculateTotal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function calculateTotal() {
    let subtotal = 0;
    if(cart.length > 0) {
        cart.forEach(item => { subtotal += item.total; });
    }
    
    const district = document.getElementById("cust-district").value;
    let delivery = 0;
    
    // শুধু কার্টে আইটেম থাকলেই ডেলিভারি চার্জ যোগ হবে
    if (subtotal > 0) {
        if(district === "Dhaka") delivery = conf.delivery.insideDhaka;
        else if(district === "Outside") delivery = conf.delivery.outsideDhaka;
    }

    const grandTotal = subtotal + delivery;

    document.getElementById("summary-subtotal").innerText = `৳${subtotal}`;
    document.getElementById("summary-delivery").innerText = `৳${delivery}`;
    document.getElementById("summary-total").innerText = `৳${grandTotal}`;
    document.getElementById("btn-total").innerText = `৳${grandTotal}`;
}

// Track Form Scroll (Initiate Checkout)
let checkoutTracked = false;
window.addEventListener('scroll', () => {
    if(!checkoutTracked) {
        const form = document.getElementById('checkout-form');
        if(form.getBoundingClientRect().top < window.innerHeight) {
            if(typeof trackInitiateCheckout === "function") trackInitiateCheckout();
            checkoutTracked = true;
        }
    }
});

// Submit Data
document.getElementById("checkout-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if(cart.length === 0) return alert("আপনার ঝুড়িটি তো একদম খালি! দয়া করে আগে কার্টে ফতুয়া যোগ করুন।");

    const btn = document.getElementById("submit-btn");
    btn.innerText = "অর্ডার প্রসেস হচ্ছে...";
    btn.disabled = true;

    let subtotal = 0;
    let totalQty = 0;
    let itemsText = "";
    
    cart.forEach(item => { 
        subtotal += item.total; 
        totalQty += item.qty; 
        itemsText += `- রঙ: ${item.color}, সাইজ: ${item.size} বছর, পরিমাণ: ${item.qty} টি\n`;
    });

    const district = document.getElementById("cust-district").value;
    const delivery = district === "Dhaka" ? conf.delivery.insideDhaka : conf.delivery.outsideDhaka;

    const custName = document.getElementById("cust-name").value;
    const custPhone = document.getElementById("cust-phone").value;
    const custAddress = document.getElementById("cust-address").value;

    const summaryText = `প্রোডাক্ট: ${conf.product.name}
${itemsText}
টোটাল বিল: ৳${subtotal + delivery}
কাস্টমারের নাম: ${custName}
মোবাইল নাম্বার: ${custPhone}
ঠিকানা: ${custAddress}`;

    const payload = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        name: document.getElementById("cust-name").value,
        phone: document.getElementById("cust-phone").value,
        district: district === "Dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে",
        area: "N/A",
        address: document.getElementById("cust-address").value,
        note: itemsText, // গুগল শিটের Note কলামে কার্টের সব আইটেমের তালিকা যাবে
        totalQty: totalQty,
        subtotal: subtotal,
        deliveryCharge: delivery,
        grandTotal: subtotal + delivery,
        orderSummary: summaryText,
        url: window.location.href
    };

    try {
        await fetch(conf.api.appsScriptUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        if(typeof trackPurchase === "function") trackPurchase(payload.grandTotal);
        
        alert("🎉 আলহামদুলিল্লাহ! আপনার সোনামণির জন্য ফতুয়ার অর্ডারটি সফলভাবে প্লেস হয়েছে।");
        window.location.reload();
    } catch (error) {
        alert("দুঃখিত, কোনো একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
        btn.innerText = "অর্ডার কনফার্ম করুন";
        btn.disabled = false;
    }
});
// PWA Install Button Logic
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById('install-btn');
    if(btn) {
        btn.style.display = 'block';
        btn.addEventListener('click', () => {
            deferredPrompt.prompt();
        });
    }
});
