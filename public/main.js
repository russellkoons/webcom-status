'use strict';

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
        let user = data.username;
        $('#user-signout').append(`
          <p>Welcome ${user}!</p>
          <button type="button" onclick="signOut();">Sign Out</button><br/>
        `)
        return res.json();
      } else {
        throw new Error(res.statusText);
      }
    })
    .then(resJson => {
      let token = resJson.authToken;
      localStorage.setItem('authToken', token);
      $('#login-error').empty().append(`<p>${token}</p>`);
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

function displayPage() {
  token = localStorage.getItem('authToken');
  if (token === null) {
    $('#user-signout').empty();
    $('#login-and-signup').removeClass('hidden');
  } else {
    const parse = parseJwt(token);
    const exp = parse.exp * 1000;
    const d = new Date();
    const date = d.getTime();
    if (exp < date)  {
      signOut();
    } else {
      refreshToken();
      user = parse.user.username;
      $('#user-signout').removeClass('hidden').append(`
        <p>Welcome ${user}!</p>
        <button type="button" onclick="signOut();">Sign Out</button><br/>
      `);
      getWorkouts();
    };
  };
}
