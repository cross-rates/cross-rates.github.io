import React from 'react';
import './App.css';
import rates from "cross-rates-browser";
import SelectSearch from "react-select-search";

class App extends React.Component {
    state = {};

    componentDidMount() {
        rates.triggerOnChange(_ => this.setState({isReady: rates.isReady()}));
        rates.refreshRates();
    }

    render() {
        if (!this.state.isReady) {
            return null
        }
        const currencies = rates.getAvailableCurrencies();
        const options = currencies.map(c => ({
            name: c.code + ((c.code === c.name) ? "" : ` - ${c.name}`),
            value: c.code,
        }));
        return (
            <div className="App">
                <header className="App-header">
                    <a className="App-link" href="/">cross-rates</a>
                </header>
                <div className={"content-body"}>
                    <p>Transform:</p>
                    <div className="options">
                        <div className="left-side">
                            <SelectSearch
                                options={options}
                                search
                                autocomplete="on"
                                name="currencies1"
                                placeholder="Select currency"
                                onChange={selectedCurrency => this.setState({
                                    currency1: selectedCurrency
                                })}
                            />
                            <input
                                className={"value-input"}
                                onChange={e => this.setState({
                                    sourceAmountValue: e.target.valueAsNumber
                                })}
                                type="number"
                                name="currency1"/>
                        </div>
                        <span className={"equals-sign"}>=</span>
                        <div className="right-side">
                            <SelectSearch
                                options={options}
                                search
                                autocomplete="on"
                                name="currencies2"
                                placeholder="Select currency"
                                onChange={selectedCurrency => this.setState({
                                    currency2: selectedCurrency
                                })}
                            />
                            <input
                                className={"value-input"}
                                ref={resultInput => {
                                    if (!resultInput) {
                                        return
                                    }
                                    if (!this.state.currency1
                                        || !this.state.currency2
                                        || !this.state.sourceAmountValue
                                        || isNaN(this.state.sourceAmountValue)
                                    ) {
                                        resultInput.value = "";
                                        return
                                    }
                                    const result = rates.transform(
                                        this.state.sourceAmountValue, this.state.currency1, this.state.currency2
                                    );
                                    const fractionDigits = (
                                        rates.getCurrencyInfo(this.state.currency2) || {afterDecimalPoint: 2}
                                    ).afterDecimalPoint;
                                    resultInput.value = Number(result).toFixed(fractionDigits);
                                }}
                                type="text"
                                name="currency2"
                                readOnly={true}/>
                        </div>
                    </div>
                    {
                        (this.state.currency1 && this.state.currency2)
                        && (<div className={"rate-row"}>
                            1 : {
                            Number(rates.transform(1.0, this.state.currency1, this.state.currency2))
                                .toFixed((
                                    rates.getCurrencyInfo(this.state.currency2) || {afterDecimalPoint: 2}
                                ).afterDecimalPoint)
                        }
                        </div>)
                    }
                </div>
            </div>
        );
    }
}

export default App;
