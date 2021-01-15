import React from 'react'

export default function conversionResult(props) {
  const result = props.result && props.targetCurrency
    ? `${props.result} ${props.targetCurrency}`
    : ''

  return (
    <h3>conversion result: { result }</h3>
  )
}