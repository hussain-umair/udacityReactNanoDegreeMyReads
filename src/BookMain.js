import React,{Component} from 'react'
import * as BooksApi from './BooksAPI'
import BookShelf from './BookShelf'
import {Link} from 'react-router-dom'
class BookMain extends Component{
    constructor(props){
        super(props)
        this.state={
            books:[],
            currentlyReading:[],
            wantToRead:[],
            read:[]
        }
    }
    async componentDidMount(){
        const books = await BooksApi.getAll()
        const currentlyReading = books.filter(book=>book.shelf=="currentlyReading")
        const wantToRead = books.filter(book=>book.shelf=="wantToRead")
        const read=books.filter(book=>book.shelf=="read")
        this.setState(()=>({
            ...this.state,
            books,
            currentlyReading,
            wantToRead,
            read
        }))    
    }
    handleChangeCurrentlyReading=(event,book)=>{
        const updatedCurrentlyReading = this.state.currentlyReading.filter(item=>item.title!==book.title)
        book = Object.assign({},book,{shelf:event.target.value})
        if(event.target.value=='wantToRead'){
            this.setState({
                ...this.state,
                wantToRead:[...this.state.wantToRead,book],
                currentlyReading:updatedCurrentlyReading
            })
        }
        if(event.target.value=='read'){
            this.setState({
                ...this.state,
                read:[...this.state.read,book],
                currentlyReading:updatedCurrentlyReading
            })
        }
        if(event.target.value=='none'){
            this.setState({
                ...this.state,
                currentlyReading:updatedCurrentlyReading
            })
        }
        BooksApi.update(book,event.target.value)
    }
    handleChangeWantToRead=(event,book)=>{
        const updatedWantToRead = this.state.wantToRead.filter(item=>item.title!==book.title)
        book = Object.assign({},book,{shelf:event.target.value})
        if(event.target.value=='currentlyReading'){
            this.setState({
                ...this.state,
                currentlyReading:[...this.state.currentlyReading,book],
                wantToRead:updatedWantToRead
            })
        }
        if(event.target.value=='read'){
            this.setState({
                ...this.state,
                read:[...this.state.read,book],
                wantToRead:updatedWantToRead
            })
        }
        if(event.target.value=='none'){
            this.setState({
                ...this.state,
                wantToRead:updatedWantToRead
            })
        }
        BooksApi.update(book,event.target.value)
    }
    handleChangeRead=(event,book)=>{
        const updatedRead = this.state.read.filter(item=>item.title!==book.title)
        book = Object.assign({},book,{shelf:event.target.value})
        
        if(event.target.value=='currentlyReading'){
            this.setState({
                ...this.state,
                currentlyReading:[...this.state.currentlyReading,book],
                read:updatedRead
            }
        )}
        if(event.target.value=='wantToRead'){
            this.setState({
                ...this.state,
                read:updatedRead,
                wantToRead:[...this.state.wantToRead,book]
            })
        }
        if(event.target.value=='none'){
            this.setState({
                ...this.state,
                read:updatedRead
            })
        }
        BooksApi.update(book,event.target.value)
    }
render(){
    const {books,currentlyReading,wantToRead,read} =this.state
    console.log(books)
    return(
    
        <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
            <div>
            <BookShelf books={currentlyReading} heading={'CurrentlyReading'} handleChange={this.handleChangeCurrentlyReading}/>
            <BookShelf books={wantToRead} heading={'Want to Read'} handleChange={this.handleChangeWantToRead}/>
            <BookShelf books={read} heading={'Read'} handleChange={this.handleChangeRead}/>
            </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
        </div>
    
)
}

}
export default BookMain