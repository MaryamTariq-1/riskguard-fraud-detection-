const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

// Ensure data directory exists
const dir = path.join(__dirname, 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const csvHeaders = 'user_id,full_name,email,phone,country,total_orders,total_returns,return_rate_%,claim_type,risk_score,status,last_incident_date,reason_details\n';
const records = [];
const europeanCountries = ['Germany', 'France', 'United Kingdom', 'Italy', 'Spain', 'Netherlands', 'Sweden'];
const callingCodes = {
    Germany: '+49',
    France: '+33',
    'United Kingdom': '+44',
    Italy: '+39',
    Spain: '+34',
    Netherlands: '+31',
    Sweden: '+46'
};

for (let i = 1; i <= 50; i++) {
    // 1. European Identity generate karna
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = faker.internet.email({ firstName, lastName, provider: 'example.eu' }).toLowerCase();
    const country = faker.helpers.arrayElement(europeanCountries);
    const phone = `${callingCodes[country]}${faker.string.numeric(10)}`;
    const userId = `USR-${1000 + i}`;

    // 2. Order History generate karna
    const totalOrders = faker.number.int({ min: 5, max: 40 });
    const totalReturns = faker.number.int({ min: 0, max: totalOrders });
    
    // 3. Return Rate calculate karna
    const returnRate = parseFloat(((totalReturns / totalOrders) * 100).toFixed(2));

    // Default values (Safe user)
    let claimType = 'None';
    let riskScore = faker.number.int({ min: 0, max: 30 });
    let status = 'Safe';
    let reasonDetails = 'Normal shopping behavior. No suspicious activity.';
    let lastIncidentDate = 'N/A';

    // 4. Client ki di hui EXACT Logic apply karna
    // Rule 1: Return Rate > 70% = return_abuser
    if (returnRate > 70) {
        claimType = 'return_abuser';
        riskScore = faker.number.int({ min: 75, max: 95 });
        status = riskScore > 85 ? 'Banned' : 'Blocked';
        reasonDetails = `High return rate of ${returnRate}% exceeding 70% threshold.`;
        lastIncidentDate = faker.date.recent({ days: 30 }).toISOString().split('T')[0];
    } 
    // Rule 2: 3+ claims of "damaged/empty box" in 30 days = scammer
    else if (totalReturns >= 3 && returnRate > 40) {
        claimType = 'scammer';
        riskScore = faker.number.int({ min: 60, max: 88 });
        status = riskScore > 80 ? 'Blocked' : 'Review';
        reasonDetails = `Multiple (3+) claims of damaged/empty box reported in last 30 days.`;
        lastIncidentDate = faker.date.recent({ days: 15 }).toISOString().split('T')[0];
    }
    // Rule 3: 80% orders have "not as described" claim = claim_abuser
    else if (returnRate > 50 && totalReturns >= 2) {
        claimType = 'claim_abuser';
        riskScore = faker.number.int({ min: 45, max: 75 });
        status = riskScore > 65 ? 'Review' : 'Warning';
        reasonDetails = `Frequent claims (80%+) tagged as "item not as described".`;
        lastIncidentDate = faker.date.recent({ days: 45 }).toISOString().split('T')[0];
    }

    // 5. Data ko CSV row format mein likhna
    const row = `"${userId}","${fullName}","${email}","${phone}","${country}",${totalOrders},${totalReturns},${returnRate},"${claimType}",${riskScore},"${status}","${lastIncidentDate}","${reasonDetails}"\n`;
    records.push(row);
}

// 6. CSV file save karna
fs.writeFileSync(path.join(dir, 'return_abusers_risk_list.csv'), csvHeaders + records.join(''), 'utf8');
console.log('✅ SUCCESS: European dummy records generated in data/return_abusers_risk_list.csv!');