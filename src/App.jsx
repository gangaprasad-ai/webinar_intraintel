import React, { useState, useEffect } from 'react';
import ReactGA from "react-ga4";
import './index.css';

// Import Assets directly so Vite bundles them natively
import DevRoyImg from '../public/images/DevRoyImgV2.svg';
import HemantImg from '../public/images/Hemant Datta.jpeg';
import RajImg from '../public/images/RajDasDutta.png';
import IntraintelCover from '../public/assets/intraintel_video_cover.png';

// Connect directly to the Google Apps Script Web App for 100% free serverless backend
const apiUrl = 'https://script.google.com/macros/s/AKfycbxdU8NhK0Lnk0RsTwsFsOmlzeKt7rTgHXBunPrBB2Xrpmk1_zDH292vzF1wjCCPqMOPfA/exec';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    challenge: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const [utmData, setUtmData] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utms = {};
    for (const [key, value] of params.entries()) {
      if (key.toLowerCase().startsWith('utm_')) {
        utms[key] = value;
      }
    }
    setUtmData(utms);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.role) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      company: formData.company,
      role: formData.role,
      challenge: formData.challenge || 'N/A',
      utmData,
      formType: 'webinar_registration'
    };

    try {
      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      setStatus('success');
      ReactGA.event({
        category: "Webinar",
        action: "Form_Submitted",
        label: "Registration_Success"
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  return (
    <>
      <div id="ambient-glows"></div>
      <div className="bg-noise"></div>
      <img src={IntraintelCover} alt="" className="bg-image" />

      {/* NAVIGATION */}
      <nav>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <svg width="180" height="29" viewBox="0 0 347 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.0099 27.1881V40.1626C21.0099 41.278 20.5201 42.3371 19.6703 43.0595L13.9673 47.907C12.5475 49.1138 10.4624 49.1138 9.0426 47.907L3.33963 43.0595C2.48978 42.3371 2 41.278 2 40.1626V17.773C2 16.415 2.72434 15.1601 3.90027 14.4808L23.6052 3.0985C24.7819 2.41879 26.2319 2.41879 27.4086 3.0985L47.1134 14.4808C48.2894 15.1601 49.0137 16.415 49.0137 17.773V40.1669C49.0137 41.2798 48.5261 42.3368 47.6795 43.0592L42.0076 47.8985C40.5881 49.1096 38.4994 49.1116 37.0775 47.9031L31.3792 43.0595C30.5294 42.3371 30.0396 41.278 30.0396 40.1626V27.1881" stroke="#00B4D8" strokeWidth="3.8" strokeLinecap="round"/>
              <path d="M74.6573 15.9483V45H67.6737V15.9483H74.6573ZM103.849 15.9483V45H96.8651L86.5892 26.9225V45H79.5857V15.9483H86.5892L96.8651 34.0258V15.9483H103.849ZM121.747 15.9483V45H114.743V15.9483H121.747ZM130.486 15.9483V21.3556H106.203V15.9483H130.486ZM133.459 15.9483H144.892C147.127 15.9483 149.069 16.2809 150.718 16.946C152.368 17.6111 153.638 18.5954 154.53 19.899C155.434 21.2026 155.886 22.8122 155.886 24.7277C155.886 26.3904 155.627 27.7805 155.108 28.8979C154.589 30.0152 153.864 30.9397 152.933 31.6713C152.015 32.3896 150.945 32.9816 149.721 33.4472L147.426 34.7441H137.829L137.789 29.3368H144.892C145.783 29.3368 146.522 29.1772 147.107 28.858C147.692 28.5387 148.131 28.0864 148.424 27.5011C148.73 26.9025 148.883 26.1909 148.883 25.3662C148.883 24.5281 148.73 23.8098 148.424 23.2112C148.118 22.6126 147.666 22.1537 147.067 21.8345C146.482 21.5152 145.757 21.3556 144.892 21.3556H140.463V45H133.459V15.9483ZM149.362 45L142.937 32.1502L150.359 32.1103L156.864 44.7007V45H149.362ZM172.427 22.0539L165.344 45H157.822L168.497 15.9483H173.265L172.427 22.0539ZM178.294 45L171.19 22.0539L170.272 15.9483H175.101L185.836 45H178.294ZM178.014 34.1655V39.5728H163.109V34.1655H178.014ZM195.413 15.9483V45H188.43V15.9483H195.413ZM224.605 15.9483V45H217.621L207.345 26.9225V45H200.342V15.9483H207.345L217.621 34.0258V15.9483H224.605ZM242.503 15.9483V45H235.499V15.9483H242.503ZM251.242 15.9483V21.3556H226.959V15.9483H251.242ZM274.208 39.6127V45H258.725V39.6127H274.208ZM261.219 15.9483V45H254.215V15.9483H261.219ZM272.213 27.4812V32.6889H258.725V27.4812H272.213ZM274.268 15.9483V21.3556H258.725V15.9483H274.268ZM296.276 39.6127V45H281.591V39.6127H296.276ZM284.085 15.9483V45H277.081V15.9483H284.085ZM299.349 41.8474C299.349 40.8897 299.695 40.0915 300.387 39.453C301.078 38.8012 301.97 38.4753 303.06 38.4753C304.164 38.4753 305.056 38.8012 305.734 39.453C306.426 40.0915 306.772 40.8897 306.772 41.8474C306.772 42.8052 306.426 43.6099 305.734 44.2617C305.056 44.9002 304.164 45.2195 303.06 45.2195C301.97 45.2195 301.078 44.9002 300.387 44.2617C299.695 43.6099 299.349 42.8052 299.349 41.8474ZM323.911 22.0539L316.828 45H309.306L319.981 15.9483H324.749L323.911 22.0539ZM329.777 45L322.674 22.0539L321.756 15.9483H326.585L337.32 45H329.777ZM329.498 34.1655V39.5728H314.593V34.1655H329.498ZM346.897 15.9483V45H339.914V15.9483H346.897Z" fill="#fff"/>
            </svg>
          </a>
          <div className="nav-badge">
            <div className="recording-dot"></div> Live Virtual Event
          </div>
          <a href="#register" className="nav-cta">Reserve Your Seat</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="section-pad" style={{ paddingTop: '180px' }}>
        <div className="W grid-2">
          <div>
            <span className="label-tag">April 20, 2026 // Inaugural Event</span>
            <h1 className="hero-title">
              The AI System<br/>
              <span className="serif">Rebuilding</span> Trials<br/>
              Inside <span className="serif">Out.</span>
            </h1>
            <p className="text-body">
              86% of trials miss enrollment deadlines. Join our exclusive live demonstration to see how our compliance-native platform is collapsing the 6-month clinical workflow into barely 4 weeks.
            </p>
            
            <div style={{ display: 'flex', gap: '40px', marginTop: '48px', borderTop: '1px solid var(--border-glass)', paddingTop: '32px' }}>
              <div>
                <div style={{ fontSize: '32px', fontFamily: 'Playfair Display', color: 'var(--teal)', fontWeight: '900', lineHeight:'1' }}>15+</div>
                <div className="text-muted" style={{ marginTop: '4px' }}>Enterprise Deployments</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontFamily: 'Playfair Display', color: 'var(--teal)', fontWeight: '900', lineHeight:'1' }}>95%</div>
                <div className="text-muted" style={{ marginTop: '4px' }}>Pilot-to-Paid Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontFamily: 'Playfair Display', color: 'var(--teal)', fontWeight: '900', lineHeight:'1' }}>$50M+</div>
                <div className="text-muted" style={{ marginTop: '4px' }}>Customer Value Add</div>
              </div>
            </div>
          </div>

          {/* REGISTRATION FORM */}
          <div className="registration-container" id="register">
            <div className="glass-panel form-glass">
              {status === 'success' ? (
                <div className="success-state">
                  <div className="success-icon">✓</div>
                  <h3>Seat Reserved</h3>
                  <p className="text-body" style={{ margin: 0 }}>An official calendar invitation and Zoom link is on its way to your inbox.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} autoComplete="off">
                  <h3>Secure Your Spot</h3>
                  <p className="sub">Register now for priority access.</p>

                  <div className="grid-row">
                    <div className="input-group">
                      <input type="text" className="input-field" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
                      <span className="input-label" style={{position:'absolute', top:'-10px', left:'16px', background:'var(--obsidian)', padding:'0 4px'}}>First Name</span>
                    </div>
                    <div className="input-group">
                      <input type="text" className="input-field" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
                      <span className="input-label" style={{position:'absolute', top:'-10px', left:'16px', background:'var(--obsidian)', padding:'0 4px'}}>Last Name</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <input type="email" className="input-field" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" />
                    <span className="input-label" style={{position:'absolute', top:'-10px', left:'16px', background:'var(--obsidian)', padding:'0 4px'}}>Work Email</span>
                  </div>

                  <div className="grid-row">
                    <div className="input-group">
                      <input type="text" className="input-field" name="company" value={formData.company} onChange={handleChange} required placeholder="Organization" />
                      <span className="input-label" style={{position:'absolute', top:'-10px', left:'16px', background:'var(--obsidian)', padding:'0 4px'}}>Company</span>
                    </div>
                    <div className="input-group">
                      <select className="input-field" name="role" value={formData.role} onChange={handleChange} required>
                        <option value="" disabled>Select Role</option>
                        <option value="Executive/C-Suite">Executive / C-Suite</option>
                        <option value="Clinical Operations">Clinical Operations</option>
                        <option value="Data Manager">Data Manager</option>
                        <option value="Investigator/Researcher">Investigator</option>
                        <option value="Other">Other</option>
                      </select>
                      <span className="input-label" style={{position:'absolute', top:'-10px', left:'16px', background:'var(--obsidian)', padding:'0 4px'}}>Role</span>
                    </div>
                  </div>

                  {errorMsg && <div style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{errorMsg}</div>}
                  
                  <button type="submit" className="btn-primary" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Encrypting & Transmitting...' : 'Register Now'}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '16px' }}>
                    SOC 2 Type II Certified infrastructure.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* SPEAKERS SECTION */}
      <section className="section-pad">
        <div className="W">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="label-tag">Expert Panel</span>
            <h2 className="section-title">Industry <span className="serif">Architects</span></h2>
          </div>
          
          <div className="speakers-grid">
            <div className="speaker-card">
              <img src={DevRoyImg} alt="Dev Roy" className="speaker-img" style={{objectPosition: 'center top'}} />
              <div className="speaker-info">
                <div className="speaker-name">Dev Roy</div>
                <div className="speaker-role">CEO & Founder</div>
                <div className="speaker-co">IntraIntel.AI</div>
              </div>
            </div>
            
            <div className="speaker-card">
              <img src={HemantImg} alt="Hemant Datta" className="speaker-img" style={{objectFit:'cover'}} />
              <div className="speaker-info">
                <div className="speaker-name">Hemant Datta</div>
                <div className="speaker-role">Chief Product Officer</div>
                <div className="speaker-co">IntraIntel.AI</div>
              </div>
            </div>

            <div className="speaker-card">
              <img src={RajImg} alt="Raj Das Dutta" className="speaker-img" />
              <div className="speaker-info">
                <div className="speaker-name">Raj Das Dutta</div>
                <div className="speaker-role">VP Product & Customer Strategy</div>
                <div className="speaker-co">IntraIntel.AI</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA SECTION */}
      <section className="section-pad" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="W grid-2">
          <div className="agenda-list">
            <span className="label-tag">The Blueprint</span>
            <h2 className="section-title">Session <span className="serif">Agenda</span></h2>
            <p className="text-body" style={{ margin: 0 }}>A rigorous 90-minute breakdown of enterprise multi-agent architecture specifically scaled for global life sciences.</p>
          </div>
          
          <div className="agenda-grid">
            <div className="agenda-item glass-panel">
              <div className="agenda-time">11:00 AM</div>
              <div className="agenda-content">
                <h4>The R&D Bottleneck</h4>
                <p>Why 86% of trials miss enrollment deadlines and how legacy document silos are paralyzing modern clinical operations.</p>
              </div>
            </div>
            <div className="agenda-item glass-panel">
              <div className="agenda-time">11:20 AM</div>
              <div className="agenda-content">
                <h4>Live Demo: Trial Protocol Co-Pilot</h4>
                <p>Real-time demonstration of drafting, checking, and validating a Phase III protocol instantly using enterprise context.</p>
              </div>
            </div>
            <div className="agenda-item glass-panel">
              <div className="agenda-time">11:50 AM</div>
              <div className="agenda-content">
                <h4>Security & Governance</h4>
                <p>Deploying models inside the VPC, maintaining SOC2/HIPAA compliance, and preventing foundational hallucinations.</p>
              </div>
            </div>
            <div className="agenda-item glass-panel" style={{ border: 'none' }}>
              <div className="agenda-time">12:15 PM</div>
              <div className="agenda-content">
                <h4>Open Q&A</h4>
                <p>Direct technical and operational questioning with the architecture team.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '60px 0', textAlign: 'center' }}>
        <div className="W">
            <p className="text-muted">&copy; 2026 IntraIntel.AI. All rights reserved. Fairfax, Virginia.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
