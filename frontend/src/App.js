import ReactDOM from 'react-dom/client';
import React, {useState, useEffect, useInsertionEffect} from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Example from './components/example';
import Create_Group from './components/Create_Group';
import Search from './components/search';
import Login from './components/login';
import Register from './components/register';
import Chat from './components/Chat';
import Chat2 from './components/Chat2';
import Account_information from './components/Account_information';
import JoinGroup from './components/joinGroup'
import Homepage from './components/homepage/homepage';
import ViewGroup from './components/viewGroup';
import FAQ from './components/faq/faq';
import Edit_info from './components/Edit_info';
import Account_info_authentification from './components/account_info_authentification';
import Contact_us from './components/contact_us';
import About_Us from './components/about_us/about_us';

function App() {
  const [selectedMode, setSelectedMode] = useState('open')
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/home' element={<Home />} />
        <Route path='/example' element={<Example />} />
        <Route path='/Create_Group' element={<Create_Group />} />
        <Route path='/search' element={<Search />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Chat' element={<Chat />} />
        <Route path='/Chat2' element={<Chat2 />} />
        <Route path='/account_information' element={<Account_information />} />
        <Route path='/join_group' element={<JoinGroup />} />
        <Route path='/view_group/:groupID' element={<ViewGroup />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/edit_info' element={<Edit_info />} />
        <Route path='account_info_authentification' element={<Account_info_authentification />} />
        <Route path='/contact_us' element={<Contact_us />} />
        <Route path='/about' element={<About_Us />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
