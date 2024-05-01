'use client'

import React, { useState } from 'react'

import Header from "./components/UI_Interface/Header/Header"
import Home from "./components/UI_Interface/Home/Home"
import IPFS from "./components/ipfs"
import HandleRegister from './components/handleRegistry'


const UI = () => {

  return (
    <>
        <Header />
        <Home />
        {/* <HandleRegister /> */}
        
        {/* <IPFS /> */}
    </>
  )
}

export default UI