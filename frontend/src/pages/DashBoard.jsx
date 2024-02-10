import React from 'react'
import {AppBar} from '../components/AppBar'
import {Balance} from '../components/Balance'


function DashBoard() {
  return (
    <div>
      <AppBar />
        <div className="m-8">
            <Balance value={"10,000"} />
        </div>
    </div>
  )
}

export default DashBoard


