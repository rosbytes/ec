import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';

// --- Types ---
type Screen = 'PHONE' | 'OTP';

export default function AuthPage() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Function to move to OTP screen
  const handlePhoneSubmit = (number: string) => {
    setPhoneNumber(number);
    setCurrentScreen('OTP');
  };

  // Function to go back
  const handleBack = () => {
    setCurrentScreen('PHONE');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 font-sans">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-sm h-[812px] bg-white relative shadow-2xl overflow-hidden flex flex-col">
        
        {currentScreen === 'PHONE' ? (
          <PhoneNumberScreen onSubmit={handlePhoneSubmit} />
        ) : (
          <OtpScreen phoneNumber={phoneNumber} onBack={handleBack} />
        )}

      </div>
    </div>
  );
}

// --- Component 1: Phone Number Screen ---
const PhoneNumberScreen = ({ onSubmit }: { onSubmit: (num: string) => void }) => {
  const [number, setNumber] = useState('');
  const isValid = number.length === 10; // Simple validation for demo

  return (
    <div className="flex flex-col h-full px-6 pt-12 pb-6">
      
      {/* Header */}
      <div className="mt-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">What's your number?</h1>
      </div>

      {/* Input Field */}
      <div className="flex items-center border-b-2 border-gray-200 focus-within:border-[#1e4a3d] transition-colors py-2">
        <span className="text-lg font-medium text-gray-900 mr-4">+91</span>
        <input
          type="tel"
          value={number}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            if (val.length <= 10) setNumber(val);
          }}
          className="w-full text-lg font-medium text-gray-900 outline-none bg-transparent placeholder-gray-300"
          placeholder="99999 99999"
          autoFocus
        />
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-500 mt-6 leading-relaxed">
        Your number helps us remember you! <br />
        no passwords, no fuss.
      </p>

      {/* Continue Button */}
      <div className="mt-8">
        <button
          onClick={() => isValid && onSubmit(number)}
          disabled={!isValid}
          className={`w-full py-4 rounded-full font-bold text-sm transition-all duration-300 ${
            isValid
              ? 'bg-[#1e4a3d] text-white shadow-lg cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          Continue
        </button>
      </div>

      {/* Keyboard simulation spacer (optional for visual fidelity) */}
      <div className="flex-1"></div>
    </div>
  );
};

// --- Component 2: OTP Screen ---
const OtpScreen = ({ phoneNumber, onBack }: { phoneNumber: string; onBack: () => void }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer Logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle Input Change
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit !== '');

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      alert("Verified!");
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full px-6 pt-6 pb-6 relative">
      
      {/* Top Bar */}
      <button onClick={onBack} className="absolute top-6 left-6 p-2 -ml-2 text-gray-700">
        <ArrowLeft size={24} />
      </button>

      {/* Illustration Area */}
      <div className="flex justify-center mt-12 mb-6">
        <div className="relative">
            {/* Tomato Character Placeholder */}
            {/* In a real app, use: <img src="/tomato.png" className="w-24 h-24" /> */}
            <div className="text-6xl animate-bounce">
              🍅
            </div>
            {/* Simulating the little arms/legs if needed with CSS, but emoji works for structure */}
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
        <div className="flex items-center justify-center text-sm text-gray-500 gap-2">
          <span>OTP sent to +91 {phoneNumber}</span>
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <Edit2 size={14} />
          </button>
        </div>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-between gap-2 mb-6">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`w-12 h-12 border rounded-xl text-center text-lg font-bold outline-none transition-all
              ${data 
                ? 'border-[#1e4a3d] bg-white text-gray-900' 
                : 'border-gray-200 bg-gray-50 text-gray-400 focus:border-[#1e4a3d] focus:bg-white'
              }`}
          />
        ))}
      </div>

      {/* Timer / Resend */}
      <div className="text-center mb-8">
        {timer > 0 ? (
          <p className="text-xs text-gray-400">
            Resend in <span className="text-gray-600 font-medium">{timer} sec</span>
          </p>
        ) : (
          <button 
            onClick={() => setTimer(60)}
            className="text-xs font-bold text-[#1e4a3d] hover:underline"
          >
            Resend OTP
          </button>
        )}
        
        {isVerifying && (
             <p className="text-xs text-gray-500 mt-2">Verifying...</p>
        )}
      </div>

      {/* Verify Button */}
      <div>
        <button
          onClick={handleVerify}
          disabled={!isComplete || isVerifying}
          className={`w-full py-4 rounded-full font-bold text-sm transition-all duration-300 ${
            isComplete && !isVerifying
              ? 'bg-[#1e4a3d] text-white shadow-lg cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>
      </div>

    </div>
  );
};