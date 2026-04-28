// Rajivnagar Shala - main.js (Gujarati UI) - Enhanced with Animations

/* ===== SIDEBAR MANAGEMENT ===== */
function toggleSidebar() {
    var sb = document.getElementById('sidebar');
    if (sb) {
        sb.classList.toggle('open');
        
        // Announce to screen readers
        sb.setAttribute('aria-expanded', sb.classList.contains('open'));
    }
}

// Close sidebar when clicking outside
document.addEventListener('click', function(e) {
    var sb = document.getElementById('sidebar');
    var btn = document.querySelector('.menu-btn');
    
    if (sb && btn && !sb.contains(e.target) && !btn.contains(e.target)) {
        if (window.innerWidth <= 767) {
            sb.classList.remove('open');
            sb.setAttribute('aria-expanded', 'false');
        }
    }
});

// Close sidebar on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var sb = document.getElementById('sidebar');
        if (sb && window.innerWidth <= 767) {
            sb.classList.remove('open');
            sb.setAttribute('aria-expanded', 'false');
        }
    }
});

/* ===== MODAL MANAGEMENT WITH ANIMATIONS ===== */
function openModal(id) {
    var el = document.getElementById(id);
    if (el) {
        el.classList.add('open');
        
        // Focus management for accessibility
        var firstInput = el.querySelector('input, select, textarea, button');
        if (firstInput) {
            setTimeout(function() {
                firstInput.focus();
            }, 150);
        }
        
        // Announce to screen readers
        el.setAttribute('aria-hidden', 'false');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    var el = document.getElementById(id);
    if (el) {
        el.classList.remove('open');
        
        // Announce to screen readers
        el.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Close modal with escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        var openModals = document.querySelectorAll('.modal-overlay.open');
        if (openModals.length > 0) {
            closeModal(openModals[openModals.length - 1].id);
        }
    }
});

// Close modal when clicking overlay
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('open')) {
        closeModal(e.target.id);
    }
});

/* ===== TOAST NOTIFICATIONS ===== */
function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    
    // Clear any existing timeout
    if (t.timeoutId) {
        clearTimeout(t.timeoutId);
    }
    
    // Update content with animation
    t.textContent = msg;
    t.style.display = 'block';
    
    // Trigger reflow to enable animation
    void t.offsetWidth;
    t.classList.add('show');
    
    // Announce to screen readers
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    
    // Auto hide with animation
    t.timeoutId = setTimeout(function() {
        t.classList.remove('show');
        setTimeout(function() {
            t.style.display = 'none';
        }, 300);
    }, 2800);
}

/* ===== PASSWORD CHANGE ===== */
function changePassword() {
    var oldPass = document.getElementById('oldPass');
    var newPass = document.getElementById('newPass');
    
    if (!oldPass || !newPass) return;
    
    if (!oldPass.value || !newPass.value) {
        showToast('⚠️ બધા ખાના ભરો.');
        return;
    }
    
    if (newPass.value.length < 4) {
        showToast('⚠️ Password ૪+ અક્ષરો હોવો જોઈએ.');
        return;
    }
    
    var fd = new FormData();
    fd.append('old_password', oldPass.value);
    fd.append('new_password', newPass.value);
    
    fetch('/change-password', {
        method: 'POST',
        body: fd
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
        showToast(d.success ? '✅ ' + d.msg : '❌ ' + d.msg);
        if (d.success) {
            closeModal('passModal');
            oldPass.value = '';
            newPass.value = '';
        }
    })
    .catch(function() {
        showToast('❌ Network error.');
    });
}

/* ===== CUSTOM DOCUMENTS ===== */
var customDocCount = 0;

function addCustomDoc() {
    customDocCount++;
    var id = 'cdoc_' + customDocCount;
    var list = document.getElementById('customDocsList');
    
    if (!list) return;
    
    var row = document.createElement('div');
    row.className = 'custom-doc-row';
    row.id = id;
    row.style.animation = 'slideInUp 0.3s ease-out';
    
    row.innerHTML = 
        '<input type="text" name="custom_doc_name" placeholder="દ.ત. જન્મ પ્રમાણ" />' +
        '<input type="file" name="custom_doc_file" accept="image/*,.pdf" />' +
        '<button type="button" class="remove-doc-btn" onclick="removeCustomDoc(\'' + id + '\')">✕</button>';
    
    list.appendChild(row);
}

function removeCustomDoc(id) {
    var row = document.getElementById(id);
    if (row) {
        row.style.animation = 'slideOutDown 0.3s ease-out forwards';
        setTimeout(function() {
            row.remove();
        }, 300);
    }
}

/* ===== STUDENT SEARCH ===== */
function searchStudents(query) {
    var q = query.toLowerCase().trim();
    var cards = document.querySelectorAll('[data-name]');
    var shown = 0;
    
    cards.forEach(function(card) {
        var name = card.dataset.name || '';
        var roll = card.dataset.roll || '';
        var match = name.includes(q) || roll.includes(q) || q === '';
        
        if (match) {
            card.style.display = '';
            card.style.animation = 'slideInUp 0.3s ease-out';
            shown++;
        } else {
            card.style.display = 'none';
            card.style.animation = '';
        }
    });
    
    var noRes = document.getElementById('noResults');
    if (noRes) {
        if (shown === 0 && q !== '') {
            noRes.style.display = 'block';
            noRes.style.animation = 'fadeIn 0.3s ease-out';
        } else {
            noRes.style.display = 'none';
        }
    }
}

/* ===== STUDENT DETAIL VIEW ===== */
var currentStudent = null;

function makeDetail(label, value) {
    return '<div>' +
        '<div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;margin-bottom:2px;letter-spacing:0.3px;">' +
        label + 
        '</div>' +
        '<div style="font-size:13px;color:#1e293b;font-weight:500;">' + 
        (value || '-') + 
        '</div>' +
        '</div>';
}

function openViewModal(studentId, detailUrl) {
    var nameEl = document.getElementById('viewStudentName');
    var contentEl = document.getElementById('viewStudentContent');
    
    if (!nameEl || !contentEl) return;
    
    // Show loading state
    nameEl.textContent = 'લોડ થઈ રહ્યું...';
    contentEl.innerHTML = '<p style="color:#64748b;font-size:13px;padding:10px 0;text-align:center;">⏳ લોડ થઈ રહ્યું...</p>';
    
    openModal('viewModal');
    
    fetch(detailUrl)
    .then(function(r) { return r.json(); })
    .then(function(s) {
        currentStudent = s;
        
        // Set name with animation
        nameEl.textContent = s.name + (s.surname ? ' ' + s.surname : '');
        nameEl.style.animation = 'slideInDown 0.3s ease-out';
        
        var docs = s.documents || [];
        var docsHtml = '';
        
        if (docs.length > 0) {
            docsHtml = '<div style="margin-top:14px;border-top:1px solid #e2e8f0;padding-top:14px;">' +
                '<div style="font-size:11px;font-weight:700;color:#1a4f8a;text-transform:uppercase;letter-spacing:0.4px;margin-bottom:12px;">📎 दस्तावेज़</div>';
            
            docs.forEach(function(d, idx) {
                var vh = '';
                
                if (d.doc_url && d.doc_url.startsWith('data:image')) {
                    vh = '<div style="margin:8px 0;"><img src="' + d.doc_url + '" style="max-width:100%;max-height:180px;border-radius:8px;border:1px solid #e2e8f0;box-shadow:0 2px 4px rgba(0,0,0,0.08);" /></div>' +
                         '<a href="' + d.doc_url + '" download="' + d.doc_name + '" class="btn-icon" style="display:inline-block;margin-top:4px;">⬇ ડાઉ.</a>';
                } else if (d.doc_url && d.doc_url.startsWith('data:')) {
                    vh = '<a href="' + d.doc_url + '" download="' + d.doc_name + '" class="btn-icon">⬇ PDF ડાઉ.</a>';
                } else if (d.doc_url) {
                    vh = '<a href="' + d.doc_url + '" target="_blank" class="btn-icon">👁 જુઓ</a>';
                }
                
                docsHtml += '<div style="padding:8px 0;border-bottom:1px solid #f1f5f9;animation:slideInUp 0.3s ease-out ' + (idx * 0.05) + 's both;">' +
                    '<div style="font-size:13px;font-weight:600;margin-bottom:6px;color:#1e293b;">📄 ' + d.doc_name + '</div>' +
                    vh +
                    '</div>';
            });
            
            docsHtml += '</div>';
        } else {
            docsHtml = '<p style="font-size:13px;color:#94a3b8;margin-top:12px;text-align:center;">કોઈ દસ્તાવેજ નથી</p>';
        }
        
        // Build and display content with animation
        var content = 
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px;animation:fadeIn 0.3s ease-out;">' +
            makeDetail('ક્રમ', s.roll_no) + makeDetail('જ.ર.', s.gr_number) +
            makeDetail('અટક', s.surname) + makeDetail('પિતા', s.father_name) +
            makeDetail('માતા', s.mother_name) + makeDetail('જ.તા.', s.dob) +
            makeDetail('જાતિ', s.gender) + makeDetail('જ્ઞ.', s.caste) +
            makeDetail('સ.', s.section) + makeDetail('સં.', s.parent_contact) +
            makeDetail('સ.નું', s.address) + makeDetail('આ.નં.', s.aadhaar_number) +
            makeDetail('ખ.નં.', s.bank_account) + makeDetail('બ.', s.bank_name) +
            '</div>' + docsHtml;
        
        contentEl.innerHTML = content;
        contentEl.style.animation = 'slideInUp 0.3s ease-out';
    })
    .catch(function(err) {
        showToast('❌ ભૂલ. ફરી જુઓ.');
        closeModal('viewModal');
    });
}

function openEditFromView() {
    if (!currentStudent) {
        showToast('❌ ફરી જુઓ.');
        return;
    }
    
    var s = currentStudent;
    
    function sv(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val || '';
    }
    
    // Populate form fields
    sv('editStudentId', s.id);
    sv('editName', s.name);
    sv('editSurname', s.surname);
    sv('editFatherName', s.father_name);
    sv('editMotherName', s.mother_name);
    sv('editRoll', s.roll_no);
    sv('editGR', s.gr_number);
    sv('editDOB', s.dob);
    sv('editGender', s.gender);
    sv('editCaste', s.caste);
    sv('editSection', s.section);
    sv('editAddress', s.address);
    sv('editContact', s.parent_contact);
    sv('editAadhaar', s.aadhaar_number);
    sv('editAttRegNo', s.attendance_register_no);
    sv('editBank', s.bank_account);
    sv('editBankName', s.bank_name);
    sv('editIFSC', s.ifsc_code);
    
    closeModal('viewModal');
    
    // Open edit modal with delay
    setTimeout(function() {
        openModal('editModal');
    }, 150);
}

/* ===== PAGE LOAD ANIMATIONS ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Add initial animations to cards
    var cards = document.querySelectorAll('.card:not([data-no-animate])');
    cards.forEach(function(card, idx) {
        card.style.animation = 'fadeIn 0.4s ease-out ' + (idx * 0.05) + 's both';
    });
    
    // Add animations to list items
    var listItems = document.querySelectorAll('.student-card, .subject-item, .teacher-row, .attendance-row');
    listItems.forEach(function(item, idx) {
        item.style.animation = 'slideInUp 0.3s ease-out ' + (idx * 0.03) + 's both';
    });
});

/* ===== ENHANCED BUTTON FEEDBACK ===== */
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn, .btn-icon, .quick-btn, .action-btn');
    if (btn && !btn.disabled) {
        // Add ripple effect
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.pointerEvents = 'none';
        
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        btn.appendChild(ripple);
        
        setTimeout(function() {
            ripple.remove();
        }, 600);
    }
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ===== CSS ANIMATIONS ===== */
var styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(10px);
        }
    }

    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulseScale {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
        100% {
            transform: scale(1);
        }
    }

    /* TOAST ANIMATION */
    #toast {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    #toast.show {
        opacity: 1;
        transform: translateY(0);
    }

    /* MODAL ANIMATIONS */
    .modal-overlay {
        animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modal-overlay.open .modal {
        animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* BUTTON RIPPLE */
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        animation: rippleEffect 0.6s ease-out;
    }

    @keyframes rippleEffect {
        to {
            opacity: 0;
            transform: scale(4);
        }
    }

    /* BUTTON HOVER ANIMATION */
    .btn:not(:disabled):active,
    .btn-icon:active,
    .quick-btn:active,
    .action-btn:active {
        animation: pulseScale 0.2s ease-out;
    }

    /* SMOOTH TRANSITIONS FOR INTERACTIVE ELEMENTS */
    input:focus,
    select:focus,
    textarea:focus {
        transform: translateY(-1px);
    }

    /* SIDEBAR ANIMATION */
    .sidebar {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (max-width: 767px) {
        .sidebar:not(.open) {
            transform: translateX(-100%);
            opacity: 0;
            visibility: hidden;
        }
    }

    /* CARD ANIMATION ON HOVER */
    .card {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* PAGE TRANSITIONS */
    .page-header {
        animation: slideInDown 0.4s ease-out;
    }

    .stats-grid > * {
        animation: fadeIn 0.4s ease-out backwards;
    }

    .stats-grid > *:nth-child(1) { animation-delay: 0s; }
    .stats-grid > *:nth-child(2) { animation-delay: 0.05s; }
    .stats-grid > *:nth-child(3) { animation-delay: 0.1s; }
    .stats-grid > *:nth-child(4) { animation-delay: 0.15s; }
`;

document.head.appendChild(styleSheet);