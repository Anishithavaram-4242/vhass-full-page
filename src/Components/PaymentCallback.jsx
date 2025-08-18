import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import phonepeService from '../services/phonepeService';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        const merchantTransactionId = searchParams.get('merchantTransactionId');
        const transactionId = searchParams.get('transactionId');
        const code = searchParams.get('code');

        if (!merchantTransactionId) {
          setPaymentStatus('error');
          return;
        }

        // Check payment status with PhonePe
        const statusResponse = await phonepeService.checkPaymentStatus(merchantTransactionId);
        
        if (statusResponse.success) {
          if (statusResponse.status === 'COMPLETED') {
            setPaymentStatus('success');
            setPaymentDetails({
              transactionId: statusResponse.transactionId,
              amount: statusResponse.amount,
              status: statusResponse.status
            });
          } else {
            setPaymentStatus('failed');
            setPaymentDetails({
              transactionId: statusResponse.transactionId,
              status: statusResponse.status,
              responseCode: statusResponse.responseCode
            });
          }
        } else {
          setPaymentStatus('error');
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        setPaymentStatus('error');
      }
    };

    handlePaymentCallback();
  }, [searchParams]);

  const getStatusContent = () => {
    switch (paymentStatus) {
      case 'processing':
        return {
          icon: <Loader className="w-16 h-16 animate-spin text-blue-500" />,
          title: 'Processing Payment...',
          message: 'Please wait while we verify your payment.',
          color: 'text-blue-500'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Payment Successful!',
          message: 'Your enrollment has been confirmed.',
          color: 'text-green-500'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Failed',
          message: 'Your payment was not successful. Please try again.',
          color: 'text-red-500'
        };
      case 'error':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Error',
          message: 'An error occurred while processing your payment.',
          color: 'text-red-500'
        };
      default:
        return {
          icon: <Loader className="w-16 h-16 animate-spin text-blue-500" />,
          title: 'Processing...',
          message: 'Please wait.',
          color: 'text-blue-500'
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-purple-500 text-center">
        <div className="mb-6">
          {statusContent.icon}
        </div>
        
        <h1 className={`text-2xl font-bold mb-4 ${statusContent.color}`}>
          {statusContent.title}
        </h1>
        
        <p className="text-gray-300 mb-6">
          {statusContent.message}
        </p>

        {paymentDetails && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-2">Payment Details:</h3>
            <div className="space-y-1 text-sm text-gray-300">
              <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
              {paymentDetails.amount && (
                <p><strong>Amount:</strong> ₹{paymentDetails.amount}</p>
              )}
              <p><strong>Status:</strong> {paymentDetails.status}</p>
              {paymentDetails.responseCode && (
                <p><strong>Response Code:</strong> {paymentDetails.responseCode}</p>
              )}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </button>
          
          {paymentStatus === 'failed' && (
            <button
              onClick={() => navigate('/course')}
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
