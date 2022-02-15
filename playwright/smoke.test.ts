jest.setTimeout(35e3)

test('go to /', async () => {
    await page.goto('http://localhost:3000')

    await page.waitForSelector(`text=invee`)
})

test('go to post', async () => {
    await page.goto('http://localhost:3000')

    await page.waitForSelector(`text=Sign Up`)

    await page.click('text=Sign Up')

    expect(page.locator(`text=Sign Up`)).toBeDefined()
})

export {}
