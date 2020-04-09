import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import * as BooksAPI from './BooksAPI'

class Search extends Component{
    constructor(props){
        super(props)
        this.state={
            books:[],
            bookIds:[],
            bookShelfs:[],
            searchResult:[],
            search:''
        }
    }
    async componentDidMount(){
        const books = await BooksAPI.getAll()
        const bookIds = books.map(book=>book.id)
        const bookShelfs=books.map(book=>book.shelf)
        this.setState({books,bookIds,bookShelfs})
    }
    filterSearch=(res)=>{
        const {bookIds,books} = this.state
        const updatedresult = res.filter(book=>!bookIds.includes(book.id))
        res.forEach(element=>{
            if(bookIds.includes(element.id)){
                const book = books.filter(item=>item.id==element.id)
                const bookobj = book[0]
                updatedresult.unshift(bookobj)
            }
        })
        this.setState({searchResult:updatedresult})
    }
    handleChange= (event)=>{
        event.target.value===''&&this.setState({searchResult:[]})
        BooksAPI.search(event.target.value)
        .then(res=>
            typeof res=='undefined'?
            console.log('response:',res)
            :this.filterSearch(res)
        ).catch(err=>{
            console.log('error')
            this.setState({searchResult:[]})
        })
        this.setState({search:event.target.value})
    }
    handleChangeShelf=(event,book)=>{
        const {searchResult} = this.state
        BooksAPI.update(book,event.target.value)
        searchResult.forEach((element,index)=>{
            if(element.id==book.id){
                const updateObj = Object.assign({},element,{shelf:event.target.value})
                searchResult[index]=updateObj
                this.setState({searchResult:searchResult})
            }
        })
        
    }
    
    render(){
        const {books,searchResult,search} = this.state
    return(
        <>
        <div className="search-books">
            <div className="search-books-bar">
                <div className="close-search"><Link className="close-search" to="/">Close</Link></div>
                <div className="search-books-input-wrapper">
                    <input type="text" name="search" value={search} onChange={this.handleChange} placeholder="Search by title or author"/>
                </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                  {searchResult.length>0?searchResult.map((book,index)=>
                  <li key={index}>
                        <div className="book">
                            <div className="book-top">
                                <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${typeof book.imageLinks !== 'undefined'&&book.imageLinks.thumbnail})` }}></div>
                                <div className="book-shelf-changer">
                                    <select value={book.shelf?book.shelf:'none'} name={book.title} onChange={(event)=>this.handleChangeShelf(event,book)}>
                                        <option value="move" disabled>Move to...</option>
                                        <option value="currentlyReading">Currently Reading</option>
                                        <option value="wantToRead">Want to Read</option>
                                        <option value="read">Read</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            <div className="book-authors">{book.authors&&book.authors.map(author=>author)}</div>
                        </div>
                    </li>
                  )
                    :null}
              </ol>
            </div>
          </div>
        </>
    )
}
}
export default Search