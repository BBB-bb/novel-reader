const { createApp, ref, computed, onMounted, watch } = Vue

createApp({
  setup() {
    const page = ref('home')
    const searchQuery = ref('')
    const searchResults = ref([])
    const activeCategory = ref('全部')
    const currentBook = ref(null)
    const currentChapter = ref(0)
    const fontSize = ref(18)
    const darkMode = ref(false)
    const showControls = ref(true)
    const bookshelf = ref([])

    const categories = ['玄幻', '文学', '悬疑', '推理', '恐怖', '历史', '科技']

    const allBooks = ref(typeof BOOKS !== 'undefined' ? BOOKS : [])

    // 从 localStorage 加载书架
    onMounted(() => {
      const saved = localStorage.getItem('novel-bookshelf')
      if (saved) {
        try { bookshelf.value = JSON.parse(saved) } catch(e) {}
      }
      const savedFont = localStorage.getItem('novel-fontsize')
      if (savedFont) fontSize.value = parseInt(savedFont)
    })

    // 保存书架
    watch(bookshelf, (val) => {
      localStorage.setItem('novel-bookshelf', JSON.stringify(val))
    }, { deep: true })

    watch(fontSize, (val) => {
      localStorage.setItem('novel-fontsize', val.toString())
    })

    const getBooksByCategory = (cat) => {
      return allBooks.value.filter(b => b.category === cat)
    }

    const searchBooks = () => {
      if (!searchQuery.value.trim()) {
        searchResults.value = []
        return
      }
      const q = searchQuery.value.toLowerCase()
      searchResults.value = allBooks.value.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      )
    }

    const openBook = (book) => {
      currentBook.value = book
      page.value = 'detail'
      window.scrollTo(0, 0)
    }

    const startReading = (chapterIndex) => {
      currentChapter.value = chapterIndex
      showControls.value = false
      page.value = 'reader'
      window.scrollTo(0, 0)
    }

    const prevChapter = () => {
      if (currentChapter.value > 0) {
        currentChapter.value--
        window.scrollTo(0, 0)
      }
    }

    const nextChapter = () => {
      if (currentChapter.value < currentBook.value.chapters.length - 1) {
        currentChapter.value++
        window.scrollTo(0, 0)
      }
    }

    const changeFontSize = (delta) => {
      fontSize.value = Math.max(14, Math.min(28, fontSize.value + delta))
    }

    const formatText = (text) => {
      if (!text) return ''
      return text.split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('')
    }

    const toggleBookshelf = (book) => {
      const idx = bookshelf.value.indexOf(book.id)
      if (idx >= 0) {
        bookshelf.value.splice(idx, 1)
      } else {
        bookshelf.value.push(book.id)
      }
    }

    const isInBookshelf = (book) => {
      return bookshelf.value.includes(book.id)
    }

    const bookshelfBooks = computed(() => {
      return bookshelf.value.map(id => allBooks.value.find(b => b.id === id)).filter(Boolean)
    })

    return {
      page, searchQuery, searchResults, activeCategory,
      currentBook, currentChapter, fontSize, darkMode, showControls,
      bookshelf, categories, allBooks, bookshelfBooks,
      getBooksByCategory, searchBooks, openBook, startReading,
      prevChapter, nextChapter, changeFontSize, formatText,
      toggleBookshelf, isInBookshelf
    }
  }
}).mount('#app')
