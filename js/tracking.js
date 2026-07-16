!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

const pixelId = window.AppConfig.tracking.metaPixelId;
const productPrice = window.AppConfig.product.offerPrice;

if(pixelId && pixelId !== "YOUR_PIXEL_ID") {
    fbq('init', pixelId);
    fbq('track', 'PageView');
    
    // ভিউ করার সাথে সাথেই ফায়ার হবে
    fbq('track', 'ViewContent', {
        content_name: window.AppConfig.product.name,
        content_type: 'product',
        value: productPrice,
        currency: 'BDT'
    });
}

function trackAddToCart() {
    if(pixelId && pixelId !== "YOUR_PIXEL_ID") {
        fbq('track', 'AddToCart', {
            content_name: window.AppConfig.product.name,
            content_type: 'product',
            value: productPrice,
            currency: 'BDT'
        });
    }
}

function trackInitiateCheckout() {
    if(pixelId && pixelId !== "YOUR_PIXEL_ID") {
        fbq('track', 'InitiateCheckout');
    }
}

function trackPurchase(totalValue) {
    if(pixelId && pixelId !== "YOUR_PIXEL_ID") {
        fbq('track', 'Purchase', {
            value: totalValue,
            currency: 'BDT'
        });
    }
}
