// Goal?: have no elements in main body
    // pull initiatization into view.init

// TODO: Add edit button to entryFocus
// TODO: Add Back button to form entry (how to handle routing?)
// TODO: when edit button is clicked open in form
// TODO: External Database
// TODO: add markdown support for entries
// TODO: add search (Implement using string.includes with a scoring system?, would regex be faster?)
// TODO: NLP (tab on top)
// TODO: Add service worker to make PWA / cache entries
// TODO: test with very large numbers of entries (page reflow performance issues?)
// TODO: add material icon to fab


const model = {
    entries : [
        { 
            date: 1523793423939,
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat ipsa ad in cum beatae vero non culpa itaque id, tempore saepe nulla explicabo maiores molestiae debitis nostrum asperiores quo iure?"
        },
        { 
            date: 1523793423939,
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat ipsa ad in cum beatae vero non culpa itaque id, tempore saepe nulla explicabo maiores molestiae debitis nostrum asperiores quo iure?"
        },
        { 
            date: 1523793423939,
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat ipsa ad in cum beatae vero non culpa itaque id, tempore saepe nulla explicabo maiores molestiae debitis nostrum asperiores quo iure?"
        },
        { 
            date: 1523793423939,
            text: "Lasdf ipsum dolor sit amet consectetur adipisicing elit. Placeat ipsa ad in cum beatae vero non culpa itaque id, tempore saepe nulla explicabo maiores molestiae debitis nostrum asperiores quo iure?"
        }
    ]
}

const view = (() => {
    const entriesDisplay = document.querySelector('.entries-display');
    const entriesForm = document.querySelector('.entries-form');
    const entryFocus = document.querySelector('.entry-focus');

    function hide(element){
        element.style.display = "none";
    }

    function show(element, method = "block"){
        element.style.display = method;
    }

    return {
        render(htmlString, targetDiv){
            // this is too tightly coupled
            targetDiv.insertAdjacentHTML('afterBegin' , htmlString)
        },
        showEntries(){
            show(entriesDisplay);
            show(fab, method = "flex");
            // Note: decouple this more?
            this.hideForm();  
            this.hideEntryFocus();          
        },
        hideEntries(){
            hide(entriesDisplay);
            hide(fab);
        },
        showEntryFocus(element){
            this.hideEntries();
            const entry = controller.getEntryObject(element);
            entryFocus.innerHTML = controller.makeEntryFocusHtml(entry);
            show(entryFocus);
        },
        hideEntryFocus(){
            hide(entryFocus);
        },
        showForm(){
            show(entriesForm);  
            this.hideEntries();
            this.hideEntryFocus()
        },   
        hideForm(){
            hide(entriesForm);  
        }   
    }
})()

const controller = (() => {

    function renderDate(dateInMs){
        return new Date(dateInMs).toDateString(); 
    }

    return{
        makeEntryHtml(entryObject, index = (model.entries.length - 1)){
            // TODO add parseDate function
            // TODO make data-index dynamic
            htmlString = `<div data-index = ${index} class="entry">
                             <p class="date">${renderDate(entryObject.date)}</p>
                             <p class="text">${entryObject.text}</p>
                          </div>`
            return htmlString
        },
        // Note: passing index through html to increase lookup speed. Is there a tight coupling trade-off?
        getEntryObject(entryHtml){
            const index = entryHtml.dataset.index;
            return model.entries[index] //returns object
        },
        makeFormHtml(entryObject){
            htmlString = `<form>
                             <textarea data-index = 0 name="entry-text" id="" cols="10" rows="40">${entryObject.text || ''}</textarea>
                             <button type="submit">Submit</button>
                         </form>`
            return htmlString
        },
        makeEntryFocusHtml(entryObject){
            htmlString = `<p class="date">${renderDate(entryObject.date)}</p>
                          <p class="text">${entryObject.text}</p>`;
            return htmlString;
        },
        addEntry(obj){
            model.entries.push(obj);
            view.render(controller.makeEntryHtml(obj), entriesDisplay);
        }
    }
})()
    

// initialize

// get elements
const entriesDisplay = document.querySelector('.entries-display');
const entriesForm = document.querySelector('.entries-form');
const fab = document.querySelector('.fab');
const logo = document.querySelector('.logo');

// on logo click return to entries
logo.addEventListener('click', () => view.showEntries());

// listen on parent for click on child 
// Note: is there a way to abstract this without slowing down with too many DOM interactions?
entriesDisplay.addEventListener('click', (event) => {
    let el = event.target
    
    if (el.className != "entry") {
        el = el.parentElement
    }
    
    if (el.className === "entry") {
        view.showEntryFocus(el)
    }
});

// initialize entry page

// render each entry with newest first
for (let [index, entry] of model.entries.reverse().entries()){
    const entryHtml = controller.makeEntryHtml(entry, index = index);
    view.render(entryHtml, entriesDisplay);
}   

// on fab click hide entries and display form
fab.addEventListener('click', () => {
    view.showForm();
});

// render form (do this here so only have to do it once)
view.render(controller.makeFormHtml({}), entriesForm);

// needs to be below the render function (can fix this by pulling this into view.init)
const form = document.querySelector('form');


// on submit add entry, reset form, and display entries pages 
form.addEventListener('submit', event => {
    const data = {
        date: Date.now(),
        text: event.target[0].value
    }
    controller.addEntry(data);
    event.target[0].value = '';
    event.preventDefault();
    view.showEntries();
})







