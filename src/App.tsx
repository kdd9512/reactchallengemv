import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/TV";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
    return (
        <React.Fragment>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/movies/:movieId" element={<Home/>}/>
                    <Route path="/tv" element={<Tv/>}/>
                    <Route path="/tv/:tvId" element={<Tv/>}/>
                    <Route path="/search" element={<Search />}/>
                </Routes>
            </BrowserRouter>
        </React.Fragment>
    );
}

export default App;
