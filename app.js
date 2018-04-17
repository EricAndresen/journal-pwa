// TODO: Add Back button to form entry (how to handle routing?)
// TODO: Abstract view / show pages into single functions (e.g. showEntries, showForm)
// TODO: cardview for each entry
// TODO: render date into readable format
// TODO: when article is clicked show full entry with edit button
// TODO: when edit button is clicked open in form
// TODO: External Database
// TODO: NLP (tab on top)
// BUG: view.show makes fab render incorrectly (uses flex)

// BUG: "undefined" shows when no object is passed to form



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

    return {
        render(htmlString, targetDiv){
            targetDiv.insertAdjacentHTML('beforeend', htmlString)
        },
        hide(element){
            element.style.display = "none"
        },
        show(element){
            element.style.display = "block"
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
            // TODO make data-index
            htmlString = `<form>
                             <textarea data-index = 0 name="entry-text" id="" cols="10" rows="40">${entryObject.text || ''}</textarea>
                             <button type="submit">Submit</button>
                         </form>`
            return htmlString
        },
        addEntry(obj){
            model.entries.push(obj);
        }
    }
})()
    


// LOGIC

// initialize
const entriesDisplay = document.querySelector('.entries-display');
const entriesForm = document.querySelector('.entries-form');
const fab = document.querySelector('.fab');


// render each entry in order
for (let e of model.entries){
    const entryHtml = controller.makeEntryHtml(e);
    view.render(entryHtml, entriesDisplay);
}

view.render(controller.makeFormHtml({}), entriesForm);

const form = document.querySelector('form');

form.addEventListener('submit', event => {
    const data = {
        date: Date.now(),
        text: event.target[0].value
    }
    controller.addEntry(data);
    view.render(controller.makeEntryHtml(data), entriesDisplay);
    event.preventDefault();

    view.show(entriesDisplay);
    view.show(fab);
    view.hide(entriesForm);
})


fab.addEventListener('click', () => {
    view.hide(entriesDisplay);
    view.hide(fab);
    view.show(entriesForm);
});




