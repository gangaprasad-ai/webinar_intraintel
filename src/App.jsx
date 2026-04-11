import React, { useState, useEffect } from 'react';
import ReactGA from "react-ga4";
import './index.css';

// Import Assets directly so Vite bundles them natively
import DevRoyImg from '../public/images/DevRoyImgV2.svg';
import BrianHoffmanImg from '../public/images/BrianHoffmanImgV2.svg';
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
  const [seatsLeft, setSeatsLeft] = useState(200);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utms = {};
    for (const [key, value] of params.entries()) {
      if (key.toLowerCase().startsWith('utm_')) {
        utms[key] = value;
      }
    }
    setUtmData(utms);

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
          <a href="#" className="nav-logo" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
             
            <svg width="160" height="29" viewBox="0 0 347 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.0099 27.1881V40.1626C21.0099 41.278 20.5201 42.3371 19.6703 43.0595L13.9673 47.907C12.5475 49.1138 10.4624 49.1138 9.0426 47.907L3.33963 43.0595C2.48978 42.3371 2 41.278 2 40.1626V17.773C2 16.415 2.72434 15.1601 3.90027 14.4808L23.6052 3.0985C24.7819 2.41879 26.2319 2.41879 27.4086 3.0985L47.1134 14.4808C48.2894 15.1601 49.0137 16.415 49.0137 17.773V40.1669C49.0137 41.2798 48.5261 42.3368 47.6795 43.0592L42.0076 47.8985C40.5881 49.1096 38.4994 49.1116 37.0775 47.9031L31.3792 43.0595C30.5294 42.3371 30.0396 41.278 30.0396 40.1626V27.1881" stroke="#00B4D8" strokeWidth="3.8" strokeLinecap="round"/>
              <path d="M74.6573 15.9483V45H67.6737V15.9483H74.6573ZM103.849 15.9483V45H96.8651L86.5892 26.9225V45H79.5857V15.9483H86.5892L96.8651 34.0258V15.9483H103.849ZM121.747 15.9483V45H114.743V15.9483H121.747ZM130.486 15.9483V21.3556H106.203V15.9483H130.486ZM133.459 15.9483H144.892C147.127 15.9483 149.069 16.2809 150.718 16.946C152.368 17.6111 153.638 18.5954 154.53 19.899C155.434 21.2026 155.886 22.8122 155.886 24.7277C155.886 26.3904 155.627 27.7805 155.108 28.8979C154.589 30.0152 153.864 30.9397 152.933 31.6713C152.015 32.3896 150.945 32.9816 149.721 33.4472L147.426 34.7441H137.829L137.789 29.3368H144.892C145.783 29.3368 146.522 29.1772 147.107 28.858C147.692 28.5387 148.131 28.0864 148.424 27.5011C148.73 26.9025 148.883 26.1909 148.883 25.3662C148.883 24.5281 148.73 23.8098 148.424 23.2112C148.118 22.6126 147.666 22.1537 147.067 21.8345C146.482 21.5152 145.757 21.3556 144.892 21.3556H140.463V45H133.459V15.9483ZM149.362 45L142.937 32.1502L150.359 32.1103L156.864 44.7007V45H149.362ZM172.427 22.0539L165.344 45H157.822L168.497 15.9483H173.265L172.427 22.0539ZM178.294 45L171.19 22.0539L170.272 15.9483H175.101L185.836 45H178.294ZM178.014 34.1655V39.5728H163.109V34.1655H178.014ZM195.413 15.9483V45H188.43V15.9483H195.413ZM224.605 15.9483V45H217.621L207.345 26.9225V45H200.342V15.9483H207.345L217.621 34.0258V15.9483H224.605ZM242.503 15.9483V45H235.499V15.9483H242.503ZM251.242 15.9483V21.3556H226.959V15.9483H251.242ZM274.208 39.6127V45H258.725V39.6127H274.208ZM261.219 15.9483V45H254.215V15.9483H261.219ZM272.213 27.4812V32.6889H258.725V27.4812H272.213ZM274.268 15.9483V21.3556H258.725V15.9483H274.268ZM296.276 39.6127V45H281.591V39.6127H296.276ZM284.085 15.9483V45H277.081V15.9483H284.085ZM299.349 41.8474C299.349 40.8897 299.695 40.0915 300.387 39.453C301.078 38.8012 301.97 38.4753 303.06 38.4753C304.164 38.4753 305.056 38.8012 305.734 39.453C306.426 40.0915 306.772 40.8897 306.772 41.8474C306.772 42.8052 306.426 43.6099 305.734 44.2617C305.056 44.9002 304.164 45.2195 303.06 45.2195C301.97 45.2195 301.078 44.9002 300.387 44.2617C299.695 43.6099 299.349 42.8052 299.349 41.8474ZM323.911 22.0539L316.828 45H309.306L319.981 15.9483H324.749L323.911 22.0539ZM329.777 45L322.674 22.0539L321.756 15.9483H326.585L337.32 45H329.777ZM329.498 34.1655V39.5728H314.593V34.1655H329.498ZM346.897 15.9483V45H339.914V15.9483H346.897Z" fill="#fff"/>
            </svg>
          </a>
          <div className="nav-badge">
            <div className="recording-dot"></div> Monday, April 20, 2026 · Free Webinar
          </div>
          <a href="#register" className="nav-cta">Reserve Your Seat →</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="section-pad" style={{ paddingTop: '180px' }}>
        <div className="W grid-2">
          <div>
            <span className="label-tag">Inaugural Webinar · Monday, April 20, 2026</span>
            <h1 className="hero-title">
              The AI Operating System<br/>
              Rebuilding <span className="serif">Clinical Trials</span><br/>
              From the Inside Out.
            </h1>
            <p className="text-body" style={{fontSize: '18px', maxWidth: '90%'}}>
              86% of trials miss enrollment deadlines. $600K–$850K lost every day a Phase III trial delays. Join IntraIntel.AI's first expert webinar to see how our 18-module compliance-native platform is collapsing the 6-month clinical workflow into 4 weeks — with live demos, real customer case studies, and the world premiere of our Clinical Trial Voice Agent.
            </p>
            
            <div style={{ display: 'flex', gap: '40px', marginTop: '48px', borderTop: '1px solid var(--border-glass)', paddingTop: '32px' }}>
              <div>
                <div style={{ fontSize: '32px', fontFamily: 'Playfair Display', color: 'var(--teal)', fontWeight: '900', lineHeight:'1' }}>15+</div>
                <div className="text-muted" style={{ marginTop: '4px' }}>Enterprise Deployments</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontFamily: 'Playfair Display', color: 'var(--teal)', fontWeight: '900', lineHeight:'1' }}>95%+</div>
                <div className="text-muted" style={{ marginTop: '4px' }}>Pilot-to-Paid Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '32px', fontFamily: 'Playfair Display', color: 'var(--teal)', fontWeight: '900', lineHeight:'1' }}>$350K</div>
                <div className="text-muted" style={{ marginTop: '4px' }}>ARR · Active 2026</div>
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
                  <p className="text-body" style={{ margin: 0 }}>Check your inbox for confirmation and calendar invite. See you Monday, April 20.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} autoComplete="off">
                  <h3>Secure Your Spot</h3>
                  <p className="sub" style={{color: 'var(--teal)'}}>Registration filling fast — {seatsLeft} seats only</p>

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

                  <div className="input-group">
                    <input type="text" className="input-field" name="company" value={formData.company} onChange={handleChange} required placeholder="Organization" />
                    <span className="input-label" style={{position:'absolute', top:'-10px', left:'16px', background:'var(--obsidian)', padding:'0 4px'}}>Company</span>
                  </div>
                  
                  <div className="input-group">
                    <select className="input-field" name="role" value={formData.role} onChange={handleChange} required>
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
                    <span className="input-label" style={{position:'absolute', top:'-10px', left:'16px', background:'var(--obsidian)', padding:'0 4px'}}>Your Role</span>
                  </div>

                  <div className="input-group">
                    <input type="text" className="input-field" name="challenge" value={formData.challenge} onChange={handleChange} placeholder="e.g. enrollment delays, data quality, FDA submission..." />
                    <span className="input-label" style={{position:'absolute', top:'-10px', left:'16px', background:'var(--obsidian)', padding:'0 4px'}}>Biggest Clinical Challenge</span>
                  </div>

                  {errorMsg && <div style={{ color: 'var(--danger)', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{errorMsg}</div>}
                  
                  <button type="submit" className="btn-primary" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Encrypting & Transmitting...' : 'Reserve My Seat — April 20 →'}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '16px' }}>
                    No spam. No data selling. SOC 2 Type II & HIPAA compliant infrastructure.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* STRIP (METRICS) */}
      <section className="section-pad" style={{ padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.4)' }}>
        <div className="W">
          <div className="content-grid-5" style={{ marginTop: 0 }}>
            <div><div className="proof-metric-large" style={{ marginTop: 0, fontSize: '42px' }}>86<span className="proof-metric-percent" style={{fontSize: '24px'}}>%</span></div><div className="text-body" style={{fontSize: '13px', marginTop: '8px'}}>Of clinical trials miss their original enrollment deadline</div></div>
            <div><div className="proof-metric-large" style={{ marginTop: 0, fontSize: '42px' }}>$850<span className="proof-metric-percent" style={{fontSize: '24px'}}>K</span></div><div className="text-body" style={{fontSize: '13px', marginTop: '8px'}}>Lost per day of Phase III delay in revenue & costs</div></div>
            <div><div className="proof-metric-large" style={{ marginTop: 0, fontSize: '42px' }}>50<span className="proof-metric-percent" style={{fontSize: '24px'}}>%</span></div><div className="text-body" style={{fontSize: '13px', marginTop: '8px'}}>Of trial sites enroll one or zero patients per trial</div></div>
            <div><div className="proof-metric-large" style={{ marginTop: 0, fontSize: '42px' }}>$2.6<span className="proof-metric-percent" style={{fontSize: '24px'}}>B</span></div><div className="text-body" style={{fontSize: '13px', marginTop: '8px'}}>Average cost to bring a single drug to market</div></div>
            <div><div className="proof-metric-large" style={{ marginTop: 0, fontSize: '42px' }}>10.7<span className="proof-metric-percent" style={{fontSize: '24px'}}>%</span></div><div className="text-body" style={{fontSize: '13px', marginTop: '8px'}}>Pharma companies with fully implemented clinical AI</div></div>
          </div>
        </div>
      </section>

      {/* AGENDA SECTION */}
      <section className="section-pad">
        <div className="W grid-2">
          <div className="agenda-list">
            <span className="label-tag">Session Agenda · Monday, April 20, 2026</span>
            <h2 className="section-title">90 Minutes. <span className="serif">Zero Fluff.</span><br/>100% Actionable Intelligence.</h2>
            <p className="text-body" style={{ margin: 0 }}>Designed for senior clinical and healthcare executives who need data, not slides. Every session grounded in live deployments and documented customer outcomes.</p>
          </div>
          
          <div className="agenda-grid" style={{marginTop: 0}}>
            <div className="agenda-item glass-panel">
              <div className="agenda-time">0:00 — 0:15</div>
              <div className="agenda-content">
                <span className="audience-role" style={{display: 'inline-block', marginBottom: '8px'}}>CEO Keynote</span>
                <h4>The $2.6B Clinical Trial Crisis</h4>
                <p>Why 86% of trials still fail despite billions in AI investment — the fragmentation problem, the point-solution trap, and what a compliance-native orchestration layer actually means.</p>
              </div>
            </div>
            <div className="agenda-item glass-panel">
              <div className="agenda-time">0:15 — 0:35</div>
              <div className="agenda-content">
                <span className="audience-role" style={{display: 'inline-block', marginBottom: '8px'}}>Live Demo</span>
                <h4>EHR to FDA-Ready Output in One Unified Workflow</h4>
                <p>Watch IntraIntel connect to a live clinical system via 5-minute OAuth and generate protocol designs, endpoint benchmarks, and regulatory summaries in real time across 50+ data sources.</p>
              </div>
            </div>
            <div className="agenda-item glass-panel" style={{borderColor: 'var(--gold)', background: 'linear-gradient(145deg, rgba(244, 162, 97, 0.05) 0%, rgba(255,255,255,0.01) 100%)'}}>
              <div class="agenda-time" style={{color: 'var(--gold)'}}>0:35 — 0:55</div>
              <div className="agenda-content">
                <span className="audience-role" style={{display: 'inline-block', marginBottom: '8px', color: 'var(--gold)'}}>World Premiere</span>
                <h4>AI Voice Agent for Clinical Trials</h4>
                <p>First-ever public demonstration of AI voice agents automating daily patient follow-ups, adverse event screening, and compliance tracking with an 87% patient satisfaction rate.</p>
              </div>
            </div>
            <div className="agenda-item glass-panel">
              <div className="agenda-time">0:55 — 1:10</div>
              <div className="agenda-content">
                <span className="audience-role" style={{display: 'inline-block', marginBottom: '8px'}}>Customer Proof</span>
                <h4>Case Studies: Restorative Therapies & XylyxBio</h4>
                <p>Documented results from live clinical deployments — 80% cost reduction, 60% faster FDA drafting, 96% executive time savings. Named customers. Real numbers. Zero extrapolation.</p>
              </div>
            </div>
            <div className="agenda-item glass-panel">
              <div className="agenda-time">1:10 — 1:20</div>
              <div className="agenda-content">
                <span className="audience-role" style={{display: 'inline-block', marginBottom: '8px'}}>SaMD Pathway</span>
                <h4>510(k), CPT/HCPCS Reimbursement</h4>
                <p>The only clinical AI platform with an active FDA 510(k) submission targeted Q3 2026 and a planned CPT/HCPCS insurance reimbursement pathway — and what it means for enterprise ROI.</p>
              </div>
            </div>
            <div className="agenda-item glass-panel" style={{border: 'none'}}>
              <div className="agenda-time">1:20 — 1:30</div>
              <div className="agenda-content">
                <span className="audience-role" style={{display: 'inline-block', marginBottom: '8px'}}>Live Q&A</span>
                <h4>Open Q&A with the Founding Team</h4>
                <p>Direct access to Dev Roy, Brian Hoffman, and advisory board members carrying 150+ combined years of SaMD and healthcare AI experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM MODULES (ALL 18) */}
      <section className="section-pad" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="W">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="label-tag">Platform Architecture · clinical.intraintel.ai</span>
            <h2 className="section-title">18 AI Modules.<br/>Clinical Intelligence & <span className="serif">Reimbursement</span></h2>
            <p className="text-body" style={{ margin: '0 auto', maxWidth: '800px' }}>clinical.intraintel.ai covers the complete trial lifecycle — from literature review to reimbursement optimization. Every module is AI-Powered, compliance-native, and connects without data migration.</p>
          </div>
          
          <h4 style={{fontSize: '20px', color: 'var(--white)', marginTop: '64px'}}>Clinical Intelligence (14 Modules)</h4>
          <div className="content-grid-3">
            <div className="glass-panel module-card">
              <div className="module-icon">01</div>
              <h4>Research & Literature Intelligence</h4>
              <p>AI-powered aggregation, recursive citation mining, predicate device comparison, automated insight synthesis from PubMed, ClinicalTrials.gov & MAUDE.</p>
            </div>
            <div className="glass-panel module-card">
              <div className="module-icon">02</div>
              <h4>Protocol Design & FDA Alignment</h4>
              <p>Predictive endpoint modeling, regulatory correlation analysis, Monte Carlo power simulations aligned to FDA predicate criteria.</p>
            </div>
            <div className="glass-panel module-card">
              <div className="module-icon">03</div>
              <h4>Real-Time Trial Data Monitoring</h4>
              <p>Site-level ingestion, anomaly detection, adverse event flagging, and real-time dashboards across all active trial sites.</p>
            </div>
            <div className="glass-panel module-card">
              <div className="module-icon">04</div>
              <h4>Endpoint Analytics & Benchmarking</h4>
              <p>Compare trial outcomes to historical FDA predicate data and competitor endpoints — alignment gaps surfaced instantly.</p>
            </div>
            <div className="glass-panel module-card">
              <div className="module-icon">05</div>
              <h4>Predictive Endpoint Engine</h4>
              <p>AI forecasts FDA acceptance likelihood and recommends protocol refinements to maximize regulatory submission success.</p>
            </div>
            <div className="glass-panel module-card">
              <div className="module-icon">06</div>
              <h4>Coding & Reimbursement</h4>
              <p>NLP-driven coding accuracy, claims validation, and billing optimization — fully aligned to CPT/HCPCS pathway.</p>
            </div>
             <div className="glass-panel module-card">
              <div className="module-icon">07</div>
              <h4>Precision Care Analytics</h4>
              <p>Integrate vitals, biomarkers, EHR data — detect real-time complications and deliver personalized AI-driven care recommendations.</p>
            </div>
             <div className="glass-panel module-card">
              <div className="module-icon">08</div>
              <h4>AI Clinical Decision Support</h4>
              <p>Evidence-based recommendations, guideline retrieval, task triage, and clinician fatigue mitigation via conversational AI interfaces.</p>
            </div>
             <div className="glass-panel module-card">
              <div className="module-icon">09</div>
              <h4>Device Integration & IoT</h4>
              <p>HL7/FHIR device integration, real-time device metrics ingestion, extensible architecture for future medical device innovations.</p>
            </div>
             <div className="glass-panel module-card">
              <div className="module-icon">10</div>
              <h4>Post-Market Support & Training</h4>
              <p>AI-generated continuous education, clinician support, and 24/7 AI Q&A — sustaining adoption and performance post-trial.</p>
            </div>
             <div className="glass-panel module-card">
              <div className="module-icon">11</div>
              <h4>IP & Commercialization Strategy</h4>
              <p>Identify patentable innovations, monitor IP opportunities, and generate AI-driven commercialization pathways and monetization roadmaps.</p>
            </div>
            <div className="glass-panel module-card">
              <div className="module-icon">12</div>
              <h4>Patient Recruitment & Retention</h4>
              <p>AI-driven recruitment optimization, demographic targeting, eligibility screening, and compliance monitoring across trial sites.</p>
            </div>
            <div className="glass-panel module-card">
              <div className="module-icon">13</div>
              <h4>Precision Recruitment (Advanced)</h4>
              <p>Predictive enrollment modeling, automated candidate screening, and accelerated timeline analysis to hit enrollment milestones.</p>
            </div>
            <div className="glass-panel module-card" style={{borderColor: 'var(--gold)'}}>
              <div className="module-icon" style={{color: 'var(--gold)', borderColor: 'var(--gold)'}}>14</div>
              <h4>Clinical Trial Voice Agent</h4>
              <p>Daily automated patient follow-ups, adverse event screening, and compliance tracking via 21 CFR Part 11-compliant AI voice agent.</p>
            </div>
          </div>

          <h4 style={{fontSize: '20px', color: 'var(--gold)', marginTop: '64px'}}>Reimbursement & Market Access (4 Modules)</h4>
          <div className="content-grid-4">
            <div className="glass-panel module-card" style={{background: 'linear-gradient(180deg, rgba(244, 162, 97, 0.05) 0%, transparent 100%)'}}>
              <div className="module-icon" style={{color: 'var(--gold)', borderColor: 'var(--gold)'}}>15</div>
              <h4>Reimbursement Intelligence</h4>
              <p>CPT/ICD/HCPCS coding automation, NTAP/TPT/TCET workflow, DRG mapping, and site-of-service financial modeling.</p>
            </div>
            <div className="glass-panel module-card" style={{background: 'linear-gradient(180deg, rgba(244, 162, 97, 0.05) 0%, transparent 100%)'}}>
              <div className="module-icon" style={{color: 'var(--gold)', borderColor: 'var(--gold)'}}>16</div>
              <h4>CMS Application Automation</h4>
              <p>Auto-fill CMS NTAP/TPT templates using clinical and cost data — cutting application preparation time by 70%+.</p>
            </div>
            <div className="glass-panel module-card" style={{background: 'linear-gradient(180deg, rgba(244, 162, 97, 0.05) 0%, transparent 100%)'}}>
              <div className="module-icon" style={{color: 'var(--gold)', borderColor: 'var(--gold)'}}>17</div>
              <h4>Financial Margin Simulator</h4>
              <p>Simulate IPPS/OPPS/ASC/OBL payments, calculate margin per procedure, and run sensitivity analyses for pricing strategy.</p>
            </div>
            <div className="glass-panel module-card" style={{background: 'linear-gradient(180deg, rgba(244, 162, 97, 0.05) 0%, transparent 100%)'}}>
              <div className="module-icon" style={{color: 'var(--gold)', borderColor: 'var(--gold)'}}>18</div>
              <h4>Market Access Strategy</h4>
              <p>Payer landscape analysis, formulary positioning, and AI-driven market access roadmaps for accelerated commercial adoption.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VOICE MODULE SECTION */}
      <section className="section-pad">
        <div className="W grid-2">
            <div>
              <span className="audience-role" style={{marginBottom: '8px', color: 'var(--gold)'}}>World Premiere · Monday, April 20</span>
              <h2 className="section-title">Introducing the<br/><span className="serif" style={{color: 'var(--gold)'}}>Clinical Trial Voice Agent</span></h2>
              <p className="text-body" style={{fontSize: '17px', lineHeight: '1.7'}}>
                80–86% of trials miss enrollment deadlines. Coordinators burn out managing fragmented outreach systems. Patients drop out at 20–30% rates — costing $19,533 to replace each one. IntraIntel's Clinical Trial Voice Agent delivers daily automated patient follow-ups, adverse event screening, and compliance tracking — all via 21 CFR Part 11-compliant AI voice.
              </p>
            </div>
             <div className="glass-panel" style={{padding: '40px', background: 'rgba(244,162,97,0.03)', borderColor: 'rgba(244,162,97,0.3)'}}>
              <div style={{marginBottom: '24px', borderBottom: '1px solid rgba(244,162,97,0.2)', paddingBottom: '24px'}}>
                <h4 style={{fontSize: '18px', color: 'var(--gold)', marginBottom: '8px'}}>Patient Outreach & Enrollment</h4>
                <p className="text-muted" style={{margin: 0}}>Automated multilingual voice calls for screening, scheduling, and enrollment reducing site burden by up to 90%.</p>
              </div>
               <div style={{marginBottom: '24px', borderBottom: '1px solid rgba(244,162,97,0.2)', paddingBottom: '24px'}}>
                <h4 style={{fontSize: '18px', color: 'var(--gold)', marginBottom: '8px'}}>PRO Data Capture</h4>
                <p className="text-muted" style={{margin: 0}}>Structured patient-reported outcome collection via voice — 21 CFR Part 11 compliant with full audit trail.</p>
              </div>
               <div style={{marginBottom: '24px', borderBottom: '1px solid rgba(244,162,97,0.2)', paddingBottom: '24px'}}>
                <h4 style={{fontSize: '18px', color: 'var(--gold)', marginBottom: '8px'}}>Adverse Event Detection</h4>
                <p className="text-muted" style={{margin: 0}}>Real-time AE signal detection from voice — flagging adverse events up to 300x faster than manual review workflows.</p>
              </div>
              <div className="grid-row" style={{marginTop: '32px'}}>
                <div>
                   <div style={{ fontSize: '36px', fontFamily: 'Playfair Display', color: 'var(--gold)', fontWeight: '900', lineHeight:'1' }}>87%</div>
                   <div className="text-muted" style={{ marginTop: '4px', fontSize: '13px' }}>Patient satisfaction with AI voice agents</div>
                </div>
                <div>
                   <div style={{ fontSize: '36px', fontFamily: 'Playfair Display', color: 'var(--gold)', fontWeight: '900', lineHeight:'1' }}>70%</div>
                   <div className="text-muted" style={{ marginTop: '4px', fontSize: '13px' }}>Reduction in coordinator burden</div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION (3 CARDS) */}
      <section className="section-pad" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="W">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="label-tag">Platform Proof</span>
            <h2 className="section-title">Not a Demo Company.<br/>A <span className="serif">Deployed Platform.</span></h2>
            <p className="text-body" style={{ margin: '0 auto' }}>Every case study at this webinar is a live customer deployment with documented outcomes.</p>
          </div>
          <div className="content-grid-3">
             <div className="glass-panel proof-card" style={{padding: '32px'}}>
              <div>
                <div className="proof-context">Restorative Therapies · Medical Devices</div>
                <h4 style={{ fontSize: '20px', margin: '16px 0 12px' }}>AI-Powered Data Integration</h4>
                <p className="text-body" style={{ margin: 0 }}>Manual clinical literature review eliminated. Training video production cut from 6 weeks to 48 hours. Real-time patient monitoring and FDA regulatory reporting automated across a 9-module platform.</p>
              </div>
              <div>
                <div className="proof-metric-large" style={{fontSize: '54px'}}>80<span className="proof-metric-percent" style={{fontSize: '24px'}}>%</span></div>
                <div className="text-muted" style={{fontSize: '13px'}}>Cost reduction · 50%+ training time reduction · 30–40% faster protocols</div>
              </div>
            </div>
            <div className="glass-panel proof-card" style={{padding: '32px'}}>
              <div>
                <div className="proof-context">XylyxBio · Biomaterials & IND</div>
                <h4 style={{ fontSize: '20px', margin: '16px 0 12px' }}>Pre-IND Submission Automation</h4>
                <p className="text-body" style={{ margin: 0 }}>Automated FDA-ready module generation, integrated efficacy tables, and compliance-first document drafting accelerated IND submission and valuation milestones.</p>
              </div>
              <div>
                <div className="proof-metric-large" style={{fontSize: '54px'}}>60<span className="proof-metric-percent" style={{fontSize: '24px'}}>%</span></div>
                <div className="text-muted" style={{fontSize: '13px'}}>Faster FDA IND drafting · 40% fewer edits · 25% faster time-to-valuation</div>
              </div>
            </div>
            <div className="glass-panel proof-card" style={{padding: '32px'}}>
              <div>
                <div className="proof-context">TransRadial · Vascular Devices</div>
                <h4 style={{ fontSize: '20px', margin: '16px 0 12px' }}>Clinical Marketing & Investment DD</h4>
                <p className="text-body" style={{ margin: 0 }}>2,000+ files ingested. 176 diligence questions auto-answered. Executive content creation reduced from 8 hours per asset to barely 20 minutes.</p>
              </div>
              <div>
                <div className="proof-metric-large" style={{fontSize: '54px'}}>96<span className="proof-metric-percent" style={{fontSize: '24px'}}>%</span></div>
                <div className="text-muted" style={{fontSize: '13px'}}>Executive time saved · 70% DD reduction · $25K+ hard costs saved per target</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPEAKERS & HOSTS */}
      <section className="section-pad">
        <div className="W">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="label-tag">Your Hosts</span>
            <h2 className="section-title">Founding Team & <span className="serif">Advisory Board</span></h2>
          </div>
          
          <div className="speakers-grid" style={{marginBottom: '48px'}}>
            <div className="speaker-card">
              <img src={DevRoyImg} alt="Dev Roy" className="speaker-img" style={{objectPosition: 'center top'}} />
              <div className="speaker-info">
                <div className="speaker-name">Dev Roy</div>
                <div className="speaker-role">CEO & Founder</div>
                <div className="speaker-co">IntraIntel.AI</div>
                <p className="text-muted" style={{fontSize: '13px', marginTop: '12px', lineHeight: '1.5'}}>Leads strategy and enterprise growth. Formerly led massive healthcare transformations resulting in $50M+ ARR workflows.</p>
              </div>
            </div>
            
            <div className="speaker-card">
              <img src={BrianHoffmanImg} alt="Brian Hoffman" className="speaker-img" style={{objectPosition: 'center top'}} />
              <div className="speaker-info">
                <div className="speaker-name">Brian Hoffman</div>
                <div className="speaker-role">CTO & Co-Founder</div>
                <div className="speaker-co">IntraIntel.AI</div>
                <p className="text-muted" style={{fontSize: '13px', marginTop: '12px', lineHeight: '1.5'}}>Architect behind the new Clinical Trial AI infrastructure. Expert in zero-trust data integration, FHIR, and SOC 2 security.</p>
              </div>
            </div>

            <div className="speaker-card">
              <div style={{width: '100%', height: '100%', background: 'linear-gradient(145deg, rgba(0, 180, 216, 0.1), rgba(0,0,0,0.6))', display: 'grid', placeItems: 'center', fontSize: '64px', color: 'rgba(255,255,255,0.1)'}} className="speaker-img">AL</div>
              <div className="speaker-info">
                <div className="speaker-name">Alex Lee</div>
                <div className="speaker-role">FDA Compliance Advisor</div>
                <div className="speaker-co">30+ Years FDA/SaMD</div>
                <p className="text-muted" style={{fontSize: '13px', marginTop: '12px', lineHeight: '1.5'}}>Former senior regulator specializing in Software as a Medical Device (SaMD) and 510(k) pathway optimization.</p>
              </div>
            </div>
          </div>

          <div className="content-grid-4">
             <div className="glass-panel audience-card" style={{padding: '24px'}}>
               <div className="audience-role">Advisory Board</div>
               <h4 style={{fontSize: '18px', marginBottom: '4px'}}>Dr. Pradipta Majumder, MD</h4>
               <p style={{fontSize: '13px'}}>20+ yrs Clinical Research & AI</p>
             </div>
             <div className="glass-panel audience-card" style={{padding: '24px'}}>
               <div className="audience-role">Advisory Board</div>
               <h4 style={{fontSize: '18px', marginBottom: '4px'}}>Prof. Dr. Zeynep Birsu Çinçin</h4>
               <p style={{fontSize: '13px'}}>20+ yrs Oncology Trials</p>
             </div>
             <div className="glass-panel audience-card" style={{padding: '24px'}}>
               <div className="audience-role">Advisory Board</div>
               <h4 style={{fontSize: '18px', marginBottom: '4px'}}>Raj DasGupta (CTO, RIVA)</h4>
               <p style={{fontSize: '13px'}}>20+ yrs Cloud & Cybersecurity</p>
             </div>
             <div className="glass-panel audience-card" style={{padding: '24px'}}>
               <div className="audience-role">Advisory Board</div>
               <h4 style={{fontSize: '18px', marginBottom: '4px'}}>Mukesh Pandey</h4>
               <p style={{fontSize: '13px'}}>20+ yrs Strategy · Ex-Amazon/Goog</p>
             </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE SECTION (ALL 8) */}
      <section className="section-pad" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="W">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="label-tag">Who Should Attend</span>
            <h2 className="section-title">Built for Decision-Makers<br/>Who Own <span className="serif">Clinical Outcomes</span></h2>
          </div>
          <div className="content-grid-4">
            <div className="glass-panel audience-card">
              <div className="audience-role">Executive & Clinical</div>
              <ul style={{color: 'var(--soft)', fontSize: '14px', margin: 0, paddingLeft: '16px'}}>
                <li>Chief Medical Officer</li><li>Chief Clinical Officer</li><li>Chief Scientific Officer</li><li>Chief Innovation Officer</li><li>Chief Medical Informatics Officer</li>
              </ul>
            </div>
            <div className="glass-panel audience-card">
              <div className="audience-role">Clinical Operations</div>
               <ul style={{color: 'var(--soft)', fontSize: '14px', margin: 0, paddingLeft: '16px'}}>
                <li>VP, Clinical Operations</li><li>Director of Clinical Trials</li><li>Head of Clinical Development</li><li>Clinical Operations Director</li>
              </ul>
            </div>
            <div className="glass-panel audience-card">
              <div className="audience-role">Data & Analytics</div>
               <ul style={{color: 'var(--soft)', fontSize: '14px', margin: 0, paddingLeft: '16px'}}>
                <li>VP, Clinical Data Management</li><li>Head of Clinical Informatics</li><li>Director of Clinical Analytics</li><li>Head of Data Science</li>
              </ul>
            </div>
            <div className="glass-panel audience-card">
              <div className="audience-role">Regulatory & Compliance</div>
               <ul style={{color: 'var(--soft)', fontSize: '14px', margin: 0, paddingLeft: '16px'}}>
                <li>VP, Regulatory Affairs</li><li>Director, Regulatory Operations</li><li>Head of Compliance & QA</li>
              </ul>
            </div>
            <div className="glass-panel audience-card">
              <div className="audience-role">Medical Device & Pharma</div>
               <ul style={{color: 'var(--soft)', fontSize: '14px', margin: 0, paddingLeft: '16px'}}>
                <li>Head of Device Development</li><li>VP, Medical Affairs</li><li>Director, Device Innovation</li>
              </ul>
            </div>
            <div className="glass-panel audience-card">
               <div className="audience-role">IT & Digital</div>
               <ul style={{color: 'var(--soft)', fontSize: '14px', margin: 0, paddingLeft: '16px'}}>
                <li>Chief Information Officer</li><li>Chief Digital Officer</li><li>Dir, Healthcare IT Integration</li>
              </ul>
            </div>
            <div className="glass-panel audience-card">
              <div className="audience-role">Business Development</div>
               <ul style={{color: 'var(--soft)', fontSize: '14px', margin: 0, paddingLeft: '16px'}}>
                <li>VP, Strategic Partnerships</li><li>Head of BD (Clinical)</li>
              </ul>
            </div>
             <div className="glass-panel audience-card" style={{borderColor: 'var(--teal)', background: 'linear-gradient(145deg, rgba(0, 229, 255, 0.05) 0%, rgba(255,255,255,0.01) 100%)'}}>
              <div className="audience-role">Not Sure?</div>
               <ul style={{color: 'var(--white)', fontSize: '14px', margin: 0, paddingLeft: '16px', fontWeight: 600}}>
                <li>You fund clinical research</li><li>You manage AI vendor decisions</li><li>You evaluate SaMD platforms</li><li>You belong in this room.</li>
              </ul>
            </div>
          </div>

          <div className="badge-row">
            <div className="badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              SOC 2 Type I Certified
            </div>
            <div className="badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              HIPAA Compliant
            </div>
            <div className="badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>  
              AES-256 Zero Trust
            </div>
            <div className="badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              GDPR Aligned
            </div>
            <div className="badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              4–8 Week ROI
            </div>
            <div className="badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              Zero Data Migration
            </div>
            <div className="badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
              SaMD · FDA 510(k) Q3
            </div>
            <div className="badge-pill">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              CPT/HCPCS Pathway
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-pad">
        <div className="W">
          <div className="ctab">
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
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="4 4"></circle>
                  <path d="M12 6L16 12L12 18L8 12L12 6Z" fill="#00e5ff" fillOpacity="0.1" stroke="#00e5ff" strokeWidth="1.5" />
                </svg>
                <svg width="180" height="32" viewBox="0 0 347 55" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              </div>
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
