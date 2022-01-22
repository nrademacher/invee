jest.setTimeout(35e3)

test('go to /', async () => {
    await page.goto('http://localhost:3000')

    await page.waitForSelector(`text=Starter`)
})

test('go to post', async () => {
    await page.goto('http://localhost:3000')

    await page.waitForSelector(`text=Sign Up`)

    await page.click('text=Sign Up')

    expect(page.locator(`text=Signup`)).toBeDefined()
})

export {}
