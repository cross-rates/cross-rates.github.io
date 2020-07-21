import React from 'react';
import './App.css';
import rates from "cross-rates-browser";

function compareStrings(a, b) {
    return (a < b) ? -1 : (a > b ? 1 : 0)
}

class App extends React.Component {
    componentDidMount() {
        rates.triggerOnChange(r => this.setState({r: r}));
        rates.refreshRates();
    }

    render() {
        if (!rates.isReady()) {
            return null
        }
        const fiatCurrencies = rates.getFiatCurrencies();
        const cryptoCurrencies = rates.getCryptoCurrencies();
        const map = [].concat(fiatCurrencies).concat(cryptoCurrencies).reduce((previousValue, currentValue) => {
            previousValue[currentValue.code] || (previousValue[currentValue.code] = currentValue)
            return previousValue
        }, {});
        const currencies = Object.values(map).sort((a, b) => compareStrings(a.code, b.code));
        let resultInput, sourceInput;

        const tryUpdate = () => {
            if (!this.state.currency1 || !this.state.currency2 || isNaN(sourceInput.valueAsNumber)) {
                resultInput.value = "";
                return
            }
            resultInput.value = rates.transform(sourceInput.valueAsNumber, this.state.currency1, this.state.currency2);
        }
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
                                onChange={e => {
                                    this.setState({
                                        currency1: e.target.value
                                    }, tryUpdate);
                                }}
                                name="currencies1">
                                <option disabled selected value> - currency -</option>
                                {
                                    currencies.map(c => <option key={c.code} title={c.name}
                                                                name={c.name}>{c.code}</option>)
                                }
                            </select>
                            <input
                                onChange={tryUpdate}
                                ref={input => input && (sourceInput = input)} type="number" name="currency1"/>
                        </div>
                        =
                        <div className="right-side">
                            <select
                                onChange={e => {
                                    this.setState({
                                        currency2: e.target.value
                                    }, tryUpdate);
                                }}
                                name="currencies2">
                                <option disabled selected value> - currency -</option>
                                {
                                    currencies.map(c => <option key={c.code} title={c.name}
                                                                name={c.name}>{c.code}</option>)
                                }
                            </select>
                            <input ref={r => r && (resultInput = r)} type="number" name="currency2" readOnly={true}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
