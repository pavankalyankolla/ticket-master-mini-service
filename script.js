var baseUrl = 'http://dct-api-data.herokuapp.com'


var countHandle = document.getElementById('count');
var searchHandle = document.getElementById('search');

var allHandle = document.getElementById('allS');
var highHandle = document.getElementById('highS');
var mediumHandle = document.getElementById('mediumS');
var lowHandle = document.getElementById('lowS');

var bodyHandle = document.getElementById('tableBody');
var ticketHandle = document.getElementById('ticketForm');

var nameHandle = document.getElementById('name');
var departmentHandle = document.getElementById('department');
// var priorityHandle = document.getElementById('priority');
var priorityNames = document.getElementsByName('Priority'); 
var messageHandle = document.getElementById('message');


var nameErrorHandle = document.getElementById('nameErr');
var departmentErrorHandle = document.getElementById('departmentErr');
var priorityErrorHandle = document.getElementById('priorityErr');
var messageErrorHandle = document.getElementById('messageErr');

var progressHandle = document.getElementById('progress');

var tickets;
var progressCount = 0;
var percentage;

function clickMe(event){
    var id = event.id;
    if(event.checked){
        axios.put(`${baseUrl}/tickets/${id}?api_key=${key}`,{'status':'completed'})
        .then(function(response){
            console.log(response.data);
        })
            .catch(function(err){
            console.log(err);
        })

        progressCount++;
        percentage = progressCount/tickets.length*100;
        progressHandle.setAttribute('style',`width : ${percentage}%`);
        progressHandle.innerHTML=Math.round(percentage)+'%';
        console.log(progressCount);

    }
    else{
        axios.put(`${baseUrl}/tickets/${id}?api_key=${key}`,{'status':'open'})
        .then(function(response){
            console.log(response.data);
        })
            .catch(function(err){
            console.log(err);
        })

        progressCount--;
        percentage = progressCount/tickets.length*100;
        progressHandle.setAttribute('style',`width : ${percentage}%`);
        progressHandle.innerHTML=Math.round(percentage)+'%';
        console.log(progressCount);
    }

}

function buildRow(ticket){
    var tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${ticket.ticket_code}</td>
        <td>${ticket.name}</td>
        <td>${ticket.department}</td>
        <td>${ticket.priority}</td>
        <td>${ticket.message}</td> 
        <td><input type="checkbox" id="${ticket.ticket_code}" onclick="clickMe(this)"/></td>
    `;
    bodyHandle.appendChild(tr); 
}
 
axios.get(`${baseUrl}/tickets?api_key=${key}`)
.then(function(response){
    tickets=response.data;
    countHandle.innerHTML=tickets.length;
    tickets.forEach(function(ticket){
        // console.log(ticket);
        buildRow(ticket)
        
    })
})
.catch(function(err){
    console.log(err);
})

var hasErrors = {
    name:true,
    department:true,
    priority:true,
    message:true
}
function validateName(){
    if(nameHandle.value===''){
        nameErrorHandle.innerHTML='can not be empty';
        hasErrors.name=true;
    }
    else{
        nameErrorHandle.innerHTML='';
        hasErrors.name=false;
    }
}

function validateDepartment(){
    if(departmentHandle.value===''){
        departmentErrorHandle.innerHTML='department cannot be blank';
        hasErrors.department=true;
    }
    else{
        departmentErrorHandle.innerHTML='';
        hasErrors.department=false;
    }
}

function validatePriority(){
    for(var i=0;i<priorityNames.length;i++){
        if(priorityNames[i].value==''){
            priorityErrorHandle.innerHTML='can not be blank';
            
            hasErrors.priority = true;
        } else{
            priorityErrorHandle.innerHTML='';
            hasErrors.priority = false;
           
         }
    }
}

function validateMessage(){
    if(messageHandle.value==''){
        messageErrorHandle.innerHTML='message cannot be empty';
        hasErrors.message=true;
    }
    else{
        messageErrorHandle.innerHTML='';
        hasErrors.message=false;
    }
}
function filterTickets(priority){
    bodyHandle.innerHTML='';
    var count=0;
    tickets.forEach(function(ticket){
        if(ticket.priority === priority){
            count++;
            buildRow(ticket);
        }
        countHandle.innerHTML=count;
    })

}

highHandle.addEventListener('click',function(){
    filterTickets('High')
},false)
mediumHandle.addEventListener('click',function(){
    filterTickets('Medium')
},false)
lowHandle.addEventListener('click',function(){
    filterTickets('Low')
},false)
allHandle.addEventListener('click',function(){
    bodyHandle.innerHTML='';
    tickets.forEach(function(ticket){
        buildRow(ticket)
    })
    countHandle.innerHTML=tickets.length;
},false)


searchHandle.addEventListener('keyup',function(){
    bodyHandle.innerHTML='';
    var searchResults = tickets.filter(function(ticket){
        return ticket.ticket_code.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >=0 ||
        ticket.name.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >=0 ||
        ticket.department.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >=0 ||
        ticket.message.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >=0 ||
        ticket.status.toLowerCase().indexOf(searchHandle.value.toLowerCase()) >=0
    })
    
searchResults.forEach(function(ticket){
    buildRow(ticket);
})
countHandle.innerHTML=searchResults.length;
},false)


function getPriorityValue(){
    for(var i = 0; i < priorityNames.length; i++) {
        if(priorityNames[i].checked){
            return priorityNames[i].value; 
        }
    }
}

ticketHandle.addEventListener('submit',function(e) {

    validateName();
    validateDepartment();
    validatePriority();
    validateMessage();
    
    
    if(Object.values(hasErrors).includes(true)) {
        e.preventDefault();  
    }

    var formData = {
        name: nameHandle.value,
        department: departmentHandle.value,
        priority: getPriorityValue(),
        message: messageHandle.value
    }
    axios.post(`${baseUrl}/tickets?api_key=${key}`,formData)
    .then(function(response) {
        console.log(response.data);
        var ticket = response.data;
        buildRow(ticket);
        ticketHandle.reset();
    })
    .catch(function(err){
        console.log(err);
    })
},false);

var ticket_code = 'DCT-f365';

axios.delete(`${baseUrl}/tickets/${ticket_code}?api_key=${key}`)
.then(function(response) {
    console.log(response.data);
    var ticket = response.data;
    buildRow(ticket);
})
.catch(function(err){
    console.log(err);
})

    
   











