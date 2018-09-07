var {ipcRenderer, remote} = require('electron');
var main = remote.require("./main.js");
const axios = require('axios');
const moment = require('moment');

function runScript(e) {
    if (e.keyCode == 13) {
        var value = document.getElementById("search").value;
        ipcRenderer.send('async', value);
        requestApi(value)
    }
}

function requestApi(value) {
    axios.get(`https://api.github.com/users/${value}/repos`)
        .then(function (response) {
            if (response.data) {
                let data = response.data
                document.getElementById("liste_repos").innerHTML = ''
                let description =''
                for (var i = 0; i < data.length; i++) {
                    console.log(data);
                    if (data[i].description){
                        description = data[i].description
                    } else {
                        description = 'No description'
                    }

                    let createDate = moment(data[i].created_at).format('ll')
                    let updateDate = moment(data[i].updated_at).format('ll')

                    let owner =
                        `<div class="box">
                            <article class="media">
                              <div class="media-left">
                                <figure class="image is-64x64">
                                  <img src="${data[i].owner.avatar_url}" alt="Image">
                                </figure>
                              </div>
                              <div class="media-content">
                                <div class="content">
                                  <p>
                                    <strong>${data[i].owner.login}</strong></br>${i+1} repositories</p>
                                </div>
                              </div>
                            </article>
                            </div>`

                    let html =
                        `<div class="card">
                          <header class="card-header">
                            <p class="card-header-title">
                              <a href="${data[i].html_url}" class="is-meditum button is-fullwidth is-outlined" style="justify-content:center">${data[i].name}</a>
                            </p>
                            <a href="#" class="card-header-icon" aria-label="more options">
                            </a>
                          </header>
                          <div class="card-content">
                            <div class="content">
                            ${description}<br>
                            Clone : <a href="#">${data[i].clone_url}</a>
                            </div>
                          </div>
                          <footer class="card-footer">
                            <p class="card-footer-item">${data[i].language}</p>
                            <p class="card-footer-item">Créer : ${createDate}</p>
                            <p class="card-footer-item">Mis à jour : ${updateDate}</p>
                          </footer>
                        </div></br>`
                    document.getElementById("liste_repos").innerHTML += html;
                    document.getElementById("profile").innerHTML = owner;
                }
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}