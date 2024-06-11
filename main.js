//1. Book class
class Book {
  //클래스로 사용할 예정이라 대문자
  constructor(title, author, isbn) {
    //생성자 함수
    this.title = title //this는 현재 만드는 book 객체. 사용자가 입력하는 녀석을 관리하겟다
    this.author = author
    this.isbn = isbn
  }
}
//2. UI class
class UI {
  //2.1 Display Books
  static displayBooks() {
    // const books = [
    //   {
    //     title: 'Book one',
    //     author: 'Author 1',
    //     isbn: '10000',
    //   },
    //   {
    //     title: 'Book two',
    //     author: '박윤지',
    //     isbn: '20000',
    //   },
    //   {
    //     title: 'HTML/ CSS/ JS',
    //     author: 'web',
    //     isbn: '30000',
    //   },
    // ]

    const books = Store.getBooks()

    books.forEach((book) => UI.addBookToList(book)) //각각의 책을 한권씩 추가하는 기능
  }

  // 2.2 Add book to UI
  static addBookToList(book) {
    const list = document.getElementById('book-list')
    const row = document.createElement('tr')
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td> <a href="#" class="btn btn-danger btn-sm delete"> X </a> </td>
    `
    list.appendChild(row)
  }

  //2.3 clear fields
  static clearFields() {
    document.querySelector('#title').value = ''
    document.querySelector('#author').value = ''
    document.querySelector('#isbn').value = ''
  }

  //2.4 알림메시지 표시
  static showAlert(message, className) {
    const div = document.createElement('div')
    div.className = `alert alert-${className}`
    div.appendChild(document.createTextNode(message))
    const container = document.querySelector('.container')
    const form = document.querySelector('#book-form')
    container.insertBefore(div, form)

    setTimeout(() => document.querySelector('.alert').remove(), 2000)
  }

  //2.5 Delete boot from UI
  static deleteBook(target) {
    console.log(target)
    target.parentElement.parentElement.remove()

    UI.showAlert('책을 삭제했습니다.', 'info')
  }
}

//3. store class: local storage 활용 가능
class Store {
  //3.1 localstorage에서 책 정보를 읽어오는 기능
  static getBooks() {
    let books
    if (localStorage.getItem('books') === null) {
      books = []
    } else {
      books = JSON.parse(localStorage.getItem('books'))
    }
    return books
  }

  //3.2 localstorage에서 새로운 책을 저장하는 기능
  static addBook(book) {
    const books = Store.getBooks()
    books.push(book)
    localStorage.setItem('books', JSON.stringify(books))
  }

  //3.3 loclastorage에서 책을 한권 지우는 기능
  static removeBook(isbn) {
    const books = Store.getBooks()

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1)
      }
    })

    localStorage.setItem('books', JSON.stringify(books))
  }
}

//4. 사용자 이벤트 처리

//4.1 페이지 초기 로딩시 책 정보 표시
document.addEventListener('DOMContentLoaded', UI.displayBooks)
//페이지가 처음 랜더링 되어서 표시할때 뭘 표시하냐?(=DOMContentLoaded) UI.displayBooks를 표시해라 라고 하는것.

//4.2 책 추가 이벤트
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault()
  //console.log(e.target)
  const title = document.querySelector('#title').value
  const author = document.querySelector('#author').value
  const isbn = document.querySelector('#isbn').value

  //입력값 검증
  if (title === '' || author === '' || isbn === '') {
    // alert("모든 필드를 입력해 주세요...");
    UI.showAlert('모든 필드를 입력해 주세요', 'danger')
  } else {
    const book = new Book(title, author, isbn)

    //화면 테이블에 추가하기
    UI.addBookToList(book)

    UI.showAlert('책이 저장되었습니다.', 'success')

    UI.clearFields()
  }
})

//4.3 책 삭제 이벤트
document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target)

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})
