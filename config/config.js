window.RizalConfig = {
    brand: {
        name: "Rizalwear",
        tagline: "Crafted for Comfort",
        logo: "assets/images/logo.webp",
        favicon: "assets/images/favicon.png",
        themeColor: "#f4f7f6"
    },
    product: {
        id: "p_001",
        name: "Kids Premium Summer Fotua",
        description: "Soft, breathable, and designed for ultimate comfort. Perfect for your little one's active summer days.",
        regularPrice: 380,
        offerPrice: 280,
        sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
        colors: ["Mint Green", "Baby Blue", "Soft Peach", "Warm Beige"],
        images: [
            "assets/images/product-1.webp",
            "assets/images/product-2.webp",
            "assets/images/product-3.webp"
        ],
        fabricDetails: "100% Organic Cotton, Hypoallergenic, Breathable Weave.",
        exchangePolicy: "3 Days Easy Exchange Policy."
    },
    offerEngine: {
        // Quantity: Price per unit
        1: 280,
        2: 280,
        3: 250, // Special offer for 3
        default: 250 // For 4 or more, price stays 250 per unit
    },
    delivery: {
        insideDhaka: 60,
        outsideDhaka: 90
    },
    contact: {
        phone: "+8801XXXXXXXXX",
        whatsapp: "8801XXXXXXXXX",
        facebook: "https://facebook.com/rizalwear",
        messenger: "https://m.me/rizalwear"
    },
    tracking: {
        metaPixelId: "YOUR_PIXEL_ID",
        ga4Id: "G-XXXXXXXXXX"
    },
    api: {
        appsScriptUrl: "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"
    },
    seo: {
        title: "Rizalwear | Crafted for Comfort - Premium Kids Clothing",
        description: "Discover premium, breathable, and comfortable summer clothing for kids aged 4-13. Shop Rizalwear today!",
        ogImage: "assets/images/og-image.jpg"
    }
};
