import React from 'react';
import { QrCode, Smartphone, Copy, CheckCircle, MessageCircle } from 'lucide-react';

const Payment = () => {
  // Aap apni details yahan update kar sakte hain
  const paymentDetails = {
    upiId: "9630955951@axl",
    phone: "+91 9630955951",
    whatsappNumber: "919630955951",
    qrImageUrl: "/qr-code.jpeg" // Demo QR
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied: " + text);
  };

const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent("Hello, maine fees pay kar di hai. Yeh raha mera payment screenshot.");
    window.open(`https://wa.me/${paymentDetails.whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
        
        {/* Header Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pay Your Fees Online</h2>
        <p className="text-gray-500 text-sm mb-8">Scan QR code or use UPI details to pay your fees online</p>

        {/* QR Code Section - Badi Image */}
        <div className="bg-indigo-50 p-6 rounded-2xl mb-8 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200">
          <img 
            src={paymentDetails.qrImageUrl} 
            alt="Payment QR Code" 
            className="w-64 h-64 object-contain rounded-lg shadow-sm"
          />
          <div className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold">
            <QrCode size={20} />
            <span>Scan & Pay</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4 text-left">
          {/* UPI ID */}
          <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between group hover:bg-gray-100 transition-colors">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">UPI ID</p>
              <p className="text-gray-700 font-medium">{paymentDetails.upiId}</p>
            </div>
            <button 
              onClick={() => copyToClipboard(paymentDetails.upiId)}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Copy size={18} />
            </button>
          </div>

          {/* Mobile Number */}
          <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between group hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Smartphone size={20} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Mobile Number</p>
                <p className="text-gray-700 font-medium">{paymentDetails.phone}</p>
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(paymentDetails.phone)}
              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        {/* Footer Instructions */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Secure & Instant Payment</span>
          </div>


          <button 
            onClick={handleWhatsAppRedirect}
            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <MessageCircle size={24} fill="white" />
            Send Screenshot
          </button>

<p className="text-gray-600 text-xs text-center leading-relaxed py-4">
    <span className="text-blue-700 font-bold block mb-1 underline decoration-blue-200 underline-offset-4">
      IMPORTANT STEP:
    </span>
   Once your payment is successful, take <span className="text-gray-900 font-bold tracking-tight">Screenshot</span>  <br/> 
   And send us using  <span className="text-blue-600 font-bold uppercase">WhatsApp button</span> 
  </p>

        </div>
      </div>

     
    </div>
  );
};

export default Payment;