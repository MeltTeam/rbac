function navigateTo(target) {
  if (target === 'web') {
    window.location.href = 'web/login.html'
  } else if (target === 'uni') {
    window.location.href = 'uni/index.html'
  }
}

function goBack() {
  window.history.back()
}

function showPage(pageId) {
  const pages = document.querySelectorAll('.page-view')
  pages.forEach(page => page.classList.add('hidden'))

  const targetPage = document.getElementById(pageId)
  if (targetPage) {
    targetPage.classList.remove('hidden')
  }

  const navItems = document.querySelectorAll('.nav-item')
  navItems.forEach(item => item.classList.remove('active'))

  const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`)
  if (activeNav) {
    activeNav.classList.add('active')
  }

  const breadcrumbActive = document.querySelector('.breadcrumb-item.active')
  const pageTitles = {
    dashboard: '仪表板',
    users: '用户管理',
    roles: '角色管理',
    menus: '菜单管理',
    resources: '资源管理',
  }
  if (breadcrumbActive && pageTitles[pageId]) {
    breadcrumbActive.textContent = pageTitles[pageId]
  }

  closeMobileSidebar()
}

function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove('hidden')
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add('hidden')
  }
}

function toggleMobileSidebar() {
  const sidebar = document.querySelector('.sidebar')
  const overlay = document.querySelector('.sidebar-overlay')
  if (sidebar) {
    sidebar.classList.toggle('mobile-open')
  }
  if (overlay) {
    overlay.classList.toggle('visible')
  }
}

function closeMobileSidebar() {
  const sidebar = document.querySelector('.sidebar')
  const overlay = document.querySelector('.sidebar-overlay')
  if (sidebar) {
    sidebar.classList.remove('mobile-open')
  }
  if (overlay) {
    overlay.classList.remove('visible')
  }
}

function setMobileNavActive(index) {
  const items = document.querySelectorAll('.mobile-nav-item')
  items.forEach((item, i) => {
    item.classList.toggle('active', i === index)
  })
}

function toggleTheme() {
  const html = document.documentElement
  const currentTheme = html.getAttribute('data-theme')
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

  html.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)

  updateThemeToggleButton(newTheme)
}

function updateThemeToggleButton(theme) {
  const themeBtns = document.querySelectorAll('.theme-toggle-btn')
  themeBtns.forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙'
    btn.title = theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'
  })
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = savedTheme || (prefersDark ? 'dark' : 'light')

  document.documentElement.setAttribute('data-theme', theme)
  updateThemeToggleButton(theme)
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme()

  const modalOverlays = document.querySelectorAll('.modal-overlay')
  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.add('hidden')
      }
    })
  })

  const sidebarOverlay = document.querySelector('.sidebar-overlay')
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      closeMobileSidebar()
    })
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', newTheme)
        updateThemeToggleButton(newTheme)
      }
    })
  }
})
