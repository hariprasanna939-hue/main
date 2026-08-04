const { Country, State, City } = require('country-state-city');
const c = Country.getAllCountries().find(c => c.isoCode === 'IN');
console.log('Country:', c);
const s = State.getStatesOfCountry('IN').find(s => s.name === 'Delhi');
console.log('State:', s);
const city = City.getCitiesOfState('IN', s.isoCode)[0];
console.log('City:', city);
