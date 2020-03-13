const puppeteer = require('puppeteer')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const reviews = []
    async function getPageData() {
        await page.goto('https://platzi.com/cursos/html5-css3/opiniones/1/')
        // await page.screenshot({
        //     path: 'screenshot.png',
        //     fullPage: true,
        // })
        const data = await page.evaluate(() => {
            const $reviews = document.querySelectorAll('.Review')
            const data = []
            $reviews.forEach(($review) => {
                data.push({
                    content: $review.querySelector('.Review-description').textContent.trim()
                })
            })
            return {
                reviews: data,
            }
        })
        console.log(data)
    }
    getPageData()
    // await browser.close()
}

run()