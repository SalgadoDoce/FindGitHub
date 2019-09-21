import axios from "axios"

var inpEl = document.querySelector("div#app input#inp-search")
var btnEl = document.querySelector("div#app button#btn-search")
var nickEl = document.querySelector("div#app #user-info #user-name h1")
var nameEl = document.querySelector("div#app #user-info #user-name h2")
var photoEl = document.querySelector("div#app #user-info #user-photo")
var bioEl = document.querySelector("div#app #user-info #user-bio p")
var locationEl = document.querySelector("div#app #user-info #user-location p")
var workEl = document.querySelector("div#app #user-info #user-work p")
var blogEl = document.querySelector("div#app #user-info #user-blog p")

document.setUser = function(username) {
    inpEl.value = username
    clicked()
}

async function following(user) {
    var following = document.querySelector("div#app div#following")

    var followers = await getFollowing(user.login)

    let html = `<h1>Following (${user.following})</h1>`

    for(let seguidor of followers) {
        html += `<div><a onclick="setUser('${seguidor.login}')"><img src="${seguidor.avatar_url}"></a></div>`

        if(followers.indexOf(seguidor) > 10) break
    }

    following.innerHTML = html
}

async function getFollowing(username) {
    try {
        var promise = await axios.get(`https://api.github.com/users/${username}/following`)

        return promise.data
    }catch{
        console.warn("USUARIO NAO EXISTE")

        return null
    }
} 

async function followed(user) {
    var following = document.querySelector("div#app div#followed")

    var followers = await getFollower(user.login)

    let html = `<h1>Followed by (${user.followers})</h1>`

    for(let seguidor of followers) {
        html += `<div><a onclick="setUser('${seguidor.login}')"><img src="${seguidor.avatar_url}"></a></div>`

        if(followers.indexOf(seguidor) > 10) break
    }

    following.innerHTML = html
}

async function getFollower(username) {
    try {
        var promise = await axios.get(`https://api.github.com/users/${username}/followers`)

        return promise.data
    }catch{
        console.warn("USUARIO NAO EXISTE")

        return null
    }
} 

async function getUser(username) {
    try {
        var promise = await axios.get(`https://api.github.com/users/${username}`)

        return promise.data
    }catch{
        console.warn("USUARIO NAO EXISTE")

        return null
    }
}

async function clicked() {
    let username = inpEl.value 

    if(username === "") return

    var user = await getUser(username)

    if(user === null) return false

    nickEl.textContent = user.login
    nameEl.textContent = user.name
    photoEl.innerHTML = `<img src="${user.avatar_url}">`
    bioEl.textContent = `"${user.bio != null ? user.bio : "No bio" }"`
    locationEl.textContent = `Live in ${user.location != null ? user.location : "World"}`
    workEl.textContent = `${user.company != null ? `Work on ${user.company}` : "Just study"}`
    blogEl.innerHTML = `Blog: <a href="${user.blog}" target="_blank">${user.blog}</a>`

    following(user)
    followed(user)
}

btnEl.addEventListener('click', clicked)
inpEl.addEventListener('keypress', e => {
    if(e.key === "Enter") clicked() 
})