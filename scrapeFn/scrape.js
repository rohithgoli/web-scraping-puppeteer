const puppeteer = require('puppeteer');
const data = {
    list: []
};

async function main(skill) {
    // launches chromium
    const browser = await puppeteer.launch({headless: false});
    // open new tab
    const page = await browser.newPage();

    // https://in.indeed.com/jobs?q={skill}&l=Hyderabad%2C+Telangana
    // https://in.indeed.com/jobs?q=sde&l=Hyderabad%2C+Telangana
    await page.goto(`https://in.indeed.com/jobs?q=${skill}&l=Hyderabad%2C+Telangana`, {
        timeout: 0,
        waitUntil: 'networkidle0'
    });

    const jobData = await page.evaluate(async (data) => {
        const items = document.querySelectorAll('td.resultContent');
        items.forEach((item, index) => {
            const title = item.querySelector('h2.jobTitle>a')?.innerText;
            const link = item.querySelector('h2.jobTitle>a')?.href;
            let salary = item.querySelector('div.metadata.salary-snippet-container > div')?.innerText;
            const companyName = item.querySelector('span.companyName')?.innerText;

            if (salary === null) {
                salary = "not defined"
            }

            data.list.push({
                title, 
                salary, 
                companyName, 
                link
            })
        })
    });
    return data
    browser.close();
}

module.exports = main;