import {test, expect } from "@playwright/test"


test('filters survive opening a book and going back', async ({ page }) => {
  await page.goto('/')

  // Type "orwell" in the search box
  await page.getByLabel('Search').fill('orwell')
  

  // Check that the URL contains q=orwell
  await expect(page).toHaveURL(/q=orwell/)

  await page.getByRole('link', { name: '1984' }).click()


  await page.goBack()

  await expect(page.getByLabel('Search')).toHaveValue('orwell')


})
    
