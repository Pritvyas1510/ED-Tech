const Razorpay = require('razorpay');

// Create a Razorpay instance with your API keys
const razorpayInstance = new Razorpay({
    key_id: "rzp_test_VQhEfe2NCXbbwI",
    key_secret: "2ibreCYL78DA3kjOhobCvz0f"
});

// Export the instance directly
module.exports = razorpayInstance;