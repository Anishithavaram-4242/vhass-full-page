import CryptoJS from 'crypto-js';

class PhonePeService {
  constructor() {
    // PhonePe Configuration - Defaults to TEST/PREPROD using provided creds
    // Hermes API expects Merchant ID (e.g., M23PNOTCLAKTF), not the Client ID (TEST-...)
    this.MERCHANT_ID = import.meta.env.VITE_PHONEPE_MERCHANT_ID || 'M23PNOTCLAKTF';
    // Use PhonePe PG Salt Key (not the Client Secret). This is the preprod salt key provided earlier.
    this.SALT_KEY = import.meta.env.VITE_PHONEPE_SALT_KEY || '33418406-0957-4ae0-a07a-a6383760ba05';
    this.SALT_INDEX = import.meta.env.VITE_PHONEPE_SALT_INDEX || '1';
    this.ENVIRONMENT = (import.meta.env.VITE_PHONEPE_ENVIRONMENT || 'PREPROD').toUpperCase();
    
    // API URLs
    this.BASE_URL = this.ENVIRONMENT === 'PRODUCTION' 
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/hermes';
    
    this.REDIRECT_URL = import.meta.env.VITE_PHONEPE_REDIRECT_URL || 'http://localhost:5173/payment/callback';
  }

  // Generate SHA256 hash
  generateSHA256(input) {
    return CryptoJS.SHA256(input).toString();
  }

  // Generate X-VERIFY header
  generateXVerify(payload, endpoint) {
    const base64 = btoa(JSON.stringify(payload));
    const string = `${base64}/pg/v1/${endpoint}${this.SALT_KEY}`;
    const sha256 = this.generateSHA256(string);
    return `${sha256}###${this.SALT_INDEX}`;
  }

  // Create payment payload
  createPaymentPayload(orderId, amount, userData, courseData) {
    // Clean and validate mobile number
    let mobileNumber = userData.mobile;
    if (mobileNumber) {
      // Remove any non-digit characters
      mobileNumber = mobileNumber.replace(/\D/g, '');
      // Handle different formats (10 digits, 11 digits with country code, etc.)
      if (mobileNumber.length === 11 && mobileNumber.startsWith('0')) {
        // Remove leading 0 for 10-digit format
        mobileNumber = mobileNumber.substring(1);
      } else if (mobileNumber.length === 12 && mobileNumber.startsWith('91')) {
        // Remove country code for 10-digit format
        mobileNumber = mobileNumber.substring(2);
      }
      
      // Ensure it's 10 digits
      if (mobileNumber.length !== 10) {
        console.warn('Invalid mobile number format:', userData.mobile, '-> cleaned:', mobileNumber);
        mobileNumber = '9999999999'; // Default fallback
      }
    } else {
      mobileNumber = '9999999999'; // Default fallback
    }

    const payload = {
      merchantId: this.MERCHANT_ID,
      merchantTransactionId: orderId,
      amount: amount * 100, // PhonePe expects amount in paise
      redirectUrl: this.REDIRECT_URL,
      redirectMode: 'REDIRECT',
      callbackUrl: this.REDIRECT_URL,
      merchantUserId: userData.userId || 'USER_' + Date.now(),
      mobileNumber: mobileNumber,
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    console.log('Created PhonePe payload:', payload);
    return payload;
  }

  // Initialize payment
  async initiatePayment(orderId, amount, userData, courseData) {
    try {
      console.log('=== PHONEPE INITIATE PAYMENT ===');
      console.log('Order ID:', orderId);
      console.log('Amount:', amount);
      console.log('User Data:', userData);
      console.log('Course Data:', courseData);
      
      const payload = this.createPaymentPayload(orderId, amount, userData, courseData);
      console.log('Payment Payload:', payload);
      
      // Send only payload; backend will compute base64 and X-VERIFY using server salt key

      // Use backend proxy to avoid CORS issues
      const requestBody = {
        payload: payload,
        environment: this.ENVIRONMENT
      };
      
      console.log('Request Body:', requestBody);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/phonepe/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        return {
          success: true,
          paymentUrl: data.data.instrumentResponse.redirectInfo.url,
          transactionId: data.data.merchantTransactionId
        };
      } else {
        console.error('PhonePe API error:', data);
        // Extract the actual error message from PhonePe response
        const errorMessage = data.message || data.error || data.data?.message || data.data?.error || data.code || 'Payment initiation failed';
        console.error('PhonePe error details:', {
          success: data.success,
          message: data.message,
          error: data.error,
          data: data.data,
          code: data.code,
          fullResponse: data
        });
        throw new Error(`PhonePe Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('PhonePe payment initiation error:', error);
      throw error;
    }
  }

  // Check payment status
  async checkPaymentStatus(merchantTransactionId) {
    try {
      const payload = {
        merchantId: this.MERCHANT_ID,
        merchantTransactionId: merchantTransactionId
      };

      // Backend will compute X-VERIFY for status, send only identifiers

      // Use backend proxy to avoid CORS issues
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/phonepe/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          merchantId: this.MERCHANT_ID,
          merchantTransactionId: merchantTransactionId,
          environment: this.ENVIRONMENT
        })
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          status: data.data.paymentState,
          transactionId: data.data.merchantTransactionId,
          amount: data.data.amount / 100, // Convert from paise to rupees
          responseCode: data.data.responseCode
        };
      } else {
        throw new Error(data.message || 'Status check failed');
      }
    } catch (error) {
      console.error('PhonePe status check error:', error);
      throw error;
    }
  }

  // Generate unique order ID
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `VHASS_${timestamp}_${random}`.toUpperCase();
  }
}

export default new PhonePeService();
