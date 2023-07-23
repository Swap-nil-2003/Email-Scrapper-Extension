let scrapeEmails =  document.getElementById('scrapeEmails');
let list = document.getElementById('emailList');

//Handler to receive emails from content script
chrome.runtime.onMessage.addListener((request,sender, sendResponse) => {

    let emails = request.emails;

    //display emails on popup

    if(emails == null || emails.length ==0)//no emails
    {
        let li =  document.createElement('li');
        li.innerText = "No emails found";
        list.appendChild(li);
    }
    else //display emails
    {
        emails.forEach((email) =>{
        let li =  document.createElement('li');
        li.innerText = email;
        list.appendChild(li);
        });
    }

});

//Button click event listener
scrapeEmails.addEventListener("click", async ()=>{

    //current active tab
    let [tab]= await chrome.tabs.query({active: true, currentWindow:true});

    //parsing emails on page
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage,
    });
});

//Function to scrape emails
function scrapeEmailsFromPage(){

    //RegEx function to parse email from html code
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/
    let emails = document.body.innerHTML.match(emailRegEx);//parse emails from html

    chrome.runtime.sendMessage({emails});//send emails to popup
}

//Alt regEx string/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
