async function loadApp() {
    const { index } = await import("./index.js"); // this is your normal entry file - (index.js, main.js, app.mjs etc.)
}
loadApp()