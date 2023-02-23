
const JIL_HOST = 'https://bps-il-stage.adobe.io/'
const BEARER_TOKEN = ''
const API_KEY = 'aem-assets-backend-1'
const tableHeaders = ['First Name', 'Last Name', 'User Name', 'Type']
const tableId = "user-list-table"

function appendUserRow(user) {

    

    let row = document.createElement('tr');
    row.className = 'user-row'
    let data = document.createElement('td');
    data.appendChild(document.createTextNode(user.firstName));
    row.appendChild(data);
    data = document.createElement('td');
    data.appendChild(document.createTextNode(user.lastName));
    row.appendChild(data);
    data = document.createElement('td');
    data.appendChild(document.createTextNode(user.userName));
    row.appendChild(data);
    data = document.createElement('td');
    data.appendChild(document.createTextNode(user.type));
    row.appendChild(data);

    return row;
}

//TODO this should be shared logic/service
async function getUsers() {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json');
    headers.append('x-api-key', API_KEY);
    headers.append('Authorization', `Bearer ${BEARER_TOKEN}`);
    
    let response;
    
    try {
        response = await fetch(`${JIL_HOST}jil-api/v2/organizations/${ORG_ID}/users`, {
            headers: headers
        })        
    } catch (error) {
        console.log(error);
    }
    
    let users = await response.json();

    return users;
}

async function getUsersOnClick (){
    let users = await getUsers();
    let table = document.getElementById(tableId);

    var rowCount = table.rows.length;
    for (var x=rowCount-1; x>0; x--) {
        table.deleteRow(x);
    }

    users.forEach(user => {
        if (!user.firstName) {
            return;
        }

        let row = appendUserRow(user);
        table.append(row)
    })

}

export default async function decorate(block) {
    // Build the empty table
    const table = document.createElement('table');
    table.id = tableId;
    let column = document.createElement('tr');
    tableHeaders.forEach(title => {
        let th = document.createElement('th');
        th.innerText = title;
        column.append(th)
    });
    table.append(column);

    // Find button by Title. 
    var button = document.querySelector('[title="Get Users"]');
    button.addEventListener("click", getUsersOnClick)

    block.append(table);
}
