"use client"
import React from 'react'
import NextError from 'next/error'

const errorPage = ({error}:{error:Error}) => {
    return (<>
        <NextError statusCode={500} title={error.message} />
  </>
  )
}

export default errorPage