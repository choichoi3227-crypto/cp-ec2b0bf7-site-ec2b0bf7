// main.js — 자동 변환: WordPress functions.php enqueue_scripts() → vanilla JS
// WordPress: wp_enqueue_script('navigation', ...) 변환
document.addEventListener('DOMContentLoaded', () => {
  // 모바일 메뉴 토글 — WordPress TwentyTwentyFour navigation.js 변환
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('#site-navigation');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.getAttribute('aria-expanded') === 'true';
      nav.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('toggled', !open);
    });
  }
  // 현재 메뉴 아이템 강조 — WordPress current-menu-item 클래스 변환
  document.querySelectorAll('.nav-menu a').forEach(a => {
    if (a instanceof HTMLAnchorElement && a.pathname === location.pathname) {
      a.classList.add('current-menu-item');
      a.setAttribute('aria-current', 'page');
    }
  });
});
