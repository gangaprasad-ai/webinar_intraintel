import React, { useState, useEffect, useRef } from 'react';
import ReactGA from "react-ga4";
import './index.css';

// Connect to local backend in development, but use Vercel environment variable in production
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
      const response = await fetch(`${apiUrl}/contact/contactUS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to register. Please try again.');
      }

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
          <span className="nev">📅 Monday, April 20, 2026 · Free Webinar</span>
          <a href="#register" className="nreg">Reserve Your Seat →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="W">
          <div className="hgrid">
            <div className="hleft">
              <div className="pill pt"><span className="dot"></span> Inaugural Webinar · Monday, April 20, 2026</div>
              <h1 className="hxl" style={{marginBottom: '22px'}}>The AI Operating System<br/>Rebuilding <span className="grad">Clinical Trials</span><br/>From the Inside Out</h1>
              <p className="hdesc">86% of trials miss enrollment deadlines. $600K–$850K lost every day a Phase III trial delays. Join IntraIntel.AI's first expert webinar to see how our 18-module compliance-native platform is collapsing the 6-month clinical workflow into 4 weeks — with live demos, real customer case studies, and the world premiere of our Clinical Trial Voice Agent.</p>
              <div className="emeta">
                <div className="ep"><span className="ei">📅</span><div><div className="el">Monday, April 20, 2026</div><div className="es">11:00 AM ET · 90 Minutes</div></div></div>
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
                    {status === 'loading' ? 'Registering...' : 'Reserve My Seat — April 20 →'}
                  </button>
                  <p className="priv">🔒 &nbsp;No spam. No data selling. HIPAA & GDPR compliant.</p>
                </form>
              ) : (
                <div className="succ" id="reg-success">
                  <div className="sico">✓</div>
                  <h3>You're registered!</h3>
                  <p>Check your inbox for confirmation<br/>and calendar invite. See you Monday, April 20.</p>
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
            <div className="eyebrow">Session Agenda · Monday, April 20, 2026</div>
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

      {/* VOICE MODULE */}
      <section className="SECA">
        <div className="W">
          <div className="vw rev">
            <div className="vl">
              <div className="pill pg">🎙 World Premiere · Monday, April 20</div>
              <h2 className="hlg" style={{marginBottom: '18px'}}>Introducing the<br/><span className="grad">Clinical Trial Voice Agent</span></h2>
              <p>80–86% of trials miss enrollment deadlines. Coordinators burn out managing fragmented outreach systems. Patients drop out at 20–30% rates — costing $19,533 to replace each one. IntraIntel's Clinical Trial Voice Agent delivers daily automated patient follow-ups, adverse event screening, and compliance tracking — all via 21 CFR Part 11-compliant AI voice. Debuting live at this webinar for the very first time.</p>
              <div className="vstats">
                <div className="vs"><div className="vsn">87%</div><div className="vsl">Patient satisfaction with AI voice agents (VOICE-COVID-19-II RCT)</div></div>
                <div className="vs"><div className="vsn">70%+</div><div className="vsl">Reduction in coordinator phone workflow burden</div></div>
                <div className="vs"><div className="vsn">89%</div><div className="vsl">Trial completion rate vs. 60% in traditional models</div></div>
                <div className="vs"><div className="vsn">38%</div><div className="vsl">CAGR of AI voice agents in healthcare (Grand View Research)</div></div>
              </div>
            </div>
            <div className="vmods">
              <div className="vm"><div className="vmi">📞</div><div><div className="vmn">Patient Outreach &amp; Enrollment</div><div className="vmd">Automated multilingual voice calls for screening, scheduling, and enrollment — reducing site burden by up to 90%.</div></div></div>
              <div className="vm"><div className="vmi">📋</div><div><div className="vmn">PRO Data Capture</div><div className="vmd">Structured patient-reported outcome collection via voice — 21 CFR Part 11 compliant with full audit trail and timestamping.</div></div></div>
              <div className="vm"><div className="vmi">⚠️</div><div><div className="vmn">Adverse Event Detection</div><div className="vmd">Real-time AE signal detection from voice — flagging adverse events up to 300x faster than manual review workflows.</div></div></div>
              <div className="vm"><div className="vmi">📊</div><div><div className="vmn">Retention &amp; Sentiment Analytics</div><div className="vmd">Dropout risk scoring and sentiment analysis from every patient interaction — with real-time coordinator dashboards.</div></div></div>
              <div className="vm"><div className="vmi">🛡</div><div><div className="vmn">Compliance-Native Architecture</div><div className="vmd">21 CFR Part 11, HIPAA, and GDPR from Day 1. Every interaction logged, timestamped, encrypted, and audit-ready.</div></div></div>
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

          <div style={{display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px'}} className="rev">
            <div style={{width: '4px', height: '24px', background: 'linear-gradient(180deg,var(--teal),var(--teal-deep))', borderRadius: '2px', flexShrink: 0}}></div>
            <div>
              <span style={{fontSize: '13px', fontWeight: 700, color: 'var(--white)'}}>Clinical Intelligence</span>
              <span style={{fontSize: '12px', color: 'var(--muted)', marginLeft: '8px'}}>14 modules</span>
            </div>
          </div>
          <div className="mg rev d1" style={{marginBottom: '40px'}}>
            <div className="mo"><div className="mon">01</div><div><div className="mot">Research &amp; Literature Intelligence</div><div className="mod">AI-powered aggregation, recursive citation mining, predicate device comparison, automated insight synthesis from PubMed, ClinicalTrials.gov &amp; MAUDE.</div></div></div>
            <div className="mo"><div className="mon">02</div><div><div className="mot">Protocol Design &amp; FDA Alignment</div><div className="mod">Predictive endpoint modeling, regulatory correlation analysis, Monte Carlo power simulations aligned to FDA predicate criteria.</div></div></div>
            <div className="mo"><div className="mon">03</div><div><div className="mot">Real-Time Trial Data Monitoring</div><div className="mod">Site-level ingestion, anomaly detection, adverse event flagging, and real-time dashboards across all active trial sites.</div></div></div>
            <div className="mo"><div className="mon">04</div><div><div className="mot">Endpoint Analytics &amp; Benchmarking</div><div className="mod">Compare trial outcomes to historical FDA predicate data and competitor endpoints — alignment gaps surfaced instantly.</div></div></div>
            <div className="mo"><div className="mon">05</div><div><div className="mot">Predictive Endpoint Recommendation Engine</div><div className="mod">AI forecasts FDA acceptance likelihood and recommends protocol refinements to maximize regulatory submission success.</div></div></div>
            <div className="mo"><div className="mon">06</div><div><div className="mot">Documentation, Coding &amp; Reimbursement Optimization</div><div className="mod">NLP-driven coding accuracy, claims validation, and billing optimization — fully aligned to CPT/HCPCS pathway.</div></div></div>
            <div className="mo"><div className="mon">07</div><div><div className="mot">Precision Patient Care Analytics</div><div className="mod">Integrate vitals, biomarkers, EHR data — detect real-time complications and deliver personalized AI-driven care recommendations.</div></div></div>
            <div className="mo"><div className="mon">08</div><div><div className="mot">AI Clinical Decision Support</div><div className="mod">Evidence-based recommendations, guideline retrieval, task triage, and clinician fatigue mitigation via conversational AI interfaces.</div></div></div>
            <div className="mo"><div className="mon">09</div><div><div className="mot">Device Integration &amp; IoT Hub</div><div className="mod">HL7/FHIR device integration, real-time device metrics ingestion, extensible architecture for future medical device innovations.</div></div></div>
            <div className="mo"><div className="mon">10</div><div><div className="mot">Post-Market Clinical Support &amp; Training</div><div className="mod">AI-generated continuous education, clinician support, and 24/7 AI Q&amp;A — sustaining adoption and performance post-trial.</div></div></div>
            <div className="mo"><div className="mon">11</div><div><div className="mot">IP &amp; Commercialization Strategy</div><div className="mod">Identify patentable innovations, monitor IP opportunities, and generate AI-driven commercialization pathways and monetization roadmaps.</div></div></div>
            <div className="mo"><div className="mon">12</div><div><div className="mot">Patient Recruitment &amp; Retention</div><div className="mod">AI-driven recruitment optimization, demographic targeting, eligibility screening, and compliance monitoring across trial sites.</div></div></div>
            <div className="mo"><div className="mon">13</div><div><div className="mot">Precision Patient Recruitment (Advanced)</div><div className="mod">Predictive enrollment modeling, automated candidate screening, and accelerated timeline analysis to hit enrollment milestones.</div></div></div>
            <div className="mo" style={{borderColor: 'rgba(244,162,97,0.25)', background: 'rgba(244,162,97,0.04)'}}><div className="mon" style={{background: 'linear-gradient(135deg,var(--gold),#e07840)'}}>14</div><div><div className="mot" style={{color: 'var(--gold)'}}>Clinical Trial Voice Agent <span style={{fontSize: '10px', fontWeight: 700, background: 'var(--gold-dim)', border: '1px solid rgba(244,162,97,0.3)', borderRadius: '4px', padding: '2px 7px', color: 'var(--gold)', marginLeft: '6px'}}>LIVE DEBUT APR 20</span></div><div className="mod">Daily automated patient follow-ups, adverse event screening, and compliance tracking via 21 CFR Part 11-compliant AI voice agent.</div></div></div>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px'}} className="rev">
            <div style={{width: '4px', height: '24px', background: 'linear-gradient(180deg,var(--gold),#e07840)', borderRadius: '2px', flexShrink: 0}}></div>
            <div>
              <span style={{fontSize: '13px', fontWeight: 700, color: 'var(--white)'}}>Reimbursement &amp; Market Access</span>
              <span style={{fontSize: '12px', color: 'var(--muted)', marginLeft: '8px'}}>4 modules</span>
            </div>
          </div>
          <div className="mg rev d2">
            <div className="mo" style={{borderColor: 'rgba(244,162,97,0.18)'}}><div className="mon" style={{background: 'linear-gradient(135deg,var(--gold),#e07840)'}}>15</div><div><div className="mot">Reimbursement Intelligence Module</div><div className="mod">CPT/ICD/HCPCS coding automation, NTAP/TPT/TCET workflow, DRG mapping, and site-of-service financial modeling.</div></div></div>
            <div className="mo" style={{borderColor: 'rgba(244,162,97,0.18)'}}><div className="mon" style={{background: 'linear-gradient(135deg,var(--gold),#e07840)'}}>16</div><div><div className="mot">CMS Application Automation (NTAP/TPT Generator)</div><div className="mod">Auto-fill CMS NTAP/TPT templates using clinical and cost data — cutting application preparation time by 70%+.</div></div></div>
            <div className="mo" style={{borderColor: 'rgba(244,162,97,0.18)'}}><div className="mon" style={{background: 'linear-gradient(135deg,var(--gold),#e07840)'}}>17</div><div><div className="mot">Financial Margin &amp; Pricing Simulator</div><div className="mod">Simulate IPPS/OPPS/ASC/OBL payments, calculate margin per procedure, and run sensitivity analyses for pricing strategy.</div></div></div>
            <div className="mo" style={{borderColor: 'rgba(244,162,97,0.18)'}}><div className="mon" style={{background: 'linear-gradient(135deg,var(--gold),#e07840)'}}>18</div><div><div className="mot">Market Access Strategy &amp; Intelligence</div><div className="mod">Payer landscape analysis, formulary positioning, and AI-driven market access roadmaps for accelerated commercial adoption.</div></div></div>
          </div>
        </div>
      </section>

      {/* SPEAKERS */}
      <section className="SECA">
        <div className="W">
          <div className="sh rev">
            <div className="eyebrow">Your Hosts</div>
            <h2 className="hlg">Founding Team &amp;<br/>Advisory Board</h2>
            <p>150+ combined years of SaMD, clinical AI, and regulated healthcare deployment experience — available live for your questions on Monday, April 20.</p>
          </div>
          <div className="spg rev d1">
            <div className="sp">
              <div className="spa">DR</div>
              <div className="spn">Dev Roy</div>
              <div className="spr">Founder &amp; CEO</div>
              <div className="spo">IntraIntel.AI · Fairfax, Virginia</div>
              <div className="spb">Leads strategy, enterprise growth, and high-stakes clinical operations. Bootstrapped IntraIntel from a $12K first customer to $350K ARR with 15+ paying customers and $50M+ in documented customer value — zero institutional capital.</div>
            </div>
            <div className="sp">
              <div className="spa">BH</div>
              <div className="spn">Brian Hoffman</div>
              <div className="spr">CTO &amp; Co-Founder</div>
              <div className="spo">IntraIntel.AI</div>
              <div className="spb">Architect of IntraIntel's secure, multi-agent SaMD platform. Designed the zero-migration OAuth connection to 50+ clinical data sources including FHIR/HL7, EHR, EMR, SharePoint, AWS, and Azure. Leads all compliant AI systems architecture.</div>
            </div>
            <div className="sp">
              <div className="spa">AL</div>
              <div className="spn">Alex Lee</div>
              <div className="spr">FDA Compliance Advisor</div>
              <div className="spo">Advisory Board · 30+ Years FDA/SaMD</div>
              <div className="spb">30+ years in FDA compliance and SaMD device approvals. Guiding IntraIntel's 510(k) regulatory pathway and CPT/HCPCS reimbursement strategy — the only advisor of this caliber embedded at seed stage in this category.</div>
            </div>
          </div>
          <div className="adv-grid rev d2">
            <div className="adv"><div className="adv-av">PM</div><div><div className="adv-n">Dr. Pradipta Majumder, MD</div><div className="adv-r">20+ yrs Clinical Research &amp; AI Integration</div></div></div>
            <div className="adv"><div className="adv-av">ZB</div><div><div className="adv-n">Prof. Dr. Zeynep Birsu Çinçin</div><div className="adv-r">20+ yrs Oncology Trials &amp; Biomarkers</div></div></div>
            <div className="adv"><div className="adv-av">RD</div><div><div className="adv-n">Raj DasGupta · CTO, RIVA Solutions</div><div className="adv-r">20+ yrs Cloud &amp; Cybersecurity</div></div></div>
            <div className="adv"><div className="adv-av">MP</div><div><div className="adv-n">Mukesh Pandey</div><div className="adv-r">20+ yrs AI Strategy · Former Amazon/Google</div></div></div>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="SEC">
        <div className="W">
          <div className="sh rev">
            <div className="eyebrow">Who Should Attend</div>
            <h2 className="hlg">Built for Decision-Makers<br/>Who Own Clinical Outcomes</h2>
            <p>If your organization runs, manages, funds, or regulates clinical trials — this webinar is designed for your exact challenges and buying criteria.</p>
          </div>
          <div className="audg rev d1">
            <div className="aud"><div className="aui">🏥</div><div className="aud-dept">Executive &amp; Clinical</div><ul><li>Chief Medical Officer</li><li>Chief Clinical Officer</li><li>Chief Scientific Officer</li><li>Chief Innovation Officer</li><li>Chief Medical Informatics Officer</li></ul></div>
            <div className="aud"><div className="aui">⚙️</div><div className="aud-dept">Clinical Operations</div><ul><li>VP, Clinical Operations</li><li>Director of Clinical Trials</li><li>Head of Clinical Development</li><li>Clinical Operations Director</li><li>Clinical Research Director</li></ul></div>
            <div className="aud"><div className="aui">📊</div><div className="aud-dept">Data &amp; Analytics</div><ul><li>VP, Clinical Data Management</li><li>Head of Clinical Informatics</li><li>Director of Clinical Analytics</li><li>Head of Data Science &amp; Analytics</li></ul></div>
            <div className="aud"><div className="aui">📋</div><div className="aud-dept">Regulatory &amp; Compliance</div><ul><li>VP, Regulatory Affairs</li><li>Director, Regulatory Operations</li><li>Head of Compliance &amp; QA</li></ul></div>
            <div className="aud"><div className="aui">🔬</div><div className="aud-dept">Medical Device &amp; Pharma</div><ul><li>Head of Device Development</li><li>VP, Medical Affairs</li><li>Director, Device Innovation</li></ul></div>
            <div className="aud"><div className="aui">💻</div><div className="aud-dept">IT &amp; Digital</div><ul><li>Chief Information Officer</li><li>Chief Digital Officer</li><li>Director, Healthcare IT Integration</li></ul></div>
            <div className="aud"><div className="aui">🤝</div><div className="aud-dept">Business Development</div><ul><li>VP, Strategic Partnerships</li><li>Head of BD (Clinical)</li></ul></div>
            <div className="aud" style={{background: 'rgba(0,180,216,0.055)', borderColor: 'rgba(0,180,216,0.2)'}}><div className="aui">💡</div><div className="aud-dept" style={{color: 'var(--gold)'}}>Not Sure?</div><ul><li>You operate or fund clinical research</li><li>You manage AI vendor decisions</li><li>You evaluate SaMD platforms</li><li>You belong in this room.</li></ul></div>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="SECA">
        <div className="W">
          <div className="sh rev">
            <div className="eyebrow">Platform Proof</div>
            <h2 className="hlg">Not a Demo Company.<br/>A Deployed Platform.</h2>
            <p>Every case study at this webinar is a live customer deployment with documented, attributable outcomes. Not projected. Not modeled. Named customers. Real results.</p>
          </div>
          <div className="pg3 rev d1">
            <div className="pf">
              <div className="pfc">Restorative Therapies · Medical Devices / FES Therapy</div>
              <div className="pfh">AI-Powered Clinical Data Integration &amp; Neuromodulation Optimization</div>
              <div className="pfn">Manual clinical literature review eliminated. Training video production cut from 6 weeks to 48 hours. Real-time patient monitoring and FDA regulatory reporting automated across a 9-module platform.</div>
              <div className="pfb">80<span className="pfu">%</span></div>
              <div className="pfc2">Cost reduction · 50%+ training time reduction · 30–40% faster protocols</div>
            </div>
            <div className="pf">
              <div className="pfc">XylyxBio · Biomaterials / FDA IND Readiness</div>
              <div className="pfh">Regulatory Document Automation for Pre-IND Submission</div>
              <div className="pfn">Multiple FDA revision cycles reduced. Automated FDA-ready module generation, integrated efficacy tables, and compliance-first document drafting accelerated IND submission and valuation milestones.</div>
              <div className="pfb">60<span className="pfu">%</span></div>
              <div className="pfc2">Faster FDA IND drafting · 40% fewer edits · 25% faster time-to-valuation</div>
            </div>
            <div className="pf">
              <div className="pfc">TransRadial / Solaris · Vascular Devices &amp; Investment DD</div>
              <div className="pfh">Clinical Marketing Automation &amp; Investment Due Diligence</div>
              <div className="pfn">2,000+ files ingested. 176 due diligence questions auto-answered. Real-time EMR-integrated risk calculator. Executive content creation reduced from 8 hours to 20 minutes. $25K+ saved per deal.</div>
              <div className="pfb">96<span className="pfu">%</span></div>
              <div className="pfc2">Executive time saved (8 hrs → 20 min) · 70% DD reduction · $25K+/deal</div>
            </div>
          </div>
          <div className="bdg-row rev d2">
            <div className="bdg">🔒 SOC 2 Type I Certified</div>
            <div className="bdg">🏥 HIPAA Compliant</div>
            <div className="bdg">🛡 AES-256 Zero Trust</div>
            <div className="bdg">📋 GDPR Aligned</div>
            <div className="bdg">⚡ 4–8 Week ROI</div>
            <div className="bdg">🔗 Zero Data Migration</div>
            <div className="bdg">🧬 SaMD · FDA 510(k) Q3 2026</div>
            <div className="bdg">💰 CPT/HCPCS Pathway</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="SEC">
        <div className="W">
          <div className="ctab rev">
            <div className="ctai">
              <h2>Monday, April 20. 200 Seats. Free.</h2>
              <p>The first public demonstration of AI-native clinical trial orchestration — including the live world premiere of IntraIntel's Clinical Trial Voice Agent. Your competitors are already evaluating this category.</p>
              <div className="br">
                <a href="#register" className="bw">Register Now — It's Free →</a>
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
