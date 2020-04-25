import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title: any;
  data: any;
  mymodel: any;
  urlCollection = [];
  name: any;
  description: any;

  constructor() { }

  onCheckboxChange(url, title, event) {
    if (event === true) {
      this.urlCollection.push({
        url: url,
        title: title
      });
    } else if (event === false) {
      for (let i = 0; i < this.urlCollection.length; i++) {
        if (this.urlCollection[i].url === url) {
          this.urlCollection.splice(i, 1);
        }
      }
    }
  }

  export(name, title, description) {
    var apiData = {
      urls: this.urlCollection,
      collection_title: title,
      name: name,
      description: description,
    };

    chrome.tabs.query({ currentWindow: true }, async function (result) {
      result.forEach(async function (tab) {
        var i = 0;
        if (tab.active === true) {
          if (i === 0) {
            chrome.tabs.executeScript(
              tab.id, {
              code: `
              chrome.storage.local.set({
                token: localStorage.getItem('x-access-token')
              }, function () {
              });
              `},
              function (results) {
                chrome.storage.local.get('token', function (items) {
                  var a = JSON.stringify(items);
                  fetch('https://urlll.xyz/extension/bulk', {
                    method: 'post',
                    headers: {
                      'Accept': 'application/json, text/plain, */*',
                      'Content-Type': 'application/json',
                      'x-access-token': JSON.parse(a).token
                    },
                    body: JSON.stringify(apiData)
                  }).then(res => res.json())
                    .then(res => alert(res.msg));
                });
              }
            );
          }
          i++;
        }
      });
    });
  }

  ngOnInit() {
    var data = [{
      title: "",
      url: "dummy"
    }];

    chrome.bookmarks.getTree(process_bookmark);

    setTimeout(() => {
      this.data = data;
    }, 200);

    function process_bookmark(bookmarks) {
      for (var i = 0; i < bookmarks.length; i++) {
        var bookmark = bookmarks[i];
        if (bookmark.url) {
          data.push({
            title: bookmark.title,
            url: bookmark.url
          });
        }

        if (bookmark.children) {
          process_bookmark(bookmark.children);
        }
      }
    }
  }
}
