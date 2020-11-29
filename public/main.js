'use strict';

let testStatus = {
  user: 'russell',
  date: new Date(),
  tasks: ['Task 1', 'Task 2', 'Task 3'],
  audits: ['Page 1', 'Page 2', 'Page 3'],
  enhancements: [
    {
      page: 'Page 1',
      change: 'Change 1'
    },
    {
      page: 'Page 2',
      change: 'Change 2'
    },
    {
      page: 'Page 3',
      change: 'Change 3'
    }
  ],
  builds: [
    {
      page: 'Page 1',
      status: 'In Progress',
      date: '12/16/20'
    },
    {
      page: 'Page 2',
      status: 'Completed',
      date: '11/12/20'
    }
  ],
  uploads: 32,
  tickets: 7,
  workflows: 63,
  reports: 12,
  mobileUpdates: 4,
  reviews: 7
}

let testStatus2 = {
  user: 'russell',
  date: new Date(),
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

function createString(status) {
  $('#result').empty();
  let str = '**List of notable completions this week**\n';
  if (status.tasks.length > 0) {
    str+= '\n';
    for (let i = 0; i < status.tasks.length; i++) {
      str += `- ${status.tasks[i]}\n`;
    }
  }
  if (status.audits.length > 0) {
    if (!status.tasks.length) {
      str+= '\n';
    }
    str += `- Page audits: ${status.audits[0]}`;
    for (let i = 1; i < status.audits.length; i++) {
      str += `, ${status.audits[i]}`;
    }
    str += '\n';
  }
  if (status.enhancements.length > 0) {
    if (!status.tasks.length && !status.audits.length) {
      str+= '\n';
    }
    str += '- Audit enhancements:\n';
    for (let i = 0; i < status.enhancements.length; i++) {
      str += ` - ${status.enhancements[i].page} - ${status.enhancements[i].change}\n`
    }
  }
  str += '\n**Page Builds**\n';
  if (status.builds.length > 0) {
    str += '\n';
    for (let i = 0; i < status.builds.length; i++) {
      str += `- ${status.builds[i].page} - ${status.builds[i].status} - ${status.builds[i].date}\n`;
    }
    str += '\n';
  }
  str += '**Number of NextGen Uploads**\n';
  if (status.uploads > 0) {
    str += `${status.uploads}\n\n`;
  }
  str += '**Number of completed tickets** (CR and other)\n';
  if (status.tickets > 0) {
    str += `${status.tickets}\n\n`;
  }
  str += '**Number of completed workflow approvals** (Renee only)\n';
  if (status.workflows > 0) {
    str += `${status.workflows}\n\n`;
  }
  str += '**Number of reports delivered** (Rob only)\n';
  if (status.reports > 0) {
    str += `${status.reports}\n\n`;
  }
  str += '**Number of mobile myApron updates**\n';
  if (status.mobileUpdates > 0) {
    str += `${status.mobileUpdates}\n\n`;
  }
  str += '**Number of Pages Audited** - list the name of the pages and the enhancements in "List of notable completions this week" section\n';
  if (status.audits.length > 0) {
    str += `${status.audits.length}\n\n`;
  }
  str += '**Number of Content Author reviews**\n';
  if (status.reviews > 0) {
    str += `${status.reviews}\n\n`;
  }
  str += '**Number of Page Audit Enhancements**\n';
  if (status.enhancements.length > 0) {
    str += `${status.enhancements.length}`;
  }
  $('#result').append(str);
}

function buildForm() {
  buildTasks();
  buildAudits();
  buildEnhancements();
  buildBuilds();
} 

function buildTasks() {
  $('#task-builds').empty();
  testStatus.tasks.forEach((task, index) => {
    $('#task-builds').append(`
      <input type="text" name="tasks" id="tasks-${index}" value="${task}" />
      <button id="task-minus-${index}" onclick="removeItem('tasks', ${index})">Remove</button>
      <button id="task-update-${index}" onclick="updateItem('tasks', ${index})">Update</button><br>
    `)
  });
}

function addTask() {
  if ($('#new-task').val() === '') {
    $('#task-error').removeClass('hidden');
    return;
  }
  $('#task-error').addClass('hidden');
  testStatus.tasks.push($('#new-task').val());
  $('#new-task').val('');
  buildTasks();
  createString(testStatus);
}

function buildAudits() {
  $('#audit-builds').empty();
  testStatus.audits.forEach((audit, index) => {
    $('#audit-builds').append(`
      <input type="text" name="audits" id="audits-${index}" value="${audit}" />
      <button id="audit-minus-${index}" onclick="removeItem('audits', ${index})">Remove</button>
      <button id="audit-update-${index}" onclick="updateItem('audits', ${index})">Update</button><br>
    `)
  });
}

function addAudit() {
  if ($('#new-audit').val() === '') {
    $('#audit-error').removeClass('hidden');
    return;
  }
  $('#audit-error').addClass('hidden');
  testStatus.audits.push($('#new-audit').val());
  $('#new-audit').val('');
  buildAudits();
  createString(testStatus);
}

function buildEnhancements() {
  $('#enhancement-builds').empty();
  testStatus.enhancements.forEach((enhancement, index) => {
    $('#enhancement-builds').append(`
      <input type="text" name="enhancements" id="enhancements-page-${index}" value="${enhancement.page}" />
      <input type="text" name="enhancements" id="enhancements-change-${index}" value="${enhancement.change}" />
      <button id="enhancement-minus-${index}" onclick="removeItem('enhancements', ${index})">Remove</button>
      <button id="enhancement-update-${index}" onclick="updateEnhancement(${index})">Update</button><br>
    `)
  });
}

function addEnhancement() {
  if (!$('#new-enhancement-page').val() || !$('#new-enhancement-change').val()) {
    $('#enhancement-error').removeClass('hidden');
    return;
  }
  $('#enhancement-error').addClass('hidden');
  testStatus.enhancements.push({
    page: $('#new-enhancement-page').val(),
    change: $('#new-enhancement-change').val(),
  });
  $('#new-enhancement-page').val('');
  $('#new-enhancement-change').val('');
  buildEnhancements();
  createString(testStatus);
}

function updateEnhancement(i) {
  testStatus.enhancements[i] = {
    page: $(`#enhancements-page-${i}`).val(),
    change: $(`#enhancements-change-${i}`).val(),
  }
  buildEnhancements();
  createString(testStatus);
}

function buildBuilds() {
  $('#build-builds').empty();
  testStatus.builds.forEach((build, index) => {
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
    document.getElementById(`build-progress-${index}`).value = build.status;
  });
}

function addBuild() {
  if (!$('#new-build-name').val() || !$('#new-build-date').val()) {
    $('#build-error').removeClass('hidden');
    return;
  }
  $('#build-error').addClass('hidden');
  testStatus.builds.push({
    page: $('#new-build-name').val(),
    status: $('#new-build-progress').val(),
    date: $('#new-build-date').val(),
  });
  $('#new-build-name').val('');
  $('#new-build-progress').val('In Progress');
  $('#new-build-date').val('');
  buildBuilds();
  createString(testStatus);
}

function updateBuild(i) {
  testStatus.builds[i] = {
    page: $(`#builds-page-${i}`).val(),
    status: $(`#build-progress-${i}`).val(),
    date: $(`#builds-date-${i}`).val(),
  }
  buildBuilds();
  createString(testStatus);
}

function removeItem(key, i) {
  testStatus[key].splice(i, 1);
  buildForm();
  createString(testStatus);
}

function updateItem(key, i) {
  testStatus[key][i] = $(`#${key}-${i}`).val();
  buildForm();
  createString(testStatus);
}

function plus(key) {
  const val = $(`#${key}`).val();
  testStatus[key] += parseInt(val);
  createString(testStatus);
}

function minus(key) {
  const val = parseInt($(`#${key}`).val());
  if (testStatus[key] === 0 || val > testStatus[key]) {
    testStatus[key] = 0;
    createString(testStatus);
    return;
  }
  testStatus[key] -= val;
  createString(testStatus);
}

function signOut() {
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
          return res.json();
        }
      })
      .then(resJson => {
        $('#signup-error').empty().append(`<p class="alert">${resJson.message}</p>`);
        console.log(resJson);
      })
      .catch(err => {
        $('#signup-error').empty().append('<p class="alert">Something went wrong!</p>');
        console.log(err);
      });
  }
}

function makeCreds() {
  const creds = {
    'username': $('#loginusername').val(),
    'password': $('#loginpassword').val()
  }
  logIn(creds);
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
  let user = parse.user.username;
  $('#login-signup').addClass('hidden');
  $('#form-result').removeClass('hidden');
  $('#user-signout').removeClass('hidden').append(`
    <p>Welcome ${user}!</p>
    <button type="button" onclick="signOut();">Sign Out</button><br/>
  `);
}

// These were built to test the textarea formatting, keeping them here for future reference

// const testString = '**hello there**\n\n- hello there\n - line 3';

// function testingTextarea() {
//   $('#result').append(testString);
// }

$(function() {
  displayPage();
  // testingTextarea();
  createString(testStatus);
  buildForm();
});
