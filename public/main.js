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
      date: new Date()
    },
    {
      page: 'Page 2',
      status: 'Completed',
      date: new Date()
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
  let str = '**List of notable completions this week**';
  if (status.tasks.length > 0) {
    str+= '\n\n';
    for (let i = 0; i < status.tasks.length; i++) {
      str += `- ${status.tasks[i]}\n`;
    }
  }
  if (status.audits.length > 0) {
    str += `- Page audits: ${status.audits[0]}`;
    for (let i = 1; i < status.audits.length; i++) {
      str += `, ${status.audits[i]}`;
    }
    str += '\n';
  }
  if (status.enhancements.length > 0) {
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

}

function plus(key) {
  const val = $(`#${key}`).val();
  testStatus[key] += parseInt(val);
  createString(testStatus);
}

function minus(key) {
  const val = $(`#${key}`).val();
  testStatus[key] -= parseInt(val);
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
      $('#login-error').empty().append(`<p class="alert">Username or password is incorrect</p>`);
    });
}

function signUp() {
  if ($('#signuppassword').val() !== $('#passconfirm').val()) {
    $('#signup-error').empty().append(`<p class="alert">Passwords must match</p>`);
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
});
