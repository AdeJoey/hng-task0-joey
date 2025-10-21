(function(){
	function setTimeNow() {
		try {
			const timeEl = document.querySelector('[data-testid="test-user-time"]');
			if (timeEl) timeEl.textContent = String(Date.now());
		} catch (e) {
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', setTimeNow);
	} else {
		setTimeNow();
	}

	// --- Continuous ticker (updates every 100ms), pauses when page is hidden ---
	let _ticker = null;
	function startTicker() {
		if (_ticker) return;
		_ticker = setInterval(()=>{
			const el = document.querySelector('[data-testid="test-user-time"]');
			if (el) el.textContent = String(Date.now());
		}, 100);
	}
	function stopTicker(){ if(_ticker){ clearInterval(_ticker); _ticker = null } }

	document.addEventListener('visibilitychange', ()=>{
		if (document.hidden) stopTicker(); else startTicker();
	});

	if (!document.hidden) startTicker();

	// --- Avatar handling (URL or file) ---
	const avatarImg = document.querySelector('[data-testid="test-user-avatar"]');
	const defaultSrc = avatarImg ? avatarImg.src : '';
	let currentBlobUrl = null;

	// Popover controls/selectors
	const uploadWrap = document.querySelector('.upload-wrap');
	const trigger = uploadWrap && uploadWrap.querySelector('.upload-trigger');
	const popover = document.getElementById('upload-popover');
	const popClose = popover && popover.querySelector('.popover-close');
	const avatarUrlInput = popover && popover.querySelector('#avatar-url');
	const avatarFileInput = popover && (popover.querySelector('#avatar-file') || popover.querySelector('#avatar-upload'));
	const applyBtn = popover && popover.querySelector('#apply-avatar');
	const resetBtn = popover && popover.querySelector('#reset-avatar');

	function openPopover(){
		if(!popover || !trigger) return;
		popover.setAttribute('aria-hidden','false');
		trigger.setAttribute('aria-expanded','true');
		setTimeout(()=>{ if(avatarUrlInput) avatarUrlInput.focus(); }, 10);
	}
	function closePopover(){
		if(!popover || !trigger) return;
		popover.setAttribute('aria-hidden','true');
		trigger.setAttribute('aria-expanded','false');
		setTimeout(()=>{ trigger.focus(); }, 10);
	}

	if(trigger){
		trigger.addEventListener('click', (e)=>{
			const expanded = trigger.getAttribute('aria-expanded') === 'true';
			if(expanded) closePopover(); else openPopover();
		});
	}

	if(popClose){ popClose.addEventListener('click', closePopover); }

	document.addEventListener('click', (e)=>{
		if(!popover || popover.getAttribute('aria-hidden') === 'true') return;
		if(uploadWrap && !uploadWrap.contains(e.target)) closePopover();
	});

	document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closePopover(); });

	if(applyBtn){
		applyBtn.addEventListener('click', ()=>{
			if(!avatarImg) return;
			const url = avatarUrlInput && avatarUrlInput.value && avatarUrlInput.value.trim();
			if(url){
				if(currentBlobUrl){ URL.revokeObjectURL(currentBlobUrl); currentBlobUrl = null }
				avatarImg.src = url;
				avatarImg.alt = 'User avatar';
				closePopover();
				return;
			}
			const file = avatarFileInput && avatarFileInput.files && avatarFileInput.files[0];
			if(file){
				if(currentBlobUrl){ URL.revokeObjectURL(currentBlobUrl); currentBlobUrl = null }
				const obj = URL.createObjectURL(file);
				currentBlobUrl = obj;
				avatarImg.src = obj;
				avatarImg.alt = file.name || 'Uploaded avatar';
				closePopover();
			}
		});
	}

	if(resetBtn){
		resetBtn.addEventListener('click', ()=>{
			if(avatarImg) {
				avatarImg.src = defaultSrc;
				avatarImg.alt = 'User avatar';
			}
			if(currentBlobUrl){ URL.revokeObjectURL(currentBlobUrl); currentBlobUrl = null }
			if(avatarUrlInput) avatarUrlInput.value = '';
			if(avatarFileInput) avatarFileInput.value = '';
			closePopover();
		});
	}

		window.addEventListener('beforeunload', ()=>{  });
})();

// --- Three-dot menu toggle ---
const menuBtn = document.querySelector('.menu-trigger');
const menuLinks = document.querySelector('.menu-links');

if (menuBtn && menuLinks) {
  menuBtn.addEventListener('click', () => {
    menuLinks.classList.toggle('show');
    const hidden = menuLinks.getAttribute('aria-hidden') === 'true';
    menuLinks.setAttribute('aria-hidden', hidden ? 'false' : 'true');
  });

  document.addEventListener('click', (e) => {
    if (!menuLinks.contains(e.target) && !menuBtn.contains(e.target)) {
      menuLinks.classList.remove('show');
      menuLinks.setAttribute('aria-hidden', 'true');
    }
  });
}
