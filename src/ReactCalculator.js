import React, { Component } from 'react';
import {
    View,
    Text,
    AppRegistry,
    BackHandler
} from 'react-native';

import InputButton from './InputButton';
import Style from './Style';

// Define the input buttons that will be displayed in the calculator.
const inputButtons = [
    ['exit', 'del', 'clear', '/'],
    [1, 2, 3, '*'],
    [4, 5, 6, '-']
];

const inputBottomsButtons = [
    [7, 8, 9],
    ['.', 0, '+']
];
var isDecimal = false;
var desSeq = 0;

export default class ReactCalculator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            previousInputValue: 0,
            inputValue: 0,
            selectedSymbol: null
        }
    }
    render() {
        return (
            <View style={Style.rootContainer}>
                <View style={Style.displayContainer}>
                    <Text style={Style.displayText}>{this.state.inputValue}</Text>
                </View>
                <View style={Style.inputContainer}>
                    {this._renderInputButtons()}
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <View style={{ flex: 3, flexDirection: 'row' }}>
                            <View style={{ flex: 2 }}>
                                {this._renderBottomButton()}
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputButton
                                value='='
                                highlight={this.state.selectedSymbol === '='}
                                onPress={this._onInputButtonPressed.bind(this, '=')}
                                key={'='} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    /**
     * For each row in `inputButtons`, create a row View and add create an InputButton for each input in the row.
     */
    _renderInputButtons() {
        let views = [];

        for (var r = 0; r < inputButtons.length; r++) {
            let row = inputButtons[r];

            let inputRow = [];

            for (var i = 0; i < row.length; i++) {
                let input = row[i];

                inputRow.push(
                    <InputButton
                        value={input}
                        highlight={this.state.selectedSymbol === input}
                        onPress={this._onInputButtonPressed.bind(this, input)}
                        key={r + "-" + i} />
                );
            }

            views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>)
        }
        return views;
    }

    _renderBottomButton() {
        let views = [];

        for (var r = 0; r < inputBottomsButtons.length; r++) {
            let row = inputBottomsButtons[r];

            let inputRow = [];

            for (var i = 0; i < row.length; i++) {
                let input = row[i];

                inputRow.push(
                    <InputButton
                        value={input}
                        highlight={this.state.selectedSymbol === input}
                        onPress={this._onInputButtonPressed.bind(this, input)}
                        key={r + "-" + i} />
                );
            }

            views.push(<View style={Style.inputRow} key={"row-" + r}>{inputRow}</View>)
        }
        return views;
    }

    _onInputButtonPressed(input) {
        switch (typeof input) {
            case 'number':
                return this._handleNumberInput(input)
            case 'string':
                return this._handleStringInput(input)
        }
    }

    _handleNumberInput(num) {
        if (isDecimal) {
            let inputValue = parseFloat(this.state.inputValue) + (num / Math.pow(10, desSeq));
            desSeq++;

            this.setState({
                inputValue: inputValue
            });
        } else {
            let inputValue = (this.state.inputValue * 10) + num;

            this.setState({
                inputValue: inputValue
            });
        }
    }
    _handleStringInput(str) {
        switch (str) {
            case '/':
            case '*':
            case '+':
            case '-':
                this.setState({
                    selectedSymbol: str,
                    previousInputValue: this.state.inputValue,
                    inputValue: 0
                });
                break;
            case '=':
                isDecimal = false;
                let symbol = this.state.selectedSymbol,
                    inputValue = this.state.inputValue,
                    previousInputValue = this.state.previousInputValue;

                if (!symbol) {
                    return;
                }

                this.setState({
                    previousInputValue: 0,
                    inputValue: eval(previousInputValue + symbol + inputValue),
                    selectedSymbol: null
                });
                break;
            case '.':
                if (!isDecimal) {
                    desSeq++;
                    var value = this.state.inputValue;
                    this.setState({ inputValue: value.toFixed(1) });
                    isDecimal = true;
                }
                break;
            case 'exit':
                BackHandler.exitApp();
                break;
            case 'del':
                let string = this.state.inputValue.toString();
                let deletedString = string.substr(0, string.length - 1);
                this.setState({
                    inputValue: deletedString
                });
                break;
            case 'clear':
                desSeq = 0;
                isDecimal = false;
                this.setState({
                    selectedSymbol: null,
                    previousInputValue: null,
                    inputValue: 0
                });
                break;
        }
    }
}



AppRegistry.registerComponent('ReactCalculator', () => ReactCalculator);