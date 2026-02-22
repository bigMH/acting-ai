/**
 * 动态加载 header 和 footer 组件
 * 适用于静态网站，兼容 Gitee Pages
 */

// 加载 header
function loadHeader() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('./components/header.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load header');
        }
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
        initMobileMenu();
        highlightActiveNav();
      })
      .catch(error => {
        console.error('Error loading header:', error);
        // 如果加载失败，显示默认导航
        headerPlaceholder.innerHTML = getDefaultHeader();
        initMobileMenu();
        highlightActiveNav();
      });
  }
}

// 加载 footer
function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('./components/footer.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load footer');
        }
        return response.text();
      })
      .then(html => {
        footerPlaceholder.innerHTML = html;
      })
      .catch(error => {
        console.error('Error loading footer:', error);
        // 如果加载失败，显示默认页脚
        footerPlaceholder.innerHTML = getDefaultFooter();
      });
  }
}

// 初始化移动端菜单（防止重复绑定事件）
let mobileMenuInitialized = false;

function initMobileMenu() {
  // 防止重复初始化
  if (mobileMenuInitialized) {
    return;
  }
  
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navList = document.querySelector('.nav-list');
  
  if (mobileMenuToggle && navList) {
    // 标记为已初始化
    mobileMenuInitialized = true;
    
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navList.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
    
    // 点击菜单项后关闭移动端菜单
    const navLinks = navList.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
      });
    });
    
    // 点击外部区域关闭菜单（使用事件委托，只绑定一次）
    if (!document.mobileMenuClickHandler) {
      document.mobileMenuClickHandler = (e) => {
        if (!navList.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
          navList.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
        }
      };
      document.addEventListener('click', document.mobileMenuClickHandler);
    }
  }
}

// 高亮当前页面的导航项
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  const dropdownLinks = document.querySelectorAll('.nav-dropdown-link');

  navLinks.forEach(link => {
    try {
      const linkPath = new URL(link.href).pathname;
      const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath + 'index.html' : currentPath;
      const normalizedLinkPath = linkPath.endsWith('/') ? linkPath + 'index.html' : linkPath;

      if (linkPath === currentPath ||
          normalizedCurrentPath === normalizedLinkPath ||
          (currentPath.endsWith('/') && linkPath.endsWith('index.html')) ||
          (currentPath === '/' && linkPath.endsWith('index.html'))) {
        link.classList.add('active');
      }
    } catch (e) {
      if (link.getAttribute('href') === './index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html'))) {
        link.classList.add('active');
      }
    }
  });

  // 当前页为科普子页时，高亮「科普」父项及对应下拉项
  dropdownLinks.forEach(link => {
    try {
      const linkPath = new URL(link.href).pathname;
      const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath + 'index.html' : currentPath;
      const normalizedLinkPath = linkPath.endsWith('/') ? linkPath + 'index.html' : linkPath;
      if (linkPath === currentPath || normalizedCurrentPath === normalizedLinkPath) {
        link.classList.add('active');
        const dropdownParent = link.closest('.nav-item--dropdown');
        if (dropdownParent) {
          const parentLink = dropdownParent.querySelector('.nav-link--dropdown');
          if (parentLink) parentLink.classList.add('active');
        }
      }
    } catch (e) {}
  });
}

// 默认 header（当 fetch 失败时使用）
function getDefaultHeader() {
  return `
    <header class="site-header">
      <div class="header-container">
        <div class="logo">
          <a href="./index.html" class="logo-link">
            <span class="logo-text">Acting AI</span>
          </a>
        </div>
        <nav class="main-nav" id="mainNav">
          <ul class="nav-list">
            <li class="nav-item">
              <a href="./index.html" class="nav-link">首页</a>
            </li>
            <li class="nav-item">
              <a href="./about.html" class="nav-link">关于</a>
            </li>
            <li class="nav-item nav-item--dropdown">
              <a href="./science-index.html" class="nav-link nav-link--dropdown">科普 <span class="nav-dropdown-arrow" aria-hidden="true">▾</span></a>
              <ul class="nav-dropdown">
                <li><a href="./science.html" class="nav-dropdown-link">当 AI 有了身体</a></li>
                <li><a href="./science-robot.html" class="nav-dropdown-link">自动—自主—自我</a></li>
              </ul>
            </li>
            <li class="nav-item">
              <a href="./projects.html" class="nav-link">项目</a>
            </li>
            <li class="nav-item">
              <a href="./contact.html" class="nav-link">联系</a>
            </li>
          </ul>
          <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="切换菜单">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </div>
    </header>
  `;
}

// 默认 footer（当 fetch 失败时使用）
function getDefaultFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-content">
          <p class="footer-text">&copy; 2025 Acting AI. All rights reserved.</p>
          <p class="footer-text">Built with simplicity and purpose.</p>
        </div>
      </div>
    </footer>
  `;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  loadHeader();
  loadFooter();
});
