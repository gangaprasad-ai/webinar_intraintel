import React, { useState, useEffect, useRef } from 'react';
import ReactGA from "react-ga4";
import './index.css';

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

  // Intersection Observer for scroll animations
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.rev');
    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        elements.forEach(el => observerRef.current.unobserve(el));
      }
    };
  }, []);

  // Seat Counter (matching original logic)
  const [seatsLeft, setSeatsLeft] = useState(200);
  useEffect(() => {
    const t = 47 + Math.floor(Math.random() * 22);
    setSeatsLeft(200 - t);
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
      // Use no-cors mode to completely bypass Google Apps Script CORS redirects.
      // Note: In no-cors mode, the response is "opaque" (we cannot read the JSON body or status code)
      // If the fetch doesn't throw a network error, we assume the data was successfully submitted.
      await fetch(apiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      setStatus('success');
      
      // Fire GA4 Conversion Event
      ReactGA.event({
        category: "Webinar",
        action: "Form_Submitted",
        label: "Registration_Success"
      });

      setFormData({ firstName: '', lastName: '', email: '', company: '', role: '', challenge: '' });
      setTimeout(() => setStatus('idle'), 8000); // Reset form after 8 seconds
    } catch (error) {
      console.error('Registration Error:', error);
      setStatus('error');
      setErrorMsg(error.message === 'Failed to fetch' ? 'Network error. Please check your connection.' : error.message);
    }
  };

  return (
    <>
      <div id="bg"></div>
      <div id="gr"></div>

      {/* NAV */}
      <nav>
        <div className="ni">
          <a href="#" className="logo">
            <svg width="180" height="29" viewBox="0 0 347 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.0099 27.1881V40.1626C21.0099 41.278 20.5201 42.3371 19.6703 43.0595L13.9673 47.907C12.5475 49.1138 10.4624 49.1138 9.0426 47.907L3.33963 43.0595C2.48978 42.3371 2 41.278 2 40.1626V17.773C2 16.415 2.72434 15.1601 3.90027 14.4808L23.6052 3.0985C24.7819 2.41879 26.2319 2.41879 27.4086 3.0985L47.1134 14.4808C48.2894 15.1601 49.0137 16.415 49.0137 17.773V40.1669C49.0137 41.2798 48.5261 42.3368 47.6795 43.0592L42.0076 47.8985C40.5881 49.1096 38.4994 49.1116 37.0775 47.9031L31.3792 43.0595C30.5294 42.3371 30.0396 41.278 30.0396 40.1626V27.1881" stroke="url(#nlg)" strokeWidth="3.80198" strokeLinecap="round"/>
              <rect x="19.1089" y="19.5842" width="3.80198" height="3.80198" rx="1.90099" fill="url(#nlr1)"/>
              <rect x="28.1387" y="19.5842" width="3.80198" height="3.80198" rx="1.90099" fill="url(#nlr2)"/>
              <path d="M74.6573 15.9483V45H67.6737V15.9483H74.6573ZM103.849 15.9483V45H96.8651L86.5892 26.9225V45H79.5857V15.9483H86.5892L96.8651 34.0258V15.9483H103.849ZM121.747 15.9483V45H114.743V15.9483H121.747ZM130.486 15.9483V21.3556H106.203V15.9483H130.486ZM133.459 15.9483H144.892C147.127 15.9483 149.069 16.2809 150.718 16.946C152.368 17.6111 153.638 18.5954 154.53 19.899C155.434 21.2026 155.886 22.8122 155.886 24.7277C155.886 26.3904 155.627 27.7805 155.108 28.8979C154.589 30.0152 153.864 30.9397 152.933 31.6713C152.015 32.3896 150.945 32.9816 149.721 33.4472L147.426 34.7441H137.829L137.789 29.3368H144.892C145.783 29.3368 146.522 29.1772 147.107 28.858C147.692 28.5387 148.131 28.0864 148.424 27.5011C148.73 26.9025 148.883 26.1909 148.883 25.3662C148.883 24.5281 148.73 23.8098 148.424 23.2112C148.118 22.6126 147.666 22.1537 147.067 21.8345C146.482 21.5152 145.757 21.3556 144.892 21.3556H140.463V45H133.459V15.9483ZM149.362 45L142.937 32.1502L150.359 32.1103L156.864 44.7007V45H149.362ZM172.427 22.0539L165.344 45H157.822L168.497 15.9483H173.265L172.427 22.0539ZM178.294 45L171.19 22.0539L170.272 15.9483H175.101L185.836 45H178.294ZM178.014 34.1655V39.5728H163.109V34.1655H178.014ZM195.413 15.9483V45H188.43V15.9483H195.413ZM224.605 15.9483V45H217.621L207.345 26.9225V45H200.342V15.9483H207.345L217.621 34.0258V15.9483H224.605ZM242.503 15.9483V45H235.499V15.9483H242.503ZM251.242 15.9483V21.3556H226.959V15.9483H251.242ZM274.208 39.6127V45H258.725V39.6127H274.208ZM261.219 15.9483V45H254.215V15.9483H261.219ZM272.213 27.4812V32.6889H258.725V27.4812H272.213ZM274.268 15.9483V21.3556H258.725V15.9483H274.268ZM296.276 39.6127V45H281.591V39.6127H296.276ZM284.085 15.9483V45H277.081V15.9483H284.085ZM299.349 41.8474C299.349 40.8897 299.695 40.0915 300.387 39.453C301.078 38.8012 301.97 38.4753 303.06 38.4753C304.164 38.4753 305.056 38.8012 305.734 39.453C306.426 40.0915 306.772 40.8897 306.772 41.8474C306.772 42.8052 306.426 43.6099 305.734 44.2617C305.056 44.9002 304.164 45.2195 303.06 45.2195C301.97 45.2195 301.078 44.9002 300.387 44.2617C299.695 43.6099 299.349 42.8052 299.349 41.8474ZM323.911 22.0539L316.828 45H309.306L319.981 15.9483H324.749L323.911 22.0539ZM329.777 45L322.674 22.0539L321.756 15.9483H326.585L337.32 45H329.777ZM329.498 34.1655V39.5728H314.593V34.1655H329.498ZM346.897 15.9483V45H339.914V15.9483H346.897Z" fill="url(#nlt)"/>
              <defs>
                <linearGradient id="nlg" x1="25.5" y1="0" x2="25.5" y2="55" gradientUnits="userSpaceOnUse"><stop stopColor="#00B4D8"/><stop offset="1" stopColor="#0096B7"/></linearGradient>
                <radialGradient id="nlr1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(21 21.5) rotate(90) scale(1.9)"><stop stopColor="#00B4D8"/><stop offset="1" stopColor="#0096B7"/></radialGradient>
                <radialGradient id="nlr2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30 21.5) rotate(90) scale(1.9)"><stop stopColor="#00B4D8"/><stop offset="1" stopColor="#0096B7"/></radialGradient>
                <linearGradient id="nlt" x1="207.5" y1="7" x2="207.5" y2="55" gradientUnits="userSpaceOnUse"><stop stopColor="#ffffff"/><stop offset="1" stopColor="#ddeeff"/></linearGradient>
              </defs>
            </svg>
          </a>
          <span className="nev">📅 Saturday, May 14 2026 · Free Webinar</span>
          <a href="#register" className="nreg">Reserve Your Seat →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="W">
          <div className="hgrid">
            <div className="hleft">
              <div className="pill pt"><span className="dot"></span> Inaugural Webinar · Thursday, May 14 2026</div>
              <h1 className="hxl" style={{marginBottom: '22px'}}>The AI Operating System<br/>Rebuilding <span className="grad">Clinical Trials</span><br/>From the Inside Out</h1>
              <p className="hdesc">86% of trials miss enrollment deadlines. $600K–$850K lost every day a Phase III trial delays. Join IntraIntel.AI's first expert webinar to see how our 18-module compliance-native platform is collapsing the 6-month clinical workflow into 4 weeks — with live demos, real customer case studies, and the world premiere of our Clinical Trial Voice Agent.</p>
              <div className="emeta">
                <div className="ep"><span className="ei">📅</span><div><div className="el">Saturday, May 14 2026</div><div className="es">11:00 AM ET · 90 Minutes</div></div></div>
                <div className="ep"><span className="ei">🌐</span><div><div className="el">Live Virtual Event</div><div className="es">Zoom · Recording provided</div></div></div>
                <div className="ep"><span className="ei">🎯</span><div><div className="el">200 Seats Available</div><div className="es">Healthcare & Clinical Leaders Only</div></div></div>
              </div>
              <div className="tract">
                <div><div className="tn">$350K</div><div className="tl">ARR · Active 2026</div></div>
                <div><div className="tn">95%+</div><div className="tl">Pilot-to-Paid Rate</div></div>
                <div><div className="tn">15+</div><div className="tl">Enterprise Deployments</div></div>
                <div><div className="tn">$50M+</div><div className="tl">Documented Customer Value</div></div>
              </div>
            </div>

            {/* REGISTER CARD */}
            <div id="register" className="rc">
              <div className="rt">Secure Your Seat</div>
              <div className="rs">Free registration · Limited to 200 professionals</div>
              <div className="sw">🔥 &nbsp;<span>Registration filling fast — {seatsLeft} seats only</span></div>
              
              {status !== 'success' ? (
                <form id="reg-form" onSubmit={handleSubmit}>
                  <div className="r2">
                    <div className="fg">
                      <label className="fl">First Name *</label>
                      <input type="text" className={`fi ${!formData.firstName && status === 'error' ? 'error-border' : ''}`} placeholder="Jane" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className="fg">
                      <label className="fl">Last Name *</label>
                      <input type="text" className={`fi ${!formData.lastName && status === 'error' ? 'error-border' : ''}`} placeholder="Smith" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="fg">
                    <label className="fl">Work Email *</label>
                    <input type="email" className={`fi ${!formData.email && status === 'error' ? 'error-border' : ''}`} placeholder="jane@company.com" name="email" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="fg">
                    <label className="fl">Organization *</label>
                    <input type="text" className={`fi ${!formData.company && status === 'error' ? 'error-border' : ''}`} placeholder="Your company or institution" name="company" value={formData.company} onChange={handleChange} required />
                  </div>
                  <div className="fg">
                    <label className="fl">Your Role *</label>
                    <select className={`fs ${!formData.role && status === 'error' ? 'error-border' : ''}`} name="role" value={formData.role} onChange={handleChange} required>
                      <option value="" disabled>Select your title</option>
                      <optgroup label="Executive & Clinical Leadership">
                        <option>Chief Medical Officer (CMO)</option><option>Chief Clinical Officer (CCO)</option><option>Chief Scientific Officer (CSO)</option><option>Chief Innovation Officer (CINO)</option><option>Chief Medical Informatics Officer (CMIO)</option>
                      </optgroup>
                      <optgroup label="Clinical Operations">
                        <option>VP, Clinical Operations</option><option>Director of Clinical Trials</option><option>Head of Clinical Development</option><option>Clinical Operations Director</option><option>Clinical Research Director</option>
                      </optgroup>
                      <optgroup label="Data & Analytics">
                        <option>VP, Clinical Data Management</option><option>Head of Clinical Informatics</option><option>Director of Clinical Analytics</option><option>Head of Data Science & Analytics</option>
                      </optgroup>
                      <optgroup label="Regulatory & Compliance">
                        <option>VP, Regulatory Affairs</option><option>Director, Regulatory Operations</option><option>Head of Compliance & Quality Assurance</option>
                      </optgroup>
                      <optgroup label="Medical Device & Pharma">
                        <option>Head of Medical Device Development</option><option>VP, Medical Affairs</option><option>Director, Medical Device Innovation</option>
                      </optgroup>
                      <optgroup label="IT & Digital Transformation">
                        <option>Chief Information Officer (CIO)</option><option>Chief Digital Officer (CDO)</option><option>Director, Healthcare IT Integration</option>
                      </optgroup>
                      <optgroup label="Business Development">
                        <option>VP, Strategic Partnerships</option><option>Head of Business Development (Clinical)</option>
                      </optgroup>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="fg">
                    <label className="fl">Your Biggest Clinical Trial Challenge</label>
                    <input type="text" className="fi" placeholder="e.g. enrollment delays, data quality, FDA submission..." name="challenge" value={formData.challenge} onChange={handleChange} />
                  </div>
                  {errorMsg && <div className="error-text">{errorMsg}</div>}
                  <button type="submit" className="breg" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Registering...' : 'Reserve My Seat — May 15 →'}
                  </button>
                  <p className="priv">🔒 &nbsp;No spam. No data selling. HIPAA & GDPR compliant.</p>
                </form>
              ) : (
                <div className="succ" id="reg-success">
                  <div className="sico">✓</div>
                  <h3>You're registered!</h3>
                  <p>Check your inbox for confirmation<br/>and calendar invite. See you Saturday, May 15.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STRIP */}
      <div className="strip">
        <div className="W">
          <div className="sg">
            <div className="ss"><div className="sn">86<span className="su">%</span></div><div className="sl">Of clinical trials miss their original enrollment deadline</div></div>
            <div className="ss"><div className="sn">$850<span className="su">K</span></div><div className="sl">Lost per day of Phase III delay in revenue &amp; costs</div></div>
            <div className="ss"><div className="sn">50<span className="su">%</span></div><div className="sl">Of trial sites enroll one or zero patients per trial</div></div>
            <div className="ss"><div className="sn">$2.6<span className="su">B</span></div><div className="sl">Average cost to bring a single drug to market</div></div>
            <div className="ss"><div className="sn">10.7<span className="su">%</span></div><div className="sl">Pharma companies with fully implemented clinical AI</div></div>
          </div>
        </div>
      </div>

      {/* AGENDA */}
      <section className="SEC">
        <div className="W">
          <div className="sh rev">
            <div className="eyebrow">Session Agenda · Saturday, May 14 2026</div>
            <h2 className="hlg">90 Minutes. Zero Fluff.<br/>100% Actionable Intelligence.</h2>
            <p>Designed for senior clinical and healthcare executives who need data, not slides. Every session grounded in live deployments and documented customer outcomes.</p>
          </div>
          <div className="ag-grid rev d1">
            <div className="ag full">
              <div className="at">⚡ Session 1 · 0:00 – 0:15 · CEO Keynote</div>
              <div className="ah">The $2.6B Clinical Trial Crisis — and Why Current AI Tools Are Making It Worse</div>
              <div className="ad">Why 86% of trials still fail despite billions in AI investment — the fragmentation problem, the point-solution trap, and what a compliance-native orchestration layer built as a Software as a Medical Device (SaMD) actually means for your organization. Delivered live by Dev Roy, Founder &amp; CEO.</div>
              <div className="ach"><span className="chip">Market Data</span><span className="chip">SaMD Architecture</span><span className="chip cg">CEO Keynote</span><span className="chip">Orchestration Layer</span></div>
            </div>
            <div className="ag">
              <div className="at">🧬 Session 2 · 0:15 – 0:35</div>
              <div className="ah">Live Platform Demo: EHR to FDA-Ready Output in One Unified Workflow</div>
              <div className="ad">Watch IntraIntel connect to a live clinical system — no migration, 5-minute OAuth — and generate protocol designs, endpoint benchmarks, and regulatory summaries in real time across 50+ data sources including FHIR/HL7, EHR, EMR, SharePoint, AWS, and Azure.</div>
              <div className="ach"><span className="chip">Live Demo</span><span className="chip">FDA Compliance</span><span className="chip">FHIR/HL7</span><span className="chip">Zero Migration</span></div>
            </div>
            <div className="ag">
              <div className="at">🎤 Session 3 · 0:35 – 0:55</div>
              <div className="ah">LIVE DEBUT: AI Voice Agent for Clinical Trials — Patient Engagement at Scale</div>
              <div className="ad">First-ever public demonstration of IntraIntel's Clinical Trial Voice Agent — AI voice agents that automate daily patient follow-ups, adverse event screening, and compliance tracking with 70%+ reduction in coordinator burden and 87% patient satisfaction in 21 CFR Part 11-compliant interactions.</div>
              <div className="ach"><span className="chip cg">World Premiere</span><span className="chip">Voice AI</span><span className="chip">21 CFR Part 11</span><span className="chip">Patient Retention</span></div>
            </div>
            <div className="ag">
              <div className="at">📊 Session 4 · 0:55 – 1:10</div>
              <div className="ah">Case Studies: Restorative Therapies, XylyxBio &amp; Solaris Endovascular</div>
              <div className="ad">Documented results from live clinical deployments — 80% cost reduction, 60% faster FDA IND drafting, 96% executive time savings — with the exact workflow changes that produced each outcome. Named customers. Real numbers. Zero extrapolation.</div>
              <div className="ach"><span className="chip">Customer Proof</span><span className="chip">ROI Data</span><span className="chip">Medical Device</span><span className="chip">FDA IND</span></div>
            </div>
            <div className="ag">
              <div className="at">🛡 Session 5 · 1:10 – 1:20</div>
              <div className="ah">SaMD Pathway — 510(k), CPT/HCPCS Reimbursement &amp; What It Means for Buyers</div>
              <div className="ad">The only clinical AI platform with an active FDA 510(k) submission targeted Q3 2026 and a planned CPT/HCPCS insurance reimbursement pathway — what it means for procurement decisions, compliance, and long-term enterprise ROI.</div>
              <div className="ach"><span className="chip">510(k)</span><span className="chip">CPT/HCPCS</span><span className="chip">SOC 2 Type I</span><span className="chip">HIPAA</span></div>
            </div>
            <div className="ag">
              <div className="at">💬 Session 6 · 1:20 – 1:30</div>
              <div className="ah">Open Q&amp;A — Your Questions, Answered Live by the Founding Team</div>
              <div className="ad">Direct access to Dev Roy (CEO), Brian Hoffman (CTO), and advisory board members carrying 150+ combined years of SaMD and healthcare AI experience. Submit your questions at registration to prioritize them on the call.</div>
              <div className="ach"><span className="chip cg">Live Q&amp;A</span><span className="chip">Advisory Board</span><span className="chip">150+ Yrs Experience</span></div>
            </div>
          </div>
        </div>
      </section>
 

      {/* PLATFORM MODULES */}
      <section className="SEC">
        <div className="W">
          <div className="sh rev">
            <div className="eyebrow">Platform Architecture · clinical.intraintel.ai</div>
            <h2 className="hlg">18 AI Modules.<br/>Clinical Intelligence &amp; Reimbursement in One Platform.</h2>
            <p>clinical.intraintel.ai covers the complete trial lifecycle — from literature review to reimbursement optimization. Every module is AI-Powered, compliance-native, and connects without data migration.</p>
          </div>

           
        </div>
      </section>
 
      {/* CTA */}
      <section className="SEC">
        <div className="W">
          <div className="ctab rev">
            <div className="ctai">
              <h2>Saturday, May 15. 200 Seats. Free.</h2>
              <p>The first public demonstration of AI-native clinical trial orchestration — including the live world premiere of IntraIntel's Clinical Trial Voice Agent. Your competitors are already evaluating this category.</p>
              <div className="br">
                <a href="#register" className="bw">Register Your Spot Now</a>
                <a href="mailto:dev.roy@intraintel.ai" className="bo">Contact Dev Roy Directly</a>
              </div>
              <p className="ccon">dev.roy@intraintel.ai &nbsp;·&nbsp; 703-984-9981 &nbsp;·&nbsp; clinical.intraintel.ai &nbsp;·&nbsp; Fairfax, Virginia</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="W">
          <div className="fi2">
            <div className="fb">
              <svg width="200" height="32" viewBox="0 0 347 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.0099 27.1881V40.1626C21.0099 41.278 20.5201 42.3371 19.6703 43.0595L13.9673 47.907C12.5475 49.1138 10.4624 49.1138 9.0426 47.907L3.33963 43.0595C2.48978 42.3371 2 41.278 2 40.1626V17.773C2 16.415 2.72434 15.1601 3.90027 14.4808L23.6052 3.0985C24.7819 2.41879 26.2319 2.41879 27.4086 3.0985L47.1134 14.4808C48.2894 15.1601 49.0137 16.415 49.0137 17.773V40.1669C49.0137 41.2798 48.5261 42.3368 47.6795 43.0592L42.0076 47.8985C40.5881 49.1096 38.4994 49.1116 37.0775 47.9031L31.3792 43.0595C30.5294 42.3371 30.0396 41.278 30.0396 40.1626V27.1881" stroke="url(#flg)" strokeWidth="3.80198" strokeLinecap="round"/>
                <rect x="19.1089" y="19.5842" width="3.80198" height="3.80198" rx="1.90099" fill="url(#flr1)"/>
                <rect x="28.1387" y="19.5842" width="3.80198" height="3.80198" rx="1.90099" fill="url(#flr2)"/>
                <path d="M74.6573 15.9483V45H67.6737V15.9483H74.6573ZM103.849 15.9483V45H96.8651L86.5892 26.9225V45H79.5857V15.9483H86.5892L96.8651 34.0258V15.9483H103.849ZM121.747 15.9483V45H114.743V15.9483H121.747ZM130.486 15.9483V21.3556H106.203V15.9483H130.486ZM133.459 15.9483H144.892C147.127 15.9483 149.069 16.2809 150.718 16.946C152.368 17.6111 153.638 18.5954 154.53 19.899C155.434 21.2026 155.886 22.8122 155.886 24.7277C155.886 26.3904 155.627 27.7805 155.108 28.8979C154.589 30.0152 153.864 30.9397 152.933 31.6713C152.015 32.3896 150.945 32.9816 149.721 33.4472L147.426 34.7441H137.829L137.789 29.3368H144.892C145.783 29.3368 146.522 29.1772 147.107 28.858C147.692 28.5387 148.131 28.0864 148.424 27.5011C148.73 26.9025 148.883 26.1909 148.883 25.3662C148.883 24.5281 148.73 23.8098 148.424 23.2112C148.118 22.6126 147.666 22.1537 147.067 21.8345C146.482 21.5152 145.757 21.3556 144.892 21.3556H140.463V45H133.459V15.9483ZM149.362 45L142.937 32.1502L150.359 32.1103L156.864 44.7007V45H149.362ZM172.427 22.0539L165.344 45H157.822L168.497 15.9483H173.265L172.427 22.0539ZM178.294 45L171.19 22.0539L170.272 15.9483H175.101L185.836 45H178.294ZM178.014 34.1655V39.5728H163.109V34.1655H178.014ZM195.413 15.9483V45H188.43V15.9483H195.413ZM224.605 15.9483V45H217.621L207.345 26.9225V45H200.342V15.9483H207.345L217.621 34.0258V15.9483H224.605ZM242.503 15.9483V45H235.499V15.9483H242.503ZM251.242 15.9483V21.3556H226.959V15.9483H251.242ZM274.208 39.6127V45H258.725V39.6127H274.208ZM261.219 15.9483V45H254.215V15.9483H261.219ZM272.213 27.4812V32.6889H258.725V27.4812H272.213ZM274.268 15.9483V21.3556H258.725V15.9483H274.268ZM296.276 39.6127V45H281.591V39.6127H296.276ZM284.085 15.9483V45H277.081V15.9483H284.085ZM299.349 41.8474C299.349 40.8897 299.695 40.0915 300.387 39.453C301.078 38.8012 301.97 38.4753 303.06 38.4753C304.164 38.4753 305.056 38.8012 305.734 39.453C306.426 40.0915 306.772 40.8897 306.772 41.8474C306.772 42.8052 306.426 43.6099 305.734 44.2617C305.056 44.9002 304.164 45.2195 303.06 45.2195C301.97 45.2195 301.078 44.9002 300.387 44.2617C299.695 43.6099 299.349 42.8052 299.349 41.8474ZM323.911 22.0539L316.828 45H309.306L319.981 15.9483H324.749L323.911 22.0539ZM329.777 45L322.674 22.0539L321.756 15.9483H326.585L337.32 45H329.777ZM329.498 34.1655V39.5728H314.593V34.1655H329.498ZM346.897 15.9483V45H339.914V15.9483H346.897Z" fill="url(#flt)"/>
                <defs>
                  <linearGradient id="flg" x1="25.5" y1="0" x2="25.5" y2="55" gradientUnits="userSpaceOnUse"><stop stopColor="#00B4D8"/><stop offset="1" stopColor="#0096B7"/></linearGradient>
                  <radialGradient id="flr1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(21 21.5) rotate(90) scale(1.9)"><stop stopColor="#00B4D8"/><stop offset="1" stopColor="#0096B7"/></radialGradient>
                  <radialGradient id="flr2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(30 21.5) rotate(90) scale(1.9)"><stop stopColor="#00B4D8"/><stop offset="1" stopColor="#0096B7"/></radialGradient>
                  <linearGradient id="flt" x1="207.5" y1="7" x2="207.5" y2="55" gradientUnits="userSpaceOnUse"><stop stopColor="#ffffff"/><stop offset="1" stopColor="#aaccee"/></linearGradient>
                </defs>
              </svg>
              <div style={{marginTop: '4px'}}><div className="fbt">Your Data. Your AI. Your Way.</div></div>
            </div>
            <div className="flinks">
              <a href="https://intraintel.ai" target="_blank" rel="noreferrer">intraintel.ai</a>
              <a href="https://clinical.intraintel.ai" target="_blank" rel="noreferrer">clinical.intraintel.ai</a>
              <a href="mailto:dev.roy@intraintel.ai">dev.roy@intraintel.ai</a>
              <a href="tel:7039849981">703-984-9981</a>
            </div>
            <div className="fcp">© 2026 IntraIntel.AI. All rights reserved.<br/>Fairfax, Virginia, USA &nbsp;·&nbsp; SOC 2 Type I Certified</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
