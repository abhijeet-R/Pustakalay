import React, { Fragment, useState } from 'react'
import { useHistory } from "react-router-dom";
import "./Search.css"
import MetaData from '../layout/MetaData';

const Search = () => {
    const history=useHistory()
const [keyword,setKeyword]=useState("")
const searchSubmitHandler=(e)=>{
    e.preventDefault()
    if(keyword.trim()){
        history.push(`/products/${keyword}`)
    }else{
        history.push(`/products`)
    }
}
  return (
    <Fragment>
    <MetaData title="Search -- Pustakalay" />
    <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input type="text" placeholder='search a product' onChange={(e)=>setKeyword(e.target.value)}/>
        <input type="submit" value="search"/>
    </form>
    </Fragment>
  )
}

export default Search