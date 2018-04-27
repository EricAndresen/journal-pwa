// BUG: see controller.updateFormValue(). Trying to make form update with current object, accept when add button is pressed because its a new object 

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


const DOM = {
    entriesDisplay : document.querySelector('.entries-display'),
    entriesForm : document.querySelector('.entries-form'),
    entryFocus : document.querySelector('.entry-focus'),
    fabAdd : document.querySelector('.fab-add'),
    fabEdit : document.querySelector('.fab-edit'),
    logo : document.querySelector('.logo'),
    form : document.querySelector('form'),
    textArea : document.querySelector('textarea'),
}

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

    function hide(element){
        element.style.display = "none";
    }

    function show(element, method = "block"){
        element.style.display = method;
    }

    
    return {
        init(){
            // on DOM.logo click return to entries
            DOM.logo.addEventListener('click', () => view.showEntries());
    
            // listen on parent for click on child 
            DOM.entriesDisplay.addEventListener('click', (event) => {
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
                view.render(entryHtml, DOM.entriesDisplay);
            }  
    
    
            // on submit add entry, reset form, and display entries pages 
            DOM.form.addEventListener('submit', event => {
                event.preventDefault();
                const data = {
                    date: Date.now(),
                    text: event.target[0].value
                }
                controller.addEntry(data);
                DOM.textArea.innerHTML = '';
                view.showEntries();
            })

            // on fab click hide entries and display form
            DOM.fabAdd.addEventListener('click', () => {
                console.log('add')
                controller.setCurrentEntryIndex(null)
                view.showForm();
            });
            
            DOM.fabEdit.addEventListener('click', (event) => {
                console.log('edit')
                view.showForm();
            });
        },
        render(htmlString, targetDiv){
            // this is too tightly coupled
            targetDiv.insertAdjacentHTML('afterBegin' , htmlString)
        },
        showEntries(){
            show(DOM.entriesDisplay);
            show(DOM.fabAdd, method = "flex");
            // Note: decouple this more?
            this.hideForm();  
            this.hideEntryFocus();          
        },
        hideEntries(){
            hide(DOM.entriesDisplay);
            hide(DOM.fabAdd);
        },
        // TODO: split this up - doing to many things
        showEntryFocus(element){
            this.hideEntries();
            const entry = controller.getCurrentEntryObject();
            DOM.entryFocus.innerHTML = controller.makeEntryFocusHtml(entry);
            show(DOM.entryFocus);
            hide(DOM.fabAdd);
            show(DOM.fabEdit, method = "flex");
        },
        hideEntryFocus(){
            hide(DOM.entryFocus);
            hide(DOM.fabEdit);
        },
        showForm(){
            controller.updateFormValue();
            show(DOM.entriesForm);  
            this.hideEntries();
            this.hideEntryFocus()
        },   
        hideForm(){
            hide(DOM.entriesForm);  
        }   
    }
})()

const controller = (() => {

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
            const index = model.currentEntryIndex
            if (index){
                return model.entries[model.currentEntryIndex] //returns object
            } else {
                return ''
            }
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
            view.render(controller.makeEntryHtml(obj), DOM.entriesDisplay);
        },
        updateFormValue(){
            DOM.textArea.value = controller.getCurrentEntryObject().text || ''
        }
    }
})()
    
view.init();








