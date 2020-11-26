'use strict';

let testStatus = {
  user: 'russell',
  date: new Date(),
  tasks: [
    'Task 1',
    'Task 2',
    'Task 3'
  ],
  audits: [
    'Page 1',
    'Page 2',
    'Page 3'
  ],
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
  mobileUpdates: 4
}

function createString(status) {
  let str = '**List of notable completions this week**\n\n';
  for (let i = 0; i < status.tasks.length; i++) {
    str += `- ${status.tasks[i]}\n`;
  }
  $('#result').append(str);
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
