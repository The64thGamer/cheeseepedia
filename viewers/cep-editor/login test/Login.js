const DISCOURSE_URL = "https://forum.cheeseepedia.org";
const APP_NAME = "Cheese-E-Pedia";
const REDIRECT_URI = window.location.origin + window.location.pathname;
const SCOPES = "read";

const statusEl = document.getElementById("status");
const controlsEl = document.getElementById("controls");

function getClientId() {
  let id = localStorage.getItem("discourse_client_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("discourse_client_id", id);
  }
  return id;
}

function showLoggedOut() {
  statusEl.textContent = "Not logged in.";
  controlsEl.innerHTML = "";
  const btn = document.createElement("button");
  btn.textContent = "Log in with Discourse";
  btn.onclick = startLogin;
  controlsEl.appendChild(btn);
}

function showLoggedIn(username) {
  statusEl.textContent = "Logged in as " + username;
  controlsEl.innerHTML = "";
  const btn = document.createElement("button");
  btn.textContent = "Log out";
  btn.onclick = logout;
  controlsEl.appendChild(btn);
}

function showError(msg) {
  statusEl.textContent = msg;
  controlsEl.innerHTML = "";
  const btn = document.createElement("button");
  btn.textContent = "Try again";
  btn.onclick = startLogin;
  controlsEl.appendChild(btn);
}

function logout() {
  localStorage.removeItem("discourse_user_api_key");
  showLoggedOut();
}

function startLogin() {
  forge.pki.rsa.generateKeyPair({ bits: 2048, workers: -1 }, function (err, keypair) {
    if (err) {
      showError(err.message);
      return;
    }
    const privatePem = forge.pki.privateKeyToPem(keypair.privateKey);
    const publicPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const nonce = forge.util.bytesToHex(forge.random.getBytesSync(16));

    sessionStorage.setItem("discourse_temp_private_key", privatePem);
    sessionStorage.setItem("discourse_temp_nonce", nonce);

    const params = new URLSearchParams({
      scopes: SCOPES,
      client_id: getClientId(),
      auth_redirect: REDIRECT_URI,
      application_name: APP_NAME,
      public_key: publicPem,
      nonce: nonce
    });

    window.location.href = DISCOURSE_URL + "/user-api-key/new?" + params.toString();
  });
}

function handleReturn(payloadParam) {
  const privatePem = sessionStorage.getItem("discourse_temp_private_key");
  const expectedNonce = sessionStorage.getItem("discourse_temp_nonce");

  if (!privatePem || !expectedNonce) {
    showError("Login session lost.");
    return;
  }

  try {
    const privateKey = forge.pki.privateKeyFromPem(privatePem);
    const encrypted = forge.util.decode64(decodeURIComponent(payloadParam));
    const decrypted = privateKey.decrypt(encrypted, "RSAES-PKCS1-V1_5");
    const data = JSON.parse(decrypted);

    if (data.nonce !== expectedNonce) {
      showError("Nonce mismatch.");
      return;
    }

    localStorage.setItem("discourse_user_api_key", data.key);
    sessionStorage.removeItem("discourse_temp_private_key");
    sessionStorage.removeItem("discourse_temp_nonce");

    window.history.replaceState({}, document.title, REDIRECT_URI);

    checkSession();
  } catch (e) {
    showError(e.message);
  }
}

function checkSession() {
  const key = localStorage.getItem("discourse_user_api_key");
  if (!key) {
    showLoggedOut();
    return;
  }

  fetch(DISCOURSE_URL + "/session/current.json", {
    headers: {
      "User-Api-Key": key,
      "User-Api-Client-Id": getClientId()
    }
  })
    .then(function (res) {
      if (!res.ok) throw new Error("Session invalid");
      return res.json();
    })
    .then(function (data) {
      showLoggedIn(data.current_user.username);
    })
    .catch(function () {
      localStorage.removeItem("discourse_user_api_key");
      showLoggedOut();
    });
}

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("payload")) {
  handleReturn(urlParams.get("payload"));
} else {
  checkSession();
}