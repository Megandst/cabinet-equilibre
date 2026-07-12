import React, { useState, useEffect, useRef } from 'react';
import { translations } from './translations';
import { servicesData } from './servicesData';

function App() {
    // 1. Language State
    const [lang, setLang] = useState(() => {
        return localStorage.getItem('cabinet_lang') || 'fr';
    });

    useEffect(() => {
        localStorage.setItem('cabinet_lang', lang);
        document.documentElement.lang = lang;
        // Dynamically update document title based on language
        if (translations[lang] && translations[lang].title) {
            document.title = translations[lang].title;
        }
    }, [lang]);

    // 2. Header Scroll State
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. Mobile Menu Toggle State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 4. Modal State
    const [activeServiceKey, setActiveServiceKey] = useState(null);

    // 5. Quiz State
    const [quizStep, setQuizStep] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({
        need: '',
        urgency: ''
    });

    const handleQuizOptionClick = (questionType, val) => {
        setQuizAnswers(prev => ({
            ...prev,
            [questionType]: val
        }));
    };

    const handleQuizNext = () => {
        if (quizStep < 2) {
            setQuizStep(prev => prev + 1);
        }
    };

    const handleQuizPrev = () => {
        if (quizStep > 0) {
            setQuizStep(prev => prev - 1);
        }
    };

    const handleQuizRestart = () => {
        setQuizStep(0);
        setQuizAnswers({ need: '', urgency: '' });
    };

    // Calculate Quiz Results
    const getQuizResults = () => {
        const resultsData = {
            social: {
                fr: {
                    pathName: "Soutien Social & Coaching Familial",
                    details: "Nous vous recommandons de vous connecter avec nos conseillères familiales et psychosociales. Nous nous concentrons sur la reconstruction, l'équilibre quotidien et la mise en relation avec les réseaux de ressources locaux.",
                    steps: {
                        crisis: [
                            "Action immédiate : Contactez-nous directement via notre numéro d'écoute (01 23 45 67 89) for des conseils rapides.",
                            "Démarche d'accompagnement : Demandez une séance de conseil cette semaine en utilisant le formulaire sécurisé ci-dessous."
                        ],
                        standard: [
                            "Recommandé : Remplissez le formulaire de contact confidentiel ci-dessous en choisissant 'Soutien Social'.",
                            "Étape suivante : Nous vous contacterons sous 24 heures pour planifier un premier entretien d'orientation confidentiel."
                        ]
                    }
                },
                en: {
                    pathName: "Social Support & Family Guidance",
                    details: "We recommend connecting with our relationship and social assistance advisors. We focus on healing, daily equilibrium, and connecting you to community resource networks.",
                    steps: {
                        crisis: [
                            "Immediate Action: Reach out directly via our priority contact number (01 23 45 67 89) for immediate advice.",
                            "Supportive Step: Book a same-week counseling session using the confidential form below."
                        ],
                        standard: [
                            "Recommended: Fill out the confidential consultation form specifying 'Social Guidance'.",
                            "Next step: We will reach out within 24 hours to set up a private initial orientation conversation."
                        ]
                    }
                }
            },
            judiciary: {
                fr: {
                    pathName: "Parcours d'Orientation Juridique",
                    details: "Vos réponses suggèrent un besoin de clarifier vos droits, statuts civils ou procédures. Notre équipe est là pour démystifier les étapes de justice et structurer votre dossier.",
                    steps: {
                        crisis: [
                            "Action immédiate : Écrivez à legal-emergency@cabinetequilibre.fr pour obtenir des conseils juridiques urgents.",
                            "Préparation : Rassemblez les documents légaux ou lettres officielles pour notre premier rendez-vous rapide."
                        ],
                        standard: [
                            "Orientation : Prenez rendez-vous pour un premier diagnostic juridique personnalisé gratuit.",
                            "Soutien pratique : Lisez nos livrets de droits simplifiés lors de votre première visite pour aborder l'aide juridique sereinement."
                        ]
                    }
                },
                en: {
                    pathName: "Judiciary Guidance Pathway",
                    details: "Your answers suggest a need to clarify legal status, rights, or procedures. Our team demystifies the court steps and outlines legal routes available to you.",
                    steps: {
                        crisis: [
                            "Immediate Action: Write to legal-emergency@cabinetequilibre.fr for critical guidance recommendations.",
                            "Next step: Gather any ongoing legal documents or letters to prepare for a swift, structured evaluation."
                        ],
                        standard: [
                            "Orientation: Contact us for an initial legal diagnostics appointment.",
                            "Self-help: Read the informational booklets we provide during your first consult to understand legal aid options."
                        ]
                    }
                }
            },
            criminology: {
                fr: {
                    pathName: "Soutien Criminologique & Planification de Sécurité",
                    details: "Nous sommes spécialisées dans l'évaluation des risques de violence, le soutien post-victimisation et l'aide pratique. Vous êtes ici dans un espace protégé et sans jugement.",
                    steps: {
                        crisis: [
                            "Protection immédiate : Si vous êtes en danger physique immédiat, veuillez composer directement le 17 (Police) ou le 112.",
                            "Soutien Cabinet : Appelez notre ligne d'assistance confidentielle pour élaborer un plan de sécurité d'urgence immédiat."
                        ],
                        standard: [
                            "Évaluation : Prenez rendez-vous avec nos criminologues pour évaluer sereinement la situation de harcèlement ou de menace.",
                            "Planification : Nous concevrons ensemble un protocole de protection discret pour vous et vos enfants à la maison."
                        ]
                    }
                },
                en: {
                    pathName: "Criminological Support & Safety Coordination",
                    details: "We specialize in safety assessment, post-victimization healing, and security planning. You are in a safe, non-judgmental environment.",
                    steps: {
                        crisis: [
                            "Immediate Protection: If you are in immediate danger, please dial 112 (or national emergency) immediately.",
                            "Our Service: Call our victim support line for urgent security assessment planning and immediate safe-haven housing referrals."
                        ],
                        standard: [
                            "Recommended: Book a detailed risk-assessment consultation with our professional criminologists.",
                            "Safety Check: We will help you draft a private safety and security plan tailored to your household."
                        ]
                    }
                }
            }
        };

        const activeNeed = quizAnswers.need || 'social';
        const activeUrgency = quizAnswers.urgency === 'crisis' ? 'crisis' : 'standard';

        return resultsData[activeNeed][lang] || resultsData[activeNeed]['fr'];
    };

    // 6. Confidential Contact Form State
    const [formName, setFormName] = useState('');
    const [formMethod, setFormMethod] = useState('');
    const [formContactDetail, setFormContactDetail] = useState('');
    const [formServiceType, setFormServiceType] = useState('general');
    const [formSafeTime, setFormSafeTime] = useState('');
    const [formMessage, setFormMessage] = useState('');
    const [formConsent, setFormConsent] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const feedbackRef = useRef(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (!formName || !formMethod || !formMessage || !formContactDetail) {
            const alertMsg = lang === 'fr'
                ? 'Veuillez remplir les champs obligatoires afin que nous puissions vous aider convenablement.'
                : 'Please fill in the required fields so we can support you appropriately.';
            alert(alertMsg);
            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        setTimeout(() => {
            setIsSubmitting(false);
            
            // Clear inputs
            setFormName('');
            setFormMethod('');
            setFormContactDetail('');
            setFormServiceType('general');
            setFormSafeTime('');
            setFormMessage('');
            setFormConsent(false);

            // Trigger visual feedback
            const methodLabel = translations[lang][`form-method-${formMethod}`] || formMethod;
            let successHtml = '';
            if (lang === 'fr') {
                successHtml = `
                    <strong>Merci, ${formName}.</strong> Votre demande a été transmise de manière sécurisée. 
                    Nous nous engageons à vous recontacter par votre moyen privilégié (${methodLabel}) sous 24 heures. 
                    Vos coordonnées sont protégées et strictement confidentielles. Vous n'êtes pas seule.
                `;
            } else {
                successHtml = `
                    <strong>Thank you, ${formName}.</strong> Your inquiry has been securely sent. 
                    We promise to reach out via your preferred method (${methodLabel}) within 24 hours. 
                    Your details are completely confidential and protected. You are not alone.
                `;
            }

            setFeedback(successHtml);

            // Scroll feedback into view
            setTimeout(() => {
                if (feedbackRef.current) {
                    feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 50);

        }, 1500);
    };

    // Helper translation functions
    const t = (key) => {
        return translations[lang][key] || translations['fr'][key] || key;
    };

    return (
        <div>
            {/* Header & Navigation */}
            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <a href="#home" className="logo" aria-label="Cabinet Équilibre Accueil">
                        <div className="logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src="images/logo-rectangle.jpg" alt="Cabinet Équilibre Logo" style={{ height: '50px', width: 'auto', borderRadius: '6px', border: '2.5px solid white', boxShadow: 'var(--shadow-sm)' }} />
                            <div className="logo-text">
                                <span className="logo-title">Cabinet Équilibre</span>
                                <span className="logo-sub">{t("logo-sub")}</span>
                            </div>
                        </div>
                    </a>

                    <nav aria-label="Menu principal">
                        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
                            <li>
                                <a href="#home" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    {t("nav-home")}
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    {t("nav-services")}
                                </a>
                            </li>
                            <li>
                                <a href="#guidance" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    {t("nav-quiz")}
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    {t("nav-about")}
                                </a>
                            </li>
                            
                            {/* Language switcher toggle in the navbar menu */}
                            <li className="lang-switch-item" style={{ display: 'flex', alignItems: 'center' }}>
                                <button 
                                    className="lang-toggle-btn" 
                                    aria-label="Changer de langue / Switch Language"
                                    onClick={() => setLang(prev => prev === 'fr' ? 'en' : 'fr')}
                                >
                                    <span className={`lang-text ${lang === 'fr' ? 'active' : ''}`}>FR</span>
                                    <span className="lang-divider" style={{ color: 'var(--accent-soft)', margin: '0 4px' }}>|</span>
                                    <span className={`lang-text ${lang === 'en' ? 'active' : ''}`}>EN</span>
                                </button>
                            </li>
                            
                            <li>
                                <a href="#contact" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>
                                    {t("nav-support")}
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <button 
                        className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`} 
                        aria-label="Menu de navigation" 
                        aria-expanded={mobileMenuOpen}
                        aria-controls="nav-menu"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </header>

            <main>
                {/* Hero Section */}
                <section id="home" className="hero">
                    <div className="decorative-leaf leaf-1"></div>
                    <div className="decorative-leaf leaf-2"></div>
                    
                    <div className="container hero-grid">
                        <div className="hero-content">
                            <span className="badge">{t("hero-badge")}</span>
                            <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: t("hero-title") }}></h1>
                            <div className="hero-description" dangerouslySetInnerHTML={{ __html: t("hero-desc") }}></div>
                            <div className="hero-actions">
                                <a href="#guidance" className="btn-primary">{t("hero-cta-quiz")}</a>
                                <a href="#services" className="btn-secondary">{t("hero-cta-services")}</a>
                            </div>
                        </div>
                        
                        <div className="hero-image-container">
                            <div className="hero-image-wrapper">
                                <img src="images/logo-rectangle.jpg" alt="Illustration apaisante de femmes se soutenant les unes les autres, entourées de branches d'olivier" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Pillars Section */}
                <section id="services" className="services">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-subtitle">{t("services-subtitle")}</span>
                            <h2 className="section-title">{t("services-title")}</h2>
                            <p className="section-desc">{t("services-desc")}</p>
                        </div>
                        
                        <div className="services-grid">
                            {/* Service Pillar 1: Social Guidance */}
                            <article className="service-card">
                                <div className="service-icon-box">
                                    {servicesData.social[lang].icon}
                                </div>
                                <h3 className="service-card-title">{t("service-social-title")}</h3>
                                <p className="service-card-desc" dangerouslySetInnerHTML={{ __html: t("service-social-desc") }}></p>
                                <span className="service-learn-more" onClick={() => setActiveServiceKey('social')}>
                                    <span>{t("service-social-link")}</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </span>
                            </article>

                            {/* Service Pillar 2: Judiciary Guidance */}
                            <article className="service-card">
                                <div className="service-icon-box">
                                    {servicesData.judiciary[lang].icon}
                                </div>
                                <h3 className="service-card-title">{t("service-judiciary-title")}</h3>
                                <p className="service-card-desc" dangerouslySetInnerHTML={{ __html: t("service-judiciary-desc") }}></p>
                                <span className="service-learn-more" onClick={() => setActiveServiceKey('judiciary')}>
                                    <span>{t("service-judiciary-link")}</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </span>
                            </article>

                            {/* Service Pillar 3: Criminology Guidance */}
                            <article className="service-card">
                                <div className="service-icon-box">
                                    {servicesData.criminology[lang].icon}
                                </div>
                                <h3 className="service-card-title">{t("service-criminology-title")}</h3>
                                <p className="service-card-desc" dangerouslySetInnerHTML={{ __html: t("service-criminology-desc") }}></p>
                                <span className="service-learn-more" onClick={() => setActiveServiceKey('criminology')}>
                                    <span>{t("service-criminology-link")}</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </span>
                            </article>
                        </div>
                    </div>
                </section>

                {/* Service details modal backdrop */}
                {activeServiceKey && (
                    <div 
                        id="services-modal" 
                        className="modal-overlay active" 
                        aria-hidden="false" 
                        role="dialog"
                        onClick={(e) => {
                            if (e.target.id === 'services-modal') {
                                setActiveServiceKey(null);
                            }
                        }}
                    >
                        <div className="modal-content">
                            <button className="modal-close" aria-label="Fermer les détails" onClick={() => setActiveServiceKey(null)}>&times;</button>
                            <div className="modal-body">
                                <div className="modal-icon-wrapper">
                                    {servicesData[activeServiceKey][lang].icon}
                                </div>
                                <h3 className="modal-title">{servicesData[activeServiceKey][lang].title}</h3>
                                <p className="modal-desc" dangerouslySetInnerHTML={{ __html: servicesData[activeServiceKey][lang].desc }}></p>
                                <h4 className="modal-list-title">{servicesData[activeServiceKey][lang].listTitle}</h4>
                                {servicesData[activeServiceKey][lang].intro && (
                                    <p className="modal-list-intro" style={{ marginBottom: '16px', color: 'var(--olive)', fontSize: '0.95rem' }}>{servicesData[activeServiceKey][lang].intro}</p>
                                )}
                                <ul className="modal-list">
                                    {servicesData[activeServiceKey][lang].points.map((pt, idx) => (
                                        <li key={idx}>{pt}</li>
                                    ))}
                                </ul>
                                <a href="#contact" className="btn-primary modal-cta" onClick={() => setActiveServiceKey(null)}>
                                    {t("res-cta")}
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactive Guidance Tool */}
                <section id="guidance" className="guidance-section">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-subtitle">{t("quiz-subtitle")}</span>
                            <h2 className="section-title">{t("quiz-title")}</h2>
                            <p className="section-desc">{t("quiz-desc")}</p>
                        </div>
                        
                        <div className="guidance-card">
                            {/* Step 1: Core Need Selection */}
                            {quizStep === 0 && (
                                <div className="guidance-step active" data-step="0">
                                    <h3 className="modal-list-title">{t("quiz-q1")}</h3>
                                    <div className="guidance-options">
                                        <button 
                                            className={`guidance-option-btn ${quizAnswers.need === 'social' ? 'selected' : ''}`}
                                            onClick={() => handleQuizOptionClick('need', 'social')} 
                                            aria-label="Sélectionner Soutien Social et Coaching Familial"
                                        >
                                            <span className="guidance-option-title">{t("quiz-q1-o1-t")}</span>
                                            <span className="guidance-option-desc">{t("quiz-q1-o1-d")}</span>
                                        </button>
                                        <button 
                                            className={`guidance-option-btn ${quizAnswers.need === 'judiciary' ? 'selected' : ''}`}
                                            onClick={() => handleQuizOptionClick('need', 'judiciary')} 
                                            aria-label="Sélectionner Accompagnement Juridique"
                                        >
                                            <span className="guidance-option-title">{t("quiz-q1-o2-t")}</span>
                                            <span className="guidance-option-desc">{t("quiz-q1-o2-d")}</span>
                                        </button>
                                        <button 
                                            className={`guidance-option-btn ${quizAnswers.need === 'criminology' ? 'selected' : ''}`}
                                            onClick={() => handleQuizOptionClick('need', 'criminology')} 
                                            aria-label="Sélectionner Soutien aux Victimes et Criminologie"
                                        >
                                            <span className="guidance-option-title">{t("quiz-q1-o3-t")}</span>
                                            <span className="guidance-option-desc">{t("quiz-q1-o3-d")}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Step 2: Urgency Level */}
                            {quizStep === 1 && (
                                <div className="guidance-step active" data-step="1">
                                    <h3 className="modal-list-title">{t("quiz-q2")}</h3>
                                    <div className="guidance-options">
                                        <button 
                                            className={`guidance-option-btn ${quizAnswers.urgency === 'standard' ? 'selected' : ''}`}
                                            onClick={() => handleQuizOptionClick('urgency', 'standard')} 
                                            aria-label="Sélectionner Urgence Standard"
                                        >
                                            <span className="guidance-option-title">{t("quiz-q2-o1-t")}</span>
                                            <span className="guidance-option-desc">{t("quiz-q2-o1-d")}</span>
                                        </button>
                                        <button 
                                            className={`guidance-option-btn ${quizAnswers.urgency === 'immediate' ? 'selected' : ''}`}
                                            onClick={() => handleQuizOptionClick('urgency', 'immediate')} 
                                            aria-label="Sélectionner Besoin Immédiat"
                                        >
                                            <span className="guidance-option-title">{t("quiz-q2-o2-t")}</span>
                                            <span className="guidance-option-desc">{t("quiz-q2-o2-d")}</span>
                                        </button>
                                        <button 
                                            className={`guidance-option-btn ${quizAnswers.urgency === 'crisis' ? 'selected' : ''}`}
                                            onClick={() => handleQuizOptionClick('urgency', 'crisis')} 
                                            aria-label="Sélectionner Urgence Critique/Danger"
                                        >
                                            <span className="guidance-option-title">{t("quiz-q2-o3-t")}</span>
                                            <span className="guidance-option-desc">{t("quiz-q2-o3-d")}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Step 3: Result Screen */}
                            {quizStep === 2 && (
                                <div className="guidance-step active" data-step="2">
                                    <div className="guidance-result-box">
                                        <span className="guidance-result-badge">{t("res-badge")}</span>
                                        <h3 className="guidance-result-title">{getQuizResults().pathName}</h3>
                                        <p className="guidance-result-desc">{getQuizResults().details}</p>
                                        
                                        <div className="guidance-action-cards">
                                            <div className="guidance-action-card">
                                                <span className="guidance-action-num">01</span>
                                                <p className="guidance-action-text">
                                                    {getQuizResults().steps[quizAnswers.urgency === 'crisis' ? 'crisis' : 'standard'][0]}
                                                </p>
                                            </div>
                                            <div className="guidance-action-card">
                                                <span className="guidance-action-num">02</span>
                                                <p className="guidance-action-text">
                                                    {getQuizResults().steps[quizAnswers.urgency === 'crisis' ? 'crisis' : 'standard'][1]}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                            <a href="#contact" className="btn-primary">{t("res-cta")}</a>
                                            <button type="button" className="btn-secondary" onClick={handleQuizRestart}>
                                                {t("quiz-restart")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Quiz Navigation */}
                            <div className="guidance-nav">
                                <button 
                                    type="button" 
                                    className="btn-secondary" 
                                    style={{ display: quizStep > 0 && quizStep < 2 ? 'block' : 'none' }} 
                                    onClick={handleQuizPrev}
                                >
                                    {t("quiz-prev")}
                                </button>
                                <div className="guidance-progress-bar">
                                    <div 
                                        className="guidance-progress-fill" 
                                        style={{ width: `${((quizStep + 1) / 3) * 100}%` }}
                                    ></div>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-primary" 
                                    style={{ display: quizStep < 2 ? 'block' : 'none' }}
                                    disabled={quizStep === 0 ? !quizAnswers.need : !quizAnswers.urgency}
                                    onClick={handleQuizNext}
                                >
                                    {quizStep === 1 ? t("quiz-see-results") : t("quiz-next")}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About / Philosophy Section */}
                <section id="about" className="philosophy">
                    <div className="container philosophy-grid">
                        <div className="philosophy-image-box">
                            {/* Calm botanical silhouette matching the logo feel */}
                            <svg viewBox="0 0 500 500" fill="none" style={{ backgroundColor: 'var(--bg-light)', display: 'block' }} width="100%">
                                <circle cx="250" cy="250" r="210" stroke="#cd8b8d" strokeWidth="2" strokeDasharray="1 3"/>
                                {/* Outlines and leaf nodes imitating logo botanical branch */}
                                <path d="M120,380 Q200,280 320,180" stroke="#6d6e61" strokeWidth="4" strokeLinecap="round"/>
                                <path d="M160,330 Q180,310 190,300" stroke="#6d6e61" strokeWidth="3"/>
                                <path d="M220,270 Q240,250 250,240" stroke="#6d6e61" strokeWidth="3"/>
                                <path d="M280,210 Q300,190 310,180" stroke="#6d6e61" strokeWidth="3"/>
                                
                                {/* Leaves */}
                                <path d="M190,300 C210,300 220,280 200,270 C180,260 170,285 190,300 Z" fill="#6d6e61" opacity="0.8"/>
                                <path d="M250,240 C270,240 280,220 260,210 C240,200 230,225 250,240 Z" fill="#cd8b8d" opacity="0.8"/>
                                <path d="M310,180 C330,180 340,160 320,150 C300,140 290,165 310,180 Z" fill="#6d6e61" opacity="0.8"/>
                                <path d="M220,290 C220,310 200,320 195,300 C190,280 215,270 220,290 Z" fill="#e1c2bd" opacity="0.9"/>
                                <path d="M280,230 C280,250 260,260 255,240 C250,220 275,210 280,230 Z" fill="#6d6e61" opacity="0.8"/>
                                
                                {/* Center Symbolical Women Outlines */}
                                <g transform="translate(180, 200)">
                                    <path d="M50,110 C50,75 80,75 80,110 Z" fill="#373e33" opacity="0.85"/>
                                    <circle cx="65" cy="65" r="14" fill="#373e33" opacity="0.85"/>
                                    
                                    <path d="M85,120 C85,90 110,90 110,120 Z" fill="#6d6e61" opacity="0.9"/>
                                    <circle cx="97" cy="80" r="12" fill="#6d6e61" opacity="0.9"/>
                                    
                                    <path d="M20,125 C20,95 45,95 45,125 Z" fill="#cd8b8d" opacity="0.85"/>
                                    <circle cx="32.5" cy="85" r="12" fill="#cd8b8d" opacity="0.85"/>
                                </g>
                            </svg>
                        </div>
                        
                        <div className="philosophy-content">
                            <span className="section-subtitle">{t("about-subtitle")}</span>
                            <h2 className="section-title">{t("about-title")}</h2>
                            <p className="section-desc" style={{ marginBottom: '32px' }} dangerouslySetInnerHTML={{ __html: t("about-desc") }}></p>
                            
                            <div className="philosophy-intervention" style={{ marginTop: '24px', marginBottom: '32px' }}>
                                <h3 className="intervention-title" style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--text-dark)', marginBottom: '8px', fontWeight: 600 }}>{t("about-intervention-title")}</h3>
                                <p className="intervention-subtitle" style={{ fontSize: '1rem', color: 'var(--olive)', marginBottom: '12px' }}>{t("about-intervention-subtitle")}</p>
                                <p className="intervention-intro" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-dark)', marginBottom: '8px' }}>{t("about-intervention-intro")}</p>
                                <ul className="intervention-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <li key={num} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
                                            <span style={{ color: 'var(--accent-rose)', fontWeight: 'bold' }}>•</span>
                                            <span>{t(`about-intervention-p${num}`)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="philosophy-features">
                                <div className="feature-item">
                                    <div className="feature-icon-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                    </div>
                                    <h3 className="feature-title">{t("about-f1-t")}</h3>
                                    <p className="feature-desc">{t("about-f1-d")}</p>
                                </div>
                                
                                <div className="feature-item">
                                    <div className="feature-icon-wrapper">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="feature-title">{t("about-f2-t")}</h3>
                                    <p className="feature-desc">{t("about-f2-d")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" class="contact">
                    <div className="container contact-grid">
                        <div className="contact-info-panel">
                            <div>
                                <h2 className="contact-card-title">{t("contact-title")}</h2>
                                <p className="contact-card-desc">{t("contact-desc")}</p>
                                
                                <div className="contact-details">
                                    <div className="contact-detail-item">
                                        <span className="contact-detail-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                            </svg>
                                        </span>
                                        <div>
                                            <span className="contact-detail-label">{t("contact-label-phone")}</span>
                                            <span className="contact-detail-value">01 23 45 67 89</span>
                                        </div>
                                    </div>
                                    
                                    <div className="contact-detail-item">
                                        <span className="contact-detail-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                        </span>
                                        <div>
                                            <span className="contact-detail-label">{t("contact-label-email")}</span>
                                            <span className="contact-detail-value">contact@cabinetequilibre.fr</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="confidentiality-notice">
                                <h3 className="confidentiality-title">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <span>{t("contact-safety-title")}</span>
                                </h3>
                                <p className="confidentiality-text">{t("contact-safety-text")}</p>
                            </div>
                        </div>
                        
                        <div className="contact-form-panel">
                            <form id="confidential-contact" onSubmit={handleFormSubmit} noValidate>
                                <div className="form-group-row">
                                    <div className="form-group">
                                        <label htmlFor="form-name" className="form-label">{t("form-name-label")}</label>
                                        <input 
                                            type="text" 
                                            id="form-name" 
                                            className="form-input" 
                                            placeholder={lang === 'fr' ? 'ex., Sarah' : 'e.g., Sarah'} 
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="form-method" className="form-label">{t("form-method-label")}</label>
                                        <select 
                                            id="form-method" 
                                            className="form-select"
                                            value={formMethod}
                                            onChange={(e) => setFormMethod(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>{t("form-method-default")}</option>
                                            <option value="email">{t("form-method-email")}</option>
                                            <option value="call">{t("form-method-call")}</option>
                                            <option value="sms">{t("form-method-sms")}</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="form-contact-detail" className="form-label">{t("form-contact-label")}</label>
                                    <input 
                                        type="text" 
                                        id="form-contact-detail" 
                                        className="form-input" 
                                        placeholder={lang === 'fr' ? 'Courriel ou numéro...' : 'Email or phone number...'} 
                                        value={formContactDetail}
                                        onChange={(e) => setFormContactDetail(e.target.value)}
                                        required 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="form-service-type" className="form-label">{t("form-category-label")}</label>
                                    <select 
                                        id="form-service-type" 
                                        className="form-select"
                                        value={formServiceType}
                                        onChange={(e) => setFormServiceType(e.target.value)}
                                    >
                                        <option value="general">{t("form-category-default")}</option>
                                        <option value="social">{t("form-category-social")}</option>
                                        <option value="judiciary">{t("form-category-judiciary")}</option>
                                        <option value="criminology">{t("form-category-criminology")}</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="form-safe-time" className="form-label">{t("form-safe-hours-label")}</label>
                                    <input 
                                        type="text" 
                                        id="form-safe-time" 
                                        className="form-input" 
                                        placeholder={lang === 'fr' ? 'Spécifiez quand répondre...' : 'Specify when to reply...'}
                                        value={formSafeTime}
                                        onChange={(e) => setFormSafeTime(e.target.value)}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="form-message" className="form-label">{t("form-desc-label")}</label>
                                    <textarea 
                                        id="form-message" 
                                        className="form-textarea" 
                                        placeholder={lang === 'fr' ? 'Comment notre équipe peut-elle vous soutenir aujourd\'hui ?' : 'How can our team support you today?'} 
                                        value={formMessage}
                                        onChange={(e) => setFormMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                
                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        checked={formConsent}
                                        onChange={(e) => setFormConsent(e.target.checked)}
                                        required 
                                    />
                                    <span>{t("form-consent-label")}</span>
                                </label>
                                
                                <button 
                                    type="submit" 
                                    className="btn-primary" 
                                    style={{ width: '100%' }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting 
                                        ? (lang === 'fr' ? 'Sécurisation & Envoi...' : 'Securing & Sending...') 
                                        : t("form-submit-btn")
                                    }
                                </button>
                                
                                <div 
                                    ref={feedbackRef}
                                    className={`form-feedback ${feedback ? 'success' : ''}`}
                                    style={{ display: feedback ? 'block' : 'none' }}
                                    dangerouslySetInnerHTML={{ __html: feedback || '' }}
                                ></div>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo-wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <img src="images/logo-rectangle.jpg" alt="Cabinet Équilibre Logo" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '1px solid rgba(250, 242, 240, 0.2)', objectFit: 'cover' }} />
                            <div>
                                <span className="footer-logo-title" style={{ marginBottom: 0, lineHeight: 1 }}>Cabinet Équilibre</span>
                                <span className="footer-logo-sub" style={{ marginBottom: 0, fontSize: '0.7rem', letterSpacing: '1px' }}>{t("logo-sub")}</span>
                            </div>
                        </div>
                        <p className="footer-desc">{t("footer-desc")}</p>
                    </div>
                    
                    <div>
                        <h3 className="footer-links-title">{t("footer-links-title")}</h3>
                        <nav aria-label="Liens de pied de page">
                            <ul className="footer-links-list">
                                <li><a href="#home">{t("nav-home")}</a></li>
                                <li><a href="#services">{t("nav-services")}</a></li>
                                <li><a href="#guidance">{t("nav-quiz")}</a></li>
                                <li><a href="#about">{t("nav-about")}</a></li>
                                <li><a href="#contact">{t("nav-support")}</a></li>
                            </ul>
                        </nav>
                    </div>
                    
                    <div>
                        <h3 className="footer-links-title">{t("footer-accessibility-title")}</h3>
                        <p className="footer-contact-item" style={{ marginBottom: '16px' }}>
                            {t("footer-accessibility-text")}
                        </p>
                        <div className="footer-contact-item">
                            <span className="footer-contact-icon">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                            </span>
                            <span>{t("footer-secure-label")}</span>
                        </div>
                    </div>
                </div>
                
                <div className="container footer-bottom">
                    <p dangerouslySetInnerHTML={{ __html: t("footer-copyright") }}></p>
                    <div className="footer-bottom-links">
                        <a href="#contact">{t("footer-policy")}</a>
                        <a href="#contact">{t("footer-terms")}</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
