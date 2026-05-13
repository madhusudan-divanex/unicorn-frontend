import  { useState } from "react";

const ReferralPage = () => {
  const [copied, setCopied] = useState(false);

  const userId = JSON.parse(localStorage.getItem("userId"));

  // Referral link generate
  const referralLink = `https://www.unicornoptions.com/register?invite=${userId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy!");
    }
  };

  return (

    <div className="deposit-main-section">
      <h4 className="text-white fz-20 fw-600">Your Referral Link</h4>
      <div className="custom-frm-bx mb-2">
        <div className="input-group">
          <input
            type="text"
            className="form-control new-form-control"
            value={referralLink}
            readOnly
          />
          <button className="thm-btn" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

      </div>

      <hr />
      <h5 className="text-white fz-20 fw-600 mb-3">Share on Social Media</h5>

      <div>
        <ul className="d-flex flex-wrap gap-2 mb-0">
          <li><a
          href={`https://wa.me/?text=${encodeURIComponent(referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="affiliate-social-btn"
        >
         <span className="affiliate-social-icon"> <i className="fa-brands fa-square-whatsapp"></i></span>
        </a></li>
          <li>
            <a
          href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="affiliate-social-btn"
        >
        <span className="affiliate-social-icon">  <i className="fa-brands fa-telegram"></i></span>
        </a>
          </li>
          <li>
            <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="affiliate-social-btn"
        >
        <span className="affiliate-social-icon"> <i className="fa-brands fa-facebook"></i></span>
        </a>
          </li>

          <li>
              <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="affiliate-social-btn"
        >
         <span className="affiliate-social-icon"> <i className="fa-brands fa-square-x-twitter"></i></span>
        </a>
          </li>
        </ul>

      </div>

    </div>
  );
};

export default ReferralPage;