import React from 'react';
import './App.css';
import rates from "cross-rates-browser";

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
        return (
            <div className="App">
                <header className="App-header">
                    <a className="App-link" href="/">cross-rates</a>
                </header>
                <div className={"content-body"}>
                    <p>Transform:</p>
                    <div className="options">
                        <div className="left-side">
                            <select
                                onChange={e => this.setState({
                                    currency1: e.target.value
                                })}
                                name="currencies1">
                                <option disabled selected value> - currency -</option>
                                {
                                    currencies.map(c => <option key={c.code} title={c.name}
                                                                name={c.name}>{c.code}</option>)
                                }
                            </select>
                            <input
                                onChange={e => this.setState({
                                    sourceAmountValue: e.target.valueAsNumber
                                })}
                                ref={input => input && input.focus()} type="number" name="currency1"/>
                        </div>
                        =
                        <div className="right-side">
                            <select
                                onChange={e => this.setState({
                                    currency2: e.target.value
                                })}
                                name="currencies2">
                                <option disabled selected value> - currency -</option>
                                {
                                    currencies.map(c => <option key={c.code} title={c.name}
                                                                name={c.name}>{c.code}</option>)
                                }
                            </select>
                            <input
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
                                    resultInput.value = rates.transform(
                                        this.state.sourceAmountValue, this.state.currency1, this.state.currency2
                                    );
                                }}
                                type="number"
                                name="currency2"
                                readOnly={true}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
