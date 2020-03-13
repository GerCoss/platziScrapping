const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    let reviews = []
    async function getPageData(pageNumber = 1) {
        await page.goto(`https://animeflv.net/browse?order=title&page=${pageNumber}`)
        if(pageNumber==1){
            await page.waitFor(10000);
        }
        // await page.screenshot({
        //     path: 'screenshot.png',
        //     fullPage: true,
        // })
        const data = await page.evaluate(() => {
            const $reviews = document.querySelectorAll('li>article')
            const $pagination = document.querySelectorAll('li>a[href*=page]')
            const totalPages = Number($pagination[$pagination.length - 2].textContent.trim())
            const data = []
            $reviews.forEach(($review) => {
                data.push({
                    content: $review.querySelector('h3').textContent,
                    // rating: $review.querySelector('.Review-stars .fulled').length,
                    // content: $review.querySelector('.Review-description').textContent.trim()
                })
            })
            return {
                reviews: data,
                totalPages,
            }
        })
        reviews = [...reviews, ...data.reviews]
        console.log(`page ${pageNumber} of ${data.totalPages} completed`);
    if(pageNumber <= data.totalPages){
            getPageData(pageNumber + 1)
        }else{
            fs.writeFile('data.js', `export default ${JSON.stringify(reviews)}`,()=>{
                console.log('data writed');
            })
            await browser.close()
        }
    }
    getPageData()
}

run()