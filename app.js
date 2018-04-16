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
        render(target, htmlString){
            target.insertAdjacentHTML('beforeend', htmlString)
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
                             <textarea data-index = 0 name="entry-text" id="" cols="10" rows="40">${entryObject.text}</textarea>
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



for (let e of model.entries){
    const entryHtml = controller.makeEntryHtml(e);
    view.render(entriesDisplay, entryHtml);
}

view.render(entriesForm, controller.makeFormHtml({}));

const form = document.querySelector('form');

form.addEventListener('submit', event => {
    const data = {
        date: Date.now(),
        text: event.target[0].value
    }
    controller.addEntry(data);
    view.render(entriesDisplay, controller.makeEntryHtml(data));
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




