const puppeteer = require("puppeteer");
// const select = require("puppeteer-select");

async function searchKSL() {
  console.log("RUNNING");

  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto("https://craigslist.com");

  await page.$$eval("#hhh0 li a span", (housingList) => {
    for (let i = 0; i < housingList.length; i++) {
      if (housingList[i].textContent === "apts / housing") {
        housingList[i].click();
      }
    }
  });

  await page.waitForSelector('input[name="search_distance"]');
  await page.type('input[name="search_distance"]', "25");

  await page.waitForSelector('input[name="postal"]');
  await page.type('input[name="postal"]', "84404");

  await page.waitForSelector('input[name="min_price"]');
  await page.type('input[name="min_price"]', "900");

  await page.waitForSelector('input[name="max_price"]');
  await page.type('input[name="max_price"]', "2000");

  await page.waitForSelector('select[name="min_bedrooms"]');
  await page.select('select[name="min_bedrooms"]', "2");
  await page.waitFor(500);

  await page.waitForSelector('select[name="max_bedrooms"]');
  await page.select('select[name="max_bedrooms"]', "3");

  await page.waitForSelector(".search-sort");
  await page.click(".search-sort");

  await page.click(".search-sort .dropdown-item:nth-child(2)");

  await page.waitForSelector("#search-results li");
  await page.$$eval("#search-results li", (cardList) => {
    const newCards = [];

    function formatDate(date) {
      let milisec = Date.parse(date);
      let dateObject = new Date(milisec).toDateString();
      let dateArr = dateObject.split(" ");
      let day = dateArr[2];
      return day;
    }
    //loop

    for (let i = 0; i < cardList.length; i++) {
      const newCard = {};

      formattedDate = formatDate(
        cardList[i].querySelector(".result-date").textContent
      );

      todaysDate = formatDate(new Date());

      if (formattedDate === todaysDate) {
        console.log(cardList[i]);
        newCard.date = cardList[i].querySelector(".result-date").textContent;
        newCard.title = cardList[i].querySelector(".result-title").textContent;
        newCard.price = cardList[i].querySelector(".result-price").textContent;
        newCard.href = cardList[i].querySelector("a").href;
        if (cardList[i].querySelector("img")) {
          newCard.img = cardList[i].querySelector("img").src;
        }

        newCards.push(newCard);
      }
    }

    console.log(newCards);
    return newCards;
  });

  // await page.keyboard.type(`25`);

  // await classifiedBtn[8].click();

  // await browser.close();
}

searchKSL();
