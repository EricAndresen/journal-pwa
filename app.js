// BUG: view.show makes fab render incorrectly (uses flex)


// Goal?: have no elements in main body
    // pull initiatization into view.init
// BUG?: Form data doesn't clear?
// TODO: Add Back button to form entry (how to handle routing?)
// TODO: cardview for each entry
// TODO: render date into readable format
// TODO: when article is clicked show full entry with edit button
// TODO: when edit button is clicked open in form
// TODO: External Database
// TODO: NLP (tab on top)
// TODO: test with very large numbers of entries (page reflow performance issues?)


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
            text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat ipsa ad in cum beatae vero non culpa itaque id, tempore saepe nulla explicabo maiores molestiae debitis nostrum asperiores quo iure?"
        }
    ]
}

const view = (() => {
    const entriesDisplay = document.querySelector('.entries-display');
    const entriesForm = document.querySelector('.entries-form');

    function hide(element){
        element.style.display = "none";
    }

    function show(element){
        element.style.display = "block";
    }

    return {
        render(htmlString, targetDiv){
            targetDiv.insertAdjacentHTML('beforeend', htmlString)
        },
        showEntries(){
            show(entriesDisplay);
            show(fab);
            // need to decouple this more
            this.hideForm();            
        },
        hideEntries(){
            hide(entriesDisplay);
            hide(fab);
        },
        showForm(){
            show(entriesForm);  
            this.hideEntries();
        },   
        hideForm(){
            hide(entriesForm);  
        }   
    }
})()

const controller = (() => {
    return{
        makeEntryHtml(entryObject){
            // TODO add parseDate function
            // TODO make data-index dynamic
            htmlString = `<div data-index = 0 class="entry">
                             <p class="date">${entryObject.date}</p>
                             <p class="text">${entryObject.text}</p>
                          </div>`
            return htmlString
        },
        // passing index this way to increase lookup speed. Is there a tight coupling trade-off?
        getEntryObject(entryHtml){
            const index = entryHtml.dataset.index;
            return model.entries[index] //returns object
        },
        makeFormHtml(entryObject){
            // TODO make data-index dynamic
            htmlString = `<form>
                             <textarea data-index = 0 name="entry-text" id="" cols="10" rows="40">${entryObject.text || ''}</textarea>
                             <button type="submit">Submit</button>
                         </form>`
            return htmlString
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

// initialize entry page

// render each entry in order
for (let e of model.entries){
    const entryHtml = controller.makeEntryHtml(e);
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







