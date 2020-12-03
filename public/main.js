'use strict';

let user;
let status;
const emptyStatus = {
  tasks: [],
  audits: [],
  enhancements: [],
  builds: [],
  uploads: 0,
  tickets: 0,
  workflows: 0,
  reports: 0,
  mobileUpdates: 0,
  reviews: 0
}

// This function creates the string that goes into the textarea, building and formatting the webcom status
  // It checks the value of each item of the status object and builds the status accordingly
function createString(stat) {
  let enhance = 0;
  $('#result').empty();
  let str = '**List of notable completions this week**\n';
  if (stat.tasks.length > 0) {
    str+= '\n';
    for (let i = 0; i < stat.tasks.length; i++) {
      str += `- ${stat.tasks[i]}\n`;
    }
  }
  if (stat.audits.length > 0) {
    if (!stat.tasks.length) {
      str+= '\n';
    }
    str += `- Page audits: ${stat.audits[0]}`;
    for (let i = 1; i < stat.audits.length; i++) {
      str += `, ${stat.audits[i]}`;
    }
    str += '\n';
  }
  if (stat.enhancements.length > 0) {
    if (!stat.tasks.length && !stat.audits.length) {
      str+= '\n';
    }
    str += '- Audit enhancements:\n';
    for (let i = 0; i < stat.enhancements.length; i++) {
      if (stat.enhancements[i].change.length > 1) {
        str += ` - ${stat.enhancements[i].page}\n`;
        for (let j = 0; j < stat.enhancements[i].change.length; j++) {
          enhance++;
          str += `  - ${stat.enhancements[i].change[j]}\n`;
        }
      } else {
        enhance++;
        str += ` - ${stat.enhancements[i].page} - ${stat.enhancements[i].change}\n`
      }
    }
  }
  if (stat.tasks.length > 0 || stat.audits.length > 0 || stat.enhancements.length > 0) {
    str += '\n';
  }
  str += '**Page Builds**\n';
  if (stat.builds.length > 0) {
    str += '\n';
    for (let i = 0; i < stat.builds.length; i++) {
      if (stat.builds[i].date === '') {
        str += `- ${stat.builds[i].page} - ${stat.builds[i].status}\n`;
      } else {
        str += `- ${stat.builds[i].page} - ${stat.builds[i].status} - ${stat.builds[i].date}\n`;
      }
    }
    str += '\n';
  }
  str += '**Number of NextGen Uploads**\n';
  if (stat.uploads > 0) {
    str += `${stat.uploads}\n\n`;
  }
  str += '**Number of completed tickets** (CR and other)\n';
  if (stat.tickets > 0) {
    str += `${stat.tickets}\n\n`;
  }
  str += '**Number of completed workflow approvals** (Renee only)\n';
  if (stat.workflows > 0) {
    str += `${stat.workflows}\n\n`;
  }
  str += '**Number of reports delivered** (Rob only)\n';
  if (stat.reports > 0) {
    str += `${stat.reports}\n\n`;
  }
  str += '**Number of mobile myApron updates**\n';
  if (stat.mobileUpdates > 0) {
    str += `${stat.mobileUpdates}\n\n`;
  }
  str += '**Number of Pages Audited** - list the name of the pages and the enhancements in "List of notable completions this week" section\n';
  if (stat.audits.length > 0) {
    str += `${stat.audits.length}\n\n`;
  }
  str += '**Number of Content Author reviews**\n';
  if (stat.reviews > 0) {
    str += `${stat.reviews}\n\n`;
  }
  str += '**Number of Page Audit Enhancements**';
  if (enhance > 0) {
    str += `\n${enhance}`;
  }
  $('#result').append(str);
}

// This fires off all the build_____ functions in order to reset the form once you make a change
function buildForm() {
  buildTasks();
  buildAudits();
  buildEnhancements();
  buildBuilds();
} 

// Functions for updating the form and status object on adding new tasks
function buildTasks() {
  $('#task-builds').empty();
  status.tasks.forEach((task, index) => {
    $('#task-builds').append(`
      <input type="text" name="tasks" id="tasks-${index}" value="${task}" />
      <button id="task-minus-${index}" onclick="removeItem('tasks', ${index})">Remove</button>
      <button id="task-update-${index}" onclick="updateItem('tasks', ${index})">Update</button><br>
    `)
  });
  if ($('body').hasClass('dark')) {
    $('*').addClass('dark');
  } else if ($('body').hasClass('light')) {
    $('*').addClass('light');
  }
}

function addTask() {
  if ($('#new-task').val() === '') {
    $('#task-error').removeClass('hidden');
    return;
  }
  $('#task-error').addClass('hidden');
  status.tasks.push($('#new-task').val());
  $('#new-task').val('');
  buildTasks();
  createString(status);
}

// Functions for updating the form and status object on adding new audits
function buildAudits() {
  $('#audit-builds').empty();
  status.audits.forEach((audit, index) => {
    $('#audit-builds').append(`
      <input type="text" name="audits" id="audits-${index}" value="${audit}" />
      <button id="audit-minus-${index}" onclick="removeItem('audits', ${index})">Remove</button>
      <button id="audit-update-${index}" onclick="updateItem('audits', ${index})">Update</button><br>
    `)
  });
  if ($('body').hasClass('dark')) {
    $('*').addClass('dark');
  } else if ($('body').hasClass('light')) {
    $('*').addClass('light');
  }
}

function addAudit() {
  if ($('#new-audit').val() === '') {
    $('#audit-error').removeClass('hidden');
    return;
  }
  $('#audit-error').addClass('hidden');
  status.audits.push($('#new-audit').val());
  $('#new-audit').val('');
  buildAudits();
  createString(status);
}

// Functions for updating the form and status object on adding new enhancements
function buildEnhancements() {
  $('#enhancement-builds').empty();
  status.enhancements.forEach((enhancement, index) => {
    $('#enhancement-builds').append(`
      <label>Page:</label>
      <input type="text" name="enhancements" id="enhancements-page-${index}" value="${enhancement.page}" />
      <button id="enhancement-minus-${index}" onclick="removeEnhancement(${index})">Remove</button>
      <button id="enhancement-update-${index}" onclick="updateEnhancement(${index})">Update</button><br>
    `);
    enhancement.change.forEach((change, jndex) => {
      $('#enhancement-builds').append(`
        <label>Change ${jndex + 1}:</label>
        <input type="text" name="enhancements" id="enhancements-change-${index}-${jndex}" value="${change}" />
        <button id="enhancement-minus-${index}-${jndex}" onclick="removeEnhancement(${index}, ${jndex})">Remove</button>
        <button id="enhancement-update-${index}-${jndex}" onclick="updateEnhancement(${index}, ${jndex})">Update</button><br>
      `);
    })
  });
  if ($('body').hasClass('dark')) {
    $('*').addClass('dark');
  } else if ($('body').hasClass('light')) {
    $('*').addClass('light');
  }
}

function addEnhancement() {
  if (!$('#new-enhancement-page').val() || !$('#new-enhancement-change').val()) {
    $('#enhancement-error').removeClass('hidden');
    return;
  }
  $('#enhancement-error').addClass('hidden');
  let search = status.enhancements.find(x => x.page === $('#new-enhancement-page').val());
  if (search) {
    search.change.push($('#new-enhancement-change').val());
    buildEnhancements();
    createString(status);
    return;
  }
  status.enhancements.push({
    page: $('#new-enhancement-page').val(),
    change: [$('#new-enhancement-change').val()],
  });
  $('#new-enhancement-change').val('');
  buildEnhancements();
  createString(status);
}

// Enhancements has special remove and update functions because there are 2 keys to worry about
function updateEnhancement(i, j) {
  status.enhancements[i].page = $(`#enhancements-page-${i}`).val();
  if (j !== undefined) {
    status.enhancements[i].change[j] = $(`#enhancements-change-${i}-${j}`).val();
  }
  buildEnhancements();
  createString(status);
}

function removeEnhancement(i, j) {
  if (j === undefined || status.enhancements[i].change.length === 1) {
    status.enhancements.splice(i, 1);
    buildEnhancements();
    createString(status);
    return;
  }
  status.enhancements[i].change.splice(j, 1);
  buildEnhancements();
  createString(status);
}

// Functions for updating the form and status object on adding new page builds
function buildBuilds() {
  $('#build-builds').empty();
  status.builds.forEach((build, index) => {
    $('#build-builds').append(`
      <input type="text" name="builds" id="builds-page-${index}" value="${build.page}" />
      <select id="build-progress-${index}">
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <input type="text" name="builds" id="builds-date-${index}" value="${build.date}" />
      <button id="build-minus-${index}" onclick="removeItem('builds', ${index})">Remove</button>
      <button id="build-update-${index}" onclick="updateBuild(${index})">Update</button><br>
    `);
    $(`#build-progress-${index}`).val(build.status);
  });
  if ($('body').hasClass('dark')) {
    $('*').addClass('dark');
  } else if ($('body').hasClass('light')) {
    $('*').addClass('light');
  }
}

function addBuild() {
  if (!$('#new-build-name').val()) {
    $('#build-error').removeClass('hidden');
    return;
  }
  $('#build-error').addClass('hidden');
  if ($('#new-build-date').val()) {
    status.builds.push({
      page: $('#new-build-name').val(),
      status: $('#new-build-progress').val(),
      date: $('#new-build-date').val(),
    });
  } else {
    status.builds.push({
      page: $('#new-build-name').val(),
      status: $('#new-build-progress').val(),
      date: '',
    });
  }
  $('#new-build-name').val('');
  $('#new-build-progress').val('In Progress');
  $('#new-build-date').val('');
  buildBuilds();
  createString(status);
}

// Builds have a special update function since there's 3 keys to worry about
function updateBuild(i) {
  status.builds[i] = {
    page: $(`#builds-page-${i}`).val(),
    status: $(`#build-progress-${i}`).val(),
    date: $(`#builds-date-${i}`).val(),
  }
  buildBuilds();
  createString(status);
}

// Generic remove and update functions for tasks, audits and page builds
function removeItem(key, i) {
  status[key].splice(i, 1);
  buildForm();
  createString(status);
}

function updateItem(key, i) {
  status[key][i] = $(`#${key}-${i}`).val();
  buildForm();
  createString(status);
}

// Plus and minus are for the number inputs, they add or subtract based on value of inputs
function plus(key) {
  const val = parseInt($(`#${key}`).val());
  if (!val) { return; }
  status[key] += val;
  createString(status);
}

function minus(key) {
  const val = parseInt($(`#${key}`).val());
  if (!val) { return; }
  if (status[key] === 0 || val > status[key]) {
    status[key] = 0;
    createString(status);
    return;
  }
  status[key] -= val;
  createString(status);
}

// Takes the overarching status object and deep copies the empty status into it
  // If a user has a status saved in the DB it also adds the ID
function resetStatus() {
  let id;
  if (status.id) {
    id = status.id;
  }
  status = JSON.parse(JSON.stringify(emptyStatus));
  status.user = user;
  if (id) {
    status.id = id;
  }
  createString(status);
  buildForm();
}

// Copies the text from the textarea field for easy pasting
function copyText() {
  $('#result').select();
  document.execCommand('copy');
  $('#copied').append('Copied to clipboard!');
  setTimeout(() => { $('#copied').empty(); }, 3000);
}

// POST and PUT endpoints for status database, created new if status does not have ID and updates if it does
function saveStatus() {
  if (!status.id) {
    console.log('POST Endpoint');
    fetch('/status', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(status),
    })
      .then(res => {
        if (res.ok) {
          $('#copied').append('Status saved to database');
          getStatus();
          setTimeout(() => { $('#copied').empty(); }, 3000);
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch(err => {
        $('#copied').append(`${err}`);
      });
  } else {
    console.log('PUT Endpoint');
    fetch(`/status/${status.id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(status),      
    })
      .then(res => {
        if (res.ok) {
          $('#copied').append('Status saved to database');
          getStatus();
          setTimeout(() => { $('#copied').empty(); }, 3000);
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch(err => {
        $('#copied').append(`${err}`);
      });
  }
}

// Fetches the statuses from the database
function getStatus() {
  fetch('/status')
    .then(res => res.json())
    .then(resJson => {
      status = resJson.filter(obj => obj.user === user);
      status = status[0];
      if (status === undefined) {
        status = JSON.parse(JSON.stringify(emptyStatus));
        status.user = user;
      }
      if (status.date) {
        $('#last-saved').empty().append(`Last saved on ${status.date}`)
      }
      createString(status);
      buildForm();
    })
    .catch(err => {
      console.log(err);
    })
}

// Functions for the user and auth endpoints
function signOut() {
  $( '#task-builds, #audit-builds, #enhancement-builds, #build-builds, #last-saved' ).empty();
  localStorage.removeItem('authToken');
  displayPage();
}

function logIn(data) {
  fetch('/auth/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.ok) {
        user = data.username;
        return res.json();
      } else {
        throw new Error(res.statusText);
      }
    })
    .then(resJson => {
      let token = resJson.authToken;
      localStorage.setItem('authToken', token);
      displayPage();
    })
    .catch(err => {
      console.error(err);
      $('#login-error').empty().append('<p class="alert">Username or password is incorrect</p>');
    });
}

function signUp() {
  if ($('#signuppassword').val() !== $('#passconfirm').val()) {
    $('#signup-error').empty().append('<p class="alert">Passwords must match</p>');
  } else {
    const newUser = {
      'username': $('#signupusername').val(),
      'password': $('#signuppassword').val()
    };
    fetch(`/users`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
      .then(res => {
        if (res.ok) {
          logIn(newUser);
        } else {
          throw new Error(res.json());
        }
      })
      .catch(err => {
        $('#signup-error').empty().append(`<p class="alert">${err.message}</p>`);
        console.log(err);
      });
  }
}

function refreshToken(token) {
  fetch('/auth/refresh', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.statusText);
      }
    })
    .then(resJson => {
      let token = resJson.authToken;
      localStorage.setItem('authToken', token);
    })
    .catch(err => console.log(err));
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

// Displays the page based on if user is logged in or not
function displayPage() {
  let token = localStorage.getItem('authToken');
  if (token === null) {
    $('#user-signout').empty();
    $('#form-result').addClass('hidden');
    $('#login-signup').removeClass('hidden');
    return;
  }
  const parse = parseJwt(token);
  const exp = parse.exp * 1000;
  const d = new Date();
  const date = d.getTime();
  if (exp < date)  {
    signOut();
    return;
  } 
  refreshToken(token);
  user = parse.user.username;
  $('#login-signup').addClass('hidden');
  document.getElementById('login').reset();
  document.getElementById('signup').reset();
  $('#form-result').removeClass('hidden');
  $('#user-signout').removeClass('hidden').append(`
    <p>Welcome ${user}!</p>
    <button type="button" onclick="signOut()">Sign Out</button>
    <button type="button" onclick="darkMode()" id="dark-mode-button">Light Mode</button>
  `);
  if ($('body').hasClass('light')) {
    $('#dark-mode-button').empty().append('Dark Mode');
  }
  getStatus();
}

// Turns dark mode on and off
function darkMode() {
  if ($('*').hasClass('dark')) {
    $('*').removeClass('dark').addClass('light');
    $('#dark-mode-button').empty().append('Dark Mode');
    return;
  }
  $('*').removeClass('light').addClass('dark');
  $('#dark-mode-button').empty().append('Light Mode');
  return;
}

$(function() {
  displayPage();
});
