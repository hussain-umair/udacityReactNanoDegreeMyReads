import React from 'react'
// import * as BooksAPI from './BooksAPI'
import {Route} from 'react-router-dom'
import BookMain from './BookMain'
import Search from './Search'
import './App.css'

const App =()=> {
  

  return (
      <div className="app">
        <Route exact path="/" component={BookMain}/>  
        <Route path="/search" component={Search}/>
      </div>
      
    )
  }


export default App
