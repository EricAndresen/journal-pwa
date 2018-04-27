// Note: this app is storing state multiple places, refactor to have a single source of truth

// On button click open form with that pages data passed in
    // on submit if index, then update that index, else add to the end
    // Note: this might actually be easier to do once firebase is up and running (update, etc.)

// TODO: truncate display of entries by char number
// TODO: Add Back button to form entry (how to handle routing?)
// TODO: External Database
// TODO: see https://firebase.google.com/docs/web/setup?authuser=0 to further abstract firebase config (use node)
// TODO: add markdown support for entries
// TODO: add search (Implement using string.includes with a scoring system?, would regex be faster?)
// TODO: NLP (tab on top)
// TODO: test with very large numbers of entries (page reflow performance issues?)


const model = {
    currentEntryIndex: null,
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
    const fabAdd = document.querySelector('.fab-add');
    const fabEdit = document.querySelector('.fab-edit');
    const logo = document.querySelector('.logo');

    function hide(element){
        element.style.display = "none";
    }

    function show(element, method = "block"){
        element.style.display = method;
    }

    
    return {
        init(){
            // on logo click return to entries
            logo.addEventListener('click', () => view.showEntries());
    
            // listen on parent for click on child 
            entriesDisplay.addEventListener('click', (event) => {
                let el = event.target
                
                // go to parent element if child
                if (el.className != "entry") {
                    el = el.parentElement
                }
                
                if (el.className === "entry") {
                    controller.setCurrentEntryIndex(el.dataset.index)
                    view.showEntryFocus()
                }
            });
    
            // initialize entry page
    
            // render each entry with newest first
            for (let [index, entry] of model.entries.reverse().entries()){
                const entryHtml = controller.makeEntryHtml(entry, index = index);
                view.render(entryHtml, entriesDisplay);
            }   
    
            // render form (do this here so only have to do it once)
            view.render(controller.makeFormHtml({}), entriesForm);
    
            // needs to be below the render function (can fix this by pulling this into view.init)
            const form = document.querySelector('form');
            const textArea = document.querySelector('textarea');
    
    
            // on submit add entry, reset form, and display entries pages 
            form.addEventListener('submit', event => {
                event.preventDefault();
                const data = {
                    date: Date.now(),
                    text: event.target[0].value
                }
                controller.addEntry(data);
                textArea.innerHTML = '';
                view.showEntries();
            })

            // on fab click hide entries and display form
            fabAdd.addEventListener('click', () => {
                controller.setCurrentEntryIndex(null)
                view.showForm();
            });
            
            fabEdit.addEventListener('click', (event) => {
                // make this not talk to model
                textArea.innerHTML = controller.getCurrentEntryObject().text
                view.showForm();
            });
        },
        render(htmlString, targetDiv){
            // this is too tightly coupled
            targetDiv.insertAdjacentHTML('afterBegin' , htmlString)
        },
        showEntries(){
            show(entriesDisplay);
            show(fabAdd, method = "flex");
            // Note: decouple this more?
            this.hideForm();  
            this.hideEntryFocus();          
        },
        hideEntries(){
            hide(entriesDisplay);
            hide(fabAdd);
        },
        // TODO: split this up - doing to many things
        showEntryFocus(element){
            this.hideEntries();
            const entry = controller.getCurrentEntryObject();
            entryFocus.innerHTML = controller.makeEntryFocusHtml(entry);
            show(entryFocus);
            hide(fabAdd);
            show(fabEdit, method = "flex");
        },
        hideEntryFocus(){
            hide(entryFocus);
            hide(fabEdit);
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
    const entriesDisplay = document.querySelector('.entries-display');

    function renderDate(dateInMs){
        return new Date(dateInMs).toDateString(); 
    }

    return{
        makeEntryHtml(entryObject, index = model.entries.length - 1){
            // TODO add parseDate function
            htmlString = `<div data-index=${index} class="entry">
                             <p class="date">${renderDate(entryObject.date)}</p>
                             <p class="text">${entryObject.text}</p>
                          </div>`
            return htmlString
        },
        // Note: passing index through html to increase lookup speed. Is there a tight coupling trade-off?
        setCurrentEntryIndex(index) {
            model.currentEntryIndex = index;
        },
        getCurrentEntryObject(){
            return model.entries[model.currentEntryIndex] //returns object
        },
        makeFormHtml(entryObject){
            htmlString = `<form>
                             <textarea name="entry-text" id="" cols="10" rows="40">${entryObject.text || ''}</textarea>
                             <button type="submit">Submit</button>
                         </form>`
            return htmlString
        },
        makeEntryFocusHtml(entryObject){
            htmlString = `<div>
                            <p class="date">${renderDate(entryObject.date)}</p>
                            <p class="text">${entryObject.text}</p>
                          </div>`;
            return htmlString;
        },
        addEntry(obj){
            model.entries.push(obj);
            view.render(controller.makeEntryHtml(obj), entriesDisplay);
        }
    }
})()
    
view.init();








