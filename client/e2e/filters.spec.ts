import {test, expect } from "@playwright/test"


test('filters survive opening a book and going back', async ({ page }) => {
await page.route('**/api/books', (route) =>
  route.fulfill({
    json: [
      { id: '1', title: '1984', author: 'George Orwell', genre: 'Dystopian', publishedYear: 1949, isbn: '9780451524935', available: false },
      { id: '2', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', publishedYear: 1937, isbn: '9780547928227', available: true },
    ],
  }),
)
  await page.goto('/')

  await page.getByLabel('Search').fill('orwell')
  await expect(page.getByRole('link', { name: 'The Hobbit' })).toHaveCount(0)
  

  await expect(page).toHaveURL(/q=orwell/)

  await page.getByRole('link', { name: '1984' }).click()


  await page.goBack()

  await expect(page.getByLabel('Search')).toHaveValue('orwell')


})
    
