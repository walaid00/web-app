


//fetch function to asyncorly recieve api info from sql database into js 

function getImgObj() {

    return fetch('/get_imgobj')
   .then(response => {
        return response.json()
   })
   .then(data => {
       return data
       
   })
   .catch((error) => {console.log("Fetch error: " + error)
})
}

//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

getImgObj().then(result => {
    //console.log(result)

    //---------------------------------------------------------------------------------------------------------
    //function takes an argument to set the number of images the get displayed to the page when document loaded
    //it creates a 'div' element and an 'image' element for each item in range if 0 to 'num'
    //each image item gets sourced from a 'b' variable that is found in layout.html
    // this variable refrences a json object that contains a list of file paths of images that are sent from python-flask

    const startImages = function(num) {
        
        for(let i = 0; i < num; i++) {
    
            const container = document.querySelector('.container');

            //add div element to DOM
            const imageDiv = document.createElement('div');
            imageDiv.className = 'one-fourth'; 
            imageDiv.setAttribute('id',`object${result[i].id}`)
            

            //create image element
            const imgElement = document.createElement('img');
            imgElement.src = result[i].url
            //------------------------------------------------------------------------------------------------
            


            //------------------------------------------------------------------------------------------------
            //append image to div then append div to container div
            imageDiv.append(imgElement);
            container.append(imageDiv);
            //------------------------------------------------------------------------------------------------

            //////////////////////////////////////////////////////////
            //adds class to select and then hides all divs that belong to objects that's key value for toRemove = true
            //////////////////////////////////////////////////////////
            if(result[i].toRemove) {
                imgElement.classList.add('selected')
                imageDiv.classList.add('divbox')
                imageDiv.style.display = 'none'
            } 
            //////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////


            //this function looks for a click before deploying, once element is clicked it toggles the class of the element
            // the class of the eleemnt either shows the div element in the document or hides it, this coded in the style.css file 

            imageDiv.addEventListener('click', function() {

                if(imgElement.classList.contains('selected')){
                
                imgElement.classList.remove('selected')
                imageDiv.classList.remove('divbox')
    
                } else {
                    imgElement.classList.add('selected')
                    imageDiv.classList.add('divbox')
                }
            })

            //------------------------------------------------------------------------------------------------
        
            // Looks for click event and once element is clicked it changes a key value of the object associated ot that slected elemetn's id
            // the value of the key: to Remove is toggled from true to false on every click
            // this fucntion is paired with the selction visuals from the above function 

            imageDiv.addEventListener('click', function() {
                //split the 'object' string from the 'id#' and places them in a lsit togther as idObject
                let idObject = (this.id.split("object"))
                
                //removes last item in list and assigns to variable,in this case the last item is the object id number
                let idx = idObject.pop() - 1

                if(result[idx].toRemove){
                    result[idx].toRemove = false
                } else {
                    result[idx].toRemove = true
                }
                console.log(result[idx])
            }) 

        }
    }

    //run function to load images
    startImages(36)

    //---------------------------------------------------------------------------------------------------------
    //This function takes an argument of 'num' that sets the number of images to display
    //when the arrow or move buttons are clicked this function opperates the same as
    //the function above except for the last few lines that alerts the user all images have been uplaoded
    const moreImages = function(num) {

        let counter = document.querySelectorAll('.container img').length
        
        for(let i = counter; i < (counter + num); i++) {
            if(i < (result.length)) {
    
                const container = document.querySelector('.container');

                //add div element to DOM
                const imageDiv = document.createElement('div');
                imageDiv.className = 'one-fourth'; 
                imageDiv.setAttribute('id',`object${result[i].id}`)
                

                //create image element
                const imgElement = document.createElement('img');
                imgElement.src = result[i].url
                //------------------------------------------------------------------------------------------------


                //------------------------------------------------------------------------------------------------
                //append image to div then append div to container div
                imageDiv.append(imgElement);
                container.append(imageDiv);
                //------------------------------------------------------------------------------------------------


                //////////////////////////////////////////////////////////
                //adds class to select and then hides all divs that belong to objects that's key value for toRemove = true
                //////////////////////////////////////////////////////////
                if(result[i].toRemove) {
                    imgElement.classList.add('selected')
                    imageDiv.classList.add('divbox')
                    imageDiv.style.display = 'none'
                } 
                //////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////

                //this function looks for a click before deploying, once element is clicked it toggles the class of the element
                // the class of the eleemnt either shows the div element in the document or hides it, this coded in the style.css file 

                imageDiv.addEventListener('click', function() {

                    if(imgElement.classList.contains('selected')){
                    
                    imgElement.classList.remove('selected')
                    imageDiv.classList.remove('divbox')
        
                    } else {
                        imgElement.classList.add('selected')
                        imageDiv.classList.add('divbox')
                    }
                })


                //------------------------------------------------------------------------------------------------
            
                // Looks for click event and once element is clicked it changes a key value of the object associated ot that slected elemetn's id
                // the value of the key: to Remove is toggled from true to false on every click
                // this fucntion is paired with the selction visuals from the above function 

                imageDiv.addEventListener('click', function() {
                    //split the 'object' string from the 'id#' and places them in a lsit togther as idObject
                    let idObject = (this.id.split("object"))
                    
                    //removes last item in list and assigns to variable,in this case the last item is the object id number
                    let idx = idObject.pop() - 1

                    if(result[idx].toRemove){
                        result[idx].toRemove = false
                    } else {
                        result[idx].toRemove = true
                    }
                    console.log(result[idx])
                })
            
            // if all images have been display show an alert stating that there are no more images to show
            } else{
                return alert('All images have been uploaded!')
            } 

        }
    }

    //------------------------------------------------------------------------------------------------
    //creates a variable to select the move arrow object on page
    const moreArrow = document.querySelector('.ft-link')


    // on click the function moreImages is run, displaying 'the prameter/num' amount of additional images
    moreArrow.addEventListener('click', () => {
        moreImages(36)
    })
    //------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------
    //button to remove images 

    const removedTag = document.querySelector('.header-removed') 

    removedTag.addEventListener('click', function() {


        const selections = document.querySelectorAll('.divbox')
        if(selections) {
            selections.forEach(selection => {
                selection.style.display = 'none'
            }) 
        } else {
            return
        }
    })
    //------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------
    //button to show image display style back to block to show back on page on click event

    const showTag = document.querySelector('.header-show')

    showTag.addEventListener('click', function() {
        const selections = document.querySelectorAll('.divbox')
        selections.forEach(tag => {
            tag.style.display = 'block'
        })
    })
    //------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------
    //button to reset selction style, selction status, and resets toRemove bool value for object in imageArray on click event
    //if confirm() brings an alert window to have user confirm reset if 'ok' then reset, if 'cancel' then abort

    const resetTag = document.querySelector('.header-reset')

    resetTag.addEventListener('click', function() {

        if(confirm('Do you want to reset?')) {
            
            const selections = document.querySelectorAll('.one-fourth')
            selections.forEach(tag => {
                tag.style.display = 'block'
            })
            const selecteds = document.querySelectorAll('.one-fourth img')
            selecteds.forEach(tag => {
                if(selections) {
                    tag.classList.remove('selected')
                } else {
                    return
                }
            })
            
            const divb = document.querySelectorAll('.divbox')
            divb.forEach(tag => {
                tag.classList.remove('divbox')
                })
            //////////////////////////////////////////////////    
            //////////////////////////////////////////////////   
            console.log(result[0].toRemove)
            console.log(result.length)

            for(let i = 0; i < result.length; i++) {
                console.log(result[i])
                result[i].toRemove = false
            } 
            //////////////////////////////////////////////////
            //////////////////////////////////////////////////
        }
        
            

    })
    //------------------------------------------------------------------------------------------------






    //POST VALUES BACK TO FLASK
    //------------------------------------------------------------------------------------------------
    //here we create an eventlistenr on click to run a function to fetch a POST method to Flask app
    // it sends the list imageArray as a string to the app.py file on click of the remove button

    const removeTag = document.querySelector('#remove')
    const resetTag1 = document.querySelector('#reset')

    function submitImages() {


        
        fetch('/input', {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(result),
            cache: 'no-cache',
            headers: new Headers({
            'content-type': 'application/json'
            })
        })
            .then(response => {
            if (response.status !== 200) {
                console.log(`Looks like there was a problem. Status code: ${response.status}`)
                return;
            } else {
                response.json().then(data => {
                    console.log(data)
                })
            }
            })
            .catch(error => {
            console.log("Fetch error: " + error)
            })
            

    }

    removeTag.addEventListener('click', function() {
        submitImages()
    })

    resetTag1.addEventListener('click', function() {
    submitImages()
    })

})
