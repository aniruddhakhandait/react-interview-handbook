import React, { useRef, useState } from "react";

const OtpInput = () => {
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current filled
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };


    // remove last value 
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    // brack it down

    const pasted = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (/^\d+$/.test(pasted)) {
    
      // split it down 
      const newOtp = pasted.split("");
      setOtp(newOtp);
      if (newOtp.length === OTP_LENGTH) inputRefs.current[OTP_LENGTH - 1].focus();
    }
  };

  const handleSubmit = () => {
    if (otp.some((digit) => digit === "")) {
      alert("⚠️ Please fill all fields before submitting!");
      return;
    }

    const otpValue = otp.join("");
    console.log("✅ Submitted OTP:", otpValue);

    // Show success popup
    setSuccess(true);

    // Reset OTP fields
    setOtp(Array(OTP_LENGTH).fill(""));

    // Focus first box again
    inputRefs.current[0].focus();

    // Hide success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">Enter OTP</h1>

      <div
        className="flex space-x-3"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            className={`w-14 h-14 text-center text-2xl border-2 rounded-lg outline-none transition-all duration-200 ${
              digit
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700"
            } focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg text-lg font-medium transition-all"
      >
        Submit
      </button>

      {success && (
        <div className="mt-6 px-6 py-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-lg animate-bounce">
          ✅ OTP Verified Successfully!
        </div>
      )}
    </div>
  );
};

export default OtpInput;
