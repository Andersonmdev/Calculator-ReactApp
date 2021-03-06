import React, { Component } from 'react';
import './Calculator.css'

import Button from '../button/Button';
import Display from '../display/Display';

const initialState = {
  displayValue: '0',
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  current: 0
}

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.clearMemory = this.clearMemory.bind(this);
    this.setOperation = this.setOperation.bind(this);
    this.deleteDigit = this.deleteDigit.bind(this);
  }

  state = { ...initialState };

  clearMemory() {
    this.setState({ ...initialState });
  }

  setOperation(operation) {
    if (this.state.current === 0) {
      this.setState({ operation, current: 1, clearDisplay: true} );
    } else {
      const equal = operation === '=';
      const currentOperation = this.state.operation;
      const values = [...this.state.values];
      let divisionByZero = false;

      switch (currentOperation) {
        case '+':
          values[0] = values[0] + values[1];
          break;
        case '-':
          values[0] = values[0] - values[1];
          break;
        case '/':
          /**
           * Division by ZERO
           */
          if (values[1] === 0) {
            values[0] = 0;
            divisionByZero = true;
          } else {
            values[0] = values[0] / values[1];
          }
          break;
        case '*':
          values[0] = values[0] * values[1];
          break;
        default:
          break;
      }
      values[1] = 0;
      const testResponse = values[0].toString();
      const response = (testResponse.length > 10) ? parseFloat(testResponse.substring(0, 10)) : values[0]; 
      this.setState({ 
        displayValue: divisionByZero ? 'Error' : response, 
        operation: equal ? null : operation, 
        current: equal ? 0 : 1,
        clearDisplay: !equal,
        values 
      });
    }
  }

  addDigit(digit) {
    if (digit === '.' && this.state.displayValue.includes('.')) {
      return
    }

    const clearDisplay = this.state.displayValue === '0' || this.state.displayValue === 'Error' || this.state.clearDisplay;
    const currentValue = clearDisplay ? '' : this.state.displayValue;
    let displayValue = currentValue;
    /**
     * Display shows a maximum of 10 digits
     */
    if (displayValue.length <= 9) {
      displayValue = currentValue + digit;
    }
    this.setState({ displayValue, clearDisplay: false });

    if (digit !== '.') {
      const newValue = parseFloat(displayValue);
      const values = [...this.state.values];
      values[this.state.current] = newValue;
      this.setState({ values });
      /**
       * Show the current values ​​uncomment the line below
       */
      // console.log(values);
    }
  }

  deleteDigit() {
    const currentValue = this.state.displayValue;
    const displayValue = currentValue !== '0' && currentValue.length > 1 ? currentValue.substring(0, currentValue.length-1) : '0';
    const newValue = parseFloat(displayValue);
    const values = [...this.state.values];
    values[this.state.current] = newValue;
    this.setState({ displayValue, values });
  }
  
  render() {
    /**
     * Bind or Arrow function to solve THIS reference
     */
    const addDigit = n => this.addDigit(n);
    return (
      <div className="calculator">
        <Display value={this.state.displayValue} />
        <Button label="AC" click={this.clearMemory} double/>
        <Button label="<" click={this.deleteDigit} delete />
        <Button label="/" click={this.setOperation} operation/>
        <Button label="7" click={addDigit}/>
        <Button label="8" click={addDigit}/>
        <Button label="9" click={addDigit}/>
        <Button label="*" click={this.setOperation} operation/>
        <Button label="4" click={addDigit}/>
        <Button label="5" click={addDigit}/>
        <Button label="6" click={addDigit}/>
        <Button label="+" click={this.setOperation} operation/>
        <Button label="1" click={addDigit}/>
        <Button label="2" click={addDigit}/>
        <Button label="3" click={addDigit}/>
        <Button label="-" click={this.setOperation} operation/>
        <Button label="0" click={addDigit} double/>
        <Button label="." click={addDigit}/>
        <Button label="=" click={this.setOperation} operation/>
      </div>
    )
  }
}