const conf = window.AppConfig;
let currentSlide = 0;
let slideInterval;
let selectedColor = conf.product.colors[0].name;
let selectedSize = null;

document.addEventListener("DOMContentLoaded", () => {
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
    document.getElementById("footer-wa").innerText = conf.contact.whatsapp;
    document.getElementById("footer-fb").href = conf.contact.facebook;
    document.getElementById("footer-web").href = conf.contact.website;
    document.getElementById("footer-web").innerText = conf.contact.website.replace("https://", "");

    document.getElementById("size-chart-img").src = conf.product.sizeChartImg;
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
    if(typeof trackAddToCart === "function") trackAddToCart(); // Neuromarketing signal
}

function selectSize(index) {
    selectedSize = conf.product.sizes[index];
    document.querySelectorAll(".size-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".size-btn")[index].classList.add("active");
    
    const display = document.getElementById("measurement-display");
    display.innerHTML = `📏 লম্বা: ${selectedSize.length} ইঞ্চি &nbsp;|&nbsp; 👕 বডির মাপ: ${selectedSize.chest} ইঞ্চি`;
    display.style.display = "block";
    if(typeof trackAddToCart === "function") trackAddToCart();
}

function changeQty(val) {
    const input = document.getElementById("item-qty");
    let newQty = parseInt(input.value) + val;
    if (newQty >= 1) {
        input.value = newQty;
        calculateTotal();
        if(typeof trackAddToCart === "function") trackAddToCart();
    }
}

function calculateTotal() {
    const qty = parseInt(document.getElementById("item-qty").value);
    const subtotal = qty * conf.product.offerPrice;
    
    const district = document.getElementById("cust-district").value;
    let delivery = 0;
    if(district === "Dhaka") delivery = conf.delivery.insideDhaka;
    else if(district === "Outside") delivery = conf.delivery.outsideDhaka;

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
    if(!selectedSize) return alert("দয়া করে ফতুয়ার একটি সাইজ (বছর) নির্বাচন করুন।");

    const btn = document.getElementById("submit-btn");
    btn.innerText = "অর্ডার প্রসেস হচ্ছে...";
    btn.disabled = true;

    const qty = parseInt(document.getElementById("item-qty").value);
    const subtotal = qty * conf.product.offerPrice;
    const district = document.getElementById("cust-district").value;
    const delivery = district === "Dhaka" ? conf.delivery.insideDhaka : conf.delivery.outsideDhaka;

    const summaryText = `${conf.product.name}\nরঙ: ${selectedColor}\nসাইজ: ${selectedSize.label} বছর (লম্বা: ${selectedSize.length}, বডি: ${selectedSize.chest})\nপরিমাণ: ${qty}\n------------------\nসাবটোটাল: ৳${subtotal}\nডেলিভারি: ৳${delivery}\nসর্বমোট: ৳${subtotal + delivery}`;

    const payload = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        name: document.getElementById("cust-name").value,
        phone: document.getElementById("cust-phone").value,
        district: district === "Dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে",
        area: "N/A",
        address: document.getElementById("cust-address").value,
        note: "রঙ: " + selectedColor + ", সাইজ: " + selectedSize.label,
        totalQty: qty,
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
