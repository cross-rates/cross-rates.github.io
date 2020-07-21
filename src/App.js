import React from 'react';
import './App.css';
import rates from "cross-rates-browser";

rates.refreshRates();

function App() {
    if (!rates.isReady()) {
        return
    }
    const fiatCurrencies = rates.getFiatCurrencies();
    const cryptoCurrencies = rates.getCryptoCurrencies();
    const map = [].concat(fiatCurrencies).concat(cryptoCurrencies).reduce((previousValue, currentValue) => {
        previousValue[currentValue.code] || (previousValue[currentValue.code] = currentValue)
        return previousValue
    }, {});
    const currencies = Object.values(map);
    let currency1, currency2, sourceInput, resultInput;

    function tryUpdate() {
        if (!currency1 || !currency2 || isNaN(sourceInput.valueAsNumber)) {
            return
        }

        resultInput.value = rates.transform(sourceInput.valueAsNumber, currency1, currency2);
        console.log(resultInput.value)
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
                        <select onChange={e => {
                            currency1 = e.target.value;
                            tryUpdate();
                        }}
                                name="currencies1">
                            <option disabled selected value> - currency -</option>
                            {
                                currencies.map(c => <option key={c.code} title={c.name} name={c.name}>{c.code}</option>)
                            }
                        </select>
                        <input
                            onChange={tryUpdate}
                            ref={input => input && (sourceInput = input)} type="number" name="currency1"/>
                    </div>
                    =
                    <div className="right-side">
                        <select onChange={e => {
                            currency2 = e.target.value;
                            tryUpdate();
                        }}
                                name="currencies2">
                            <option disabled selected value> - currency -</option>
                            {
                                currencies.map(c => <option key={c.code} title={c.name} name={c.name}>{c.code}</option>)
                            }
                        </select>
                        <input ref={r => r && (resultInput = r)} type="number" name="currency2" readOnly={true}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
