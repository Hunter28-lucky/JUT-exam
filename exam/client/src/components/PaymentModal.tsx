import React, { useState } from 'react';
import { X, Smartphone, CreditCard, Building, Loader2 } from 'lucide-react';
import { Package } from '@/pages/home';
import { apiRequest } from '@/lib/queryClient';

interface PaymentModalProps {
  package: Package;
  semester: string;
  branch: string;
  onClose: () => void;
}

export default function PaymentModal({ package: pkg, semester, branch, onClose }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const semesterNames: Record<string, string> = {
    '1st': '1st Semester',
    '2nd': '2nd Semester',
    '3rd': '3rd Semester',
    '4th': '4th Semester',
    '5th': '5th Semester',
    '6th': '6th Semester',
    '7th': '7th Semester',
    '8th': '8th Semester',
    'yearly': 'Yearly Pattern'
  };

  const branchNames: Record<string, string> = {
    'cse': 'Computer Science & Engineering',
    'ece': 'Electronics & Communication',
    'me': 'Mechanical Engineering',
    'ce': 'Civil Engineering',
    'ee': 'Electrical Engineering',
    'che': 'Chemical Engineering'
  };

  const processingFee = 10;
  const totalAmount = pkg.price + processingFee;

  // Generate unique order ID
  const generateOrderId = () => {
    const timestamp = Date.now();
    const microseconds = performance.now().toString().replace('.', '');
    const random1 = Math.random().toString(36).substring(2, 8);
    const random2 = Math.random().toString(36).substring(2, 8);
    return `JUT${timestamp}${microseconds}${random1}${random2}`.replace(/\./g, '').toUpperCase().substring(0, 20);
  };

  const handlePayment = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const orderId = generateOrderId();
      
      const response = await apiRequest('POST', '/api/payment/create-order', {
        amount: totalAmount,
        order_id: orderId,
        package_name: pkg.name,
        semester: semester,
        branch: branch,
      });

      const data = await response.json();
      
      if (data.success && data.payment_url) {
        // Open payment URL in new window
        window.open(data.payment_url, '_blank', 'width=800,height=600');
        setPaymentUrl(data.payment_url);
        
        // Start checking payment status
        startPaymentStatusCheck(orderId);
      } else {
        setError(data.message || 'Failed to create payment order');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startPaymentStatusCheck = (orderId: string) => {
    const checkStatus = async () => {
      try {
        const response = await apiRequest('POST', '/api/payment/check-status', {
          order_id: orderId,
        });

        const data = await response.json();
        
        if (data.success && data.status === 'Success') {
          alert('Payment successful! You will receive access to your study materials shortly.');
          onClose();
          return;
        }
        
        // Continue checking for 5 minutes
        setTimeout(checkStatus, 5000);
      } catch (err) {
        console.error('Status check error:', err);
        setTimeout(checkStatus, 10000); // Retry after longer delay on error
      }
    };
    
    // Start checking after 10 seconds
    setTimeout(checkStatus, 10000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="modal-payment">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full animate-slideUp" data-testid="modal-payment-content">
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold" data-testid="text-payment-modal-title">Complete Payment</h3>
            <button 
              onClick={onClose}
              className="text-primary-foreground/80 hover:text-primary-foreground"
              data-testid="button-close-payment-modal"
            >
              <X className="h-5 w-5" data-testid="icon-close" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-2" data-testid="text-selected-package-name">{pkg.name}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div data-testid="text-selected-semester">Semester: <span>{semesterNames[semester]}</span></div>
              <div data-testid="text-selected-branch">Branch: <span>{branchNames[branch]}</span></div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-4 mb-6" data-testid="payment-summary">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Package Price:</span>
              <span className="font-semibold" data-testid="text-package-price">₹{pkg.price}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Processing Fee:</span>
              <span className="font-semibold" data-testid="text-processing-fee">₹{processingFee}</span>
            </div>
            <hr className="my-2 border-border" />
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total Amount:</span>
              <span className="text-primary" data-testid="text-total-amount">₹{totalAmount}</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm" data-testid="error-message">
              {error}
            </div>
          )}

          {paymentUrl && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-700 text-sm" data-testid="payment-info">
              <div className="font-semibold mb-2">📱 Payment Instructions:</div>
              <ul className="text-xs space-y-1">
                <li>• Payment window has opened in a new tab</li>
                <li>• Scan the QR code with your UPI app (PhonePe, GPay, Paytm, etc.)</li>
                <li>• OR take a screenshot of the QR code and upload in your UPI app</li>
                <li>• Complete the payment and keep this window open</li>
                <li>• You'll receive automatic confirmation once payment is successful</li>
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-pay-now"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" data-testid="icon-loading" />
                  Processing...
                </>
              ) : (
                <>
                  <Smartphone className="mr-2 h-5 w-5" data-testid="icon-smartphone" />
                  Pay ₹{totalAmount} Now
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-xs text-muted-foreground" data-testid="text-security-notice">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment powered by ZapUPI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
