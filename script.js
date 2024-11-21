document.addEventListener('DOMContentLoaded', () => {
    function initParticles() {
        if (window.tsParticles) {
            tsParticles.load("background-particles", {
                fullScreen: {
                    enable: true,
                    zIndex: -1
                },
                particles: {
                    number: { 
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: { value: "#4a90e2" },
                    shape: { 
                        type: "circle",
                        stroke: {
                            width: 0,
                            color: "#000000"
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#4a90e2",
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "top",
                        random: false,
                        straight: false,
                        out_mode: "out",
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "repulse"
                        },
                        onclick: {
                            enable: true,
                            mode: "push"
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 400,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

    initParticles();

    const readGuidelinesBtn = document.getElementById('readGuidelinesBtn');
    const agreeBtn = document.getElementById('agreeBtn');
    const guidelinesModal = document.getElementById('guidelinesModal');
    const agreementForm = document.getElementById('agreementForm');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    const confirmationModal = document.createElement('div');

    confirmationModal.innerHTML = `
        <div class="modal" id="confirmationModal">
            <div class="modal-content">
                <h2>Agreement Submitted Successfully</h2>
                <p>Thank you for submitting your official UKRP Divisional Command agreement.</p>
                <p>Your response is now under review.</p>
                <button id="closeConfirmationBtn" class="glowing-btn">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmationModal);
    const confirmationModalEl = document.getElementById('confirmationModal');

    function openGuidelinesModal() {
        guidelinesModal.style.display = 'flex';
    }

    function openAgreementForm() {
        guidelinesModal.style.display = 'none';
        agreementForm.style.display = 'flex';
    }

    function closeModals() {
        guidelinesModal.style.display = 'none';
        agreementForm.style.display = 'none';
        confirmationModalEl.style.display = 'none';
    }

    readGuidelinesBtn?.addEventListener('click', openGuidelinesModal);
    agreeBtn?.addEventListener('click', openAgreementForm);
    modalCloseButtons.forEach(btn => btn.addEventListener('click', closeModals));

    document.getElementById('closeConfirmationBtn')?.addEventListener('click', () => {
        confirmationModalEl.style.display = 'none';
    });

    const commandAgreementForm = document.getElementById('commandAgreementForm');
    if (commandAgreementForm) {
        function getWebhookURL() {
            const baseURL = 'https://discord.com/api/webhooks/';
            const webhookID = '1309013780163723324';
            const webhookToken = 'IzG1vinT5A2jpjge-Sv5WmjoadSnHaVYdzgSPAA2NTc6q6hKYE7CRgAVsLYeU6YN84b-';
            
            return `${baseURL}${webhookID}/${webhookToken}`;
        }

        commandAgreementForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                discordId: e.target.querySelector('input[placeholder="Discord ID"]').value,
                age: e.target.querySelector('input[type="number"]').value,
                email: e.target.querySelector('input[type="email"]').value,
                commandTier: e.target.querySelector('select').value,
                additionalComments: e.target.querySelector('textarea').value,
                agreements: {
                    professionalConduct: e.target.querySelectorAll('input[type="checkbox"]')[0].checked,
                    confidentiality: e.target.querySelectorAll('input[type="checkbox"]')[1].checked,
                    disciplinaryActions: e.target.querySelectorAll('input[type="checkbox"]')[2].checked,
                    ageConfirmation: e.target.querySelectorAll('input[type="checkbox"]')[3].checked
                }
            };

            try {
                const webhookURL = getWebhookURL();

                const response = await fetch(webhookURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        embeds: [{
                            title: "UKRP Command Division - Agreement Submission",
                            color: 0x4A90E2,
                            fields: [
                                { 
                                    name: "Discord Member", 
                                    value: `<@${formData.discordId}>`, 
                                },
                                { 
                                    name: "Command Tier", 
                                    value: formData.commandTier, 
                                },
                                { 
                                    name: "Age", 
                                    value: formData.age, 
                                },
                                { 
                                    name: "Email", 
                                    value: formData.email, 
                                },
                                { 
                                    name: "Additional Comments", 
                                    value: formData.additionalComments || "No comments", 
                                },
                                { 
                                    name: "Agreement Checklist", 
                                    value: `
**Professional Conduct**: ${formData.agreements.professionalConduct ? '✓' : '✗'}
**Confidentiality**: ${formData.agreements.confidentiality ? '✓' : '✗'}
**Disciplinary Actions**: ${formData.agreements.disciplinaryActions ? '✓' : '✗'}
**Age Confirmation**: ${formData.agreements.ageConfirmation ? '✓' : '✗'}
                                    `, 
                                }
                            ]
                        }]
                    })
                });

                if (response.ok) {
                    agreementForm.style.display = 'none';
                    confirmationModalEl.style.display = 'flex';
                } else {
                    const errorText = await response.text();
                    throw new Error('Submission failed');
                }
            } catch (error) {
                alert('Failed to submit agreement. Please try again.');
            }
        });
    }
}); 