import playwright from "playwright";

async function launchBrowser(callback) {

}

export function delay(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  });
}
