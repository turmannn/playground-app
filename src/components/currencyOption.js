import React from 'react'

export default function(props) {
  return (
    <div>
      <label htmlFor={props.label.split(' ').join('-')}>{props.label}:</label>
      <select onChange={props.onChange} value={props.value}>
        { props.options.map(opt => <option>{opt}</option>) }
      </select>
    </div>
  )
}